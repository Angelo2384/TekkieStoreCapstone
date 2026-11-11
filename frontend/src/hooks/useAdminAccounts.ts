import { useState, useEffect } from 'react';
import { adminService, type AdminAccount } from '../services/adminService';

// Reloads every 30 seconds so the Active column stays current
const REFRESH_MS = 30_000;

export const useAdminAccounts = () => {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  // Bumped to reload straight away, e.g. after a new account is created
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = () =>
      adminService
        .getAdminAccounts()
        .then((data) => {
          if (cancelled) return;
          setAdmins(data);
          setError(false);
        })
        .catch(() => {
          if (!cancelled) setError(true);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });

    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [reloadKey]);

  const refresh = () => setReloadKey((key) => key + 1);

  return { admins, loading, error, refresh };
};
