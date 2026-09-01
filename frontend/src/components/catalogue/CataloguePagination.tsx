import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CataloguePagination.css';

interface CataloguePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const CataloguePagination: React.FC<CataloguePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  // Generate intelligent pagination range with ellipsis
  const getPageNumbers = (): (number | string)[] => {
    // If total pages <= 7, display all page numbers directly
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    // Always include page 1
    pages.push(1);

    if (currentPage > 3) {
      pages.push('ellipsis-start');
    }

    // Determine surrounding page range
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis-end');
    }

    // Always include the last page
    pages.push(totalPages);

    return pages;
  };

  const pageItems = getPageNumbers();

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <nav className="catalogue-pagination" aria-label="Catalogue pagination">
      {/* PREVIOUS BUTTON */}
      <button
        type="button"
        className="pagination-btn pagination-arrow"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        title="Previous Page"
      >
        <ChevronLeft size={18} strokeWidth={2.2} />
      </button>

      {/* PAGE NUMBERS & ELLIPSIS */}
      <div className="pagination-pages">
        {pageItems.map((item, index) => {
          if (typeof item === 'string') {
            return (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis" aria-hidden="true">
                …
              </span>
            );
          }

          const isActive = item === currentPage;
          return (
            <button
              key={`page-${item}`}
              type="button"
              className={`pagination-btn pagination-num ${isActive ? 'active' : ''}`}
              onClick={() => handlePageClick(item)}
              aria-label={`Page ${item}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* NEXT BUTTON */}
      <button
        type="button"
        className="pagination-btn pagination-arrow"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
        title="Next Page"
      >
        <ChevronRight size={18} strokeWidth={2.2} />
      </button>
    </nav>
  );
};
