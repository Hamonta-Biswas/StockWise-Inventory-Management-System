import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Suppliers from './pages/Suppliers';
import Stock from './pages/Stock';
import Sales from './pages/Sales';
import Reports from './pages/Reports';

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦', group: 'WORKSPACE' },
  { id: 'products', label: 'Products', icon: '▤' },
  { id: 'suppliers', label: 'Suppliers', icon: '♧' },
  { id: 'stock', label: 'Stock control', icon: '↔' },
  { id: 'sales', label: 'Sales & billing', icon: '৳', group: 'MANAGEMENT' },
  { id: 'reports', label: 'Reports', icon: '▥' }
];
const pageTitles = { dashboard: 'Dashboard', products: 'Products', suppliers: 'Suppliers', stock: 'Stock control', sales: 'Sales & billing', reports: 'Reports' };

export default function App() {
  const [active, setActive] = useState('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);
  const pages = { dashboard: Dashboard, products: Products, suppliers: Suppliers, stock: Stock, sales: Sales, reports: Reports };
  const Page = pages[active];
  return <div className="app-shell">
    <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark">S</div><div><strong>stockwise</strong><small>INVENTORY CONTROL</small></div><button className="mobile-close" onClick={() => setMenuOpen(false)}>×</button></div>
      <div className="workspace-switch"><span className="workspace-avatar">NW</span><div><strong>Northwind Store</strong><small>Workspace</small></div><span className="workspace-chevron">⌄</span></div>
      <nav className="main-nav" aria-label="Main navigation">
        {navigation.map((item, index) => <div key={item.id}>{item.group && <p className="nav-group">{item.group}</p>}<button className={`nav-link ${active === item.id ? 'active' : ''}`} onClick={() => { setActive(item.id); setMenuOpen(false); }} aria-current={active === item.id ? 'page' : undefined}><span className="nav-icon">{item.icon}</span><span>{item.label}</span>{item.id === 'stock' && <span className="nav-indicator" />}</button></div>)}
      </nav>
      <div className="sidebar-bottom"><div className="help-card"><span className="help-icon">?</span><strong>Need a hand?</strong><p>Check the setup guide to get the most out of StockWise.</p><a href="https://github.com/" target="_blank" rel="noreferrer">View documentation ↗</a></div><div className="profile-row"><div className="profile-avatar">AD</div><div className="grow"><strong>Store Admin</strong><small>Administrator</small></div><span className="profile-menu">•••</span></div></div>
    </aside>
    {menuOpen && <button className="mobile-overlay" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
    <main className="main-area"><header className="topbar"><div className="topbar-left"><button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu">☰</button><span className="breadcrumb-muted">Workspace</span><span className="breadcrumb-separator">/</span><strong>{pageTitles[active]}</strong></div><div className="topbar-right"><span className="system-status"><i /> System operational</span><button className="topbar-icon" aria-label="Notifications">♧<i /></button><div className="topbar-divider" /><div className="topbar-user"><div className="profile-avatar small-avatar">AD</div><span>Admin</span></div></div></header><div className="page-content"><Page /></div><footer className="app-footer"><span>StockWise Inventory Management</span><span>Built for accurate stock, simple operations.</span></footer></main>
  </div>;
}
