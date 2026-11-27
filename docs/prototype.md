# Prototype / Mock-up

The running React interface is the high-fidelity prototype and implementation. It uses a persistent left navigation bar, a top context bar, summary cards, forms, and data tables. The same navigation is used throughout the six functional modules.

## Screen plan

| Screen | Main elements | User action |
|---|---|---|
| Dashboard | Product count, units in stock, low-stock alerts, sales today, recent activity | Review current store status |
| Products | Search, low-stock filter, product table, add/edit form | Maintain the product catalogue |
| Suppliers | Supplier cards and add/edit form | Maintain supplier information |
| Stock Control | Product selector, movement type, quantity, note, movement history | Record stock changes |
| Sales & Billing | Product selector, quantity, current bill, total, recent sales | Complete a sale |
| Reports | Sales summary, daily sales chart, top products, category value | Review performance |

## Low-fidelity wireframe

```text
+----------------------+----------------------------------------------+
| STOCKWISE            | Workspace / Dashboard             Admin     |
|                      +----------------------------------------------+
| Northwind Store      | Dashboard                                    |
|                      | Good day. Here's your store at a glance.     |
| WORKSPACE            |                                              |
| > Dashboard          | +------------+ +------------+ +-------------+ |
|   Products           | | Products   | | Units      | | Low stock   | |
|   Suppliers          | +------------+ +------------+ +-------------+ |
|   Stock Control      |                                              |
|                      | +----------------------+ +----------------+ |
| MANAGEMENT           | | Stock alerts         | | Recent activity| |
|   Sales & Billing    | | Product / quantity   | | Movement log   | |
|   Reports            | +----------------------+ +----------------+ |
+----------------------+----------------------------------------------+
```

## Prototype testing checklist

- Check that a first-time user can identify each module from the sidebar.
- Check that required fields are visibly marked and validation errors are understandable.
- Check that the stock-adjustment screen explains that the entered number is the new physical count.
- Check that the sales screen displays the total before checkout.
- Resize the browser to a mobile width and check that the navigation becomes a menu.

## Screenshots for the final report

Capture your own screenshots after running the application:

1. Dashboard with sample data.
2. Product list and add-product form.
3. Supplier list.
4. Stock movement form and movement history.
5. Sales bill and completed sale.
6. Reports screen.

Paste the screenshots into the project report with figure numbers and short captions.
