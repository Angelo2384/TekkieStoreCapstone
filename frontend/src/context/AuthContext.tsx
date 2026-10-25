import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/profile';
import { authService, AuthResponse, RegisterPayload } from '../services/authService';
import { adminService } from '../services/adminService';

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, password?: string) => Promise<AuthResponse>;
  signup: (data: RegisterPayload) => Promise<AuthResponse>;
  logout: () => void;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
}

const STORAGE_KEY = 'tekkie_store_auth';
const TOKEN_KEY = 'tekkie_token';

export const DEFAULT_USER: UserProfile = {
  firstName: 'Marcus',
  lastName: 'Redelinghuys',
  email: 'marcus.red@example.com',
  phone: '+27 82 555 1234',
  role: 'CUSTOMER',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      const token = sessionStorage.getItem(TOKEN_KEY);
      if (saved && token) {
        const parsed = JSON.parse(saved);
        const user = parsed.user
          ? {
              ...parsed.user,
              role: parsed.user.role || 'CUSTOMER',
            }
          : null;
        return {
          isAuthenticated: Boolean(parsed.isAuthenticated),
          user,
        };
      }
    } catch (error) {
      console.error('Failed to load auth from sessionStorage', error);
    }
    return {
      isAuthenticated: false,
      user: null,
    };
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
    } catch (error) {
      console.error('Failed to persist auth state', error);
    }
  }, [authState]);

  // Checks in every minute so the admin "Admin Logins" page can show who is active right now
  const isAdmin = authState.isAuthenticated && authState.user?.role === 'ADMIN';
  useEffect(() => {
    if (!isAdmin) return;
    const beat = () => adminService.heartbeat().catch(() => {});
    beat();
    const timer = setInterval(beat, 60_000);
    return () => clearInterval(timer);
  }, [isAdmin]);

  const login = async (email: string, password?: string): Promise<AuthResponse> => {
    const response = await authService.login(email, password);
    sessionStorage.setItem(TOKEN_KEY, response.token);

    let first = '';
    let last = '';
    if (response.name) {
      const parts = response.name.trim().split(/\s+/);
      first = parts[0] || '';
      last = parts.slice(1).join(' ') || '';
    }

    const userRole = response.role || 'CUSTOMER';

    const realUser: UserProfile = {
      customerId: response.customerId,
      firstName: first || 'Member',
      lastName: last,
      email: response.email,
      phone: '',
      role: userRole,
    };

    setAuthState({
      isAuthenticated: true,
      user: realUser,
    });

    return response;
  };

  const signup = async (data: RegisterPayload): Promise<AuthResponse> => {
    const response = await authService.register(data);
    sessionStorage.setItem(TOKEN_KEY, response.token);

    let first = data.firstName || '';
    let last = data.lastName || '';

    if (!first && response.name) {
      const parts = response.name.trim().split(/\s+/);
      first = parts[0] || '';
      last = parts.slice(1).join(' ') || '';
    }

    const userRole = response.role || data.role || 'CUSTOMER';

    const realUser: UserProfile = {
      customerId: response.customerId,
      firstName: first || 'Member',
      lastName: last,
      email: response.email,
      phone: data.phone || data.mobileNumber || '',
      role: userRole,
    };

    setAuthState({
      isAuthenticated: true,
      user: realUser,
    });

    return response;
  };

  const logout = () => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (token && isAdmin) adminService.goOffline(token).catch(() => {});
    const currentCustomerId = authState.user?.customerId;
    if (currentCustomerId) {
      localStorage.removeItem(`tekkie_orders_${currentCustomerId}`);
      localStorage.removeItem(`tekkie_active_order_${currentCustomerId}`);
    }
    localStorage.removeItem('tekkie_store_orders');
    localStorage.removeItem('tekkie_store_active_order_id');
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    setAuthState({
      isAuthenticated: false,
      user: null,
    });
  };

  const updateProfile = (updatedData: Partial<UserProfile>) => {
    setAuthState((prev) => {
      if (!prev.user) return prev;
      return {
        ...prev,
        user: {
          ...prev.user,
          ...updatedData,
        },
      };
    });
  };

  const value: AuthContextType = {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    login,
    signup,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
