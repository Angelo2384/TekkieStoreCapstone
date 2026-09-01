import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import { AuthContainer } from '../components/authentication/AuthContainer';
import { AuthField } from '../components/authentication/AuthField';

export const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const fieldMap: Record<string, string> = {
      'signup-name': 'fullName',
      'signup-email': 'email',
      'signup-password': 'password',
      'signup-confirm-password': 'confirmPassword',
    };
    const key = fieldMap[id] || id;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
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
          value={form.fullName}
          onChange={handleChange}
          required
        />

        <AuthField
          id="signup-email"
          type="email"
          label="Email Address"
          icon={Mail}
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />

        <AuthField
          id="signup-password"
          type="password"
          label="Password"
          icon={Lock}
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          required
        />

        <AuthField
          id="signup-confirm-password"
          type="password"
          label="Confirm Password"
          icon={CheckCircle}
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={handleChange}
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
