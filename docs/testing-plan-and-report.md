# Software Testing Plan and Report

## 1. Testing approach

StockWise uses a test pyramid with business-rule unit tests and API integration tests. A Selenium smoke test checks that the browser application opens and that the Products navigation works.

### TDD cycle

For each new business rule, follow Red–Green–Refactor:

1. **Red:** Write a test for the required behaviour and run it. Capture the failing test output.
2. **Green:** Implement the smallest code change that makes the test pass. Capture the passing output.
3. **Refactor:** Improve structure or readability while keeping all tests passing.

The source tree contains tests, but a test file alone does not prove that TDD was followed. Preserve the actual chronology in Git commits (for example, a test-first commit followed by the implementation commit) and include genuine terminal output in the report.

## 2. Unit and API test coverage

| Test file | Type | What it verifies |
|---|---|---|
| `server/test/movement-factory.test.js` | Unit | Factory creates all movement types; stock-out cannot make stock negative; invalid types and quantities are rejected. |
| `server/test/patterns.test.js` | Unit | Observer subscription/unsubscription; Adapter maps message fields; low-stock notifier reacts to an event. |
| `server/test/inventory-service.test.js` | Unit with fakes/mocks | Inventory service updates stock, records the movement, and publishes low-stock events; missing products are rejected. |
| `server/test/api.test.js` | API integration | Health route; product list/low-stock filter; successful sale; insufficient-stock sale is rejected without changing inventory. |
| `client/e2e/smoke.test.js` | Browser E2E | Chrome opens the app and can navigate to Products. |

## 3. Mocks and test doubles

- `patterns.test.js` injects a mock provider with a `sendMessage()` method to verify the Adapter without calling an external email/SMS service.
- `inventory-service.test.js` injects a fake repository and a transaction wrapper to isolate business rules from the database.
- `api.test.js` uses a real in-memory SQLite database to test API/database integration without changing the persistent local database.

## 4. Run commands

Backend unit and API tests with coverage:

```bash
cd server
npm test
```

Frontend browser smoke test (backend and frontend must both be running):

```bash
cd client
npm run test:e2e
```

Frontend production build:

```bash
npm run build
```

## 5. Test evidence table — complete after running

| Evidence | Actual result / link | Screenshot or output file |
|---|---|---|
| Backend test run | **Fill in your actual result** | `evidence/backend-tests.png` |
| Coverage summary | **Fill in the actual percentages from the terminal** | `evidence/coverage.png` |
| Selenium smoke test | **Fill in pass/fail and browser version** | `evidence/selenium.png` |
| Frontend production build | **Fill in your actual result** | `evidence/frontend-build.png` |
| GitHub Actions run | **Paste actual workflow URL and status** | `evidence/github-actions.png` |

## 6. Defect log — complete during development

| Defect ID | Observed problem | Root cause | Fix | Retest result |
|---|---|---|---|---|
| BUG-01 | [Record a real defect] | [Your analysis] | [Your fix] | [Actual result] |

Do not invent test percentages or mark tests as passed before running them in your own environment.
