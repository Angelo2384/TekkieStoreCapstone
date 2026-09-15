import React, { useState } from 'react';
import { SlidersHorizontal, Plus, Check } from 'lucide-react';

interface DashboardHeaderProps {
  onAddNewProduct?: () => void;
  onFilterChange?: (filter: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onAddNewProduct,
}) => {
  const [filterActive, setFilterActive] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [productSaved, setProductSaved] = useState(false);

  const handleAddClick = () => {
    if (onAddNewProduct) {
      onAddNewProduct();
    } else {
      setShowProductModal(true);
    }
  };

  const handleMockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProductSaved(true);
    setTimeout(() => {
      setProductSaved(false);
      setShowProductModal(false);
    }, 1200);
  };

  return (
    <>
      <div className="dashboard-header-container">
        <div className="dashboard-header-left">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Overview of your TekkieStore</p>
        </div>

        <div className="dashboard-header-actions">
          <button
            type="button"
            className={`admin-btn-secondary ${filterActive ? 'active' : ''}`}
            onClick={() => setFilterActive(!filterActive)}
            title="Filter dashboard time ranges and metrics"
          >
            <SlidersHorizontal size={16} />
            <span>{filterActive ? 'Filtered (All Channels)' : 'Filter Data'}</span>
          </button>

          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleAddClick}
            title="Add a new sneaker product to TekkieStore"
          >
            <Plus size={18} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* QUICK ADD PRODUCT MODAL */}
      {showProductModal && (
        <div className="admin-modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Add New Sneaker to Catalogue</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowProductModal(false)}
              >
                ✕
              </button>
            </div>
            {productSaved ? (
              <div className="modal-success-state">
                <Check size={32} className="success-icon" />
                <p>New product draft created successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleMockSubmit} className="admin-modal-form">
                <div className="form-group">
                  <label htmlFor="shoeName">Shoe Name</label>
                  <input
                    id="shoeName"
                    type="text"
                    required
                    placeholder="e.g. Nike Air Max Plus Drift"
                    defaultValue="Nike Air Max Plus Drift"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="brand">Brand</label>
                    <select id="brand" defaultValue="Nike">
                      <option value="Nike">Nike</option>
                      <option value="adidas">adidas</option>
                      <option value="PUMA">PUMA</option>
                      <option value="New Balance">New Balance</option>
                      <option value="Asics">Asics</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="price">Base Price (ZAR)</label>
                    <input
                      id="price"
                      type="number"
                      required
                      placeholder="e.g. 2999"
                      defaultValue="2999"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select id="category" defaultValue="Running">
                    <option value="Running">Running</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Classic">Classic</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => setShowProductModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn-primary">
                    Save Product
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
