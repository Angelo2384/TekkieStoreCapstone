import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export type OrderSortOption =
  | 'date-desc'
  | 'date-asc'
  | 'amount-desc'
  | 'amount-asc';

interface OrderFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  paymentFilter: string;
  onPaymentFilterChange: (payment: string) => void;
  sortBy: OrderSortOption;
  onSortByChange: (sortBy: OrderSortOption) => void;
  paymentMethods: string[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  totalFiltered: number;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  paymentFilter,
  onPaymentFilterChange,
  sortBy,
  onSortByChange,
  paymentMethods,
  hasActiveFilters,
  onClearFilters,
  totalFiltered,
}) => {
  return (
    <div className="orders-filter-toolbar">
      <div className="filter-toolbar-left">
        {/* Search Input */}
        <div className="orders-search-box">
          <Search size={16} className="search-icon" aria-hidden="true" />
          <input
            id="orders-search-input"
            type="text"
            placeholder="Search by Order ID, customer, email, payment ref..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search text"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="filter-toolbar-right">
        {/* Status Dropdown Filter */}
        <div className="filter-control-item">
          <label htmlFor="orders-status-select" className="filter-label">
            Status:
          </label>
          <select
            id="orders-status-select"
            className="filter-select"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Order Confirmed (New)</option>
            <option value="PAID">Paid</option>
            <option value="PACKED">Ready to Pack</option>
            <option value="SHIPPED">In Transit (Dispatched)</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Payment Method Filter */}
        <div className="filter-control-item">
          <label htmlFor="orders-payment-select" className="filter-label">
            Payment:
          </label>
          <select
            id="orders-payment-select"
            className="filter-select"
            value={paymentFilter}
            onChange={(e) => onPaymentFilterChange(e.target.value)}
          >
            <option value="ALL">All Methods</option>
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="filter-control-item">
          <label htmlFor="orders-sort-select" className="filter-label">
            <ArrowUpDown size={13} className="sort-icon" aria-hidden="true" />
            Sort:
          </label>
          <select
            id="orders-sort-select"
            className="filter-select"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as OrderSortOption)}
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Highest total</option>
            <option value="amount-asc">Lowest total</option>
          </select>
        </div>

        {/* Clear Filters Button (Only shown when filter active) */}
        {hasActiveFilters && (
          <button
            type="button"
            className="clear-filters-btn"
            onClick={onClearFilters}
            title="Reset search and filters"
          >
            <X size={14} />
            <span>Clear filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
