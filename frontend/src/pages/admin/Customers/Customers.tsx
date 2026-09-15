import React, { useState, useEffect } from 'react';
import { Search, UserCheck } from 'lucide-react';
import api from '../../../services/api';

interface CustomerRow {
  customerId: string;
  fullName: string;
  email: string;
  phone: string;
  totalOrders: number;
  status: string;
}

const DEFAULT_CUSTOMERS: CustomerRow[] = [
  {
    customerId: 'CUST-001',
    fullName: 'Ethan Williams',
    email: 'ethan.w@example.com',
    phone: '+27 82 123 4567',
    totalOrders: 6,
    status: 'Active',
  },
  {
    customerId: 'CUST-002',
    fullName: 'Solly Hendricks',
    email: 'solly.h@example.com',
    phone: '+27 83 234 5678',
    totalOrders: 4,
    status: 'Active',
  },
  {
    customerId: 'CUST-003',
    fullName: 'Redah Gamieldien',
    email: 'redah.g@example.com',
    phone: '+27 84 345 6789',
    totalOrders: 3,
    status: 'Active',
  },
  {
    customerId: 'CUST-004',
    fullName: 'Angelo Jacobs',
    email: 'angelo.j@example.com',
    phone: '+27 82 456 7890',
    totalOrders: 2,
    status: 'Active',
  },
  {
    customerId: 'CUST-005',
    fullName: 'Rameez Karriem',
    email: 'rameez.k@example.com',
    phone: '+27 81 567 8901',
    totalOrders: 5,
    status: 'Active',
  },
];

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerRow[]>(DEFAULT_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get('/customer/getAll');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: CustomerRow[] = res.data.map((c: any) => {
            const name = c.name ? `${c.name.firstName || ''} ${c.name.lastName || ''}`.trim() : 'Customer';
            return {
              customerId: c.customerId || 'CUST',
              fullName: name,
              email: c.email || 'N/A',
              phone: c.mobileNumber || '+27 00 000 0000',
              totalOrders: 1,
              status: 'Active',
            };
          });
          setCustomers(mapped);
        }
      } catch (e) {
        console.warn('Using default customers fallback:', e);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    return (
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Registered Customers</h1>
          <p className="admin-page-subtitle">View and manage TekkieStore verified customer profiles</p>
        </div>
      </div>

      <div className="admin-toolbar-card">
        <div className="admin-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by customer name, email or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="dashboard-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Total Orders</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.customerId}>
                  <td className="font-semibold text-obsidian">{c.customerId}</td>
                  <td>
                    <div className="customer-cell">
                      <span className="customer-name">{c.fullName}</span>
                    </div>
                  </td>
                  <td className="text-muted text-sm">{c.email}</td>
                  <td className="text-sm">{c.phone}</td>
                  <td className="font-semibold text-sm">{c.totalOrders} orders</td>
                  <td>
                    <span className="status-pill stock-badge-in">
                      <UserCheck size={12} style={{ display: 'inline', marginRight: 4 }} />
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Customers;
