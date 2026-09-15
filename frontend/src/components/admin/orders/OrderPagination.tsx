import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OrderPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const OrderPagination: React.FC<OrderPaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  if (totalItems === 0) return null;

  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers window (e.g. 1 2 3 4 5)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) pages.push(i);
    }

    return pages;
  };

  return (
    <div className="order-pagination-container">
      {/* Left: Range and Page Size Selector */}
      <div className="pagination-info-group">
        <span className="pagination-range-text">
          Showing <strong>{startItem}</strong>–<strong>{endItem}</strong> of{' '}
          <strong>{totalItems}</strong> orders
        </span>

        <div className="pagination-size-selector">
          <label htmlFor="orders-page-size" className="page-size-label">
            Per page:
          </label>
          <select
            id="orders-page-size"
            className="page-size-select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Right: Page Navigation Buttons */}
      <div className="pagination-nav-group">
        <button
          type="button"
          className="pagination-btn nav-arrow"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous Page"
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>

        <div className="pagination-pages-list">
          {getPageNumbers().map((p, idx) => (
            <button
              key={idx}
              type="button"
              className={`pagination-page-btn ${p === currentPage ? 'active' : ''}`}
              onClick={() => typeof p === 'number' && onPageChange(p)}
              disabled={p === currentPage}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="pagination-btn nav-arrow"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next Page"
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
