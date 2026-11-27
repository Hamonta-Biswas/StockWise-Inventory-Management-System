import test from 'node:test';
import assert from 'node:assert/strict';
import { StockEventBus } from '../src/patterns/stock-event-bus.js';
import { NotificationAdapter } from '../src/patterns/notification-adapter.js';
import { LowStockNotifier } from '../src/patterns/low-stock-notifier.js';

test('Observer notifies subscribers and supports unsubscribe', () => {
  const bus = new StockEventBus();
  const received = [];
  const unsubscribe = bus.subscribe('low-stock', (product) => received.push(product.sku));
  bus.publish('low-stock', { sku: 'ST-1' });
  unsubscribe();
  bus.publish('low-stock', { sku: 'ST-2' });
  assert.deepEqual(received, ['ST-1']);
});

test('Adapter translates application notifications to provider messages', () => {
  const sent = [];
  const mockedProvider = { sendMessage: (message) => sent.push(message) };
  const adapter = new NotificationAdapter(mockedProvider);
  adapter.send({ title: 'Low stock', message: 'Only two left.' });
  assert.deepEqual(sent, [{ subject: 'Low stock', body: 'Only two left.' }]);
});

test('LowStockNotifier reacts to Observer events through the notification adapter', () => {
  const bus = new StockEventBus();
  const messages = [];
  const adapter = new NotificationAdapter({ sendMessage: (message) => messages.push(message) });
  const notifier = new LowStockNotifier(bus, adapter);
  bus.publish('low-stock', { name: 'Desk Lamp', sku: 'L-1', quantity: 2, reorder_level: 5 });
  notifier.close();
  assert.equal(messages.length, 1);
  assert.match(messages[0].body, /Desk Lamp/);
});
