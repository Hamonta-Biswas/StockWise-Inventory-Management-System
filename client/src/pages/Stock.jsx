import { useEffect, useState } from 'react';
import { api, dateTime } from '../api';
import Loading from '../components/Loading';
import Notice from '../components/Notice';

export default function Stock() {
  const [products, setProducts] = useState(null);
  const [movements, setMovements] = useState([]);
  const [form, setForm] = useState({ productId: '', type: 'IN', quantity: '1', note: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  async function load() {
    const [productData, movementData] = await Promise.all([api('/products'), api('/inventory/movements?limit=100')]);
    setProducts(productData); setMovements(movementData);
    if (!form.productId && productData.length) setForm((current) => ({ ...current, productId: String(productData[0].id) }));
  }
  useEffect(() => { load().catch((e) => setError(e.message)); }, []);
  async function submit(event) {
    event.preventDefault(); setError(''); setSuccess('');
    try {
      const result = await api('/inventory/movements', { method: 'POST', body: JSON.stringify({ ...form, productId: Number(form.productId), quantity: Number(form.quantity) }) });
      setSuccess(`${result.product.name} now has ${result.product.quantity} unit(s) in stock.`);
      setForm((current) => ({ ...current, quantity: '1', note: '' })); await load();
    } catch (e) { setError(e.message); }
  }
  if (!products) return error ? <Notice error={error} /> : <Loading />;
  return <div className="page-stack">
    <div className="page-heading"><div><p className="eyebrow">INVENTORY CONTROL</p><h1>Stock movements</h1><p className="subheading">Record incoming deliveries, outgoing stock, and physical stock corrections.</p></div><span className="date-chip">↔ Inventory ledger</span></div>
    <Notice error={error} success={success} onClose={() => { setError(''); setSuccess(''); }} />
    <section className="panel form-panel"><div className="panel-heading"><div><h2>Record a movement</h2><p>Every movement is stored in the inventory history.</p></div></div>
      <form onSubmit={submit} className="form-grid stock-form"><label>Product<select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} required><option value="">Select product</option>{products.map((p) => <option value={p.id} key={p.id}>{p.name} · {p.quantity} available</option>)}</select></label><label>Movement type<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="IN">Stock In — receive delivery</option><option value="OUT">Stock Out — remove stock</option><option value="ADJUSTMENT">Adjustment — set actual count</option></select></label><label>{form.type === 'ADJUSTMENT' ? 'New physical count' : 'Quantity'}<input type="number" min="0" step="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required /></label><label className="span-2">Note<input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="e.g. Supplier delivery, damaged items, stock count..." /></label><div className="form-actions span-2"><span className="form-hint">Stock Out cannot exceed available quantity.</span><button className="primary-button" disabled={!products.length}>Save movement</button></div></form>
    </section>
    <section className="panel table-panel"><div className="panel-heading table-heading"><div><h2>Movement history</h2><p>Most recent stock activity first.</p></div><span className="count-pill">{movements.length} records</span></div><div className="table-wrap"><table><thead><tr><th>PRODUCT</th><th>TYPE</th><th>QUANTITY</th><th>RESULTING STOCK</th><th>NOTE</th><th>DATE</th></tr></thead><tbody>{movements.map((m) => <tr key={m.id}><td><strong>{m.product_name}</strong><small className="table-subtext">{m.sku}</small></td><td><span className={`type-pill ${m.movement_type.toLowerCase()}`}>{m.movement_type}</span></td><td>{m.movement_type === 'OUT' ? '−' : '+'}{m.quantity}</td><td><strong>{m.resulting_quantity}</strong> units</td><td>{m.note || '—'}</td><td>{dateTime(m.created_at)}</td></tr>)}{!movements.length && <tr><td colSpan="6"><div className="empty-state">No inventory movements recorded yet.</div></td></tr>}</tbody></table></div></section>
  </div>;
}
