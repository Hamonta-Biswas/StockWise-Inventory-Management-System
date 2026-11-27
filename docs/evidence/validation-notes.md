# Starter Validation Notes

These notes describe checks performed while preparing the downloadable starter. They are not a substitute for running the full project on the student's computer.

- Backend JavaScript files passed `node --check` syntax validation.
- Frontend `.js` and `.jsx` files passed TypeScript parser syntax validation.
- The SQLite schema was executed against an in-memory SQLite database; table relationships, stock movement insertion, sale insertion, and unique-SKU constraint were checked.
- Dashboard and report SQL query shapes were executed against the schema.
- Nine dependency-free unit tests (movement factory, Observer/Adapter, and InventoryService tests) passed with Node's built-in test runner.
- The resulting 98.16% coverage number in `dependency-free-unit-tests.txt` is only for that selected subset of source files. It is **not** the coverage of the complete backend project.
- Installing Express, better-sqlite3, Supertest, Swagger UI, React, Vite, and Selenium dependencies timed out in this environment. Therefore the complete API integration test suite, frontend production build, and Selenium browser test were not executed here.

After downloading, run the commands in the root README. Replace this note with your own complete results after all dependencies are installed and all tests are run.
