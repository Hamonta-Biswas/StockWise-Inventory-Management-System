/** Observer pattern: subscribers react to stock events without coupling the
 * inventory service to notification, audit, or analytics implementations.
 */
export class StockEventBus {
  #listeners = new Map();

  subscribe(eventName, listener) {
    if (typeof listener !== 'function') throw new TypeError('Listener must be a function.');
    const listeners = this.#listeners.get(eventName) ?? new Set();
    listeners.add(listener);
    this.#listeners.set(eventName, listeners);
    return () => listeners.delete(listener);
  }

  publish(eventName, payload) {
    for (const listener of this.#listeners.get(eventName) ?? []) listener(payload);
  }
}
