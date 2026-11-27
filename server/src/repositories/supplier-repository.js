export class SupplierRepository {
  constructor(db) { this.db = db; }
  list() { return this.db.prepare('SELECT * FROM suppliers ORDER BY name COLLATE NOCASE').all(); }
  getById(id) { return this.db.prepare('SELECT * FROM suppliers WHERE id = ?').get(id); }
  create(input) {
    const result = this.db.prepare(`INSERT INTO suppliers (name, contact_person, email, phone, address)
      VALUES (@name, @contact_person, @email, @phone, @address)`).run(input);
    return this.getById(result.lastInsertRowid);
  }
  update(id, input) {
    const result = this.db.prepare(`UPDATE suppliers SET name=@name, contact_person=@contact_person,
      email=@email, phone=@phone, address=@address WHERE id=@id`).run({ ...input, id });
    return result.changes ? this.getById(id) : null;
  }
  delete(id) { return this.db.prepare('DELETE FROM suppliers WHERE id = ?').run(id).changes > 0; }
}
