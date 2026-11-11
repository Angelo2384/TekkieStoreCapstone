import React, { useEffect, useMemo, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import { AlertCircle, RefreshCw, Search, X } from 'lucide-react';
import { adminService, type ActivityEntry } from '../../../services/adminService';
import './Activity.css';

type ActivityType = 'all' | 'price' | 'shoes' | 'stock' | 'orders' | 'staff';

const TYPE_OPTIONS: { value: ActivityType; label: string }[] = [
  { value: 'all', label: 'All changes' },
  { value: 'price', label: 'Price and sale changes' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'stock', label: 'Stock' },
  { value: 'orders', label: 'Orders' },
  { value: 'staff', label: 'Staff accounts' },
];

// Works out the kind of change from how the server words each entry
const matchesType = (description: string, type: ActivityType): boolean => {
  const isShoe = /^(Added|Edited|Deleted) shoe /.test(description);
  switch (type) {
    case 'price':
      return isShoe && (description.includes('price R') || description.includes('sale '));
    case 'shoes':
      return isShoe;
    case 'stock':
      return !isShoe && /^(Stock for|Added|Removed) /.test(description);
    case 'orders':
      return description.startsWith('Order ');
    case 'staff':
      return description.includes('staff account');
    default:
      return true;
  }
};

// Local calendar day as YYYY-MM-DD, the same format a date input gives
const toDay = (value: string): string => {
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

const formatWhen = (value: string): string => {
  const d = new Date(value);
  if (isNaN(d.getTime())) return 'Unknown';
  return d.toLocaleString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const Activity: React.FC = () => {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // Bumped by the Refresh button to load the log again
  const [reloadKey, setReloadKey] = useState(0);

  const [search, setSearch] = useState('');
  const [person, setPerson] = useState('All');
  const [type, setType] = useState<ActivityType>('all');
  const [fromDay, setFromDay] = useState('');
  const [toDayValue, setToDayValue] = useState('');

  useEffect(() => {
    let cancelled = false;

    adminService
      .getActivity()
      .then((data) => {
        if (cancelled) return;
        setEntries(data);
        setError(false);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const people = useMemo(() => Array.from(new Set(entries.map((e) => e.actor))).sort(), [entries]);

  const shown = useMemo(() => {
    const term = search.trim().toLowerCase();
    return entries.filter((entry) => {
      if (person !== 'All' && entry.actor !== person) return false;
      if (!matchesType(entry.description, type)) return false;
      const day = toDay(entry.createdAt);
      if (fromDay && day < fromDay) return false;
      if (toDayValue && day > toDayValue) return false;
      return !term || entry.description.toLowerCase().includes(term) || entry.actor.toLowerCase().includes(term);
    });
  }, [entries, search, person, type, fromDay, toDayValue]);

  const hasFilters = search.trim() !== '' || person !== 'All' || type !== 'all' || fromDay !== '' || toDayValue !== '';

  const clearFilters = () => {
    setSearch('');
    setPerson('All');
    setType('all');
    setFromDay('');
    setToDayValue('');
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Activity</h1>
          <p className="admin-page-subtitle">Every change made in the admin portal: who made it, what changed and when.</p>
        </div>

        <button type="button" className="admin-btn-secondary" onClick={() => setReloadKey((key) => key + 1)}>
          <RefreshCw size={15} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="activity-toolbar">
        <div className="activity-search">
          <Search size={16} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search by shoe, order number or person..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search the activity log"
          />
        </div>

        <div className="activity-filters">
          <select className="activity-filter" value={person} onChange={(e) => setPerson(e.target.value)} aria-label="Filter by person">
            <option value="All">Everyone</option>
            {people.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            className="activity-filter"
            value={type}
            onChange={(e) => setType(e.target.value as ActivityType)}
            aria-label="Filter by type of change"
          >
            {TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <label className="activity-date">
            <span>From</span>
            <input
              type="date"
              className="activity-filter"
              value={fromDay}
              max={toDayValue || undefined}
              onChange={(e) => setFromDay(e.target.value)}
            />
          </label>

          <label className="activity-date">
            <span>To</span>
            <input
              type="date"
              className="activity-filter"
              value={toDayValue}
              min={fromDay || undefined}
              onChange={(e) => setToDayValue(e.target.value)}
            />
          </label>

          {hasFilters && (
            <button type="button" className="activity-clear" onClick={clearFilters}>
              <X size={14} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      <div className="activity-table-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Who</th>
                <th>What</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td>
                      <Skeleton variant="text" width={130} animation="wave" />
                    </td>
                    <td>
                      <Skeleton variant="text" width={160} animation="wave" />
                    </td>
                    <td>
                      <Skeleton variant="text" width={320} animation="wave" />
                    </td>
                  </tr>
                ))
              ) : error && entries.length === 0 ? (
                <tr>
                  <td colSpan={3} className="activity-empty activity-empty-error">
                    <AlertCircle size={16} />
                    <span>Unable to load the activity log from the server.</span>
                  </td>
                </tr>
              ) : shown.length === 0 ? (
                <tr>
                  <td colSpan={3} className="activity-empty">
                    {entries.length === 0 ? 'No activity recorded yet.' : 'No activity matches these filters.'}
                  </td>
                </tr>
              ) : (
                shown.map((entry) => (
                  <tr key={entry.id}>
                    <td className="activity-when">{formatWhen(entry.createdAt)}</td>
                    <td className="activity-who">{entry.actor}</td>
                    <td>{entry.description}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && entries.length > 0 && (
          <div className="activity-count">
            Showing {shown.length} of {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;
