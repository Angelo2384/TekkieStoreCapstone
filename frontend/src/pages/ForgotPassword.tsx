import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, KeyRound } from 'lucide-react';
import { AuthContainer } from '../components/authentication/AuthContainer';
import { AuthField } from '../components/authentication/AuthField';
import { authService } from '../services/authService';

const RESEND_WAIT_SECONDS = 60;

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resendIn, setResendIn] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const errorMessage = (err: any, fallback: string) => err.response?.data?.message || err.message || fallback;

  const sendCode = async () => {
    await authService.sendResetCode(email);
    setCode('');
    setResendIn(RESEND_WAIT_SECONDS);
  };

  const handleSendCode = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await sendCode();
      setStep('code');
    } catch (err: any) {
      setError(errorMessage(err, 'Could not send the code. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setLoading(true);
    try {
      await sendCode();
    } catch (err: any) {
      setError(errorMessage(err, 'Could not send a new code. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit code from your email');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await authService.verifyResetCode(email, code);
      setStep('password');
    } catch (err: any) {
      setError(errorMessage(err, 'That code could not be verified. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await authService.resetPassword(email, code, password);
      navigate('/login', { state: { message: 'Password updated. Log in with your new password.' } });
    } catch (err: any) {
      setError(errorMessage(err, 'Could not update your password. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const errorBox = error && (
    <div className="authError" role="alert">
      {error}
    </div>
  );

  if (step === 'code') {
    return (
      <AuthContainer
        title="Check Your Email"
        subtitle={`If an account exists for ${email}, we sent it a 6-digit code`}
        footerText="Remember your password?"
        footerLinkText="Log In"
        footerLinkTo="/login"
      >
        <form className="authForm" onSubmit={handleVerifyCode}>
          {errorBox}

          <AuthField
            id="reset-code"
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
            {loading ? 'VERIFYING...' : 'VERIFY CODE'}
          </button>

          <div className="verifyActions">
            <button type="button" className="authTextBtn" onClick={handleResend} disabled={resendIn > 0 || loading}>
              {resendIn > 0 ? `Resend code in ${resendIn}s` : 'Resend code'}
            </button>
            <button
              type="button"
              className="authTextBtn"
              onClick={() => {
                setStep('email');
                setError(null);
              }}
            >
              Change email
            </button>
          </div>
        </form>
      </AuthContainer>
    );
  }

  if (step === 'password') {
    return (
      <AuthContainer
        title="Set New Password"
        subtitle={`Choose a new password for ${email}`}
        footerText="Remember your password?"
        footerLinkText="Log In"
        footerLinkTo="/login"
      >
        <form className="authForm" onSubmit={handleResetPassword}>
          {errorBox}

          <AuthField
            id="reset-password"
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
            id="reset-confirm-password"
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
  }

  return (
    <AuthContainer
      title="Forgot Password?"
      subtitle="Enter your email and we'll send you a code to reset your password"
      footerText="Remember your password?"
      footerLinkText="Log In"
      footerLinkTo="/login"
    >
      <form className="authForm" onSubmit={handleSendCode}>
        {errorBox}

        <AuthField
          id="forgot-email"
          type="email"
          label="Email Address"
          icon={Mail}
          placeholder="john.doe@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          required
        />

        <button type="submit" className="authSubmitBtn" disabled={loading}>
          {loading ? 'SENDING CODE...' : 'SEND CODE'}
        </button>
      </form>
    </AuthContainer>
  );
};
