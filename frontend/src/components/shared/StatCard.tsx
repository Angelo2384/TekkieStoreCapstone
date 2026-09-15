import React from 'react';
// No longer need LucideIcon import from lucide-react

interface StatCardProps {
  /**
   * Icon component from lucide-react. Using a generic SVG component type ensures it accepts
   * standard SVG props such as `size` and `className` without requiring the `iconNode`
   * prop that the wrapper `Icon` component expects.
   */
  icon: React.ComponentType<any>;
  label: string;
  value: string;
  trend?: string;
  trendPositive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, trend, trendPositive }) => {
  return (
    <div className="kpi-card stat-card glass">
      <div className="kpi-card-header">
        <span className="kpi-label">{label}</span>
        <div className="kpi-icon-wrapper">
          <Icon size={18} className="kpi-icon" />
        </div>
      </div>
      <div className="kpi-value-row">
        <span className="kpi-main-number">{value}</span>
      </div>
      {trend && (
        <div className="kpi-footer">
          <span className={`kpi-trend ${trendPositive ? 'positive' : ''}`}>{trend}</span>
        </div>
      )}
    </div>
  );
};
