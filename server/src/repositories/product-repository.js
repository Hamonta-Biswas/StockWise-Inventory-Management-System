export class ProductRepository {
  constructor(db) { this.db = db; }

  list({ search = '', category = '', lowStock = false } = {}) {
    const conditions = [];
    const params = {};
    if (search) {
      conditions.push('(p.name LIKE @search OR p.sku LIKE @search OR p.category LIKE @search)');
      params.search = `%${search}%`;
    }
    if (category) { conditions.push('p.category = @category'); params.category = category; }
    if (lowStock) conditions.push('p.quantity <= p.reorder_level');
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    return this.db.prepare(`SELECT p.*, s.name AS supplier_name FROM products p
      LEFT JOIN suppliers s ON s.id = p.supplier_id ${where} ORDER BY p.name COLLATE NOCASE`).all(params);
  }

  getById(id) {
    return this.db.prepare(`SELECT p.*, s.name AS supplier_name FROM products p
      LEFT JOIN suppliers s ON s.id = p.supplier_id WHERE p.id = ?`).get(id);
  }

  create(input) {
    const result = this.db.prepare(`INSERT INTO products
      (sku, name, category, description, cost_price, selling_price, quantity, reorder_level, supplier_id)
      VALUES (@sku, @name, @category, @description, @cost_price, @selling_price, @quantity, @reorder_level, @supplier_id)`).run(input);
    return this.getById(result.lastInsertRowid);
  }

  update(id, input) {
    const result = this.db.prepare(`UPDATE products SET sku=@sku, name=@name, category=@category,
      description=@description, cost_price=@cost_price, selling_price=@selling_price,
      reorder_level=@reorder_level, supplier_id=@supplier_id, updated_at=datetime('now') WHERE id=@id`)
      .run({ ...input, id });
    return result.changes ? this.getById(id) : null;
  }

  delete(id) {
    return this.db.prepare('DELETE FROM products WHERE id = ?').run(id).changes > 0;
  }
}
