import { useEffect, useState } from 'react';
import { api, money } from '../api';
import Loading from '../components/Loading';
import Notice from '../components/Notice';

export default function Reports() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api('/analytics/reports').then(setData).catch((e) => setError(e.message)); }, []);
  if (error) return <Notice error={error} />;
  if (!data) return <Loading label="Building reports…" />;
  const maxRevenue = Math.max(1, ...data.daily_sales.map((d) => Number(d.revenue)));
  return <div className="page-stack">
    <div className="page-heading"><div><p className="eyebrow">INSIGHTS</p><h1>Reports & analytics</h1><p className="subheading">A summary of sales performance and inventory value.</p></div><span className="date-chip">Last 30 days</span></div>
    <div className="stats-grid two-stats"><article className="stat-card"><div className="stat-icon green">↗</div><p className="stat-label">Sales revenue</p><strong className="stat-value">{money(data.sales_summary.revenue)}</strong><p className="stat-note">Completed sales in the last 30 days</p></article><article className="stat-card"><div className="stat-icon blue">▤</div><p className="stat-label">Transactions</p><strong className="stat-value">{data.sales_summary.transactions}</strong><p className="stat-note">Number of completed sales</p></article></div>
    <div className="content-grid reports-grid"><section className="panel"><div className="panel-heading"><div><h2>Daily sales</h2><p>Revenue by day · last 7 days with activity</p></div></div>{data.daily_sales.length ? <div className="bar-chart">{data.daily_sales.map((day) => <div className="bar-column" key={day.day}><strong>{money(day.revenue)}</strong><div className="bar-track"><div className="bar-fill" style={{ height: `${Math.max(5, Number(day.revenue) / maxRevenue * 100)}%` }} /></div><span>{new Date(`${day.day}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short' })}</span></div>)}</div> : <div className="empty-state">Sales data will appear here after your first transaction.</div>}</section>
      <section className="panel"><div className="panel-heading"><div><h2>Top-selling products</h2><p>Ranked by units sold</p></div></div>{data.top_products.length ? <div className="rank-list">{data.top_products.map((item, index) => <div className="rank-row" key={item.product_id}><span className="rank-number">0{index + 1}</span><div className="grow"><strong>{item.product_name}</strong><small>{item.units_sold} units sold</small></div><strong>{money(item.revenue)}</strong></div>)}</div> : <div className="empty-state">No sales yet. Product performance will appear here.</div>}</section>
    </div>
    <section className="panel"><div className="panel-heading"><div><h2>Inventory by category</h2><p>Current stock value based on cost price.</p></div></div><div className="table-wrap"><table><thead><tr><th>CATEGORY</th><th>UNITS IN STOCK</th><th>ESTIMATED COST VALUE</th></tr></thead><tbody>{data.category_value.map((row) => <tr key={row.category}><td><strong>{row.category}</strong></td><td>{row.units}</td><td>{money(row.cost_value)}</td></tr>)}{!data.category_value.length && <tr><td colSpan="3">No inventory data.</td></tr>}</tbody></table></div></section>
  </div>;
}
