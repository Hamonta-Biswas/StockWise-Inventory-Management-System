export class InventoryRepository {
  constructor(db) { this.db = db; }
  getProduct(id) { return this.db.prepare('SELECT * FROM products WHERE id = ?').get(id); }
  updateQuantity(id, quantity) {
    this.db.prepare("UPDATE products SET quantity = ?, updated_at = datetime('now') WHERE id = ?").run(quantity, id);
  }
  addMovement({ product_id, movement_type, quantity, resulting_quantity, note }) {
    const result = this.db.prepare(`INSERT INTO stock_movements
      (product_id, movement_type, quantity, resulting_quantity, note)
      VALUES (@product_id, @movement_type, @quantity, @resulting_quantity, @note)`).run({
      product_id, movement_type, quantity, resulting_quantity, note
    });
    return this.db.prepare(`SELECT m.*, p.name AS product_name, p.sku FROM stock_movements m
      JOIN products p ON p.id=m.product_id WHERE m.id=?`).get(result.lastInsertRowid);
  }
  listMovements(limit = 100) {
    return this.db.prepare(`SELECT m.*, p.name AS product_name, p.sku FROM stock_movements m
      JOIN products p ON p.id=m.product_id ORDER BY m.created_at DESC, m.id DESC LIMIT ?`).all(limit);
  }
}
