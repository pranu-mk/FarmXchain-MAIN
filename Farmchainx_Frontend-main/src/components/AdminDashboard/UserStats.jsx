import React from 'react';

function UserStats({ stats = {} }) {
  // Safe data handling with defaults
  const safeStats = {
    farmers: stats.farmers || 0,
    customers: stats.customers || 0,
    retailers: stats.retailers || 0,
    total: stats.total || 0
  };

  // Calculate percentages safely
  const farmersPercentage = safeStats.total > 0 ? ((safeStats.farmers / safeStats.total) * 100) : 0;
  const customersPercentage = safeStats.total > 0 ? ((safeStats.customers / safeStats.total) * 100) : 0;
  const retailersPercentage = safeStats.total > 0 ? ((safeStats.retailers / safeStats.total) * 100) : 0;

  const statItems = [
    {
      key: 'farmers',
      title: 'Farmers',
      value: safeStats.farmers,
      percentage: farmersPercentage,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: 'var(--farmer-color, #48bb78)',
      description: 'Active producers'
    },
    {
      key: 'customers',
      title: 'Customers',
      value: safeStats.customers,
      percentage: customersPercentage,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: 'var(--customer-color, #667eea)',
      description: 'Direct buyers'
    },
    {
      key: 'retailers',
      title: 'Retailers',
      value: safeStats.retailers,
      percentage: retailersPercentage,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 10H21M7 15H8M12 15H13M6 19H18C19.1046 19 20 18.1046 20 17V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V17C4 18.1046 4.89543 19 6 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: 'var(--retailer-color, #ed8936)',
      description: 'Business partners'
    },
    {
      key: 'total',
      title: 'Total Users',
      value: safeStats.total,
      percentage: 100,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: 'var(--total-color, #764ba2)',
      description: 'Platform total'
    }
  ];

  return (
    <div className="user-stats">
      <div className="stats-header">
        <div className="header-content">
          <h2>User Statistics</h2>
          <p>Platform user distribution and growth</p>
        </div>
        <div className="header-actions">
          <div className="growth-indicator">
            <span className="growth-badge positive">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 19V5M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              +12.5% growth
            </span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        {statItems.map((item) => (
          <div key={item.key} className={`stat-item ${item.key}`}>
            <div className="stat-icon" style={{ color: item.color }}>
              {item.icon}
            </div>
            
            <div className="stat-content">
              <div className="stat-main">
                <h3 className="stat-title">{item.title}</h3>
                <p className="stat-value">{item.value.toLocaleString()}</p>
              </div>
              
              <div className="stat-meta">
                {item.key !== 'total' ? (
                  <>
                    <div className="percentage-bar">
                      <div 
                        className="percentage-fill" 
                        style={{ 
                          width: `${item.percentage}%`,
                          backgroundColor: item.color
                        }}
                      ></div>
                    </div>
                    <span className="stat-percentage">{item.percentage.toFixed(1)}%</span>
                  </>
                ) : (
                  <span className="stat-description">{item.description}</span>
                )}
              </div>
            </div>

            {/* Hover effect overlay */}
            <div className="stat-hover">
              <span>{item.description}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="stats-summary">
        <div className="summary-item">
          <span className="summary-label">Active This Month</span>
          <span className="summary-value">+{(safeStats.total * 0.15).toFixed(0)} users</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Avg. Daily Signups</span>
          <span className="summary-value">+{(safeStats.total * 0.005).toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

export default UserStats;