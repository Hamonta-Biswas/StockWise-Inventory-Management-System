import { useEffect, useMemo, useState } from 'react';
import { api, dateTime, money } from '../api';
import Loading from '../components/Loading';
import Notice from '../components/Notice';

export default function Sales() {
  const [products, setProducts] = useState(null);
  const [sales, setSales] = useState([]);
  const [selected, setSelected] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  async function load() {
    const [productData, salesData] = await Promise.all([api('/products'), api('/sales?limit=30')]);
    setProducts(productData); setSales(salesData);
    if (!selected && productData.length) setSelected(String(productData[0].id));
  }
  useEffect(() => { load().catch((e) => setError(e.message)); }, []);
  const available = products || [];
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.quantity * item.selling_price, 0), [cart]);
  function addItem() {
    const product = available.find((p) => p.id === Number(selected));
    const qty = Number(quantity);
    if (!product || !Number.isInteger(qty) || qty < 1) { setError('Choose a product and enter a valid quantity.'); return; }
    const existing = cart.find((item) => item.id === product.id);
    const requested = (existing?.quantity || 0) + qty;
    if (requested > product.quantity) { setError(`Only ${product.quantity} ${product.name} unit(s) are available.`); return; }
    setCart(existing ? cart.map((item) => item.id === product.id ? { ...item, quantity: requested } : item) : [...cart, { ...product, quantity: qty }]);
    setError('');
  }
  function changeQty(id, value) {
    const qty = Number(value);
    const product = available.find((p) => p.id === id);
    if (!Number.isInteger(qty) || qty < 1 || qty > product.quantity) return;
    setCart(cart.map((item) => item.id === id ? { ...item, quantity: qty } : item));
  }
  async function checkout() {
    setError(''); setSuccess('');
    try {
      const sale = await api('/sales', { method: 'POST', body: JSON.stringify({ items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })) }) });
      setCart([]); setSuccess(`Sale ${sale.sale_number} completed. Total: ${money(sale.total)}.`); await load();
    } catch (e) { setError(e.message); }
  }
  if (!products) return error ? <Notice error={error} /> : <Loading />;
  return <div className="page-stack">
    <div className="page-heading"><div><p className="eyebrow">CHECKOUT</p><h1>Sales & billing</h1><p className="subheading">Create a sale, calculate totals, and automatically deduct sold stock.</p></div><span className="date-chip">৳ BDT currency</span></div>
    <Notice error={error} success={success} onClose={() => { setError(''); setSuccess(''); }} />
    <div className="content-grid sales-grid"><section className="panel"><div className="panel-heading"><div><h2>New sale</h2><p>Add products to the current bill.</p></div></div><div className="add-to-cart"><label>Product<select value={selected} onChange={(e) => setSelected(e.target.value)}>{available.map((p) => <option value={p.id} key={p.id} disabled={p.quantity === 0}>{p.name} · {money(p.selling_price)} · {p.quantity} available</option>)}</select></label><label>Qty<input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} /></label><button className="primary-button" onClick={addItem}>Add</button></div>
      <div className="cart-list">{cart.map((item) => <div className="cart-row" key={item.id}><div className="grow"><strong>{item.name}</strong><small>{money(item.selling_price)} each · {item.sku}</small></div><input className="quantity-input" aria-label={`Quantity for ${item.name}`} type="number" min="1" max={item.quantity} value={item.quantity} onChange={(e) => changeQty(item.id, e.target.value)} /><strong>{money(item.quantity * item.selling_price)}</strong><button className="icon-button" onClick={() => setCart(cart.filter((row) => row.id !== item.id))} aria-label={`Remove ${item.name}`}>×</button></div>)}{!cart.length && <div className="empty-state compact"><span>▤</span><strong>Your bill is empty</strong><p>Add available products to begin a sale.</p></div>}</div>
      <div className="cart-total"><span>Bill total</span><strong>{money(cartTotal)}</strong></div><button className="primary-button checkout-button" disabled={!cart.length} onClick={checkout}>Complete sale <span>→</span></button>
    </section>
    <section className="panel"><div className="panel-heading"><div><h2>Recent sales</h2><p>Latest completed transactions.</p></div><span className="count-pill">{sales.length}</span></div><div className="sales-history">{sales.map((sale) => <div className="sale-row" key={sale.id}><div className="sale-icon">৳</div><div className="grow"><strong>{sale.sale_number}</strong><small>{sale.items.length} line item(s) · {dateTime(sale.created_at)}</small></div><strong>{money(sale.total)}</strong></div>)}{!sales.length && <div className="empty-state compact">No sales have been recorded yet.</div>}</div></section></div>
  </div>;
}
