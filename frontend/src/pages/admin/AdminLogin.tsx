import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { AdminAuthContainer } from '../../components/authentication/AdminAuthContainer';
import { useAuth } from '../../context/AuthContext';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login(form.email, form.password);
      if (response?.role === 'ADMIN') {
        const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      } else {
        logout();
        setError('Access denied. This portal is strictly restricted to authorized store administrators.');
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || 'Authentication failed. Please verify your admin credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuthContainer
      title="Admin Portal Login"
      subtitle="Sign in with your @tekkies.com administrator credentials"
      footerText="Need to provision an administrator?"
      footerLinkText="Admin Sign Up"
      footerLinkTo="/admin/signup"
      secondaryLinkText="Go to Customer Login"
      secondaryLinkTo="/login"
    >
      <form className="adminAuthForm" onSubmit={handleSubmit} noValidate={false}>
        {error && (
          <div className="adminAuthAlert adminAuthAlertError" role="alert">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        <div className="adminFormGroup">
          <label htmlFor="admin-login-email" className="adminFormLabel">
            Admin Email Address
          </label>
          <div className="adminInputWrapper">
            <Mail className="adminInputIcon" />
            <input
              id="admin-login-email"
              name="email"
              type="email"
              autoComplete="username"
              className="adminInput"
              placeholder="admin@tekkies.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="adminFormGroup">
          <label htmlFor="admin-login-password" className="adminFormLabel">
            Password
          </label>
          <div className="adminInputWrapper">
            <Lock className="adminInputIcon" />
            <input
              id="admin-login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className="adminInput hasToggle"
              placeholder="••••••••••••"
              value={form.password}
              onChange={handleChange}
              required
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

        <button type="submit" className="adminSubmitBtn" disabled={loading}>
          <ShieldCheck size={18} />
          {loading ? 'AUTHENTICATING...' : 'ADMIN SIGN IN'}
        </button>
      </form>
    </AdminAuthContainer>
  );
};

export default AdminLogin;

