import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, ShieldAlert, UserPlus, CheckCircle, ArrowRight } from 'lucide-react';
import { AdminAuthContainer } from '../../components/authentication/AdminAuthContainer';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';

export const AdminSignUp = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successEmail, setSuccessEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitized = name === 'mobileNumber' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setForm((prev) => ({ ...prev, [name]: sanitized }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setError('Unauthorized. Only authenticated administrators can create new admin accounts.');
      return;
    }

    if (form.fullName.trim().split(/\s+/).length < 2) {
      setError('Please provide both first and last name for the new administrator.');
      return;
    }

    const emailTrimmed = form.email.trim().toLowerCase();
    if (!emailTrimmed.endsWith('@tekkies.com')) {
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
      const result = await adminService.createAdminAccount({
        fullName: form.fullName.trim(),
        email: emailTrimmed,
        mobileNumber: form.mobileNumber.trim() || '0000000000',
        password: form.password,
      });

      setSuccessEmail(result.email || emailTrimmed);
      setForm({
        fullName: '',
        email: '',
        mobileNumber: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to create admin account. Please verify the details and try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // 1. NON-ADMIN VIEW (Public / Unauthenticated / Customer Access Blocked)
  if (!isAdmin) {
    return (
      <AdminAuthContainer
        title="Admin Sign Up"
        subtitle="Administrator account creation is restricted to authenticated admins"
        footerText="Already have admin credentials?"
        footerLinkText="Admin Login"
        footerLinkTo="/admin/login"
        secondaryLinkText="Return to Customer Storefront"
        secondaryLinkTo="/"
      >
        <div className="adminAuthAlert adminAuthAlertWarning" role="alert">
          <ShieldAlert size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Access Restricted:</strong> Public sign-up for administrator accounts is disabled. Only an existing authenticated administrator can provision a new admin account.
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <Link
            to="/admin/login"
            state={{ from: location }}
            className="adminSubmitBtn"
            style={{ textDecoration: 'none' }}
          >
            <Lock size={18} />
            SIGN IN AS ADMIN TO CONTINUE
          </Link>

          <Link to="/" className="adminSecondaryBtn">
            Back to Customer Storefront
          </Link>
        </div>
      </AdminAuthContainer>
    );
  }

  // 2. AUTHENTICATED ADMIN VIEW (Able to provision another administrator)
  return (
    <AdminAuthContainer
      title="Create Admin Account"
      subtitle="Provision a new administrator account for the SoleTown management team"
      footerText="Done provisioning administrators?"
      footerLinkText="Go to Dashboard"
      footerLinkTo="/admin"
      secondaryLinkText="View All Admin Accounts"
      secondaryLinkTo="/admin/logins"
    >
      <div className="adminAuthSessionBadge">
        <span>Authorizing Admin:</span>
        <span className="adminAuthSessionEmail">{user?.email}</span>
      </div>

      {successEmail && (
        <div className="adminAuthAlert adminAuthAlertSuccess" role="status" style={{ marginBottom: '1.25rem' }}>
          <CheckCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Admin Created:</strong> Account for <strong>{successEmail}</strong> has been provisioned successfully.
            <div style={{ marginTop: '0.65rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Link to="/admin/logins" className="adminAuthFooterLink" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                View in Admin Logins <ArrowRight size={14} />
              </Link>
              <button
                type="button"
                className="adminAuthSecondaryLink"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                onClick={() => setSuccessEmail(null)}
              >
                &bull; Create another
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="adminAuthAlert adminAuthAlertError" role="alert" style={{ marginBottom: '1.25rem' }}>
          <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{error}</span>
        </div>
      )}

      <form className="adminAuthForm" onSubmit={handleSubmit} noValidate={false}>
        <div className="adminFormGroup">
          <label htmlFor="admin-signup-name" className="adminFormLabel">
            Full Name
            <span className="adminFormHint">First and last name</span>
          </label>
          <div className="adminInputWrapper">
            <User className="adminInputIcon" />
            <input
              id="admin-signup-name"
              name="fullName"
              type="text"
              autoComplete="name"
              className="adminInput"
              placeholder="Sarah Connor"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="adminFormGroup">
          <label htmlFor="admin-signup-email" className="adminFormLabel">
            Admin Email Address
          </label>
          <div className="adminInputWrapper">
            <Mail className="adminInputIcon" />
            <input
              id="admin-signup-email"
              name="email"
              type="email"
              autoComplete="username"
              className="adminInput"
              placeholder="s.connor@tekkies.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="adminFormGroup">
          <label htmlFor="admin-signup-phone" className="adminFormLabel">
            Mobile Number
            <span className="adminFormHint">Optional contact</span>
          </label>
          <div className="adminInputWrapper">
            <Phone className="adminInputIcon" />
            <input
              id="admin-signup-phone"
              name="mobileNumber"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              className="adminInput"
              placeholder="0821234567"
              value={form.mobileNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="adminFormGroup">
          <label htmlFor="admin-signup-password" className="adminFormLabel">
            Temporary Password
            <span className="adminFormHint">Min. 6 characters</span>
          </label>
          <div className="adminInputWrapper">
            <Lock className="adminInputIcon" />
            <input
              id="admin-signup-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className="adminInput hasToggle"
              placeholder="••••••••••••"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
            <button
              type="button"
              className="adminPasswordToggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="adminFormGroup">
          <label htmlFor="admin-signup-confirm" className="adminFormLabel">
            Confirm Password
          </label>
          <div className="adminInputWrapper">
            <Lock className="adminInputIcon" />
            <input
              id="admin-signup-confirm"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className="adminInput hasToggle"
              placeholder="••••••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
            />
            <button
              type="button"
              className="adminPasswordToggle"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showConfirmPassword}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" className="adminSubmitBtn" disabled={loading}>
          <UserPlus size={18} />
          {loading ? 'CREATING ADMIN ACCOUNT...' : 'CREATE ADMIN ACCOUNT'}
        </button>
      </form>
    </AdminAuthContainer>
  );
};

export default AdminSignUp;

