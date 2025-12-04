import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Shared/Header';
import "../../styles/components/inventory.css";

function InventoryReport({ user, onLogout }) {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:8080/api/products/my-products', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const products = await response.json();
        setInventoryData(products);
      } else if (response.status === 401) {
        // Token expired or invalid
        onLogout();
        navigate('/login');
      } else {
        throw new Error(`Failed to fetch inventory: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate inventory statistics
  const stats = {
    totalProducts: inventoryData.length,
    inStock: inventoryData.filter(p => p.quantity > 0).length,
    outOfStock: inventoryData.filter(p => p.quantity === 0).length,
    lowStock: inventoryData.filter(p => p.quantity > 0 && p.quantity <= 10).length,
    totalValue: inventoryData.reduce((sum, p) => sum + (p.price * (p.quantity || 0)), 0),
    averagePrice: inventoryData.length > 0 ? 
      inventoryData.reduce((sum, p) => sum + (p.price || 0), 0) / inventoryData.length : 0
  };

  // Filter products based on selected filter
  const filteredProducts = inventoryData.filter(product => {
    switch (filter) {
      case 'in-stock':
        return product.quantity > 0;
      case 'out-of-stock':
        return product.quantity === 0;
      case 'low-stock':
        return product.quantity > 0 && product.quantity <= 10;
      default:
        return true;
    }
  });

  // Get stock status
  const getStockStatus = (quantity) => {
    if (quantity === 0 || quantity === null) return { status: 'Out of Stock', class: 'out-of-stock' };
    if (quantity <= 10) return { status: 'Low Stock', class: 'low-stock' };
    return { status: 'In Stock', class: 'in-stock' };
  };

  // Handle image error
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  if (loading) {
    return (
      <div className="inventory-report">
        <Header 
          title="FarmChainX - Inventory Report" 
          user={user} 
          onLogout={onLogout}
        />
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading inventory data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-report">
      <Header 
        title="FarmChainX - Inventory Report" 
        user={user} 
        onLogout={onLogout}
      />
      
      <div className="container">
        <div className="inventory-content">
          {/* Header */}
          <div className="inventory-header">
            <div className="header-content">
              <div className="header-text">
                <h1>Inventory Report</h1>
                <p>Comprehensive overview of your product inventory and stock levels</p>
              </div>
              <div className="header-actions">
                <button 
                  className="btn btn-outline"
                  onClick={() => navigate('/farmerdashboard')}
                >
                  ← Back to Dashboard
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => window.print()}
                >
                  📄 Print Report
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-alert">
              <div className="alert-content">
                <span className="alert-icon">⚠️</span>
                <div className="alert-text">
                  <strong>Error loading inventory:</strong> {error}
                </div>
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={fetchInventoryData}
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Summary Statistics */}
          <div className="inventory-summary">
            <h2>Inventory Summary</h2>
            <div className="summary-cards">
              <div className="summary-card total">
                <div className="summary-icon">📦</div>
                <div className="summary-content">
                  <div className="summary-number">{stats.totalProducts}</div>
                  <div className="summary-label">Total Products</div>
                </div>
              </div>
              <div className="summary-card in-stock">
                <div className="summary-icon">✅</div>
                <div className="summary-content">
                  <div className="summary-number">{stats.inStock}</div>
                  <div className="summary-label">In Stock</div>
                </div>
              </div>
              <div className="summary-card low-stock">
                <div className="summary-icon">⚠️</div>
                <div className="summary-content">
                  <div className="summary-number">{stats.lowStock}</div>
                  <div className="summary-label">Low Stock</div>
                </div>
              </div>
              <div className="summary-card out-of-stock">
                <div className="summary-icon">❌</div>
                <div className="summary-content">
                  <div className="summary-number">{stats.outOfStock}</div>
                  <div className="summary-label">Out of Stock</div>
                </div>
              </div>
              <div className="summary-card value">
                <div className="summary-icon">💰</div>
                <div className="summary-content">
                  <div className="summary-number">₹{stats.totalValue.toFixed(2)}</div>
                  <div className="summary-label">Total Value</div>
                </div>
              </div>
              <div className="summary-card average">
                <div className="summary-icon">📊</div>
                <div className="summary-content">
                  <div className="summary-number">₹{stats.averagePrice.toFixed(2)}</div>
                  <div className="summary-label">Avg Price</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="inventory-filters">
            <h3>Filter Products</h3>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All Products ({inventoryData.length})
              </button>
              <button 
                className={`filter-btn ${filter === 'in-stock' ? 'active' : ''}`}
                onClick={() => setFilter('in-stock')}
              >
                In Stock ({stats.inStock})
              </button>
              <button 
                className={`filter-btn ${filter === 'low-stock' ? 'active' : ''}`}
                onClick={() => setFilter('low-stock')}
              >
                Low Stock ({stats.lowStock})
              </button>
              <button 
                className={`filter-btn ${filter === 'out-of-stock' ? 'active' : ''}`}
                onClick={() => setFilter('out-of-stock')}
              >
                Out of Stock ({stats.outOfStock})
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="inventory-table-section">
            <div className="section-header">
              <h3>Product Inventory ({filteredProducts.length} items)</h3>
              <div className="table-actions">
                <button className="btn btn-outline" onClick={fetchInventoryData}>
                  🔄 Refresh
                </button>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <h4>No products found</h4>
                <p>
                  {filter === 'all' 
                    ? "You haven't added any products yet." 
                    : "No products match your current filter criteria."
                  }
                </p>
                {filter === 'all' ? (
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/form')}
                  >
                    Add Your First Product
                  </button>
                ) : (
                  <button 
                    className="btn btn-outline"
                    onClick={() => setFilter('all')}
                  >
                    Show All Products
                  </button>
                )}
              </div>
            ) : (
              <div className="table-container">
                <table className="inventory-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Crop Type</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Stock Value</th>
                      <th>Status</th>
                      <th>Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => {
                      const stockStatus = getStockStatus(product.quantity);
                      const stockValue = (product.price || 0) * (product.quantity || 0);
                      const imageUrl = product.imageUrl?.startsWith('http') 
                        ? product.imageUrl 
                        : `http://localhost:8080${product.imageUrl}`;
                      
                      return (
                        <tr key={product.id}>
                          <td>
                            <div className="product-cell">
                              <div className="image-container">
                                {product.imageUrl ? (
                                  <>
                                    <img 
                                      src={imageUrl} 
                                      alt={product.name}
                                      className="product-thumb"
                                      onError={handleImageError}
                                    />
                                    <div className="image-fallback" style={{display: 'none'}}>
                                      <span>📷</span>
                                    </div>
                                  </>
                                ) : (
                                  <div className="no-image">
                                    <span>📷</span>
                                  </div>
                                )}
                              </div>
                              <div className="product-info">
                                <div className="product-name">{product.name}</div>
                                <div className="product-location">{product.location || 'No location'}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="crop-badge">{product.cropType}</span>
                          </td>
                          <td className="price-cell">₹{(product.price || 0).toFixed(2)}</td>
                          <td className="quantity-cell">
                            <span className={`quantity ${stockStatus.class}`}>
                              {product.quantity || 0}
                            </span>
                          </td>
                          <td className="value-cell">₹{stockValue.toFixed(2)}</td>
                          <td>
                            <span className={`status-badge ${stockStatus.class}`}>
                              {stockStatus.status}
                            </span>
                          </td>
                          <td className="date-cell">
                            {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Stock Analysis */}
          {inventoryData.length > 0 && (
            <div className="stock-analysis">
              <h3>Stock Analysis</h3>
              <div className="analysis-grid">
                <div className="analysis-card">
                  <h4>Stock Distribution</h4>
                  <div className="stock-distribution">
                    <div className="distribution-item">
                      <span className="label">In Stock:</span>
                      <span className="value">{stats.inStock} products</span>
                      <div className="bar">
                        <div 
                          className="fill in-stock" 
                          style={{width: `${(stats.inStock / stats.totalProducts) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                    <div className="distribution-item">
                      <span className="label">Low Stock:</span>
                      <span className="value">{stats.lowStock} products</span>
                      <div className="bar">
                        <div 
                          className="fill low-stock" 
                          style={{width: `${(stats.lowStock / stats.totalProducts) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                    <div className="distribution-item">
                      <span className="label">Out of Stock:</span>
                      <span className="value">{stats.outOfStock} products</span>
                      <div className="bar">
                        <div 
                          className="fill out-of-stock" 
                          style={{width: `${(stats.outOfStock / stats.totalProducts) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="analysis-card">
                  <h4>Value Analysis</h4>
                  <div className="value-analysis">
                    <div className="value-item">
                      <span className="label">Total Inventory Value:</span>
                      <span className="value">₹{stats.totalValue.toFixed(2)}</span>
                    </div>
                    <div className="value-item">
                      <span className="label">Average Product Price:</span>
                      <span className="value">₹{stats.averagePrice.toFixed(2)}</span>
                    </div>
                    <div className="value-item">
                      <span className="label">Highest Value Product:</span>
                      <span className="value">
                        {inventoryData.length > 0 ? 
                          `₹${Math.max(...inventoryData.map(p => (p.price || 0) * (p.quantity || 0))).toFixed(2)}` : 
                          'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InventoryReport;