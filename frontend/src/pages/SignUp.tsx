import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, KeyRound } from 'lucide-react';
import { AuthContainer } from '../components/authentication/AuthContainer';
import { AuthField } from '../components/authentication/AuthField';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const RESEND_WAIT_SECONDS = 60;

export const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [step, setStep] = useState<'details' | 'verify'>('details');
  const [code, setCode] = useState('');
  const [resendIn, setResendIn] = useState(0);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const errorMessage = (err: any, fallback: string) => err.response?.data?.message || err.message || fallback;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const fieldMap: Record<string, string> = {
      'signup-name': 'fullName',
      'signup-email': 'email',
      'signup-phone': 'phone',
      'signup-password': 'password',
      'signup-confirm-password': 'confirmPassword',
    };
    const key = fieldMap[id] || id;
    const sanitizedValue = key === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setForm((prev) => ({ ...prev, [key]: sanitizedValue }));
    if (error) setError(null);
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow control and navigation keys
    if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'Tab' ||
      e.key === 'Escape' ||
      e.key === 'Enter' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      e.key === 'Home' ||
      e.key === 'End' ||
      ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase()))
    ) {
      return;
    }

    // Block non-numeric characters
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      // The account is only created after the emailed code is entered
      await authService.sendCode(form.email);
      setCode('');
      setResendIn(RESEND_WAIT_SECONDS);
      setStep('verify');
    } catch (err: any) {
      setError(errorMessage(err, 'Could not send the verification code. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit code from your email');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      // Public signup only creates customers; the admin account is created by the backend on startup
      await signup({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: 'CUSTOMER',
        code,
      });
      navigate('/catalogue');
    } catch (err: any) {
      setError(errorMessage(err, 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setLoading(true);
    try {
      await authService.sendCode(form.email);
      setCode('');
      setResendIn(RESEND_WAIT_SECONDS);
    } catch (err: any) {
      setError(errorMessage(err, 'Could not send a new code. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <AuthContainer
        title="Check Your Email"
        subtitle={`We sent a 6-digit code to ${form.email}`}
        footerText="Already have an account?"
        footerLinkText="Log In"
        footerLinkTo="/login"
      >
        <form className="authForm" onSubmit={handleVerify}>
          {error && (
            <div className="authError" role="alert">
              {error}
            </div>
          )}

          <AuthField
            id="signup-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            label="Verification Code"
            icon={KeyRound}
            placeholder="Enter OTP"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
              if (error) setError(null);
            }}
            required
          />

          <button type="submit" className="authSubmitBtn" disabled={loading}>
            {loading ? 'VERIFYING...' : 'VERIFY & SIGN UP'}
          </button>

          <div className="verifyActions">
            <button type="button" className="authTextBtn" onClick={handleResend} disabled={resendIn > 0 || loading}>
              {resendIn > 0 ? `Resend code in ${resendIn}s` : 'Resend code'}
            </button>
            <button
              type="button"
              className="authTextBtn"
              onClick={() => {
                setStep('details');
                setError(null);
              }}
            >
              Change details
            </button>
          </div>
        </form>
      </AuthContainer>
    );
  }

  return (
    <AuthContainer
      title="Create Account"
      subtitle="Join Sole Town and start shopping today"
      footerText="Already have an account?"
      footerLinkText="Log In"
      footerLinkTo="/login"
    >
      <form className="authForm" onSubmit={handleSubmit}>
        {error && (
          <div className="authError" role="alert">
            {error}
          </div>
        )}

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
          id="signup-phone"
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={10}
          label="Mobile Number"
          icon={Phone}
          placeholder="0825551234"
          value={form.phone}
          onChange={handleChange}
          onKeyDown={handlePhoneKeyDown}
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
          icon={Lock}
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className="authSubmitBtn" disabled={loading}>
          {loading ? 'SENDING CODE...' : 'SIGN UP'}
        </button>
      </form>
    </AuthContainer>
  );
};
