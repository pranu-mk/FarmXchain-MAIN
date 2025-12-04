import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/globals.css';

function ProductTable({ products, columns, showQR = false, title = "Products" }) {
  if (!products || products.length === 0) {
    return (
      <div className="table-card">
        <div className="table-header">
          <h3 className="table-title">{title}</h3>
          <div className="table-actions">
            <span className="table-count">0 items</span>
          </div>
        </div>
        <div className="empty-state">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9H21M9 21V9M5 9L7.5 5.5M19 9L16.5 5.5M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h4>No products found</h4>
          <p>There are no products to display at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      {/* Table Header Section */}
      <div className="table-header">
        <div className="table-title-section">
          <h3 className="table-title">{title}</h3>
          <span className="table-count">{products.length} {products.length === 1 ? 'item' : 'items'}</span>
        </div>
        <div className="table-actions">
          <div className="table-search">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search products..." 
              className="search-input"
              onChange={(e) => console.log('Search:', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="table-header-cell">
                  <div className="header-content">
                    <span className="header-title">{col.title}</span>
                    {col.sortable && (
                      <button className="sort-btn">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 15L12 20L17 15M7 9L12 4L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </th>
              ))}
              {showQR && (
                <th key="qr-code" className="table-header-cell">
                  <div className="header-content">
                    <span className="header-title">QR Code</span>
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} className={`table-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                {columns.map((col) => (
                  <td key={col.key} className="table-cell">
                    <div className="cell-content">
                      {col.render ? col.render(product) : product[col.key]}
                    </div>
                  </td>
                ))}
                {showQR && (
                  <td key="qr-action" className="table-cell">
                    <div className="cell-content">
                      <Link to="/qrcode" state={product}>
                        <button className="qr-btn">
                          <svg className="qr-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 7H7V3H3V7ZM1 1H9V9H1V1Z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M3 17H7V13H3V17ZM1 11H9V19H1V11Z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M13 3H17V7H13V3ZM11 1H19V9H11V1Z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M15 15H17V17H15V15Z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M13 13H15V15H13V13Z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M17 13H19V15H17V13Z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M13 17H15V19H13V17Z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M17 17H19V19H17V17Z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M21 13V15H19V17H21V19H19H17V21H15V19H13V21H11V19H13V17H15V15H13V13H15V15H17V13H21Z" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          Generate QR
                        </button>
                      </Link>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="table-footer">
        <div className="table-pagination">
          <button className="pagination-btn" disabled>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Previous
          </button>
          <span className="pagination-info">Page 1 of 1</span>
          <button className="pagination-btn" disabled>
            Next
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductTable;