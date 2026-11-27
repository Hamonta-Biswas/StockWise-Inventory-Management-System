export class SalesRepository {
  constructor(db) { this.db = db; }

  create({ sale_number, total, items }) {
    const sale = this.db.prepare('INSERT INTO sales (sale_number, total) VALUES (?, ?)').run(sale_number, total);
    const insertItem = this.db.prepare(`INSERT INTO sale_items
      (sale_id, product_id, product_name, quantity, unit_price, line_total)
      VALUES (@sale_id, @product_id, @product_name, @quantity, @unit_price, @line_total)`);
    for (const item of items) insertItem.run({ ...item, sale_id: sale.lastInsertRowid });
    return this.getById(sale.lastInsertRowid);
  }

  getById(id) {
    const sale = this.db.prepare('SELECT * FROM sales WHERE id = ?').get(id);
    if (!sale) return null;
    sale.items = this.db.prepare('SELECT * FROM sale_items WHERE sale_id = ?').all(id);
    return sale;
  }

  list(limit = 50) {
    const sales = this.db.prepare('SELECT * FROM sales ORDER BY created_at DESC, id DESC LIMIT ?').all(limit);
    const getItems = this.db.prepare('SELECT * FROM sale_items WHERE sale_id = ?');
    return sales.map((sale) => ({ ...sale, items: getItems.all(sale.id) }));
  }
}
