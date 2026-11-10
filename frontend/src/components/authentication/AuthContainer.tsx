import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './AuthContainer.css';

interface AuthContainerProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
}

export const AuthContainer = ({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}: AuthContainerProps) => {
  return (
    <div className="authPageWrapper">
      <Link to="/" className="authBackLink" aria-label="Back to store" title="Back to store">
        <ArrowLeft size={20} />
      </Link>

      <div className="authCard">
        <img className="authLogo" src="/logo.png" alt="Sole Town" />

        <div className="authHeader">
          <h1 className="authTitle">{title}</h1>
          <p className="authSubtitle">{subtitle}</p>
        </div>

        <div className="authContent">
          {children}
        </div>

        <div className="authFooter">
          <span>{footerText}</span>{' '}
          <Link to={footerLinkTo} className="authFooterLink">
            {footerLinkText}
          </Link>
        </div>
      </div>
    </div>
  );
};
