# Five-Minute Demonstration and Viva Preparation

## Suggested five-minute demo

| Time | Demonstration |
|---|---|
| 0:00–0:30 | Introduce StockWise, the problem it addresses, the stack, and the six modules. |
| 0:30–1:15 | Show the dashboard and explain product, stock, alert, and sales metrics. |
| 1:15–2:00 | Add or edit a product and show supplier management. |
| 2:00–2:45 | Record stock-in and stock-out; demonstrate that insufficient stock is rejected. |
| 2:45–3:30 | Create a sale and show that stock quantity decreases automatically. |
| 3:30–4:10 | Show reports and the Swagger UI endpoint documentation. |
| 4:10–5:00 | Briefly show tests/CI and explain the three design patterns and new tool. |

Use a seeded database before the demo. Do not use a real customer or personal data.

## Viva questions to practise

1. Why did you choose the Incremental Process Model?
2. What is the difference between a functional and non-functional requirement? Give one example of each from StockWise.
3. Why is a Factory Method useful for stock movements?
4. How does the Observer pattern reduce coupling in low-stock notifications?
5. What interface does the Notification Adapter translate?
6. What is the difference between unit testing and API integration testing?
7. Which dependency is mocked in your tests, and what would happen if you used the real provider?
8. Explain the Red–Green–Refactor cycle and show one actual test-first example from your Git history.
9. How does the sales transaction prevent partial stock updates?
10. What does Selenium test in your project, and what does it not test?
11. What happens when a product quantity becomes equal to its reorder level?
12. Why did you select Swagger/OpenAPI? How is it used in this application?
13. What was your merge conflict, and how did you resolve it?
14. What is one limitation of the current application, and what would you improve next?

Answer using your own code and evidence rather than memorized definitions alone.
