import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import "../../styles/components/qrcode.css";

function QRcode() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product || location.state;

  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace('Url', ' URL')
      .replace('Id', ' ID');
  };

  const formatValue = (key, value) => {
    if (!value) return 'Not specified';
    
    // Format date values
    if (key.toLowerCase().includes('date')) {
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value;
      }
    }
    
    // Format price values
    if (key.toLowerCase().includes('price')) {
      return `₹${parseFloat(value).toFixed(2)}`;
    }
    
    return String(value);
  };

  const handleClose = () => {
    navigate("/farmerdashboard");
  };

  // Filter out unnecessary fields and create display data
  const getDisplayData = () => {
    if (!product) return [];
    
    const excludedFields = ['id', 'imageUrl', 'averageRating', 'farmer'];
    
    return Object.entries(product)
      .filter(([key]) => !excludedFields.includes(key))
      .map(([key, value]) => ({
        key,
        label: formatKey(key),
        value: formatValue(key, value)
      }));
  };

  // Download QR Code as PNG
  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${product?.name || 'product'}_qrcode.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  // Download Report as PDF
  const downloadReport = () => {
    const displayData = getDisplayData();
    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Product Report - ${product?.name || 'Product'}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            line-height: 1.6;
            color: #333;
          }
          .header { 
            text-align: center; 
            margin-bottom: 40px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .header h1 { 
            color: #2c5530;
            margin-bottom: 10px;
          }
          .product-details { 
            margin-bottom: 40px; 
          }
          .product-details h2 {
            color: #2c5530;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
          }
          .details-grid { 
            display: grid; 
            gap: 15px;
            margin-top: 20px;
          }
          .detail-item { 
            display: flex; 
            justify-content: space-between; 
            border-bottom: 1px solid #eee; 
            padding: 8px 0; 
          }
          .detail-label { 
            font-weight: bold; 
            color: #555;
          }
          .detail-value { 
            color: #333;
          }
          .qr-section { 
            text-align: center; 
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid #ddd;
          }
          .qr-section h3 {
            color: #2c5530;
            margin-bottom: 20px;
          }
          .footer { 
            margin-top: 40px; 
            text-align: center; 
            font-size: 12px; 
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          @media print {
            body { margin: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Product Quality Report</h1>
          <p><strong>FarmChainX</strong> - Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="product-details">
          <h2>Product Information</h2>
          <div class="details-grid">
            ${displayData.map(item => `
              <div class="detail-item">
                <span class="detail-label">${item.label}:</span>
                <span class="detail-value">${item.value}</span>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="qr-section">
          <h3>Product QR Code</h3>
          <p>Scan this QR code to verify product authenticity and access detailed information</p>
          <div style="margin: 20px 0;">
            <!-- QR code will be generated separately -->
          </div>
        </div>
        
        <div class="footer">
          <p><strong>FarmChainX - Blockchain Verified Product</strong></p>
          <p>This report was generated automatically from our secure system</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(reportContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  // Share functionality
  const shareReport = async () => {
    const shareData = {
      title: `${product?.name || 'Product'} - FarmChainX`,
      text: `Check out this agricultural product: ${product?.name || 'Product Details'}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Product link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Product link copied to clipboard!');
      } catch (clipboardErr) {
        alert('Sharing failed. Please copy the URL manually.');
      }
    }
  };

  // Print functionality
  const printReport = () => {
    window.print();
  };

  // Create QR code data
  const getQRData = () => {
    if (!product) return '';
    
    const qrData = {
      productId: product.id,
      name: product.name,
      cropType: product.cropType,
      price: product.price,
      harvestDate: product.harvestDate,
      useBeforeDate: product.useBeforeDate,
      location: product.location,
      type: 'FarmChainX_Product',
      timestamp: new Date().toISOString()
    };
    
    return JSON.stringify(qrData, null, 2);
  };

  const displayData = getDisplayData();

  return (
    <div className="qr-container">
      <div className="qr-card">
        <div className="qr-header">
          <h2>Product QR Code</h2>
          <button className="btn btn-close" onClick={handleClose}>
            ✖ Close
          </button>
        </div>

        {product ? (
          <>
            <div className="product-details">
              <h3>📋 Product Details</h3>
              <div className="details-grid">
                {displayData.map((item) => (
                  <div key={item.key} className="detail-item">
                    <span className="detail-label">{item.label}:</span>
                    <span className="detail-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="qr-section">
              <h3>📱 Product QR Code</h3>
              <div className="QR">
                <QRCode 
                  id="qr-code-svg"
                  value={getQRData()} 
                  size={200}
                  level="H"
                  style={{ 
                    padding: '10px', 
                    backgroundColor: 'white',
                    borderRadius: '8px'
                  }}
                />
              </div>
              <p className="qr-note">
                Scan this QR code to verify product authenticity and access detailed information
              </p>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button className="btn btn-download" onClick={downloadQRCode}>
                📥 Download QR Code
              </button>
              <button className="btn btn-report" onClick={downloadReport}>
                📄 Generate Report
              </button>
              <button className="btn btn-share" onClick={shareReport}>
                🔗 Share Product
              </button>
              <button className="btn btn-print" onClick={printReport}>
                🖨️ Print
              </button>
            </div>
          </>
        ) : (
          <div className="no-data">
            <h3>No Product Data Available</h3>
            <p>Please go back to your dashboard and select a product to generate QR code.</p>
            <button className="btn btn-close" onClick={handleClose}>
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QRcode;