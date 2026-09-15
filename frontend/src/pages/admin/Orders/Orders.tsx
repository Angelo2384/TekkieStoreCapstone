import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  orderService,
  BackendOrder,
  BackendOrderStatus,
} from '../../../services/orderService';
import { OrderQueueStrip, OrderQueueCounts } from '../../../components/admin/orders/OrderQueueStrip';
import { OrderFilters, OrderSortOption } from '../../../components/admin/orders/OrderFilters';
import { OrdersTable } from '../../../components/admin/orders/OrdersTable';
import { OrderPagination } from '../../../components/admin/orders/OrderPagination';
import { OrderDetailsDrawer } from '../../../components/admin/orders/OrderDetailsDrawer';
import { RefreshCw, Download } from 'lucide-react';
import './Orders.css';

export const Orders: React.FC = () => {
  // Primary state
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Filters, search, and sorting state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<OrderSortOption>('date-desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Drawer state
  const [selectedOrder, setSelectedOrder] = useState<BackendOrder | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // 1. Fetch real backend orders using orderService
  const loadOrders = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err: any) {
      console.warn('[Admin Orders] Failed to fetch orders from backend:', err);
      setError(
        'Could not load orders from the backend service. Please check that the Spring Boot server is running on port 8080.'
      );
      // NOTE: We do NOT set mock orders as fallback!
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // 2. Derive dynamic status queue counts from real orders
  const queueCounts: OrderQueueCounts = useMemo(() => {
    const counts: OrderQueueCounts = {
      all: orders.length,
      PENDING: 0,
      PAID: 0,
      PACKED: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };

    orders.forEach((o) => {
      const st = (o.status || '').toUpperCase() as BackendOrderStatus;
      if (counts[st] !== undefined) {
        counts[st]++;
      }
    });

    return counts;
  }, [orders]);

  // 3. Extract unique payment methods available in fetched data
  const paymentMethods = useMemo(() => {
    const methods = new Set<string>();
    orders.forEach((o) => {
      if (o.paymentMethod) {
        methods.add(o.paymentMethod.toLowerCase());
      }
    });
    return Array.from(methods);
  }, [orders]);

  // 4. Filtering and searching logic
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // Status filter
      if (selectedStatus !== 'ALL') {
        const ordStatus = (ord.status || '').toUpperCase();
        if (ordStatus !== selectedStatus.toUpperCase()) return false;
      }

      // Payment method filter
      if (paymentFilter !== 'ALL') {
        const ordPayment = (ord.paymentMethod || '').toLowerCase();
        if (ordPayment !== paymentFilter.toLowerCase()) return false;
      }

      // Search keyword filter
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase().trim();
        const orderIdMatch = ord.orderId?.toLowerCase().includes(term);
        const refMatch = ord.paymentReference?.toLowerCase().includes(term);

        const firstName = ord.customer?.name?.firstName?.toLowerCase() || '';
        const lastName = ord.customer?.name?.lastName?.toLowerCase() || '';
        const email = ord.customer?.email?.toLowerCase() || '';

        const nameMatch =
          firstName.includes(term) ||
          lastName.includes(term) ||
          `${firstName} ${lastName}`.includes(term);
        const emailMatch = email.includes(term);

        if (!orderIdMatch && !refMatch && !nameMatch && !emailMatch) {
          return false;
        }
      }

      return true;
    });
  }, [orders, selectedStatus, paymentFilter, searchTerm]);

  // 5. Sorting logic
  const sortedOrders = useMemo(() => {
    const list = [...filteredOrders];

    list.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
      }
      if (sortBy === 'amount-desc') {
        return (b.totalAmount || 0) - (a.totalAmount || 0);
      }
      if (sortBy === 'amount-asc') {
        return (a.totalAmount || 0) - (b.totalAmount || 0);
      }
      return 0;
    });

    return list;
  }, [filteredOrders, sortBy]);

  // Handler to update search text and reset pagination
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  // Handler to update status and reset pagination
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  // Handler to update payment method and reset pagination
  const handlePaymentChange = (payment: string) => {
    setPaymentFilter(payment);
    setCurrentPage(1);
  };

  // Handler to update sort order and reset pagination
  const handleSortChange = (newSort: OrderSortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  // 7. Pagination slice computation
  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / pageSize));
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedOrders.slice(startIndex, startIndex + pageSize);
  }, [sortedOrders, currentPage, pageSize]);

  // Check if any non-default filter is currently applied
  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedStatus !== 'ALL' ||
    paymentFilter !== 'ALL' ||
    sortBy !== 'date-desc';

  // Clear all filters handler
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('ALL');
    setPaymentFilter('ALL');
    setSortBy('date-desc');
    setCurrentPage(1);
  };

  // Open order drawer handler
  const handleSelectOrder = (order: BackendOrder) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  // Close order drawer handler
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  // 8. Order status update handler (safely preserves entire order entity)
  const handleUpdateStatus = async (
    orderToUpdate: BackendOrder,
    newStatus: BackendOrderStatus
  ): Promise<boolean> => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(orderToUpdate, newStatus);

      // Immediately update local orders list
      setOrders((prev) =>
        prev.map((ord) => (ord.orderId === updatedOrder.orderId ? updatedOrder : ord))
      );

      // Update active order inside the drawer
      setSelectedOrder(updatedOrder);
      return true;
    } catch (err) {
      console.error('[Admin Orders] Status update failed:', err);
      return false;
    }
  };

  // 9. Client-side CSV export of filtered orders
  const handleExportCSV = () => {
    if (sortedOrders.length === 0) return;

    const escapeCsv = (val: any): string => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = [
      'Order ID',
      'Customer First Name',
      'Customer Last Name',
      'Customer Email',
      'Customer Phone',
      'Order Date',
      'Items Count',
      'Payment Method',
      'Payment Reference',
      'Subtotal (ZAR)',
      'Shipping Fee (ZAR)',
      'Total Amount (ZAR)',
      'Status',
    ];

    const rows = sortedOrders.map((ord) => {
      const totalItemsQty = (ord.orderItems || []).reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
      );

      const d = new Date(ord.orderDate);
      const dateStr = !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : String(ord.orderDate);

      return [
        ord.orderId,
        ord.customer?.name?.firstName || '',
        ord.customer?.name?.lastName || '',
        ord.customer?.email || '',
        ord.customer?.mobileNumber || '',
        dateStr,
        totalItemsQty,
        ord.paymentMethod || 'Card',
        ord.paymentReference || '',
        (ord.subtotal || 0).toFixed(2),
        (ord.shippingFee || 0).toFixed(2),
        (ord.totalAmount || 0).toFixed(2),
        ord.status || 'PENDING',
      ].map(escapeCsv);
    });

    const csvContent = [headers.map(escapeCsv).join(','), ...rows.map((r) => r.join(','))].join(
      '\r\n'
    );

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const today = new Date().toISOString().split('T')[0];

    link.setAttribute('href', url);
    link.setAttribute('download', `tekkiestore-orders-${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-orders-page">
      {/* 1. TOP HEADER & OPERATIONAL ACTIONS */}
      <header className="orders-page-header">
        <div className="orders-title-wrap">
          <h1 className="orders-page-title">Orders Management</h1>
          <p className="orders-page-subtitle">
            Manage customer sneaker orders, fulfilment lifecycle and courier delivery.
          </p>
        </div>

        <div className="orders-header-actions">
          <button
            type="button"
            className="header-action-btn secondary"
            onClick={() => loadOrders(true)}
            disabled={isRefreshing}
            title="Refetch all orders from Spring Boot database"
          >
            <RefreshCw size={15} className={isRefreshing ? 'spin-icon' : ''} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Orders'}</span>
          </button>

          <button
            type="button"
            className="header-action-btn secondary"
            onClick={handleExportCSV}
            disabled={sortedOrders.length === 0}
            title="Download CSV export of currently filtered orders"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </header>

      {/* 2. ORDER QUEUE NAVIGATION STRIP */}
      <OrderQueueStrip
        selectedStatus={selectedStatus}
        onSelectStatus={handleStatusChange}
        counts={queueCounts}
      />

      {/* 3. SEARCH & MULTI-CRITERIA FILTERS TOOLBAR */}
      <OrderFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        statusFilter={selectedStatus}
        onStatusFilterChange={handleStatusChange}
        paymentFilter={paymentFilter}
        onPaymentFilterChange={handlePaymentChange}
        sortBy={sortBy}
        onSortByChange={handleSortChange}
        paymentMethods={paymentMethods}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
        totalFiltered={sortedOrders.length}
      />

      {/* 4. MAIN ORDERS TABLE CARD */}
      <div className="orders-table-card">
        <OrdersTable
          orders={paginatedOrders}
          loading={loading}
          error={error}
          onRetry={() => loadOrders(false)}
          onSelectOrder={handleSelectOrder}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />

        {/* 5. COMPACT CLIENT-SIDE PAGINATION */}
        {!loading && !error && sortedOrders.length > 0 && (
          <OrderPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={sortedOrders.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        )}
      </div>

      {/* 6. RIGHT-SIDE SLIDE-OVER ORDER DETAILS DRAWER */}
      <OrderDetailsDrawer
        order={selectedOrder}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default Orders;
