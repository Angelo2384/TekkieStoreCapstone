// ADMIN is the main admin; STAFF can use the portal but can't manage admin accounts
export const canUseAdminPortal = (role?: string): boolean => role === 'ADMIN' || role === 'STAFF';
