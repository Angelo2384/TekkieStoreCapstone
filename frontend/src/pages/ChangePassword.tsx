import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { AuthContainer } from '../components/authentication/AuthContainer';
import { AuthField } from '../components/authentication/AuthField';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { canUseAdminPortal } from '../utils/roles';

// Shown on first login to accounts an admin created with a temporary password
export const ChangePassword = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, updateProfile } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await authService.changePassword(password);
      updateProfile({ mustChangePassword: false });
      navigate(canUseAdminPortal(user?.role) ? '/admin' : '/catalogue', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Could not update your password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer
      title="Set Your Password"
      subtitle="Choose your own password to replace the temporary one"
      footerText="Wrong account?"
      footerLinkText="Back to Log In"
      footerLinkTo="/login"
    >
      <form className="authForm" onSubmit={handleSubmit}>
        {error && (
          <div className="authError" role="alert">
            {error}
          </div>
        )}

        <AuthField
          id="change-password"
          type="password"
          label="New Password"
          icon={Lock}
          placeholder="••••••••"
          autoComplete="new-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError(null);
          }}
          required
        />

        <AuthField
          id="change-confirm-password"
          type="password"
          label="Confirm Password"
          icon={Lock}
          placeholder="••••••••"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (error) setError(null);
          }}
          required
        />

        <button type="submit" className="authSubmitBtn" disabled={loading}>
          {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
        </button>
      </form>
    </AuthContainer>
  );
};
