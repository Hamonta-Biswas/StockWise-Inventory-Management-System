# Self-Directed Learning: Swagger / OpenAPI

## 1. Tool selected

**Swagger UI with an OpenAPI 3.0 specification** was selected as the new self-directed tool for StockWise. This section assumes the student has not previously practised this tool in the sessional; confirm that assumption with the instructor before submission.

## 2. Why it was selected

StockWise has multiple REST API modules. An API specification makes available endpoints, request fields, and expected responses easier to inspect. Swagger UI also gives developers an interactive way to explore the documented API while developing the frontend or testing the backend.

## 3. How it is applied

- The OpenAPI specification is maintained in `server/src/openapi.js`.
- Swagger UI is exposed at `http://localhost:5000/api-docs`.
- The raw specification is available at `http://localhost:5000/api/openapi.json`.
- The specification documents health, product, supplier, stock-movement, sales, dashboard, and report endpoints.

## 4. Comparison with an alternative

| Point | Swagger UI / OpenAPI | Manually maintained endpoint list in README |
|---|---|---|
| Structure | Standardized machine-readable API description | Free-form text |
| Exploration | Interactive endpoint page and request forms | Reader must construct requests separately |
| Reuse | Specification can be used by API tooling | Usually limited to the README |
| Maintenance | Must update specification when endpoints change | Must update text when endpoints change |

A manually maintained README list was rejected as the primary documentation method because it does not provide the same standardized interactive API description. The README remains useful for installation and project overview.

## 5. Learning log — fill with your own experience

| Prompt | Student's notes |
|---|---|
| Which official guide/tutorial did you use? | [Insert actual title and URL] |
| What did you learn first? | [Explain OpenAPI structure, paths, methods, schemas, responses] |
| What was difficult? | [Describe an actual issue, not a guessed issue] |
| How did you solve it? | [Record your debugging steps and reference used] |
| How did the tool improve this project? | [Describe what you observed while using `/api-docs`] |
| What would you learn next? | [Name a realistic next tool/skill] |

## 6. Evaluation of learning resources

Evaluate resources you actually used. A suitable comparison structure is:

- **Official Swagger documentation:** assess accuracy, completeness, and whether examples matched your implementation.
- **Tutorial/video:** assess clarity and whether it helped you complete a working API documentation page.
- **Troubleshooting discussion:** assess how helpful it was and whether the answer was verified against official documentation.

Do not claim to have read a resource that you did not use. Add its actual URL and access date in the final report.

## 7. Evidence to capture

- Swagger UI showing the StockWise endpoint groups.
- Expanded endpoint showing its parameters or request body.
- Raw OpenAPI JSON endpoint.
- A working `Try it out` request to a local API endpoint.
