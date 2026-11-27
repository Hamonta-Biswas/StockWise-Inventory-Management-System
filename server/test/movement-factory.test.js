import test from 'node:test';
import assert from 'node:assert/strict';
import { MovementFactory } from '../src/patterns/movement-factory.js';

test('Factory Method creates a stock-in movement', () => {
  const movement = MovementFactory.create('IN', { quantity: 7, note: 'New delivery' });
  assert.equal(movement.apply(10), 17);
  assert.equal(movement.type, 'IN');
});

test('Factory Method prevents stock from becoming negative', () => {
  const movement = MovementFactory.create('OUT', { quantity: 4 });
  assert.equal(movement.apply(9), 5);
  assert.throws(() => movement.apply(2), /Not enough stock/);
});

test('Factory Method treats adjustment quantity as the new count', () => {
  const movement = MovementFactory.create('ADJUSTMENT', { quantity: 3 });
  assert.equal(movement.apply(11), 3);
});

test('Factory Method rejects unknown types and invalid quantities', () => {
  assert.throws(() => MovementFactory.create('TRANSFER', { quantity: 2 }), /Movement type/);
  assert.throws(() => MovementFactory.create('IN', { quantity: -1 }), /positive whole number/);
});
