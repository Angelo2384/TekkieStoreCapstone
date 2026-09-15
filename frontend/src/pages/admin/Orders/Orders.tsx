import React, { useState, useEffect } from 'react';
import { formatPrice } from '../../../utils/formatters';
import { Search } from 'lucide-react';
import api from '../../../services/api';

interface OrderItemRow {
  orderId: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
}

const DEFAULT_ORDERS: OrderItemRow[] = [
  {
    orderId: 'ORD-9412',
    customerName: 'Ethan Williams',
    customerEmail: 'ethan.w@example.com',
    orderDate: '2026-09-15',
    totalAmount: 2899,
    paymentMethod: 'Credit Card',
    status: 'Processing',
  },
  {
    orderId: 'ORD-9411',
    customerName: 'Solly Hendricks',
    customerEmail: 'solly.h@example.com',
    orderDate: '2026-09-15',
    totalAmount: 3499,
    paymentMethod: 'Credit Card',
    status: 'Dispatched',
  },
  {
    orderId: 'ORD-9410',
    customerName: 'Redah Gamieldien',
    customerEmail: 'redah.g@example.com',
    orderDate: '2026-09-14',
    totalAmount: 1999,
    paymentMethod: 'Debit Card',
    status: 'Delivered',
  },
  {
    orderId: 'ORD-9409',
    customerName: 'Angelo Jacobs',
    customerEmail: 'angelo.j@example.com',
    orderDate: '2026-09-13',
    totalAmount: 2599,
    paymentMethod: 'EFT',
    status: 'Delivered',
  },
  {
    orderId: 'ORD-9408',
    customerName: 'Rameez Karriem',
    customerEmail: 'rameez.k@example.com',
    orderDate: '2026-09-12',
    totalAmount: 4199,
    paymentMethod: 'Credit Card',
    status: 'Cancelled',
  },
];

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderItemRow[]>(DEFAULT_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/order/getAll');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: OrderItemRow[] = res.data.map((o: any) => {
            let custName = 'Customer';
            if (o.customer?.name) {
              custName = `${o.customer.name.firstName || ''} ${o.customer.name.lastName || ''}`.trim() || 'Customer';
            }
            return {
              orderId: o.orderId || 'ORD',
              customerName: custName,
              customerEmail: o.customer?.email || 'N/A',
              orderDate: typeof o.orderDate === 'string' ? o.orderDate.split('T')[0] : '2026-09-15',
              totalAmount: o.totalAmount || 0,
              paymentMethod: o.paymentMethod || 'Card',
              status: o.status || 'Processing',
            };
          });
          setOrders(mapped);
        }
      } catch (e) {
        console.warn('Using default orders fallback:', e);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'status-badge-processing';
      case 'dispatched':
      case 'shipped':
        return 'status-badge-dispatched';
      case 'delivered':
        return 'status-badge-delivered';
      case 'cancelled':
        return 'status-badge-cancelled';
      default:
        return 'status-badge-processing';
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders Management</h1>
          <p className="admin-page-subtitle">Track, filter and fulfill customer sneaker orders</p>
        </div>
      </div>

      <div className="admin-toolbar-card">
        <div className="admin-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Order ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="admin-filter-group">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Processing">Processing</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((ord) => (
                <tr key={ord.orderId}>
                  <td className="font-semibold text-obsidian">#{ord.orderId}</td>
                  <td>
                    <div className="customer-cell">
                      <span className="customer-name">{ord.customerName}</span>
                      <span className="customer-sub">{ord.customerEmail}</span>
                    </div>
                  </td>
                  <td className="text-muted text-sm">{ord.orderDate}</td>
                  <td className="text-sm">{ord.paymentMethod}</td>
                  <td className="font-semibold text-obsidian">{formatPrice(ord.totalAmount)}</td>
                  <td>
                    <span className={`status-pill ${getStatusClass(ord.status)}`}>
                      {ord.status}
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
export default Orders;
