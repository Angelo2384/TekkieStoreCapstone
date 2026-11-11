import React, { useState, type FormEvent, type ChangeEvent } from 'react';
import { X, AlertCircle, UserPlus } from 'lucide-react';
import { adminService, type AdminRole } from '../../../services/adminService';
import '../../../components/admin/products/AddShoeModal.css';

interface CreateAdminModalProps {
  onClose: () => void;
  onCreated: (email: string) => void;
}

export const CreateAdminModal: React.FC<CreateAdminModalProps> = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    role: 'STAFF' as AdminRole,
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const sanitized = name === 'mobileNumber' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setForm((prev) => ({ ...prev, [name]: sanitized }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (form.fullName.trim().split(/\s+/).length < 2) {
      setError('Please provide both first and last name.');
      return;
    }

    const email = form.email.trim().toLowerCase();
    if (!email.endsWith('@tekkies.com')) {
      setError('Admin accounts must use an official @tekkies.com email address.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const created = await adminService.createAdminAccount({
        fullName: form.fullName.trim(),
        email,
        mobileNumber: form.mobileNumber.trim() || '0000000000',
        role: form.role,
        password: form.password,
      });
      onCreated(created.email || email);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create the account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="admin-modal-overlay"
      onClick={loading ? undefined : onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-admin-modal-title"
    >
      <div className="admin-modal-card add-shoe-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div className="modal-header-text">
            <h2 id="create-admin-modal-title" className="modal-title">
              New Admin
            </h2>
            <p className="modal-subtitle">They choose their own password the first time they log in.</p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} disabled={loading} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="modal-error-alert" role="alert">
            <AlertCircle size={18} className="error-alert-icon" />
            <div className="error-alert-content">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-modal-form">
          <div className="modal-form-scrollable">
            <div className="form-grid-row">
              <div className="form-group">
                <label htmlFor="new-admin-name">Full Name</label>
                <input
                  id="new-admin-name"
                  name="fullName"
                  type="text"
                  placeholder="First and last name"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-admin-email">Email Address</label>
                <input
                  id="new-admin-email"
                  name="email"
                  type="email"
                  placeholder="name@tekkies.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-grid-row">
              <div className="form-group">
                <label htmlFor="new-admin-phone">Mobile Number</label>
                <input
                  id="new-admin-phone"
                  name="mobileNumber"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Optional"
                  value={form.mobileNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-admin-role">Role</label>
                <select id="new-admin-role" name="role" value={form.role} onChange={handleChange}>
                  <option value="STAFF">Staff - products, inventory and orders</option>
                  <option value="ADMIN">Main admin - also manages admin accounts</option>
                </select>
              </div>
            </div>

            <div className="form-grid-row">
              <div className="form-group">
                <label htmlFor="new-admin-password">Temporary Password</label>
                <input
                  id="new-admin-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-admin-confirm">Confirm Password</label>
                <input
                  id="new-admin-confirm"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat the password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="admin-modal-actions">
            <button type="button" className="admin-btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="admin-btn-primary submit-btn" disabled={loading}>
              <UserPlus size={16} />
              <span>{loading ? 'Creating...' : 'Create Admin'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdminModal;
