import { randomUUID } from 'node:crypto';

export class SalesService {
  constructor({ db, salesRepository, productRepository, inventoryService }) {
    this.db = db;
    this.salesRepository = salesRepository;
    this.productRepository = productRepository;
    this.inventoryService = inventoryService;
  }

  createSale(rawItems) {
    if (!Array.isArray(rawItems) || rawItems.length === 0) throw new Error('Add at least one item to the sale.');
    const aggregated = new Map();
    for (const raw of rawItems) {
      const productId = Number(raw.productId);
      const quantity = Number(raw.quantity);
      if (!Number.isInteger(productId) || productId <= 0 || !Number.isInteger(quantity) || quantity <= 0) {
        throw new Error('Each sale item needs a valid product and a positive whole-number quantity.');
      }
      aggregated.set(productId, (aggregated.get(productId) ?? 0) + quantity);
    }

    const transaction = this.db.transaction(() => {
      const items = [];
      for (const [productId, quantity] of aggregated) {
        const product = this.productRepository.getById(productId);
        if (!product) throw new Error(`Product ${productId} was not found.`);
        if (product.quantity < quantity) throw new Error(`Not enough stock for ${product.name}.`);
        const unitPrice = Number(product.selling_price);
        items.push({ product_id: productId, product_name: product.name, quantity,
          unit_price: unitPrice, line_total: Number((unitPrice * quantity).toFixed(2)) });
      }
      const total = Number(items.reduce((sum, item) => sum + item.line_total, 0).toFixed(2));
      const sale = this.salesRepository.create({
        sale_number: `SW-${Date.now()}-${randomUUID().slice(0, 6).toUpperCase()}`,
        total, items
      });
      for (const item of items) {
        this.inventoryService.recordMovement({ productId: item.product_id, type: 'OUT',
          quantity: item.quantity, note: `Sale ${sale.sale_number}` });
      }
      return sale;
    });
    return transaction();
  }
}
