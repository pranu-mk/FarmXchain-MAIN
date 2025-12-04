import React from 'react';

function ProductAnalytics({ data }) {
  const maxProducts = Math.max(...data.map(item => item.productsAdded));

  return (
    <div className="purchase-analytics">
      <div className="analytics-charts">
        <div className="chart">
          <h4>Products Added Monthly</h4>
          <div className="bar-chart">
            {data.map((item, index) => (
              <div key={index} className="bar-container">
                <div 
                  className="bar"
                  style={{ height: `${(item.productsAdded / maxProducts) * 100}%` }}
                >
                  <span className="bar-value">{item.productsAdded}</span>
                </div>
                <span className="bar-label">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="analytics-summary">
        <div className="summary-item">
          <h4>Total Products</h4>
          <p>{data.reduce((sum, item) => sum + item.productsAdded, 0)}</p>
        </div>
        <div className="summary-item">
          <h4>Average Monthly</h4>
          <p>{(data.reduce((sum, item) => sum + item.productsAdded, 0) / data.length).toFixed(1)}</p>
        </div>
        <div className="summary-item">
          <h4>Current Top Crop</h4>
          <p>{data[data.length - 1]?.topCrop}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductAnalytics;