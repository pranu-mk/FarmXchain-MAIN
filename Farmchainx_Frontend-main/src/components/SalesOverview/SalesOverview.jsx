import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Shared/Header';
import "../../styles/components/sales.css";

function SalesOverview({ user, onLogout }) {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSalesData();
  }, [timeRange]);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // TODO: Replace with actual API endpoint when available
      // For now, using mock data with timeout to simulate API call
      setTimeout(() => {
        const mockSalesData = generateMockSalesData(timeRange);
        setSalesData(mockSalesData);
        setLoading(false);
      }, 1500);

    } catch (error) {
      console.error('Error fetching sales data:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Generate mock data based on time range
  const generateMockSalesData = (range) => {
    const baseData = [
      { id: 1, productName: 'Organic Tomatoes', customer: 'John Doe', quantity: 50, price: 25, total: 1250, date: '2024-01-15', status: 'completed' },
      { id: 2, productName: 'Fresh Potatoes', customer: 'Jane Smith', quantity: 100, price: 15, total: 1500, date: '2024-01-14', status: 'completed' },
      { id: 3, productName: 'Green Vegetables', customer: 'Retail Mart', quantity: 200, price: 30, total: 6000, date: '2024-01-13', status: 'completed' },
      { id: 4, productName: 'Organic Rice', customer: 'Mike Johnson', quantity: 80, price: 45, total: 3600, date: '2024-01-12', status: 'pending' },
      { id: 5, productName: 'Fresh Corn', customer: 'Sarah Wilson', quantity: 120, price: 20, total: 2400, date: '2024-01-11', status: 'completed' },
      { id: 6, productName: 'Organic Wheat', customer: 'David Brown', quantity: 150, price: 35, total: 5250, date: '2024-01-10', status: 'completed' },
    ];

    // Filter based on time range (simplified for demo)
    if (range === 'weekly') {
      return baseData.slice(0, 3); // Last week
    } else if (range === 'daily') {
      return [baseData[0]]; // Today
    }
    
    return baseData; // Monthly (all data)
  };

  // Calculate sales statistics
  const stats = {
    totalSales: salesData.length,
    completedSales: salesData.filter(s => s.status === 'completed').length,
    pendingSales: salesData.filter(s => s.status === 'pending').length,
    totalRevenue: salesData.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.total, 0),
    totalQuantity: salesData.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.quantity, 0),
    averageOrderValue: salesData.filter(s => s.status === 'completed').length > 0 ? 
      salesData.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.total, 0) / 
      salesData.filter(s => s.status === 'completed').length : 0
  };

  // Calculate trends (mock data for demo)
  const trends = {
    revenue: '+12%',
    orders: '+8%',
    averageOrder: '+5%',
    completionRate: '94%'
  };

  // Top selling products
  const topProducts = salesData
    .filter(s => s.status === 'completed')
    .reduce((acc, sale) => {
      const existing = acc.find(p => p.name === sale.productName);
      if (existing) {
        existing.quantity += sale.quantity;
        existing.revenue += sale.total;
        existing.orders += 1;
      } else {
        acc.push({
          name: sale.productName,
          quantity: sale.quantity,
          revenue: sale.total,
          orders: 1
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Recent sales (last 10)
  const recentSales = [...salesData]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  if (loading) {
    return (
      <div className="sales-overview">
        <Header 
          title="FarmChainX - Sales Overview" 
          user={user} 
          onLogout={onLogout}
        />
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading sales data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sales-overview">
      <Header 
        title="FarmChainX - Sales Overview" 
        user={user} 
        onLogout={onLogout}
      />
      
      <div className="container">
        <div className="sales-content">
          {/* Header */}
          <div className="sales-header">
            <div className="header-content">
              <div className="header-text">
                <h1>Sales Overview</h1>
                <p>Track your sales performance and revenue analytics</p>
              </div>
              <div className="header-actions">
                <button 
                  className="btn btn-outline"
                  onClick={() => navigate('/farmerdashboard')}
                >
                  ← Back to Dashboard
                </button>
                <div className="time-filters">
                  <button 
                    className={`time-btn ${timeRange === 'daily' ? 'active' : ''}`}
                    onClick={() => setTimeRange('daily')}
                  >
                    Daily
                  </button>
                  <button 
                    className={`time-btn ${timeRange === 'weekly' ? 'active' : ''}`}
                    onClick={() => setTimeRange('weekly')}
                  >
                    Weekly
                  </button>
                  <button 
                    className={`time-btn ${timeRange === 'monthly' ? 'active' : ''}`}
                    onClick={() => setTimeRange('monthly')}
                  >
                    Monthly
                  </button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-alert">
              <div className="alert-content">
                <span className="alert-icon">⚠️</span>
                <div className="alert-text">
                  <strong>Error loading sales data:</strong> {error}
                </div>
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={fetchSalesData}
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Sales Summary */}
          <div className="sales-summary">
            <h2>Sales Summary - {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}</h2>
            <div className="summary-cards">
              <div className="summary-card revenue">
                <div className="summary-icon">💰</div>
                <div className="summary-content">
                  <div className="summary-number">₹{stats.totalRevenue.toLocaleString()}</div>
                  <div className="summary-label">Total Revenue</div>
                  <div className="summary-trend positive">↑ {trends.revenue} from last {timeRange}</div>
                </div>
              </div>
              <div className="summary-card orders">
                <div className="summary-icon">📦</div>
                <div className="summary-content">
                  <div className="summary-number">{stats.totalSales}</div>
                  <div className="summary-label">Total Orders</div>
                  <div className="summary-trend positive">↑ {trends.orders} from last {timeRange}</div>
                </div>
              </div>
              <div className="summary-card avg-order">
                <div className="summary-icon">📊</div>
                <div className="summary-content">
                  <div className="summary-number">₹{stats.averageOrderValue.toFixed(0)}</div>
                  <div className="summary-label">Avg Order Value</div>
                  <div className="summary-trend positive">↑ {trends.averageOrder} from last {timeRange}</div>
                </div>
              </div>
              <div className="summary-card completed">
                <div className="summary-icon">✅</div>
                <div className="summary-content">
                  <div className="summary-number">{stats.completedSales}</div>
                  <div className="summary-label">Completed Orders</div>
                  <div className="summary-trend">
                    {stats.totalSales > 0 ? 
                      `${Math.round((stats.completedSales / stats.totalSales) * 100)}% success rate` : 
                      'No orders'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sales Analytics */}
          <div className="sales-analytics">
            <div className="analytics-grid">
              {/* Revenue Chart Placeholder */}
              <div className="analytics-card">
                <div className="card-header">
                  <h3>Revenue Trend</h3>
                  <span className="time-range">{timeRange}</span>
                </div>
                <div className="chart-placeholder">
                  <div className="placeholder-text">
                    <div className="chart-icon">📈</div>
                    <div className="chart-info">
                      <strong>Revenue Visualization</strong>
                      <small>Chart will display {timeRange} revenue trends</small>
                    </div>
                  </div>
                </div>
                <div className="chart-stats">
                  <div className="chart-stat">
                    <span className="stat-label">Current {timeRange}</span>
                    <span className="stat-value">₹{stats.totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="chart-stat">
                    <span className="stat-label">Growth</span>
                    <span className="stat-value positive">{trends.revenue}</span>
                  </div>
                </div>
              </div>

              {/* Top Products */}
              <div className="analytics-card">
                <div className="card-header">
                  <h3>Top Selling Products</h3>
                  <span className="items-count">{topProducts.length} products</span>
                </div>
                <div className="top-products">
                  {topProducts.length > 0 ? (
                    topProducts.map((product, index) => (
                      <div key={index} className="product-rank">
                        <div className={`rank rank-${index + 1}`}>#{index + 1}</div>
                        <div className="product-info">
                          <div className="product-name">{product.name}</div>
                          <div className="product-stats">
                            <span className="quantity">{product.quantity} units</span>
                            <span className="revenue">₹{product.revenue.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="product-orders">
                          {product.orders} order{product.orders !== 1 ? 's' : ''}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-data">
                      <div className="no-data-icon">📊</div>
                      <p>No sales data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Sales Table */}
          <div className="recent-sales">
            <div className="section-header">
              <h3>Recent Sales</h3>
              <div className="table-actions">
                <button className="btn btn-outline" onClick={fetchSalesData}>
                  🔄 Refresh
                </button>
                <button className="btn btn-primary">
                  📥 Export Report
                </button>
              </div>
            </div>

            <div className="table-container">
              {recentSales.length > 0 ? (
                <table className="sales-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Product</th>
                      <th>Customer</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSales.map((sale) => (
                      <tr key={sale.id}>
                        <td className="order-id">#{sale.id.toString().padStart(4, '0')}</td>
                        <td className="product-name">
                          <div className="product-cell">
                            <span className="product-text">{sale.productName}</span>
                          </div>
                        </td>
                        <td className="customer">{sale.customer}</td>
                        <td className="quantity">{sale.quantity.toLocaleString()}</td>
                        <td className="price">₹{sale.price.toFixed(2)}</td>
                        <td className="total">₹{sale.total.toLocaleString()}</td>
                        <td className="date">{new Date(sale.date).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge ${sale.status}`}>
                            {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h4>No Sales Records</h4>
                  <p>No sales data available for the selected time period.</p>
                </div>
              )}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="performance-metrics">
            <h3>Performance Metrics</h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <h4>Conversion Rate</h4>
                <div className="metric-value">{(stats.completedSales / Math.max(stats.totalSales, 1) * 100).toFixed(1)}%</div>
                <div className="metric-label">Order Completion</div>
              </div>
              <div className="metric-card">
                <h4>Average Units per Order</h4>
                <div className="metric-value">
                  {stats.completedSales > 0 ? 
                    Math.round(stats.totalQuantity / stats.completedSales) : 0
                  }
                </div>
                <div className="metric-label">Units/Order</div>
              </div>
              <div className="metric-card">
                <h4>Revenue per Product</h4>
                <div className="metric-value">
                  ₹{topProducts.length > 0 ? 
                    Math.round(topProducts.reduce((sum, p) => sum + p.revenue, 0) / topProducts.length).toLocaleString() : 
                    '0'
                  }
                </div>
                <div className="metric-label">Average</div>
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="sales-insights">
            <h3>Sales Insights</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-icon">🏆</div>
                <div className="insight-content">
                  <h4>Best Performing Product</h4>
                  <div className="insight-value">
                    {topProducts[0]?.name || 'N/A'}
                  </div>
                  <div className="insight-label">
                    {topProducts[0] ? `₹${topProducts[0].revenue.toLocaleString()} revenue` : 'No data'}
                  </div>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon">📅</div>
                <div className="insight-content">
                  <h4>Peak Performance</h4>
                  <div className="insight-value">
                    {recentSales.length > 0 ? 
                      new Date(recentSales[0].date).toLocaleDateString('en-US', { weekday: 'long' }) : 
                      'N/A'
                    }
                  </div>
                  <div className="insight-label">
                    Highest sales volume day
                  </div>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon">👥</div>
                <div className="insight-content">
                  <h4>Customer Segments</h4>
                  <div className="insight-value">
                    {salesData.length > 0 ? 'Retailers & Individuals' : 'N/A'}
                  </div>
                  <div className="insight-label">
                    Mixed customer base
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesOverview;