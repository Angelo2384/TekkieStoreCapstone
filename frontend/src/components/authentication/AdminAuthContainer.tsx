import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import './AdminAuthContainer.css';

interface AdminAuthContainerProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText?: string;
  footerLinkText?: string;
  footerLinkTo?: string;
  secondaryLinkText?: string;
  secondaryLinkTo?: string;
}

export const AdminAuthContainer = ({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
  secondaryLinkText,
  secondaryLinkTo,
}: AdminAuthContainerProps) => {
  return (
    <div className="adminAuthWrapper">
      <div className="adminAuthTopBar">
        <Link to="/" className="adminAuthBackLink" aria-label="Back to store" title="Back to store">
          <ArrowLeft size={20} />
        </Link>
        <span className="adminAuthEnvironmentBadge">
          <span className="adminAuthPulseDot" />
          SECURE ENVIRONMENT
        </span>
      </div>

      <div className="adminAuthCard">
        <div className="adminSecurityBanner">
          <ShieldCheck size={16} className="adminSecurityIcon" />
          <span>ADMINISTRATOR ACCESS &bull; AUTHORIZED PERSONNEL ONLY</span>
        </div>

        <div className="adminAuthHeader">
          <div className="adminAuthBrand">
            <img className="adminAuthLogo" src="/logo.png" alt="Sole Town Logo" />
            <div className="adminAuthBrandText">
              <span className="adminAuthBrandTitle">SoleTown</span>
              <span className="adminAuthBrandTag">MANAGEMENT SYSTEM</span>
            </div>
          </div>
          <h1 className="adminAuthTitle">{title}</h1>
          <p className="adminAuthSubtitle">{subtitle}</p>
        </div>

        <div className="adminAuthContent">
          {children}
        </div>

        {(footerLinkTo || secondaryLinkTo) && (
          <div className="adminAuthFooter">
            {footerText && footerLinkText && footerLinkTo && (
              <div className="adminAuthFooterRow">
                <span>{footerText}</span>{' '}
                <Link to={footerLinkTo} className="adminAuthFooterLink">
                  {footerLinkText}
                </Link>
              </div>
            )}
            {secondaryLinkText && secondaryLinkTo && (
              <div className="adminAuthSecondaryRow">
                <Link to={secondaryLinkTo} className="adminAuthSecondaryLink">
                  {secondaryLinkText}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="adminAuthNotice">
        All administrator access and activity is logged and monitored. Unauthorized access attempts will be recorded and investigated.
      </p>
    </div>
  );
};

