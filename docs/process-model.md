# Process Model: Incremental Development

## Selected model

The project uses the **Incremental Process Model**. The application is divided into small functional increments. Each increment adds a usable part of the inventory system while keeping the earlier modules available.

## Justification

1. The requirements can be divided into independent modules such as products, suppliers, inventory, sales, and reporting.
2. The core product and supplier data can be implemented first; stock control and sales can then reuse those modules.
3. Each increment can be tested before the next module is added, helping identify defects earlier.
4. New requirements, such as a different notification provider or another report, can be added without redesigning the entire application.

## Planned increments

| Increment | Scope | Main evidence |
|---|---|---|
| 1 | Project setup, database schema, product and supplier management | Database schema, CRUD tests, product/supplier screens |
| 2 | Stock movements and low-stock event | Movement factory, Observer event, stock history, tests |
| 3 | Sales and billing | Transactional checkout, sale records, inventory deduction tests |
| 4 | Dashboard and reports | Dashboard metrics, reporting endpoints, UI |
| 5 | API documentation, Selenium, CI, report and refinement | Swagger UI, browser test, GitHub Actions result |

## Incremental lifecycle

For each increment:

1. Review its requirements and acceptance criteria.
2. Create a feature branch.
3. Write the relevant test first (Red).
4. Implement the smallest change that makes the test pass (Green).
5. Refactor while keeping tests green.
6. Review the code and open a pull request.
7. Merge the reviewed increment into the main branch.
8. Update the learning log and project documentation.

## Limitations

Incremental development requires clear module boundaries and regular integration. Changes to shared database structures may affect multiple increments, so database migrations and integration tests should be reviewed carefully.

## Evidence to add to the report

Insert the actual GitHub commit/PR links and screenshots for each increment. Do not use the planned sequence as a claim that the work was completed unless the repository history shows it.
