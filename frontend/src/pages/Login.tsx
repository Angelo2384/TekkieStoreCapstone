import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { AuthContainer } from '../components/authentication/AuthContainer';
import { AuthField } from '../components/authentication/AuthField';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id === 'login-email' ? 'email' : 'password']: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login(form.email, form.password);
    navigate('/catalogue');
  };

  return (
    <AuthContainer
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
      footerText="Don't have an account?"
      footerLinkText="Sign Up"
      footerLinkTo="/signup"
    >
      <form className="authForm" onSubmit={handleSubmit}>
        <AuthField
          id="login-email"
          type="email"
          label="Email Address"
          icon={Mail}
          placeholder="john.doe@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />

        <AuthField
          id="login-password"
          type="password"
          label="Password"
          icon={Lock}
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          required
        />

        <div className="forgotPasswordRow">
          <Link to="/forgot-password" className="forgotPasswordLink">
            Forgot Password?
          </Link>
        </div>

        <button type="submit" className="authSubmitBtn">
          LOGIN
        </button>
      </form>
    </AuthContainer>
  );
};
