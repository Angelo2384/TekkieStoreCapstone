import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { AuthContainer } from '../components/authentication/AuthContainer';
import { AuthField } from '../components/authentication/AuthField';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Auth submission logic
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <AuthField
          id="login-password"
          type="password"
          label="Password"
          icon={Lock}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
