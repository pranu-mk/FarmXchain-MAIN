// components/FarmerDashboard/FarmerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Shared/Header';
import SearchSection from '../Shared/SearchSection';
import ProductTable from '../Shared/ProductTable';
import "../../styles/components/dashboard.css";
import Chatbot from "../../pages/chatbot";



function FarmerDashboard({ products, onDeleteProduct, onLogout }) {
  const [showChatbot, setShowChatbot] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const navigate = useNavigate();

  // Update filtered products when products prop changes
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // Search functionality
  const handleSearch = () => {
    if (!searchValue.trim()) {
      setFilteredProducts(products);
      return;
    }
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      product.cropType.toLowerCase().includes(searchValue.toLowerCase()) ||
      product.location?.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchValue('');
    setFilteredProducts(products);
  };

  // Navigate to edit form
  const handleEditProduct = (product) => {
    navigate("/form", { state: { product } });
  };

  // Enhanced delete functionality
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(productId);
    
    try {
      // Call parent's onDeleteProduct which will update the global state
      await onDeleteProduct(productId);
      showNotification('Product deleted successfully!', 'success');
    } catch (error) {
      console.error('❌ Delete error:', error);
      showNotification(`Failed to delete product: ${error.message}`, 'error');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Navigate to QR code page
  const handleGenerateQR = (product) => {
    navigate("/qrcode", { state: { product } });
  };

  // Helper function to get full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:8080${imageUrl}`;
  };

  // Show notification
  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  // Refresh products by reloading the page (simple solution)
  const handleRefresh = () => {
    window.location.reload();
  };

  // Columns for ProductTable
  const farmerColumns = [
    { 
      key: 'imageUrl', 
      title: 'Image', 
      render: (product) => (
        <div className="product-image-container">
          {product.imageUrl ? (
            <img 
              src={getImageUrl(product.imageUrl)} 
              alt={product.name} 
              className="product-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="no-image-placeholder" style={{ display: product.imageUrl ? 'none' : 'flex' }}>
            <span>📷</span>
          </div>
        </div>
      )
    },
    { 
      key: 'name', 
      title: 'Product Name',
      render: (product) => (
        <div className="product-name-cell">
          <div className="product-name">{product.name}</div>
          <div className="product-crop">{product.cropType}</div>
        </div>
      )
    },
    { 
      key: 'details', 
      title: 'Details',
      render: (product) => ( 
        <div className="product-details-cell">
          {product.soilType && <div className="detail-item"><strong>Soil:</strong> {product.soilType}</div>}
          {product.pesticides && <div className="detail-item"><strong>Pesticides:</strong> {product.pesticides}</div>}
          {product.location && <div className="detail-item"><strong>Location:</strong> {product.location}</div>}
        </div>
      )
    },
    { 
      key: 'dates', 
      title: 'Dates',
      render: (product) => (
        <div className="dates-cell">
          {product.harvestDate && (
            <div className="date-item">
              <span className="date-label">Harvest:</span>
              <span className="date-value">{new Date(product.harvestDate).toLocaleDateString()}</span>
            </div>
          )}
          {product.useBeforeDate && (
            <div className="date-item">
              <span className="date-label">Use Before:</span>
              <span className="date-value">{new Date(product.useBeforeDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      )
    },
    { 
      key: 'inventory', 
      title: 'Inventory',
      render: (product) => (
        <div className="inventory-cell">
          <div className="price">₹{product.price?.toFixed(2) || '0.00'}</div>
          <div className="quantity">{product.quantity || 0} units</div>
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (product) => (
        <div className="action-buttons">
          <button 
            className="btn btn-qr btn-sm"
            onClick={() => handleGenerateQR(product)}
            title="Generate QR Code"
          >
            📱 QR
          </button>
          <button 
            className="btn btn-edit btn-sm"
            onClick={() => handleEditProduct(product)}
            title="Edit Product"
          >
            ✏️ Edit
          </button>
          <button 
            className="btn btn-delete btn-sm"
            onClick={() => handleDeleteProduct(product.id)}
            disabled={deleteLoading === product.id}
            title="Delete Product"
          >
            {deleteLoading === product.id ? '⏳' : '🗑️ Delete'}
          </button>
        </div>
      )
    }
  ];

  // Calculate statistics
  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.quantity > 0).length,
    outOfStock: products.filter(p => p.quantity === 0).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * (p.quantity || 0)), 0)
  };

  return (
    <div className="dashboard farmer-dashboard">
      <Header 
        title="FarmChainX - Farmer Dashboard" 
        user={JSON.parse(localStorage.getItem('user'))} 
        onLogout={onLogout}
      />
      
      <div className="container">
        <div className="dashboard-content">
          {/* Dashboard Header */}
          <div className="dashboard-header">
            <div className="header-content">
              <div className="header-text">
                <h1>My Products</h1>
                <p>Manage your agricultural products and inventory</p>
              </div>
              <div className="header-actions">
                <button 
                  className="btn btn-outline btn-refresh"
                  onClick={handleRefresh}
                >
                  🔄 Refresh
                </button>
                <Link to="/form" className="btn btn-primary btn-add">
                  <span className="btn-icon">+</span>
                  Add New Product
                </Link>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <div className="stat-number">{stats.totalProducts}</div>
                <div className="stat-label">Total Products</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-number">{stats.activeProducts}</div>
                <div className="stat-label">In Stock</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚠️</div>
              <div className="stat-content">
                <div className="stat-number">{stats.outOfStock}</div>
                <div className="stat-label">Out of Stock</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-number">₹{stats.totalValue.toFixed(2)}</div>
                <div className="stat-label">Total Value</div>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="search-section-wrapper">
            <SearchSection
              value={searchValue}
              onChange={setSearchValue}
              onSearch={handleSearch}
              placeholder="Search by product name, crop type, or location..."
            />
            {searchValue && (
              <button 
                className="btn btn-outline btn-clear"
                onClick={handleClearSearch}
              >
                Clear
              </button>
            )}
          </div>

          {/* Products Table */}
          <div className="products-section">
            <div className="section-header">
              <h3>Product Inventory</h3>
              <div className="results-count">
                {filteredProducts.length} of {products.length} products
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h4>No products found</h4>
                <p>
                  {searchValue 
                    ? 'No products match your search criteria. Try adjusting your search terms.'
                    : "You haven't added any products yet. Start by adding your first product!"
                  }
                </p>
                {!searchValue && (
                  <Link to="/form" className="btn btn-primary btn-lg">
                    Add Your First Product
                  </Link>
                )}
                {searchValue && (
                  <button 
                    className="btn btn-outline"
                    onClick={handleClearSearch}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="table-container">
                <ProductTable
                  products={filteredProducts}
                  columns={farmerColumns}
                  showQR={false} // Remove the separate QR column
                  title="My Products"
                />
              </div>
            )}
            
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h4>Quick Actions</h4>
            <div className="action-buttons-grid">
              <Link to="/form" className="action-card">
                <div className="action-icon">➕</div>
                <div className="action-text">
                  <div className="action-title">Add Product</div>
                  <div className="action-description">Create new product listing</div>
                </div>
              </Link>
              <button className="action-card" onClick={() => navigate('/inventory')}>
                <div className="action-icon">📊</div>
                <div className="action-text">
                  <div className="action-title">Inventory Report</div>
                  <div className="action-description">View stock analysis</div>
                </div>
              </button>
              <button className="action-card" onClick={() => navigate('/sales')}>
                <div className="action-icon">💰</div>
                <div className="action-text">
                  <div className="action-title">Sales Overview</div>
                  <div className="action-description">Track your sales</div>
                </div>
              </button>
              <button className="action-card" onClick={() => navigate('/qrcode')}>
                <div className="action-icon">📱</div>
                <div className="action-text">
                  <div className="action-title">QR Codes</div>
                  <div className="action-description">Generate product QR codes</div>
                </div>
              </button>
              <button className="action-card" onClick={() => navigate("/farmer/chatbot")}>
                    <div className="action-icon">🤖</div>
                    <div className="action-text">
                    <div className="action-title">Chatbot</div>
                    <div className="action-description">Farming Chatbot</div>
                    </div>
              </button>
              
              

            </div>
            
          </div>
        </div>
      </div>
    </div>
    
  );
}
export default FarmerDashboard;