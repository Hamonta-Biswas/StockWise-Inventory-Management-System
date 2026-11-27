# Requirements and Use Cases

## 1. Project overview

**Project name:** StockWise – Inventory Management System  
**Purpose:** Help a small retail store maintain product and supplier information, track stock changes, record sales, and review basic reports.

## 2. Functional requirements

| ID | Requirement |
|---|---|
| FR-01 | The system shall display an overview of products, units in stock, low-stock items, suppliers, and sales for the current day. |
| FR-02 | The administrator shall create, view, search, filter, update, and delete products. |
| FR-03 | The administrator shall store a product SKU, name, category, description, cost price, selling price, quantity, reorder level, and optional supplier. |
| FR-04 | The administrator shall create, view, update, and delete suppliers. |
| FR-05 | The administrator shall record stock-in, stock-out, and stock-adjustment movements. |
| FR-06 | The system shall prevent stock-out transactions that exceed available quantity. |
| FR-07 | The system shall retain a dated history of stock movements. |
| FR-08 | The administrator shall create a sale containing one or more products. |
| FR-09 | The system shall calculate sale totals and reduce stock quantities after a successful sale. |
| FR-10 | The system shall preserve sales and sale-item records in the database. |
| FR-11 | The system shall show sales summaries, daily sales, top-selling products, and category-wise inventory value. |
| FR-12 | The system shall notify the notification component when a product reaches or falls below its reorder level. |
| FR-13 | The system shall provide interactive API documentation through Swagger UI. |

## 3. Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-01 – Usability | The interface shall use consistent navigation, clear forms, and readable status messages. |
| NFR-02 – Performance | Normal local CRUD and dashboard requests should respond promptly for a small-store dataset. |
| NFR-03 – Reliability | A sale and its stock deductions shall be handled within a database transaction so a failed sale does not leave partial inventory changes. |
| NFR-04 – Data integrity | The database shall use primary keys, foreign keys, unique SKUs, and non-negative quantity/price constraints. |
| NFR-05 – Maintainability | The backend shall separate routes, repositories, services, and design-pattern implementations. |
| NFR-06 – Extensibility | Notification providers and movement types should be replaceable or extendable without rewriting unrelated modules. |
| NFR-07 – Testability | Business rules shall be testable independently using fake repositories and mocked notification providers. |
| NFR-08 – Compatibility | The frontend shall be responsive and run in a current desktop browser. |

## 4. Actors

- **Store administrator:** Maintains the product catalogue, suppliers, inventory movements, and sales; reviews reports.
- **Notification provider:** An external-system boundary represented by a provider interface. The included demo provider logs low-stock notifications to the server console.

## 5. User stories

1. As a store administrator, I want to add a product with its SKU and prices so that the store catalogue remains accurate.
2. As a store administrator, I want to search and filter products so that I can find an item quickly.
3. As a store administrator, I want to maintain supplier contacts so that I can identify the source of each product.
4. As a store administrator, I want to record stock received and stock removed so that the available quantity stays accurate.
5. As a store administrator, I want an alert when stock reaches the reorder level so that I can replenish products on time.
6. As a store administrator, I want to complete a multi-item sale so that the system calculates the total and updates stock automatically.
7. As a store administrator, I want sales and inventory reports so that I can review store activity.

## 6. Use cases

### UC-01: Add a product

- **Primary actor:** Store administrator
- **Precondition:** The application and database are running.
- **Main flow:** Open Products → Add product → enter SKU, name, category, prices, opening quantity, and optional supplier → submit → system validates and saves the product.
- **Alternative flow:** If the SKU already exists or required information is invalid, the system displays an error and does not create the product.
- **Postcondition:** The product appears in the product catalogue and dashboard totals.

### UC-02: Record stock movement

- **Primary actor:** Store administrator
- **Precondition:** The product exists.
- **Main flow:** Open Stock Control → select a product and movement type → enter quantity and note → save → system updates product quantity and records the movement.
- **Alternative flow:** If stock-out quantity exceeds available stock, the system rejects the movement.
- **Postcondition:** Product quantity and movement history are updated. A low-stock event is published when the new quantity is at or below the reorder level.

### UC-03: Complete a sale

- **Primary actor:** Store administrator
- **Precondition:** At least one product exists and requested quantities are available.
- **Main flow:** Open Sales & Billing → add one or more products → review bill total → complete sale → system stores sale and line items, records stock-out movements, and decreases inventory.
- **Alternative flow:** If any item has insufficient stock, the sale is rejected and the inventory is unchanged.
- **Postcondition:** A sale receipt record is stored and stock quantities are updated.

### UC-04: Review reports

- **Primary actor:** Store administrator
- **Precondition:** The application has product and/or sales data.
- **Main flow:** Open Reports → review recent sales revenue, transaction count, daily revenue, top-selling products, and category stock value.
- **Postcondition:** The administrator can inspect summarized store activity.

## 7. Acceptance criteria

- A product with a unique SKU can be created and retrieved.
- A duplicate SKU is rejected.
- Stock-in increases quantity; stock-out decreases quantity; adjustment sets the physical count.
- A stock-out operation cannot make quantity negative.
- A completed sale is saved and reduces stock by the sold quantity.
- An invalid sale does not reduce stock or create a sale record.
- A low-stock event is published when the resulting quantity is less than or equal to the reorder level.
- Reports and dashboard values are calculated from stored records.
