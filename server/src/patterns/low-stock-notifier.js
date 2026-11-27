export class LowStockNotifier {
  constructor(eventBus, notificationPort) {
    this.notificationPort = notificationPort;
    this.unsubscribe = eventBus.subscribe('low-stock', (product) => {
      this.notificationPort.send({
        title: `Low stock: ${product.name}`,
        message: `${product.name} (${product.sku}) has ${product.quantity} item(s) remaining. Reorder level: ${product.reorder_level}.`
      });
    });
  }

  close() { this.unsubscribe?.(); }
}
