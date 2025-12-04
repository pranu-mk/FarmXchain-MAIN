import React from 'react';
import '../../styles/globals.css';

function SearchSection({ value, onChange, onSearch, placeholder = "Search products..." }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <section className="search-section" style={searchSectionStyle}>
      <div className="container">
        <div className="search-box d-flex gap-2">
          <input
            type="text"
            className="form-input"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{flex: '1'}}
          />
          <button className="btn btn-primary" onClick={onSearch}>
            Search
          </button>
        </div>
      </div>
    </section>
  );
}

const searchSectionStyle = {
  marginBottom: '2rem'
};

export default SearchSection;