import { createDatabase } from './database.js';

const db = createDatabase();
const supplierCount = db.prepare('SELECT COUNT(*) AS count FROM suppliers').get().count;

if (supplierCount === 0) {
  const insertSupplier = db.prepare(`INSERT INTO suppliers (name, contact_person, email, phone, address)
    VALUES (@name, @contact_person, @email, @phone, @address)`);
  const suppliers = [
    { name: 'Northern Supplies', contact_person: 'Ayesha Rahman', email: 'sales@northernsupplies.example', phone: '+880 1700-000001', address: 'Rajshahi, Bangladesh' },
    { name: 'Metro Wholesale', contact_person: 'Tanvir Hasan', email: 'hello@metrowholesale.example', phone: '+880 1700-000002', address: 'Dhaka, Bangladesh' },
    { name: 'TechSource BD', contact_person: 'Nusrat Jahan', email: 'orders@techsource.example', phone: '+880 1700-000003', address: 'Bogura, Bangladesh' }
  ];
  const insertProducts = db.prepare(`INSERT INTO products
    (sku, name, category, description, cost_price, selling_price, quantity, reorder_level, supplier_id)
    VALUES (@sku, @name, @category, @description, @cost_price, @selling_price, @quantity, @reorder_level, @supplier_id)`);
  const seed = db.transaction(() => {
    suppliers.forEach((supplier) => insertSupplier.run(supplier));
    const items = [
      { sku: 'ST-1001', name: 'Wireless Mouse', category: 'Electronics', description: '2.4 GHz wireless optical mouse', cost_price: 450, selling_price: 650, quantity: 42, reorder_level: 10, supplier_id: 1 },
      { sku: 'ST-1002', name: 'Mechanical Keyboard', category: 'Electronics', description: 'Compact mechanical keyboard', cost_price: 1850, selling_price: 2450, quantity: 18, reorder_level: 6, supplier_id: 3 },
      { sku: 'ST-1003', name: 'A4 Paper Ream', category: 'Stationery', description: '80 GSM A4 paper, 500 sheets', cost_price: 310, selling_price: 390, quantity: 65, reorder_level: 15, supplier_id: 1 },
      { sku: 'ST-1004', name: 'Desk Organizer', category: 'Office', description: 'Multi-compartment desk organizer', cost_price: 220, selling_price: 350, quantity: 4, reorder_level: 8, supplier_id: 2 },
      { sku: 'ST-1005', name: 'USB-C Hub', category: 'Electronics', description: '6-in-1 USB-C adapter', cost_price: 1250, selling_price: 1690, quantity: 12, reorder_level: 5, supplier_id: 3 },
      { sku: 'ST-1006', name: 'Ballpoint Pen Pack', category: 'Stationery', description: 'Pack of 10 blue ballpoint pens', cost_price: 75, selling_price: 120, quantity: 90, reorder_level: 20, supplier_id: 2 }
    ];
    items.forEach((item) => insertProducts.run(item));
  });
  seed();
  console.log('Sample suppliers and products inserted.');
} else {
  console.log('Database already contains data; seed skipped.');
}

db.close();
