import api from './api';

export type AdminRole = 'ADMIN' | 'STAFF';

export interface AdminAccount {
  email: string;
  role: AdminRole;
  createdAt: string | null;
  lastLoginAt: string | null;
  active: boolean;
}

// One row on the owner's Activity page
export interface ActivityEntry {
  id: string;
  actor: string;
  description: string;
  createdAt: string;
}

export interface CreateStaffPayload {
  email: string;
  password: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
}

export const adminService = {
  getAdminAccounts: async (): Promise<AdminAccount[]> => {
    const res = await api.get('/admin/accounts');
    return Array.isArray(res.data) ? res.data : [];
  },

  // Accounts created here are always staff
  createStaffAccount: async (payload: CreateStaffPayload): Promise<AdminAccount> => {
    const res = await api.post<AdminAccount>('/admin/register', payload);
    return res.data;
  },

  deleteStaff: async (email: string): Promise<void> => {
    await api.delete('/admin/accounts', { params: { email } });
  },

  getActivity: async (): Promise<ActivityEntry[]> => {
    const res = await api.get('/admin/activity');
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
