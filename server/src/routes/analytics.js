import { Router } from 'express';

export function analyticsRoutes(db) {
  const router = Router();
  router.get('/dashboard', (_req, res) => {
    const totals = db.prepare(`SELECT COUNT(*) AS product_count,
      COALESCE(SUM(quantity), 0) AS units_in_stock,
      COALESCE(SUM(quantity * cost_price), 0) AS inventory_cost,
      COALESCE(SUM(quantity * selling_price), 0) AS inventory_retail_value
      FROM products`).get();
    const lowStock = db.prepare('SELECT COUNT(*) AS count FROM products WHERE quantity <= reorder_level').get().count;
    const supplierCount = db.prepare('SELECT COUNT(*) AS count FROM suppliers').get().count;
    const salesToday = db.prepare("SELECT COUNT(*) AS count, COALESCE(SUM(total),0) AS total FROM sales WHERE date(created_at)=date('now','localtime')").get();
    const recentMovements = db.prepare(`SELECT m.*, p.name AS product_name, p.sku FROM stock_movements m
      JOIN products p ON p.id=m.product_id ORDER BY m.created_at DESC, m.id DESC LIMIT 6`).all();
    const lowStockProducts = db.prepare(`SELECT id, sku, name, quantity, reorder_level FROM products
      WHERE quantity <= reorder_level ORDER BY quantity ASC LIMIT 6`).all();
    res.json({ ...totals, low_stock_count: lowStock, supplier_count: supplierCount,
      sales_today_count: salesToday.count, sales_today_total: salesToday.total,
      recent_movements: recentMovements, low_stock_products: lowStockProducts });
  });

  router.get('/reports', (_req, res) => {
    const salesSummary = db.prepare(`SELECT COUNT(*) AS transactions, COALESCE(SUM(total),0) AS revenue
      FROM sales WHERE created_at >= datetime('now','-30 days')`).get();
    const topProducts = db.prepare(`SELECT si.product_id, si.product_name, SUM(si.quantity) AS units_sold,
      SUM(si.line_total) AS revenue FROM sale_items si JOIN sales s ON s.id=si.sale_id
      WHERE s.created_at >= datetime('now','-30 days') GROUP BY si.product_id, si.product_name
      ORDER BY units_sold DESC LIMIT 5`).all();
    const dailySales = db.prepare(`SELECT date(created_at) AS day, COUNT(*) AS transactions,
      ROUND(SUM(total),2) AS revenue FROM sales WHERE created_at >= datetime('now','-6 days')
      GROUP BY date(created_at) ORDER BY day`).all();
    const categoryValue = db.prepare(`SELECT category, SUM(quantity) AS units,
      ROUND(SUM(quantity * cost_price),2) AS cost_value FROM products GROUP BY category ORDER BY cost_value DESC`).all();
    res.json({ sales_summary: salesSummary, top_products: topProducts,
      daily_sales: dailySales, category_value: categoryValue });
  });
  return router;
}
