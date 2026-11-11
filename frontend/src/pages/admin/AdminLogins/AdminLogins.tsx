import React, { useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import { AlertCircle, CheckCircle2, Trash2, UserPlus } from 'lucide-react';
import { useAdminAccounts } from '../../../hooks/useAdminAccounts';
import { CreateStaffModal } from './CreateStaffModal';
import { DeleteStaffDialog } from './DeleteStaffDialog';
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
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleCreated = (email: string) => {
    setShowCreate(false);
    setNotice(`Account for ${email} created. They'll set their own password the first time they log in.`);
    refresh();
  };

  const handleDeleted = (email: string) => {
    setDeletingEmail(null);
    setNotice(`Account for ${email} deleted.`);
    refresh();
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Admin Logins</h1>
          <p className="admin-page-subtitle">The owner and every staff account, its last login and who's active right now.</p>
        </div>
        <button type="button" className="admin-btn-primary" onClick={() => setShowCreate(true)}>
          <UserPlus size={16} />
          <span>New Staff</span>
        </button>
      </div>

      {notice && (
        <div className="adm-alert-success" role="status">
          <CheckCircle2 size={18} />
          <span>{notice}</span>
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
                <th aria-label="Actions" />
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
                    <td />
                  </tr>
                ))
              ) : error && admins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="adm-empty-row adm-empty-row-error">
                    <AlertCircle size={16} />
                    <span>Unable to load accounts from the server.</span>
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="adm-empty-row">
                    No accounts found.
                  </td>
                </tr>
              ) : (
                admins.map((a) => (
                  <tr key={a.email}>
                    <td className="adm-email">{a.email}</td>
                    <td className="adm-text-sm">{a.role === 'ADMIN' ? 'Owner' : 'Staff'}</td>
                    <td className="adm-text-sm">{formatDate(a.createdAt, false, 'Unknown')}</td>
                    <td className="adm-text-sm">{formatDate(a.lastLoginAt, true, 'Never')}</td>
                    <td>
                      <span className={`adm-status ${a.active ? 'adm-status-active' : 'adm-status-offline'}`}>
                        <span className="adm-status-dot" />
                        {a.active ? 'Active now' : 'Offline'}
                      </span>
                    </td>
                    <td className="adm-actions-cell">
                      {a.role === 'STAFF' && (
                        <button
                          type="button"
                          className="admin-row-delete-btn"
                          onClick={() => setDeletingEmail(a.email)}
                          aria-label={`Delete ${a.email}`}
                        >
                          <Trash2 size={15} />
                          <span>Delete</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && <CreateStaffModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />}

      {deletingEmail && (
        <DeleteStaffDialog
          email={deletingEmail}
          onCancel={() => setDeletingEmail(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
};
export default AdminLogins;
