/**
 * Factory Method pattern: callers request a movement by type without needing
 * to know which concrete movement class should be instantiated.
 */
class StockInMovement {
  constructor({ quantity, note = '' }) { this.type = 'IN'; this.quantity = quantity; this.note = note; }
  apply(currentStock) { return currentStock + this.quantity; }
}

class StockOutMovement {
  constructor({ quantity, note = '' }) { this.type = 'OUT'; this.quantity = quantity; this.note = note; }
  apply(currentStock) {
    if (this.quantity > currentStock) throw new Error('Not enough stock for this operation.');
    return currentStock - this.quantity;
  }
}

class StockAdjustment {
  constructor({ quantity, note = '' }) { this.type = 'ADJUSTMENT'; this.quantity = quantity; this.note = note; }
  // For an adjustment, quantity is the new physical count, not a delta.
  apply() { return this.quantity; }
}

export class MovementFactory {
  static create(type, data) {
    const constructors = {
      IN: StockInMovement,
      OUT: StockOutMovement,
      ADJUSTMENT: StockAdjustment
    };
    const Movement = constructors[String(type ?? '').toUpperCase()];
    if (!Movement) throw new Error('Movement type must be IN, OUT, or ADJUSTMENT.');
    const quantity = Number(data?.quantity);
    if (!Number.isInteger(quantity) || quantity < 0 || (String(type).toUpperCase() !== 'ADJUSTMENT' && quantity === 0)) {
      throw new Error('Quantity must be a positive whole number (zero is allowed for adjustment).');
    }
    return new Movement({ quantity, note: String(data?.note ?? '').trim() });
  }
}
