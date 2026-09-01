import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Edit2, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserProfile } from '../../types/profile';

export const PersonalInfoCard: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const [formData, setFormData] = useState<UserProfile>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Sync state if user changes externally
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user]);

  // Handle auto-dismiss for notification toast
  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    setShowSuccessToast(true);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="profile-card personal-info-card">
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="profile-toast" role="status" aria-live="polite">
          <div className="toast-content">
            <CheckCircle2 size={18} className="toast-icon" />
            <span>Profile details updated successfully!</span>
          </div>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => setShowSuccessToast(false)}
            aria-label="Close notification"
          >
            <X size={15} />
          </button>
        </div>
      )}

      <div className="profile-card-header">
        <div>
          <h2 className="profile-card-title">Personal Information</h2>
          <p className="profile-card-subtitle">
            Manage your personal contact details and identification info.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            className="btn-edit-toggle"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 size={15} />
            <span>Edit Info</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <form className="profile-form" onSubmit={handleSave}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="form-input"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="form-input"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <div className="input-wrapper">
                <Phone size={18} className="input-icon" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+27 82 123 4567"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="info-display-grid">
          <div className="info-field">
            <span className="info-label">First Name</span>
            <span className="info-value">{user?.firstName || '—'}</span>
          </div>

          <div className="info-field">
            <span className="info-label">Last Name</span>
            <span className="info-value">{user?.lastName || '—'}</span>
          </div>

          <div className="info-field">
            <span className="info-label">Email Address</span>
            <span className="info-value">{user?.email || '—'}</span>
          </div>

          <div className="info-field">
            <span className="info-label">Phone Number</span>
            <span className="info-value">{user?.phone || '—'}</span>
          </div>
        </div>
      )}
    </div>
  );
};
