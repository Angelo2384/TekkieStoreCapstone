import { useState, useEffect } from 'react';
import { ShoeProduct } from '../types/catalogue';
import { fetchAllShoes } from '../services/shoeService';

let cache: ShoeProduct[] | null = null;
let inFlight: Promise<ShoeProduct[]> | null = null;

const loadShoes = (): Promise<ShoeProduct[]> => {
  if (cache) return Promise.resolve(cache);
  if (!inFlight) {
    inFlight = fetchAllShoes().then((data) => {
      cache = data;
      inFlight = null;
      return data;
    });
  }
  return inFlight;
};

// Starts the fetch immediately, without waiting for a component to mount
export const prefetchShoes = (): void => {
  loadShoes();
};

export const useShoes = () => {
  const [shoes, setShoes] = useState<ShoeProduct[]>(cache || []);
  const [loading, setLoading] = useState<boolean>(!cache);
  const [error, setError] = useState<string | null>(null);

  // Internal helper to fetch shoes and update state
  const fetchAndSetShoes = () => {
    setLoading(true);
    return loadShoes()
      .then((data) => {
        setShoes(data);
        setError(null);
        return data;
      })
      .catch(() => {
        setError('Failed to fetch shoes from the database.');
        // Return empty array to keep type consistency
        return [] as ShoeProduct[];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (cache) {
      setShoes(cache);
      setLoading(false);
      return;
    }
    // Load initially
    fetchAndSetShoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh function clears cache and re-fetches shoes
  const refresh = () => {
    cache = null; // clear memoized cache
    return fetchAndSetShoes();
  };

  return { shoes, loading, error, refresh };
};
