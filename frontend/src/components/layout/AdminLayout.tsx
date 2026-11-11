import React, { useRef, useState } from 'react';
import { NavLink, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingBag,
  Users,
  Store,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LogoutDialog } from '../shared/LogoutDialog';
import './AdminLayout.css';

// Sidebar links; the breadcrumb reads its label from the same list
const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true, mainAdminOnly: false },
  { to: '/admin/products', label: 'Products', icon: Package, end: false, mainAdminOnly: false },
  { to: '/admin/inventory', label: 'Inventory', icon: Boxes, end: false, mainAdminOnly: false },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag, end: false, mainAdminOnly: false },
  { to: '/admin/customers', label: 'Customers', icon: Users, end: false, mainAdminOnly: false },
  { to: '/admin/logins', label: 'Admin Logins', icon: ShieldCheck, end: false, mainAdminOnly: true },
];

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isLoggingOut = useRef(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = () => {
    isLoggingOut.current = true;
    logout();
    navigate('/login', { replace: true });
  };

  const displayName = user?.firstName || user?.lastName
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
    : 'Admin';
  const displayEmail = user?.email || 'Store Administrator';
  const initials = (
    (user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')
  ).toUpperCase() || 'AD';

  // Staff don't see the pages only the main admin can open
  const navItems = NAV_ITEMS.filter((item) => !item.mainAdminOnly || user?.role === 'ADMIN');

  const path = location.pathname;
  const section = NAV_ITEMS.find((item) => !item.end && path.startsWith(item.to)) ?? NAV_ITEMS[0];

  return (
    <div className="admin-container">
      <aside className="admin-sidebar" aria-label="Admin Navigation">
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-logo-link">
            <img src="/logo.png" alt="SoleTown Logo" className="admin-logo-img" />
            <div className="admin-logo-text">
              <span className="brand-title">SoleTown</span>
              <span className="admin-portal-tag">ADMIN PORTAL</span>
            </div>
          </Link>
        </div>

        <nav className="admin-nav-menu">
          <div className="admin-nav-section-label">MAIN MENU</div>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={label}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} className="admin-nav-icon" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button
            type="button"
            className="admin-nav-link logout-link"
            onClick={() => setConfirmLogout(true)}
            title="Log out of admin session"
            aria-label="Log out of admin session"
          >
            <LogOut size={20} className="admin-nav-icon" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="admin-main-wrapper">
        <header className="admin-top-navbar">
          <div className="admin-top-left">
            <nav className="admin-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/admin" className="breadcrumb-link">Admin</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">{section.label}</span>
            </nav>
          </div>

          <div className="admin-top-right">
            <Link to="/" className="admin-quick-store-btn" title="Go to Customer Storefront">
              <Store size={16} />
              <span>View Store</span>
            </Link>

            <div className="admin-profile-pill">
              <div className="admin-avatar">{initials}</div>
              <div className="admin-user-info">
                <span className="admin-name">{displayName}</span>
                <span className="admin-role">{displayEmail}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content-area">
          <Outlet />
        </main>
      </div>

      {confirmLogout && <LogoutDialog onCancel={() => setConfirmLogout(false)} onConfirm={handleLogout} />}
    </div>
  );
};

export default AdminLayout;
