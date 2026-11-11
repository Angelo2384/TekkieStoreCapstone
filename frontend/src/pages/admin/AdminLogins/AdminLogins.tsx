import React, { useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import { AlertCircle, CheckCircle2, UserPlus } from 'lucide-react';
import { useAdminAccounts } from '../../../hooks/useAdminAccounts';
import { CreateAdminModal } from './CreateAdminModal';
import './AdminLogins.css';

const formatDate = (value: string | null, withTime: boolean, fallback: string): string => {
  if (!value) return fallback;
  const d = new Date(value);
  if (isNaN(d.getTime())) return fallback;
  return d.toLocaleString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
};

export const AdminLogins: React.FC = () => {
  const { admins, loading, error, refresh } = useAdminAccounts();
  const [showCreate, setShowCreate] = useState(false);
  const [createdEmail, setCreatedEmail] = useState<string | null>(null);

  const handleCreated = (email: string) => {
    setShowCreate(false);
    setCreatedEmail(email);
    refresh();
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Admin Logins</h1>
          <p className="admin-page-subtitle">Every admin and staff account, its last login and who's active right now.</p>
        </div>
        <button type="button" className="admin-btn-primary" onClick={() => setShowCreate(true)}>
          <UserPlus size={16} />
          <span>New Admin</span>
        </button>
      </div>

      {createdEmail && (
        <div className="adm-alert-success" role="status">
          <CheckCircle2 size={18} />
          <span>
            Account for <strong>{createdEmail}</strong> created. They'll set their own password the first time they log in.
          </span>
        </div>
      )}

      <div className="admin-logins-table-card">
        <div className="adm-table-responsive">
          <table className="admin-logins-table">
            <thead>
              <tr>
                <th>Email Address</th>
                <th>Role</th>
                <th>Account Created</th>
                <th>Last Login</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx}>
                    <td>
                      <Skeleton variant="text" width={180} animation="wave" />
                    </td>
                    <td>
                      <Skeleton variant="text" width={80} animation="wave" />
                    </td>
                    <td>
                      <Skeleton variant="text" width={100} animation="wave" />
                    </td>
                    <td>
                      <Skeleton variant="text" width={140} animation="wave" />
                    </td>
                    <td>
                      <Skeleton variant="text" width={80} animation="wave" />
                    </td>
                  </tr>
                ))
              ) : error && admins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="adm-empty-row adm-empty-row-error">
                    <AlertCircle size={16} />
                    <span>Unable to load admin accounts from the server.</span>
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="adm-empty-row">
                    No admin accounts found.
                  </td>
                </tr>
              ) : (
                admins.map((a) => (
                  <tr key={a.email}>
                    <td className="adm-email">{a.email}</td>
                    <td className="adm-text-sm">{a.role === 'ADMIN' ? 'Main admin' : 'Staff'}</td>
                    <td className="adm-text-sm">{formatDate(a.createdAt, false, 'Unknown')}</td>
                    <td className="adm-text-sm">{formatDate(a.lastLoginAt, true, 'Never')}</td>
                    <td>
                      <span className={`adm-status ${a.active ? 'adm-status-active' : 'adm-status-offline'}`}>
                        <span className="adm-status-dot" />
                        {a.active ? 'Active now' : 'Offline'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && <CreateAdminModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />}
    </div>
  );
};
export default AdminLogins;
