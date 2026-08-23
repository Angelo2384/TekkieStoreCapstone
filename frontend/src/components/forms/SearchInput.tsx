import React from 'react';
import './SearchInput.css';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ className = '', onSearch, onKeyDown, ...rest }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch((e.target as HTMLInputElement).value);
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <div className={`search-input-wrapper ${className}`}>
      <svg
        className="search-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input
        type="search"
        className="search-input"
        placeholder="Search..."
        onKeyDown={handleKeyDown}
        {...rest}
      />
    </div>
  );
};

export default SearchInput;
