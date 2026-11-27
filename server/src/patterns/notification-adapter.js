/**
 * Adapter pattern: the application expects send({ title, message }).
 * This adapter translates that contract to a provider exposing sendMessage().
 * A real email/SMS provider can be substituted without changing business logic.
 */
export class NotificationAdapter {
  constructor(provider) {
    if (!provider || typeof provider.sendMessage !== 'function') {
      throw new TypeError('Notification provider must implement sendMessage().');
    }
    this.provider = provider;
  }

  send({ title, message }) {
    return this.provider.sendMessage({ subject: title, body: message });
  }
}

export class ConsoleNotificationProvider {
  sendMessage({ subject, body }) {
    console.info(`[StockWise notification] ${subject}: ${body}`);
  }
}
