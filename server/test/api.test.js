import test, { beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createDatabase } from '../src/db/database.js';
import { createApp } from '../src/app.js';

let db;
let app;
let productId;

beforeEach(() => {
  db = createDatabase({ filename: ':memory:' });
  app = createApp({ db, notificationProvider: { sendMessage() {} } });
  db.prepare('INSERT INTO suppliers (name) VALUES (?)').run('Test Supplier');
  const result = db.prepare(`INSERT INTO products (sku, name, category, cost_price, selling_price, quantity, reorder_level, supplier_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run('TEST-001', 'Test Keyboard', 'Electronics', 1000, 1500, 10, 3, 1);
  productId = Number(result.lastInsertRowid);
});

afterEach(() => {
  app.locals.dispose();
  db.close();
});

test('API health endpoint is available', async () => {
  const response = await request(app).get('/api/health').expect(200);
  assert.equal(response.body.status, 'ok');
});

test('Product API lists products and filters low-stock products', async () => {
  const response = await request(app).get('/api/products').expect(200);
  assert.equal(response.body.length, 1);
  await request(app).post('/api/inventory/movements').send({ productId, type: 'OUT', quantity: 8 }).expect(201);
  const low = await request(app).get('/api/products?lowStock=true').expect(200);
  assert.equal(low.body[0].quantity, 2);
});

test('Sales API creates a sale and decreases inventory', async () => {
  const response = await request(app).post('/api/sales').send({ items: [{ productId, quantity: 2 }] }).expect(201);
  assert.equal(response.body.total, 3000);
  assert.equal(response.body.items.length, 1);
  const product = await request(app).get(`/api/products/${productId}`).expect(200);
  assert.equal(product.body.quantity, 8);
});

test('Sales API rejects a sale when available stock is insufficient', async () => {
  await request(app).post('/api/sales').send({ items: [{ productId, quantity: 20 }] }).expect(400);
  const product = await request(app).get(`/api/products/${productId}`).expect(200);
  assert.equal(product.body.quantity, 10);
});
