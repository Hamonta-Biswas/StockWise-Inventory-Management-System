import test from 'node:test';
import assert from 'node:assert/strict';
import { InventoryService } from '../src/services/inventory-service.js';
import { StockEventBus } from '../src/patterns/stock-event-bus.js';

test('InventoryService updates stock, records movement, and publishes low-stock event', () => {
  const product = { id: 1, sku: 'A-1', name: 'Notebook', quantity: 6, reorder_level: 5 };
  const calls = [];
  const fakeDb = { transaction: (callback) => callback };
  const fakeRepository = {
    getProduct: () => ({ ...product }),
    updateQuantity: (_id, quantity) => { product.quantity = quantity; calls.push(['update', quantity]); },
    addMovement: (movement) => { calls.push(['movement', movement]); return movement; }
  };
  const bus = new StockEventBus();
  const events = [];
  bus.subscribe('low-stock', (payload) => events.push(payload));
  const service = new InventoryService({ db: fakeDb, inventoryRepository: fakeRepository, eventBus: bus });
  const result = service.recordMovement({ productId: 1, type: 'OUT', quantity: 2, note: 'Test sale' });

  assert.equal(result.product.quantity, 4);
  assert.equal(product.quantity, 4);
  assert.equal(calls.length, 2);
  assert.equal(events.length, 1);
  assert.equal(events[0].quantity, 4);
});

test('InventoryService rejects a movement when a product is missing', () => {
  const fakeDb = { transaction: (callback) => callback };
  const fakeRepository = { getProduct: () => undefined };
  const service = new InventoryService({ db: fakeDb, inventoryRepository: fakeRepository, eventBus: new StockEventBus() });
  assert.throws(() => service.recordMovement({ productId: 500, type: 'IN', quantity: 1 }), /Product not found/);
});
