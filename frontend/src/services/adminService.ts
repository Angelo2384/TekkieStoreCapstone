import api from './api';

export type AdminRole = 'ADMIN' | 'STAFF';

export interface AdminAccount {
  email: string;
  role: AdminRole;
  createdAt: string | null;
  lastLoginAt: string | null;
  active: boolean;
}

export interface CreateAdminPayload {
  email: string;
  password: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  role: AdminRole;
}

export const adminService = {
  getAdminAccounts: async (): Promise<AdminAccount[]> => {
    const res = await api.get('/admin/accounts');
    return Array.isArray(res.data) ? res.data : [];
  },

  createAdminAccount: async (payload: CreateAdminPayload): Promise<AdminAccount> => {
    const res = await api.post<AdminAccount>('/admin/register', payload);
    return res.data;
  },

  heartbeat: async (): Promise<void> => {
    await api.post('/admin/heartbeat');
  },

  // Token is passed in because logout clears it before the request interceptor runs
  goOffline: async (token: string): Promise<void> => {
    await api.post('/admin/offline', null, { headers: { Authorization: `Bearer ${token}` } });
  },
};
