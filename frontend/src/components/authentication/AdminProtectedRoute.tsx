import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { canUseAdminPortal } from '../../utils/roles';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  // Pages only the owner may open, such as Admin Logins
  ownerOnly?: boolean;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children, ownerOnly = false }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Not logged in -> redirect to /login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!canUseAdminPortal(user?.role)) {
    // Logged in as CUSTOMER -> redirect away from /admin
    return <Navigate to="/" replace />;
  }

  if (user?.mustChangePassword) {
    // Still on the temporary password -> set a new one first
    return <Navigate to="/change-password" replace />;
  }

  if (ownerOnly && user?.role !== 'ADMIN') {
    // Logged in as STAFF -> back to the dashboard
    return <Navigate to="/admin" replace />;
  }

  // Logged in as ADMIN or STAFF -> allow access
  return <>{children}</>;
};
