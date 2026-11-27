import { useEffect, useState } from 'react';
import { api } from '../api';
import Loading from '../components/Loading';
import Notice from '../components/Notice';

const blank = { name: '', contact_person: '', email: '', phone: '', address: '' };

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState(null);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  async function load() { setSuppliers(await api('/suppliers')); }
  useEffect(() => { load().catch((e) => setError(e.message)); }, []);
  function startEdit(supplier) { setEditing(supplier.id); setForm({ ...supplier }); setShowForm(true); }
  async function submit(event) {
    event.preventDefault(); setError(''); setSuccess('');
    try {
      await api(editing ? `/suppliers/${editing}` : '/suppliers', { method: editing ? 'PUT' : 'POST', body: JSON.stringify(form) });
      setShowForm(false); setForm(blank); setEditing(null); setSuccess(editing ? 'Supplier updated.' : 'Supplier added.'); await load();
    } catch (e) { setError(e.message); }
  }
  async function remove(supplier) {
    if (!window.confirm(`Delete supplier ${supplier.name}?`)) return;
    try { await api(`/suppliers/${supplier.id}`, { method: 'DELETE' }); setSuccess('Supplier deleted.'); await load(); }
    catch (e) { setError(e.message); }
  }
  if (!suppliers) return error ? <Notice error={error} /> : <Loading />;
  return <div className="page-stack">
    <div className="page-heading"><div><p className="eyebrow">PARTNERS</p><h1>Suppliers</h1><p className="subheading">Keep supplier contacts and product sourcing details organized.</p></div><button className="primary-button" onClick={() => { setEditing(null); setForm(blank); setShowForm(true); }}>＋ Add supplier</button></div>
    <Notice error={error} success={success} onClose={() => { setError(''); setSuccess(''); }} />
    {showForm && <section className="panel form-panel"><div className="panel-heading"><div><h2>{editing ? 'Edit supplier' : 'Add supplier'}</h2><p>Contact information for your supplier.</p></div><button className="icon-button" onClick={() => setShowForm(false)}>×</button></div>
      <form className="form-grid" onSubmit={submit}><label>Supplier name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label><label>Contact person<input value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} /></label><label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label><label>Phone<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label><label className="span-2">Address<input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label><div className="form-actions span-2"><button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button><button className="primary-button">{editing ? 'Save supplier' : 'Add supplier'}</button></div></form>
    </section>}
    <div className="supplier-grid">{suppliers.map((supplier) => <article className="panel supplier-card" key={supplier.id}><div className="supplier-card-head"><span className="supplier-avatar">{supplier.name.slice(0, 1).toUpperCase()}</span><div className="grow"><h2>{supplier.name}</h2><p>{supplier.contact_person || 'Contact not specified'}</p></div><span className="active-tag">ACTIVE</span></div><div className="supplier-details"><p>✉ <span>{supplier.email || 'No email provided'}</span></p><p>⌕ <span>{supplier.phone || 'No phone provided'}</span></p><p>⌖ <span>{supplier.address || 'No address provided'}</span></p></div><div className="supplier-actions"><button className="text-button" onClick={() => startEdit(supplier)}>Edit details</button><button className="text-button danger-text" onClick={() => remove(supplier)}>Remove</button></div></article>)}
      {!suppliers.length && <section className="panel empty-state"><strong>No suppliers added</strong><p>Add your first supplier to connect them to products.</p></section>}
    </div>
  </div>;
}
