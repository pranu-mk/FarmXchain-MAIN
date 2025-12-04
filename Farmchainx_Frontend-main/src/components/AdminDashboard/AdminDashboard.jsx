import React, { useState, useEffect } from 'react';
import Header from '../Shared/Header';
import UserStats from "./UserStats";
import PurchaseAnalytics from "./PurchaseAnalytics";
import ProductAnalytics from "./ProductAnalytics";
import ProductTable from '../Shared/ProductTable';
import "../../styles/components/admin.css";
import Chatbot from "../../pages/chatbot.jsx";

function AdminDashboard({ products, onDeleteProduct, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [userStats, setUserStats] = useState({
    farmers: 0,
    customers: 0,
    retailers: 0,
    total: 0
  });
  
  const [purchaseData, setPurchaseData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [systemMetrics, setSystemMetrics] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data from backend
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        };

        // Fetch user statistics
        const usersResponse = await fetch('http://localhost:8080/api/users/stats', { headers });
        if (usersResponse.ok) {
          const userStatsData = await usersResponse.json();
          setUserStats(userStatsData);
        }

        // Fetch purchase analytics
        const purchasesResponse = await fetch('http://localhost:8080/api/analytics/purchases', { headers });
        if (purchasesResponse.ok) {
          const purchaseData = await purchasesResponse.json();
          setPurchaseData(purchaseData);
        }

        // Fetch product analytics
        const productsResponse = await fetch('http://localhost:8080/api/analytics/products', { headers });
        if (productsResponse.ok) {
          const productData = await productsResponse.json();
          setProductData(productData);
        }

        // Fetch system metrics
        const metricsResponse = await fetch('http://localhost:8080/api/analytics/metrics', { headers });
        if (metricsResponse.ok) {
          const metricsData = await metricsResponse.json();
          setSystemMetrics(metricsData);
        }

        // Fetch recent activities
        const activitiesResponse = await fetch('http://localhost:8080/api/activities/recent', { headers });
        if (activitiesResponse.ok) {
          const activitiesData = await activitiesResponse.json();
          setRecentActivities(activitiesData);
        }

        // Fetch ratings and comments
        const ratingsResponse = await fetch('http://localhost:8080/api/ratings', { headers });
        if (ratingsResponse.ok) {
          const ratingsData = await ratingsResponse.json();
          setRatings(ratingsData);
        }

      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Calculate derived metrics from real data
  const calculateMetrics = () => {
    const totalRevenue = purchaseData.reduce((sum, month) => sum + (month.revenue || 0), 0);
    const totalPurchases = purchaseData.reduce((sum, month) => sum + (month.purchases || 0), 0);
    const avgOrderValue = totalPurchases > 0 ? totalRevenue / totalPurchases : 0;
    
    // Calculate average rating from products
    const ratedProducts = products.filter(p => p.averageRating > 0);
    const avgRating = ratedProducts.length > 0 
      ? ratedProducts.reduce((sum, p) => sum + p.averageRating, 0) / ratedProducts.length 
      : 0;

    return {
      totalRevenue,
      avgOrderValue: Math.round(avgOrderValue),
      conversionRate: 3.8, // This would come from backend analytics
      customerSatisfaction: parseFloat(avgRating.toFixed(1)),
      systemUptime: 99.8, // This would come from system monitoring
      activeTransactions: purchaseData[purchaseData.length - 1]?.purchases || 0
    };
  };

  const systemMetricsData = calculateMetrics();

  const adminColumns = [
    { 
      key: 'imageUrl', 
      title: 'Image', 
      render: (product) => (
        <div className="product-image-container">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:8080${product.imageUrl}`} 
              alt={product.name} 
              className="product-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="no-image-placeholder" style={{ display: product.imageUrl ? 'none' : 'flex' }}>
            <span>🌱</span>
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
          <div className="product-id">ID: {product.id}</div>
        </div>
      )
    },
    { 
      key: 'cropType', 
      title: 'Crop Type',
      render: (product) => (
        <span className="crop-badge">{product.cropType}</span>
      )
    },
    { 
      key: 'farmer', 
      title: 'Farmer',
      render: (product) => product.farmer?.name || product.farmerName || 'Unknown Farmer'
    },
    { 
      key: 'location', 
      title: 'Location',
      render: (product) => (
        <div className="location-cell">
          <span className="location-icon">📍</span>
          {product.location || 'Not specified'}
        </div>
      )
    },
    { 
      key: 'createdAt', 
      title: 'Added On', 
      render: (product) => (
        <div className="date-cell">
          {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
        </div>
      )
    },
    { 
      key: 'averageRating', 
      title: 'Avg Rating', 
      render: (product) => (
        <div className="rating-cell">
          {product.averageRating ? (
            <>
              <span className="rating-stars">{'⭐'.repeat(Math.round(product.averageRating))}</span>
              <span className="rating-value">{product.averageRating.toFixed(1)}</span>
            </>
          ) : (
            <span className="no-rating">Not rated</span>
          )}
        </div>
      )
    },
    { 
      key: 'actions', 
      title: 'Actions', 
      render: (product) => (
        <div className="action-buttons">
          <button 
            className="btn btn-view btn-sm"
            onClick={() => console.log('View product:', product.id)}
            title="View Details"
          >
            👁️
          </button>
          <button 
            className="btn btn-danger btn-sm"
            onClick={() => onDeleteProduct(product.id)}
            title="Delete Product"
          >
            🗑️
          </button>
        </div>
      )
    }
  ];

  // Calculate top crops from actual product data
  const topCrops = products.reduce((acc, product) => {
    const existing = acc.find(item => item.name === product.cropType);
    if (existing) {
      existing.sales += product.quantity || 0;
      existing.revenue += (product.price || 0) * (product.quantity || 0);
    } else {
      acc.push({
        name: product.cropType,
        sales: product.quantity || 0,
        revenue: (product.price || 0) * (product.quantity || 0),
        growth: Math.random() * 20 + 5 // This would come from analytics
      });
    }
    return acc;
  }, []).sort((a, b) => b.sales - a.sales).slice(0, 5);

  if (isLoading) {
    return (
      <div className="dashboard admin-dashboard">
        <Header 
          title="FarmChainX - Admin Dashboard" 
          user={{ name: "Admin User", role: "ADMIN" }} 
          onLogout={onLogout}
        />
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard admin-dashboard">
      <Header 
        title="FarmChainX - Admin Dashboard" 
        user={{ name: "Admin User", role: "ADMIN" }} 
        onLogout={onLogout}
      />
      
      <div className="container">
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            📦 Products
          </button>
          <button 
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
          <button 
            className={`tab-btn ${activeTab === 'ratings' ? 'active' : ''}`}
            onClick={() => setActiveTab('ratings')}
          >
            ⭐ Ratings
          </button>
       <button
  className={`tab-btn ${activeTab === 'chatbot' ? 'active' : ''}`}
  onClick={() => setActiveTab('chatbot')}
>
  💬 Chatbot
</button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="admin-overview">
              <UserStats stats={userStats} />
              
              <div className="quick-stats-grid">
                <div className="stat-card primary">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <div className="stat-number">₹{(systemMetricsData.totalRevenue / 100000).toFixed(1)}L</div>
                    <div className="stat-label">Total Revenue</div>
                    <div className="stat-trend positive">+{purchaseData[purchaseData.length - 1]?.growth || 0}%</div>
                  </div>
                </div>
                
                <div className="stat-card success">
                  <div className="stat-icon">📦</div>
                  <div className="stat-content">
                    <div className="stat-number">{products.length}</div>
                    <div className="stat-label">Active Products</div>
                    <div className="stat-trend positive">+{productData[productData.length - 1]?.growth || 0}%</div>
                  </div>
                </div>
                
                <div className="stat-card info">
                  <div className="stat-icon">🛒</div>
                  <div className="stat-content">
                    <div className="stat-number">{systemMetricsData.activeTransactions}</div>
                    <div className="stat-label">Active Transactions</div>
                    <div className="stat-trend positive">+5.2%</div>
                  </div>
                </div>
                
                <div className="stat-card warning">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-content">
                    <div className="stat-number">{systemMetricsData.customerSatisfaction}/5</div>
                    <div className="stat-label">Avg Rating</div>
                    <div className="stat-trend positive">+0.3</div>
                  </div>
                </div>
              </div>

              <div className="overview-grid">
                <div className="recent-activities">
                  <h3>Recent Activities</h3>
                  <div className="activities-list">
                    {recentActivities.slice(0, 5).map(activity => (
                      <div key={activity.id} className="activity-item">
                        <div className="activity-icon">{activity.icon || '🔔'}</div>
                        <div className="activity-content">
                          <div className="activity-text">
                            <strong>{activity.user}</strong> {activity.action || activity.type}
                            {activity.product && ` - ${activity.product}`}
                            {activity.amount && ` (${activity.amount})`}
                          </div>
                          <div className="activity-time">{activity.timestamp ? new Date(activity.timestamp).toLocaleTimeString() : 'Recently'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="performance-metrics">
                  <h3>Performance Metrics</h3>
                  <div className="metrics-grid">
                    <div className="metric-item">
                      <div className="metric-value">{systemMetricsData.conversionRate}%</div>
                      <div className="metric-label">Conversion Rate</div>
                    </div>
                    <div className="metric-item">
                      <div className="metric-value">₹{systemMetricsData.avgOrderValue}</div>
                      <div className="metric-label">Avg Order Value</div>
                    </div>
                    <div className="metric-item">
                      <div className="metric-value">{systemMetricsData.systemUptime}%</div>
                      <div className="metric-label">System Uptime</div>
                    </div>
                    <div className="metric-item">
                      <div className="metric-value">98.7%</div>
                      <div className="metric-label">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="products-section">
              <div className="section-header">
                <div className="header-content">
                  <div className="header-text">
                    <h2>Product Management</h2>
                    <p>Manage all products in the FarmChainX ecosystem</p>
                  </div>
                  <div className="header-stats">
                    <div className="stat-badge">
                      <span className="stat-number">{products.length}</span>
                      <span className="stat-label">Total Products</span>
                    </div>
                  </div>
                </div>
              </div>
              <ProductTable
                products={products}
                columns={adminColumns}
                title="All Products"
              />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="analytics-section">
              <div className="section-header">
                <h2>System Analytics</h2>
                <p>Comprehensive insights and performance metrics</p>
              </div>
              
              <div className="analytics-grid">
                <div className="analytics-card">
                  <div className="card-header">
                    <h3>📈 Purchase Analytics</h3>
                    <span className="card-badge">Real-time Data</span>
                  </div>
                  <PurchaseAnalytics data={purchaseData} />
                </div>
                
                <div className="analytics-card">
                  <div className="card-header">
                    <h3>📊 Product Analytics</h3>
                    <span className="card-badge">Real-time Data</span>
                  </div>
                  <ProductAnalytics data={productData} />
                </div>
              </div>

              <div className="crop-analytics">
                <div className="card-header">
                  <h3>🌾 Top Performing Crops</h3>
                  <span className="card-badge">Based on Sales</span>
                </div>
                <div className="crop-list">
                  {topCrops.map((crop, index) => (
                    <div key={crop.name} className="crop-item">
                      <div className="crop-rank">#{index + 1}</div>
                      <div className="crop-info">
                        <span className="crop-name">{crop.name}</span>
                        <span className="crop-sales">{crop.sales} units</span>
                      </div>
                      <div className="crop-stats">
                        <div className="crop-revenue">₹{(crop.revenue / 1000).toFixed(1)}K</div>
                        <div className="crop-growth positive">+{crop.growth.toFixed(1)}%</div>
                      </div>
                      <div className="crop-bar">
                        <div 
                          className="crop-fill" 
                          style={{width: `${(crop.sales / (topCrops[0]?.sales || 1)) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ratings' && (
            <div className="ratings-section">
              <div className="section-header">
                <h2>Customer Ratings & Reviews</h2>
                <p>Feedback and ratings from customers</p>
                
              </div>
              
              
              <div className="ratings-grid">
                {ratings.map(rating => (
                  <div key={rating.id} className="rating-card">
                    <div className="rating-header">
                      <div className="rating-stars-large">
                        {'⭐'.repeat(rating.stars || rating.rating)}
                        {'☆'.repeat(5 - (rating.stars || rating.rating))}
                      </div>
                      <div className="rating-meta">
                        <span className="rating-user">{rating.user?.name || rating.userName || 'Anonymous'}</span>
                        <span className="rating-date">
                          {new Date(rating.createdAt || rating.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="rating-product">
                      Product: <strong>{rating.product?.name || 'Unknown Product'}</strong>
                    </div>
                    {rating.comment && (
                      <div className="rating-comment">
                        "{rating.comment}"
                      </div>
                    )}
                    
                    <div className="rating-actions">
                      <button className="btn btn-sm btn-outline">View Product</button>
                      <button className="btn btn-sm btn-danger">Delete Review</button>
                    </div>
                    
                      
                  </div>
                ))}

  
              </div>
 
                
            </div>
            
          )}

          {/* ✅ CHATBOT TAB BLOCK – Place this AFTER ratings tab */}
{activeTab === 'chatbot' && (
  <div className="chatbot-section">
    <Chatbot />
  </div>
)}
            
        </div>
      </div>
      
    </div>
  );

  
}

export default AdminDashboard;