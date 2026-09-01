import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import { AuthContainer } from '../components/authentication/AuthContainer';
import { AuthField } from '../components/authentication/AuthField';

export const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Registration logic
    navigate('/catalogue');
  };

  return (
    <AuthContainer
      title="Create Account"
      subtitle="Join Sole Town and start shopping today"
      footerText="Already have an account?"
      footerLinkText="Log In"
      footerLinkTo="/login"
    >
      <form className="authForm" onSubmit={handleSubmit}>
        <AuthField
          id="signup-name"
          type="text"
          label="Full Name"
          icon={User}
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <AuthField
          id="signup-email"
          type="email"
          label="Email Address"
          icon={Mail}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <AuthField
          id="signup-password"
          type="password"
          label="Password"
          icon={Lock}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <AuthField
          id="signup-confirm-password"
          type="password"
          label="Confirm Password"
          icon={CheckCircle}
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" className="authSubmitBtn">
          <span>SIGN UP</span>
          <ArrowRight size={18} strokeWidth={2.25} />
        </button>
      </form>
    </AuthContainer>
  );
};
