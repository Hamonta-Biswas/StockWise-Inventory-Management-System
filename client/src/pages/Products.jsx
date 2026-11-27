import { useEffect, useMemo, useState } from 'react';
import { api, money } from '../api';
import Loading from '../components/Loading';
import Notice from '../components/Notice';

const blank = { sku: '', name: '', category: 'General', description: '', cost_price: '0', selling_price: '0', quantity: '0', reorder_level: '5', supplier_id: '' };

export default function Products() {
  const [products, setProducts] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [lowOnly, setLowOnly] = useState(false);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function load() {
    const [productData, supplierData] = await Promise.all([api(`/products?search=${encodeURIComponent(search)}&lowStock=${lowOnly}`), api('/suppliers')]);
    setProducts(productData); setSuppliers(supplierData);
  }
  useEffect(() => { load().catch((e) => setError(e.message)); }, [search, lowOnly]);

  const categories = useMemo(() => [...new Set((products || []).map((p) => p.category))], [products]);
  function startCreate() { setEditing(null); setForm(blank); setShowForm(true); setError(''); setSuccess(''); }
  function startEdit(product) {
    setEditing(product.id);
    setForm({ ...product, cost_price: String(product.cost_price), selling_price: String(product.selling_price), quantity: String(product.quantity), reorder_level: String(product.reorder_level), supplier_id: product.supplier_id ? String(product.supplier_id) : '' });
    setShowForm(true); setError(''); setSuccess('');
  }
  function updateField(event) { setForm((current) => ({ ...current, [event.target.name]: event.target.value })); }
  async function submit(event) {
    event.preventDefault(); setError(''); setSuccess('');
    const payload = { ...form, cost_price: Number(form.cost_price), selling_price: Number(form.selling_price), quantity: Number(form.quantity), reorder_level: Number(form.reorder_level), supplier_id: form.supplier_id || null };
    try {
      await api(editing ? `/products/${editing}` : '/products', { method: editing ? 'PUT' : 'POST', body: JSON.stringify(payload) });
      setShowForm(false); setSuccess(editing ? 'Product details updated.' : 'Product created successfully.'); await load();
    } catch (e) { setError(e.message); }
  }
  async function remove(product) {
    if (!window.confirm(`Delete ${product.name}? Its movement history will also be removed.`)) return;
    try { await api(`/products/${product.id}`, { method: 'DELETE' }); setSuccess('Product deleted.'); await load(); }
    catch (e) { setError(e.message); }
  }

  if (!products) return error ? <Notice error={error} /> : <Loading />;
  return <div className="page-stack">
    <div className="page-heading"><div><p className="eyebrow">CATALOG</p><h1>Products</h1><p className="subheading">Manage your catalog, prices, and stock thresholds.</p></div><button className="primary-button" onClick={startCreate}>＋ Add product</button></div>
    <Notice error={error} success={success} onClose={() => { setError(''); setSuccess(''); }} />
    {showForm && <section className="panel form-panel"><div className="panel-heading"><div><h2>{editing ? 'Edit product details' : 'Add a new product'}</h2><p>{editing ? 'Update catalog information. Change stock from Stock Control.' : 'Enter product and opening stock information.'}</p></div><button className="icon-button" onClick={() => setShowForm(false)} aria-label="Close form">×</button></div>
      <form onSubmit={submit} className="form-grid">
        <label>SKU<input name="sku" value={form.sku} onChange={updateField} required /></label>
        <label>Product name<input name="name" value={form.name} onChange={updateField} required /></label>
        <label>Category<input name="category" value={form.category} onChange={updateField} /></label>
        <label>Supplier<select name="supplier_id" value={form.supplier_id} onChange={updateField}><option value="">No supplier</option>{suppliers.map((supplier) => <option value={supplier.id} key={supplier.id}>{supplier.name}</option>)}</select></label>
        <label>Cost price (৳)<input name="cost_price" type="number" min="0" step="0.01" value={form.cost_price} onChange={updateField} required /></label>
        <label>Selling price (৳)<input name="selling_price" type="number" min="0" step="0.01" value={form.selling_price} onChange={updateField} required /></label>
        {!editing && <label>Opening quantity<input name="quantity" type="number" min="0" step="1" value={form.quantity} onChange={updateField} required /></label>}
        <label>Reorder level<input name="reorder_level" type="number" min="0" step="1" value={form.reorder_level} onChange={updateField} required /></label>
        <label className="span-2">Description<textarea name="description" value={form.description} onChange={updateField} rows="2" /></label>
        <div className="form-actions span-2"><button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button><button className="primary-button">{editing ? 'Save changes' : 'Create product'}</button></div>
      </form>
    </section>}
    <section className="panel table-panel"><div className="toolbar"><div className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products or SKU..." /></div><label className="check-filter"><input type="checkbox" checked={lowOnly} onChange={(e) => setLowOnly(e.target.checked)} /> Low stock only</label><span className="result-count">{products.length} products</span></div>
      <div className="table-wrap"><table><thead><tr><th>PRODUCT</th><th>SKU / CATEGORY</th><th>PRICE</th><th>STOCK</th><th>SUPPLIER</th><th className="align-right">ACTIONS</th></tr></thead><tbody>
        {products.map((product) => <tr key={product.id}><td><div className="table-product"><span className="product-avatar">{product.name.slice(0, 1).toUpperCase()}</span><div><strong>{product.name}</strong><small>{product.description || 'No description'}</small></div></div></td><td><strong className="code-text">{product.sku}</strong><small className="table-subtext">{product.category}</small></td><td><strong>{money(product.selling_price)}</strong><small className="table-subtext">Cost {money(product.cost_price)}</small></td><td><strong>{product.quantity} units</strong><small className={`table-subtext ${product.quantity <= product.reorder_level ? 'text-warning' : ''}`}>{product.quantity <= product.reorder_level ? `Reorder at ${product.reorder_level}` : 'In stock'}</small></td><td>{product.supplier_name || '—'}</td><td className="align-right"><button className="text-button" onClick={() => startEdit(product)}>Edit</button><button className="text-button danger-text" onClick={() => remove(product)}>Delete</button></td></tr>)}
        {!products.length && <tr><td colSpan="6"><div className="empty-state"><strong>No products found</strong><p>Try changing your search or add a product.</p></div></td></tr>}
      </tbody></table></div>
      <div className="table-footer">Showing {products.length} matching products · Categories: {categories.length || 0}</div>
    </section>
  </div>;
}
