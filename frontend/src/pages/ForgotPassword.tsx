import { useState, type FormEvent } from 'react';
import { Mail } from 'lucide-react';
import { AuthContainer } from '../components/authentication/AuthContainer';
import { AuthField } from '../components/authentication/AuthField';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Password reset request logic
  };

  return (
    <AuthContainer
      title="Forgot Password?"
      subtitle="Enter your email and we'll send you a reset link"
      footerText="Remember your password?"
      footerLinkText="Log In"
      footerLinkTo="/login"
    >
      <form className="authForm" onSubmit={handleSubmit}>
        <AuthField
          id="forgot-email"
          type="email"
          label="Email Address"
          icon={Mail}
          placeholder="john.doe@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" className="authSubmitBtn">
          SEND RESET LINK
        </button>
      </form>
    </AuthContainer>
  );
};
