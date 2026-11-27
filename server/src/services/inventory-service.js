import { MovementFactory } from '../patterns/movement-factory.js';

export class InventoryService {
  constructor({ db, inventoryRepository, eventBus }) {
    this.db = db;
    this.inventoryRepository = inventoryRepository;
    this.eventBus = eventBus;
  }

  recordMovement({ productId, type, quantity, note = '' }) {
    const movement = MovementFactory.create(type, { quantity, note });
    const transaction = this.db.transaction(() => {
      const product = this.inventoryRepository.getProduct(productId);
      if (!product) throw new Error('Product not found.');
      const nextQuantity = movement.apply(product.quantity);
      this.inventoryRepository.updateQuantity(productId, nextQuantity);
      const saved = this.inventoryRepository.addMovement({
        product_id: productId,
        movement_type: movement.type,
        quantity: movement.quantity,
        resulting_quantity: nextQuantity,
        note: movement.note
      });
      return { movement: saved, product: { ...product, quantity: nextQuantity } };
    });
    const result = transaction();
    if (result.product.quantity <= result.product.reorder_level) {
      this.eventBus.publish('low-stock', result.product);
    }
    return result;
  }
}
