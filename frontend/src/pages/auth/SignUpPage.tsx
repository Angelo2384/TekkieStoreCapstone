import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button } from '../../components/ui';
import { useShop } from '../../context/ShopContext';
import './SignUpPage.css';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, updateProfile } = useShop();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    if (name.trim()) {
      const parts = name.trim().split(' ');
      const firstName = parts[0] || 'User';
      const lastName = parts.slice(1).join(' ') || '';
      updateProfile({ firstName, lastName, email });
    }
    navigate('/profile');
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <h1>Create Account</h1>
          <p className="signup-subtitle">Join TekkieStore and start shopping today</p>
        </div>

        <form className="signup-form" onSubmit={handleSignUp}>
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            }
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            }
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            }
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            required
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            }
          />

          <Button type="submit" size="lg" variant="primary" className="signup-btn">
            SIGN UP →
          </Button>
        </form>

        <div className="signup-footer">
          <p>Already have an account? <Link to="/login" className="login-link">Log In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
