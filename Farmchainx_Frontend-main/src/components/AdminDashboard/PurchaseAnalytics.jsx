import React from 'react';

function PurchaseAnalytics({ data = [] }) {
  // Safe data handling with defaults
  const safeData = Array.isArray(data) ? data : [];
  
  // Calculate max values safely
  const maxPurchases = safeData.length > 0 ? Math.max(...safeData.map(item => item.purchases || 0)) : 0;
  const maxRevenue = safeData.length > 0 ? Math.max(...safeData.map(item => item.revenue || 0)) : 0;

  // Calculate totals safely
  const totalPurchases = safeData.reduce((sum, item) => sum + (item.purchases || 0), 0);
  const totalRevenue = safeData.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const averageRevenue = safeData.length > 0 ? totalRevenue / safeData.length : 0;

  if (safeData.length === 0) {
    return (
      <div className="purchase-analytics">
        <div className="empty-analytics">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 17H15M9 13H15M9 9H10M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h4>No Data Available</h4>
          <p>Purchase analytics data will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="purchase-analytics">
      <div className="analytics-charts">
        <div className="chart">
          <div className="chart-header">
            <h4>Monthly Purchases</h4>
            <span className="chart-subtitle">Number of transactions</span>
          </div>
          <div className="bar-chart">
            {safeData.map((item, index) => (
              <div key={index} className="bar-container">
                <div 
                  className="bar purchases-bar"
                  style={{ 
                    height: maxPurchases > 0 ? `${(item.purchases / maxPurchases) * 80}%` : '0%'
                  }}
                  data-value={item.purchases}
                >
                  <span className="bar-value">{item.purchases}</span>
                  <div className="bar-tooltip">
                    {item.month}: {item.purchases} purchases
                  </div>
                </div>
                <span className="bar-label">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart">
          <div className="chart-header">
            <h4>Monthly Revenue</h4>
            <span className="chart-subtitle">In Indian Rupees</span>
          </div>
          <div className="bar-chart">
            {safeData.map((item, index) => (
              <div key={index} className="bar-container">
                <div 
                  className="bar revenue-bar"
                  style={{ 
                    height: maxRevenue > 0 ? `${(item.revenue / maxRevenue) * 80}%` : '0%'
                  }}
                  data-value={item.revenue}
                >
                  <span className="bar-value">₹{(item.revenue / 1000).toFixed(0)}K</span>
                  <div className="bar-tooltip">
                    {item.month}: ₹{item.revenue.toLocaleString()}
                  </div>
                </div>
                <span className="bar-label">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="analytics-summary">
        <div className="summary-item">
          <div className="summary-icon purchases-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 10H21M7 15H8M12 15H13M6 19H18C19.1046 19 20 18.1046 20 17V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V17C4 18.1046 4.89543 19 6 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="summary-content">
            <h4>Total Purchases</h4>
            <p className="summary-value">{totalPurchases.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="summary-item">
          <div className="summary-icon revenue-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="summary-content">
            <h4>Total Revenue</h4>
            <p className="summary-value">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="summary-item">
          <div className="summary-icon average-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 19C9 19 3 16 3 9C3 5 5 3 9 3C13 3 15 5 15 9C15 16 9 19 9 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 11C10.1046 11 11 10.1046 11 9C11 7.89543 10.1046 7 9 7C7.89543 7 7 7.89543 7 9C7 10.1046 7.89543 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 21C15 21 16 19 16 16C16 14 15 13 13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="summary-content">
            <h4>Monthly Average</h4>
            <p className="summary-value">₹{averageRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Trend Indicator */}
      <div className="trend-indicator">
        <div className="trend-item">
          <span className="trend-label">Growth Rate</span>
          <span className="trend-value positive">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 19V5M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            +15.2%
          </span>
        </div>
        <div className="trend-item">
          <span className="trend-label">Peak Month</span>
          <span className="trend-value">{safeData[safeData.length - 1]?.month}</span>
        </div>
      </div>
    </div>
  );
}

export default PurchaseAnalytics;