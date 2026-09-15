import React, { useState } from 'react';
import { useShoes } from '../../../hooks/useShoes';
import { formatPrice } from '../../../utils/formatters';
import { ProductImage } from '../../../components/shared/ProductImage';
import { Search, Plus } from 'lucide-react';
import './Products.css';

export const Products: React.FC = () => {
  const { shoes, loading } = useShoes();
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('All');

  const filtered = shoes.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = brandFilter === 'All' || p.brand === brandFilter;
    return matchesSearch && matchesBrand;
  });

  const brands = ['All', ...Array.from(new Set(shoes.map((s) => s.brand)))];

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products Catalogue</h1>
          <p className="admin-page-subtitle">Manage sneaker listings, pricing and availability</p>
        </div>

        <button type="button" className="admin-btn-primary">
          <Plus size={18} />
          <span>Add New Shoe</span>
        </button>
      </div>

      <div className="admin-toolbar-card">
        <div className="admin-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by shoe name, brand, or SKU ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="admin-filter-group">
          <label htmlFor="brand-filter">Brand:</label>
          <select
            id="brand-filter"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
          >
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="dashboard-card">
        {loading ? (
          <div className="admin-loading-state">Loading product catalogue...</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Gender</th>
                  <th>Base Price</th>
                  <th>Sale Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((shoe) => (
                  <tr key={shoe.id}>
                    <td>
                      <div className="admin-prod-cell">
                        <div className="admin-prod-img-box">
                          <ProductImage src={shoe.image} alt={shoe.name} />
                        </div>
                        <div className="admin-prod-info">
                          <span className="font-semibold text-obsidian">{shoe.name}</span>
                          <span className="text-muted text-sm">ID: {shoe.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>{shoe.brand}</td>
                    <td>{shoe.category}</td>
                    <td>{shoe.gender}</td>
                    <td className="font-semibold text-obsidian">{formatPrice(shoe.price)}</td>
                    <td>
                      {shoe.isOnSale ? (
                        <span className="status-pill status-badge-processing">
                          {shoe.salePercentage}% OFF
                        </span>
                      ) : (
                        <span className="status-pill stock-badge-in">Standard</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default Products;
