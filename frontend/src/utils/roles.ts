// ADMIN is the owner; STAFF can use the portal but can't manage staff accounts
export const canUseAdminPortal = (role?: string): boolean => role === 'ADMIN' || role === 'STAFF';
