import React, { useState, useEffect, useMemo } from 'react';
import Header from '../Shared/Header';
import ProductTable from '../Shared/ProductTable';
import RatingModal from '../Shared/RatingModal';
import SearchSection from '../Shared/SearchSection';
import apiService from '../../services/api';
import "../../styles/components/dashboard.css";

function CustomerDashboard({ onLogout, user }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const products = await apiService.getProducts();
      setProducts(products);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      showNotification("Failed to load products", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRateProduct = (product) => {
    setSelectedProduct(product);
    setShowRatingModal(true);
  };

  const handleSubmitRating = async (productId, rating, comment) => {
    try {
      await apiService.addRating(productId, { stars: rating, comment });
      
      showNotification("Thanks for your rating!", "success");
      await fetchProducts();
      setShowRatingModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("❌ Error submitting rating:", error);
      showNotification("Failed to submit rating. Please try again.", "error");
    }
  };

  const handleBuyProduct = (product) => {
    showNotification(`🛒 ${product.name} added to cart!`, "success");
    console.log("Product added to cart:", product);
  };

  const showNotification = (message, type = 'info') => {
    // Create a temporary notification element
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

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((p) =>
        [p.name, p.cropType, p.location, p.farmer?.name]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(product => product.cropType === activeFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'price':
          return (a.price || 0) - (b.price || 0);
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchQuery, activeFilter, sortBy]);

  const cropTypes = useMemo(() => {
    const types = [...new Set(products.map(p => p.cropType).filter(Boolean))];
    return types;
  }, [products]);

  const customerColumns = [
    {
      key: 'image',
      title: 'Product',
      render: (product) => (
        <div className="product-image-container">
          {product.imageUrl ? (
            <img
              src={`http://localhost:8080${product.imageUrl}`}
              alt={product.name}
              className="product-image"
              onError={(e) => {
                e.target.src = '/api/placeholder/60/60';
                e.target.className = 'product-image placeholder';
              }}
            />
          ) : (
            <div className="product-image-placeholder">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 16L8 12L12 16L18 10L20 12V4H4V16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 20H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      title: 'Name',
      render: (product) => (
        <div className="product-name">
          <strong>{product.name}</strong>
          {product.farmer?.name && (
            <span className="farmer-name">by {product.farmer.name}</span>
          )}
        </div>
      )
    },
    {
      key: 'cropType',
      title: 'Category',
      render: (product) => (
        <span className="crop-badge">{product.cropType || 'General'}</span>
      )
    },
    { key: 'location', title: 'Location' },
    {
      key: 'price',
      title: 'Price',
      render: (product) =>
        product.price ? `₹${product.price.toLocaleString()}` : 'Price on request'
    },
    {
      key: 'harvestDate',
      title: 'Harvest Date',
      render: (product) =>
        product.harvestDate ? new Date(product.harvestDate).toLocaleDateString() : 'N/A',
    },
    {
      key: 'averageRating',
      title: 'Rating',
      render: (product) => (
        <div className="rating-display">
          {product.averageRating && product.averageRating > 0 ? (
            <>
              <span className="rating-stars">
                {'⭐'.repeat(Math.floor(product.averageRating))}
                {product.averageRating % 1 >= 0.5 && '⭐'}
              </span>
              <span className="rating-value">({product.averageRating.toFixed(1)})</span>
            </>
          ) : (
            <span className="no-rating">Not rated yet</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (product) => (
        <div className="action-buttons">
          <button
            className="btn btn-primary btn-sm buy-btn"
            onClick={() => handleBuyProduct(product)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add to Cart
          </button>
          <button
            className="btn btn-outline btn-sm rate-btn"
            onClick={() => handleRateProduct(product)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Rate
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="dashboard customer-dashboard">
      <Header
        title="FarmChainX - Customer Dashboard"
        user={user || { name: 'Customer User', role: 'CUSTOMER' }}
        onLogout={onLogout}
      />
      <div className="container">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <div className="header-content">
              <h1>Fresh Farm Products</h1>
              <p>Browse and purchase directly from local farmers. Rate products after purchase to help others.</p>
            </div>
            <div className="header-stats">
              <div className="stat-badge">
                <span className="stat-number">{products.length}</span>
                <span className="stat-label">Total Products</span>
              </div>
            </div>
          </div>

          {/* Filters and Search Section */}
          <div className="filters-section">
            <div className="filters-row">
              <SearchSection
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search products, farmers, or locations..."
              />
              
              <div className="filter-controls">
                <select
                  className="filter-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Sort by Name</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="price">Sort by Price</option>
                  <option value="date">Sort by Date</option>
                </select>
                <select
                  className="filter-select"
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {cropTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Category Filters */}
            <div className="category-filters">
              <button
                className={`category-filter ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All Products
              </button>
               {/* Fruit Classifier Button */}
  <button
    className="category-filter active"
    onClick={() => window.location.href = "/fruit-classifier"}
  >
    Fruit Classifier
  </button>
              {cropTypes.slice(0, 6).map(type => (
                <button
                  key={type}
                  className={`category-filter ${activeFilter === type ? 'active' : ''}`}
                  onClick={() => setActiveFilter(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Products Table */}
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading fresh products...</p>
            </div>
          ) : (
            <ProductTable
              products={filteredProducts}
              columns={customerColumns}
              title="Available Products"
            />
          )}

          {/* Empty State */}
          {!isLoading && filteredProducts.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 16L8 12L12 16L18 10L20 12V4H4V16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 20H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>No products found</h3>
              <p>Try adjusting your search or filters to find more products.</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Rating Modal */}
          {showRatingModal && selectedProduct && (
            <RatingModal
              product={selectedProduct}
              onClose={() => setShowRatingModal(false)}
              onSubmitRating={handleSubmitRating}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;