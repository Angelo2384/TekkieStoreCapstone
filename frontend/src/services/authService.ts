import api from './api';

export interface AuthResponse {
  customerId: string;
  email: string;
  name: string;
  token: string;
  role?: 'CUSTOMER' | 'ADMIN';
}

export interface RegisterPayload {
  email: string;
  password?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  mobileNumber?: string;
  role?: 'CUSTOMER' | 'ADMIN';
  code?: string;
}

export const authService = {
  // Emails a 6-digit code that /auth/register needs before it creates the account
  sendCode: async (email: string): Promise<void> => {
    await api.post('/auth/send-code', { email });
  },

  // Forgot password: email a code, check it, then set the new password (the code is checked again there)
  sendResetCode: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password/send-code', { email });
  },

  verifyResetCode: async (email: string, code: string): Promise<void> => {
    await api.post('/auth/forgot-password/verify-code', { email, code });
  },

  resetPassword: async (email: string, code: string, password: string): Promise<void> => {
    await api.post('/auth/forgot-password/reset', { email, code, password });
  },

  login: async (email: string, password?: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const formattedPayload = {
      ...payload,
      mobileNumber: payload.mobileNumber || payload.phone || '',
    };
    const response = await api.post<AuthResponse>('/auth/register', formattedPayload);
    return response.data;
  },
};

export default authService;
