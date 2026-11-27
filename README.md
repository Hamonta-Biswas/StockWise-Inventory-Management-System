# StockWise — Inventory Management System

A full-stack inventory and sales management application prepared as a foundation for **CSE 3206 – Software Engineering Sessional, Lab 6 (CO4 Reflection Essay)**.

StockWise is built with React + Vite, Node.js + Express, and SQLite. It contains six working business modules, persists application data in a local SQLite database, documents its API with Swagger/OpenAPI, and includes automated backend tests, a Selenium browser smoke test, and a GitHub Actions workflow.

> **Academic note:** This is a project starter and implementation, not proof that every required development activity has already been performed by the student. In particular, create your own commits, feature branches, pull-request reviews, and merge-conflict resolution. Record the real TDD steps and your own learning experience in the report. Do not claim to have completed activities that you have not personally performed.

## Main modules

1. **Dashboard** — product count, stock units, stock alerts, daily sales, recent movements, and inventory value.
2. **Product management** — create, view, search, filter, edit, and delete products.
3. **Supplier management** — maintain supplier names and contact details; connect suppliers to products.
4. **Stock control** — record stock-in, stock-out, and physical-count adjustments with a movement history.
5. **Sales and billing** — create a multi-item sale, calculate the total, save the receipt record, and deduct stock automatically.
6. **Reports** — review recent revenue, daily sales, top-selling products, and stock value by category.

The application uses Bangladeshi taka (BDT) as its displayed currency. All sample suppliers and products are fictional and are included for demonstration.

## Technology

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18, Vite | Responsive user interface |
| Backend | Node.js, Express | REST API and business logic |
| Database | SQLite via better-sqlite3 | Persistent local storage |
| API documentation | Swagger UI + OpenAPI 3.0 | Interactive API documentation |
| Unit/API tests | Node.js Test Runner, Supertest | Automated backend tests |
| Browser test | Selenium WebDriver | UI smoke test |
| CI | GitHub Actions | Run backend tests and frontend build on pushes/PRs |

## Requirements

- Node.js 22 (LTS). Node 23-26 is not supported by the pinned native SQLite dependency.
- npm
- Google Chrome or Chromium for the Selenium test

## Run locally

Open two terminal windows from the project root.

### 1. Configure and start the backend

```bash
cd server
cp .env.example .env
npm install
npm run db:seed
npm run dev
```

The API will run at `http://localhost:5000`.

The default database file is `server/data/stockwise.sqlite`. It is created automatically the first time the server starts. `npm run db:seed` inserts fictional suppliers and products only when the supplier table is empty.

### 2. Start the frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### 3. API documentation

When the backend is running, open:

- Swagger UI: `http://localhost:5000/api-docs`
- OpenAPI JSON: `http://localhost:5000/api/openapi.json`
- Health check: `http://localhost:5000/api/health`

## Run tests

From the project root:

```bash
npm test
```

Or from the server directory:

```bash
npm test
```

The server test command uses Node's built-in test runner with coverage output. It includes:

- Unit tests for the movement factory.
- Unit tests for the Observer and Adapter implementations.
- A unit test for inventory business logic using a fake repository and event bus.
- API integration tests using an in-memory SQLite database and Supertest.

Run the Selenium smoke test after the backend and frontend are both running:

```bash
cd client
npm install
npm run test:e2e
```

The smoke test opens the local application in Chrome and checks that the Products section can be opened. It requires Chrome/Chromium and a compatible ChromeDriver. Selenium Manager can help resolve a local driver if the environment permits it.

Build the frontend:

```bash
npm run build --prefix client
```

## Project structure

```text
inventory-management-system/
├── .github/workflows/ci.yml
├── client/
│   ├── e2e/smoke.test.js
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── api.js
│       ├── App.jsx
│       └── styles.css
├── server/
│   ├── src/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── patterns/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.js
│   │   ├── index.js
│   │   └── openapi.js
│   └── test/
└── docs/
```

## Design patterns implemented

- **Factory Method:** `server/src/patterns/movement-factory.js` creates stock-in, stock-out, and stock-adjustment objects.
- **Observer:** `server/src/patterns/stock-event-bus.js` publishes low-stock events. `LowStockNotifier` subscribes without coupling inventory logic to notification handling.
- **Adapter:** `server/src/patterns/notification-adapter.js` converts the application's notification format to a provider's `sendMessage()` contract. The default provider writes a notification to the server console; another provider can be substituted.

See [`docs/design-patterns.md`](docs/design-patterns.md) and [`docs/uml-class-diagram.mmd`](docs/uml-class-diagram.mmd).

## Important implementation notes

- Product quantity must be changed through Stock Control after a product is created. Editing product details does not overwrite stock quantity.
- For an **Adjustment**, enter the new physical stock count. For **Stock In** and **Stock Out**, enter the movement quantity.
- A sale is saved in a database transaction. The application checks stock availability before creating the sale and records each sold quantity as an OUT movement.
- The demo uses a console notification provider. It demonstrates the Adapter contract but does not send real email or SMS.
- This academic demo does not implement production-grade user authentication, role permissions, payment processing, or cloud database deployment. Those can be future extensions.

## Lab 6 documentation

Start with the documents in [`docs/`](docs/):

- Requirements, user stories, and use cases
- Incremental process-model justification
- Prototype notes
- Design-pattern explanations and rejected alternatives
- UML class diagram
- Testing plan and evidence table
- Git/GitHub workflow instructions
- Swagger/OpenAPI self-directed learning log
- Learning log and reflection-essay templates
- Five-minute demonstration and viva preparation

Complete the evidence tables with your actual screenshots, test output, GitHub links, and personal learning experience before submission.
