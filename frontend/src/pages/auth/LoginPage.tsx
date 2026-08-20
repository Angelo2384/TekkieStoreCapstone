import React from 'react';
import { Link } from 'react-router-dom';
import { Input, Button } from '../../components/ui';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p className="login-subtitle">Sign in to your account to continue</p>
        </div>
        
        <form className="login-form">
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="you@example.com"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            }
          />
          
          <div className="password-field">
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              }
            />
            <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
          </div>
          
          <Button type="button" size="lg" variant="primary" className="login-btn">
            LOGIN
          </Button>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account? <Link to="/register" className="signup-link">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
