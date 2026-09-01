import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/profile';

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email?: string, password?: string) => void;
  signup: (data: { fullName?: string; firstName?: string; lastName?: string; email: string; phone?: string }) => void;
  logout: () => void;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
}

const STORAGE_KEY = 'tekkie_store_auth';

export const DEFAULT_USER: UserProfile = {
  firstName: 'Marcus',
  lastName: 'Redelinghuys',
  email: 'marcus.red@example.com',
  phone: '+27 82 555 1234',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          isAuthenticated: Boolean(parsed.isAuthenticated),
          user: parsed.user || null,
        };
      }
    } catch (error) {
      console.error('Failed to load auth from localStorage', error);
    }
    return {
      isAuthenticated: false,
      user: null,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
    } catch (error) {
      console.error('Failed to persist auth state', error);
    }
  }, [authState]);

  const login = (email?: string) => {
    setAuthState((prev) => ({
      isAuthenticated: true,
      user: prev.user || {
        ...DEFAULT_USER,
        email: email || DEFAULT_USER.email,
      },
    }));
  };

  const signup = (data: { fullName?: string; firstName?: string; lastName?: string; email: string; phone?: string }) => {
    let first = data.firstName || '';
    let last = data.lastName || '';

    if (data.fullName && (!first || !last)) {
      const parts = data.fullName.trim().split(' ');
      first = parts[0] || 'Member';
      last = parts.slice(1).join(' ') || '';
    }

    setAuthState({
      isAuthenticated: true,
      user: {
        firstName: first || DEFAULT_USER.firstName,
        lastName: last || DEFAULT_USER.lastName,
        email: data.email || DEFAULT_USER.email,
        phone: data.phone || DEFAULT_USER.phone,
      },
    });
  };

  const logout = () => {
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
