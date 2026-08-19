import React from 'react';
import './Stat.css';

interface StatProps {
  value: string | number;
  label: string;
  className?: string;
}

export const Stat: React.FC<StatProps> = ({ value, label, className = '' }) => {
  return (
    <div className={`stat ${className}`}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

interface StatsGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const StatsGroup: React.FC<StatsGroupProps> = ({ children, className = '' }) => {
  return (
    <div className={`stats-group ${className}`}>
      {children}
    </div>
  );
};
