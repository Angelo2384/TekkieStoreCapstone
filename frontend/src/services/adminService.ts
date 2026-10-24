import api from './api';

export interface AdminAccount {
  email: string;
  createdAt: string | null;
  lastLoginAt: string | null;
  active: boolean;
}

export const adminService = {
  getAdminAccounts: async (): Promise<AdminAccount[]> => {
    const res = await api.get('/admin/accounts');
    return Array.isArray(res.data) ? res.data : [];
  },

  heartbeat: async (): Promise<void> => {
    await api.post('/admin/heartbeat');
  },

  // Token is passed in because logout clears it before the request interceptor runs
  goOffline: async (token: string): Promise<void> => {
    await api.post('/admin/offline', null, { headers: { Authorization: `Bearer ${token}` } });
  },
};
