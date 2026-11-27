# Design Patterns

StockWise implements three patterns from three categories (therefore satisfying the minimum of three patterns from at least two categories).

## 1. Factory Method — Creational

**Implementation:** `server/src/patterns/movement-factory.js`

**Problem:** Inventory can change through different movement types. Without a creation point, service code would need to construct each movement implementation and contain type-specific creation logic.

**How it is used:** `MovementFactory.create(type, data)` selects and creates a `StockInMovement`, `StockOutMovement`, or `StockAdjustment`. Each concrete movement implements `apply(currentStock)`.

**Why selected:** It centralizes movement creation and keeps the inventory service independent of concrete movement classes. A new movement type can be added in one place.

**Alternative rejected:** A single long `if/else` block directly inside `InventoryService`. It was rejected because creation logic and business orchestration would become tightly coupled as movement types grow.

## 2. Observer — Behavioral

**Implementation:** `server/src/patterns/stock-event-bus.js` and `server/src/patterns/low-stock-notifier.js`

**Problem:** Inventory logic should not need to know how low-stock notifications are delivered. Directly calling email, SMS, or console code from the inventory service would tightly couple the modules.

**How it is used:** `InventoryService` publishes a `low-stock` event when the resulting quantity is at or below the product's reorder level. `LowStockNotifier` subscribes and reacts to that event.

**Why selected:** Additional subscribers (for example, an audit logger or reporting component) can respond to the same event without changing the inventory service.

**Alternative rejected:** Calling the notifier directly from `InventoryService`. It was rejected because direct calls create dependencies between stock calculation and notification implementation.

## 3. Adapter — Structural

**Implementation:** `server/src/patterns/notification-adapter.js`

**Problem:** The application expects a notification interface with `send({ title, message })`, while a provider may expose a different interface such as `sendMessage({ subject, body })`.

**How it is used:** `NotificationAdapter` maps the application's title/message structure to the provider's subject/body structure. The included `ConsoleNotificationProvider` is a local demonstration provider.

**Why selected:** A different provider can be added later without changing `LowStockNotifier` or inventory business logic.

**Alternative rejected:** Making every notification subscriber call provider-specific methods directly. It was rejected because the business layer would depend on a specific provider API.

## Pattern categories

| Pattern | Category | Main classes |
|---|---|---|
| Factory Method | Creational | MovementFactory and concrete movement classes |
| Observer | Behavioral | StockEventBus and LowStockNotifier |
| Adapter | Structural | NotificationAdapter and ConsoleNotificationProvider |

## Evidence

Use the corresponding tests in `server/test/movement-factory.test.js` and `server/test/patterns.test.js`. Add screenshots of passing test output and code excerpts to the final report.
