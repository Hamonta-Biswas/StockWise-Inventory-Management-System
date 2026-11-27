import { useEffect, useState } from 'react';
import { api, money, dateTime } from '../api';
import Loading from '../components/Loading';
import Notice from '../components/Notice';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api('/analytics/dashboard').then(setData).catch((e) => setError(e.message)); }, []);
  if (error) return <Notice error={error} />;
  if (!data) return <Loading label="Preparing your overview…" />;

  const stats = [
    { label: 'Total products', value: data.product_count, note: 'Active catalog items', icon: '▦', tone: 'blue' },
    { label: 'Units in stock', value: data.units_in_stock.toLocaleString(), note: 'Across all products', icon: '▤', tone: 'violet' },
    { label: 'Low-stock items', value: data.low_stock_count, note: 'At or below reorder level', icon: '!', tone: 'orange' },
    { label: 'Sales today', value: money(data.sales_today_total), note: `${data.sales_today_count} transactions`, icon: '↗', tone: 'green' }
  ];
  return (
    <div className="page-stack">
      <div className="page-heading"><div><p className="eyebrow">OVERVIEW</p><h1>Good day. Here's your store at a glance.</h1><p className="subheading">A real-time snapshot of your inventory and sales activity.</p></div><span className="date-chip">◷ {new Date().toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
      <div className="stats-grid">
        {stats.map((stat) => <article className="stat-card" key={stat.label}><div className={`stat-icon ${stat.tone}`}>{stat.icon}</div><p className="stat-label">{stat.label}</p><strong className="stat-value">{stat.value}</strong><p className="stat-note">{stat.note}</p></article>)}
      </div>
      <div className="content-grid dashboard-grid">
        <section className="panel"><div className="panel-heading"><div><h2>Stock alerts</h2><p>Products that need attention</p></div><span className="count-pill">{data.low_stock_products.length} alerts</span></div>
          {data.low_stock_products.length ? <div className="alert-list">{data.low_stock_products.map((product) => <div className="alert-row" key={product.id}><div className="product-avatar">{product.name.slice(0, 1).toUpperCase()}</div><div className="grow"><strong>{product.name}</strong><small>{product.sku}</small></div><div className="stock-level"><strong>{product.quantity} left</strong><small>Reorder at {product.reorder_level}</small></div><span className="status-dot" /></div>)}</div> : <div className="empty-state compact"><span>✓</span><strong>All stock levels look healthy</strong><p>No products are currently below their reorder level.</p></div>}
        </section>
        <section className="panel"><div className="panel-heading"><div><h2>Recent stock activity</h2><p>Latest inventory movements</p></div><span className="muted-label">LATEST 6</span></div>
          {data.recent_movements.length ? <div className="activity-list">{data.recent_movements.map((movement) => <div className="activity-row" key={movement.id}><span className={`movement-mark ${movement.movement_type.toLowerCase()}`}>{movement.movement_type === 'IN' ? '+' : movement.movement_type === 'OUT' ? '−' : '↔'}</span><div className="grow"><strong>{movement.product_name}</strong><small>{movement.sku} · {dateTime(movement.created_at)}</small></div><span className={`movement-quantity ${movement.movement_type.toLowerCase()}`}>{movement.movement_type === 'OUT' ? '−' : '+'}{movement.quantity}</span></div>)}</div> : <div className="empty-state compact"><p>No stock activity yet.</p></div>}
        </section>
      </div>
      <div className="footnote">Inventory cost value: <strong>{money(data.inventory_cost)}</strong><span> · </span>Estimated retail value: <strong>{money(data.inventory_retail_value)}</strong><span> · </span>{data.supplier_count} suppliers</div>
    </div>
  );
}
