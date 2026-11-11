import React from 'react';

export const DashboardHeader: React.FC = () => {
  return (
    <div className="admin-page-header">
      <div>
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">Overview of your store</p>
      </div>
    </div>
  );
};

export default DashboardHeader;
