import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/form.css";

function Form({ addProduct }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    cropType: "",
    soilType: "",
    pesticides: "",
    harvestDate: "",
    useBeforeDate: "",
    location: "",
    additionalInfo: "",
    price: 0,
    quantity: 1
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
    if (error) setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      console.log("🔄 Starting product creation...");

      // Create FormData with individual fields (matching backend @RequestParam)
      const formDataToSend = new FormData();
      
      // Append individual fields as the backend expects
      formDataToSend.append("name", formData.name);
      formDataToSend.append("cropType", formData.cropType);
      formDataToSend.append("soilType", formData.soilType || "");
      formDataToSend.append("pesticides", formData.pesticides || "");
      formDataToSend.append("harvestDate", formData.harvestDate || "");
      formDataToSend.append("useBeforeDate", formData.useBeforeDate || "");
      formDataToSend.append("location", formData.location || "");
      formDataToSend.append("additionalInfo", formData.additionalInfo || "");
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("quantity", formData.quantity.toString());

      // Append image file if exists
      if (imageFile) {
        formDataToSend.append("image", imageFile);
        console.log("📸 Added image file:", imageFile.name);
      }

      // Log FormData contents for debugging
      console.log("📄 FormData contents:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`  ${key}:`, value);
      }

      const response = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
          // No Content-Type header for FormData - browser will set it with boundary
        },
        body: formDataToSend
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          console.error("❌ Server error details:", errorData);
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
          console.error("❌ Server error text:", errorText);
        }
        throw new Error(errorMessage);
      }

      const savedProduct = await response.json();
      console.log("✅ Product created successfully:", savedProduct);

      // Update parent state
      if (addProduct) {
        addProduct(savedProduct);
      }
      
      showNotification("Product created successfully!", "success");
      
      setTimeout(() => {
        navigate("/farmerdashboard");
      }, 1500);

    } catch (error) {
      console.error("❌ Product creation error:", error);
      setError(error.message || "Failed to create product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const showNotification = (message, type = 'info') => {
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

  const isFormValid = () => {
    return formData.name.trim() && 
           formData.cropType.trim() && 
           formData.price > 0 && 
           formData.quantity > 0;
  };

  // Test with minimal data
  const testMinimalProduct = () => {
    setFormData({
      name: "Organic Tomatoes",
      cropType: "Vegetables",
      soilType: "Loamy Soil",
      pesticides: "Neem Oil",
      harvestDate: "2024-01-15",
      useBeforeDate: "2024-02-15",
      location: "Farm Fresh, Maharashtra",
      additionalInfo: "Freshly harvested organic tomatoes",
      price: 45,
      quantity: 50
    });
    setImageFile(null);
    setImagePreview("");
    setError("");
    
    showNotification("Test data loaded. Click 'Create Product' to test.", "info");
  };

  const clearForm = () => {
    setFormData({
      name: "",
      cropType: "",
      soilType: "",
      pesticides: "",
      harvestDate: "",
      useBeforeDate: "",
      location: "",
      additionalInfo: "",
      price: 0,
      quantity: 1
    });
    setImageFile(null);
    setImagePreview("");
    setError("");
    
    showNotification("Form cleared!", "info");
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>Add New Product</h2>
          <p>Enter details about your agricultural product</p>
          
          <div className="debug-buttons">
            <button 
              type="button" 
              className="btn btn-outline btn-sm"
              onClick={testMinimalProduct}
            >
              🧪 Load Test Data
            </button>
            <button 
              type="button" 
              className="btn btn-outline btn-sm"
              onClick={clearForm}
            >
              🗑️ Clear Form
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Product Name *
                  {!formData.name.trim() && <span className="required-indicator"> (required)</span>}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cropType" className="form-label">
                  Crop Type *
                  {!formData.cropType.trim() && <span className="required-indicator"> (required)</span>}
                </label>
                <input
                  type="text"
                  id="cropType"
                  name="cropType"
                  className="form-input"
                  placeholder="Enter crop type"
                  value={formData.cropType}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Pricing & Inventory</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price" className="form-label">
                  Price (₹) *
                  {formData.price <= 0 && <span className="required-indicator"> (must be greater than 0)</span>}
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="form-input"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="quantity" className="form-label">
                  Quantity *
                  {formData.quantity <= 0 && <span className="required-indicator"> (must be greater than 0)</span>}
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  className="form-input"
                  placeholder="Enter quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Product Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="soilType" className="form-label">Soil Type</label>
                <input
                  type="text"
                  id="soilType"
                  name="soilType"
                  className="form-input"
                  placeholder="Enter soil type"
                  value={formData.soilType}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="pesticides" className="form-label">Pesticides Used</label>
                <input
                  type="text"
                  id="pesticides"
                  name="pesticides"
                  className="form-input"
                  placeholder="Enter pesticides used"
                  value={formData.pesticides}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="harvestDate" className="form-label">Harvest Date</label>
                <input
                  type="date"
                  id="harvestDate"
                  name="harvestDate"
                  className="form-input"
                  value={formData.harvestDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="useBeforeDate" className="form-label">Use Before Date</label>
                <input
                  type="date"
                  id="useBeforeDate"
                  name="useBeforeDate"
                  className="form-input"
                  value={formData.useBeforeDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location" className="form-label">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                className="form-input"
                placeholder="Enter location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="additionalInfo" className="form-label">Additional Information</label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                className="form-textarea"
                placeholder="Enter any additional information about the product"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows="3"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Product Image</h3>
            <div className="form-group">
              <div className="file-upload-container">
                <input
                  type="file"
                  id="image"
                  name="image"
                  className="file-input"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <label htmlFor="image" className="file-upload-label">
                  <span className="file-upload-text">
                    {imageFile ? imageFile.name : "Choose an image..."}
                  </span>
                  <span className="file-upload-button">Browse</span>
                </label>
              </div>
              <p className="file-help-text">Supported formats: JPG, PNG, GIF. Max size: 5MB</p>
            </div>

            {imagePreview && (
              <div className="image-preview-container">
                <div className="image-preview-header">
                  <span>Image Preview</span>
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={removeImage}
                  >
                    Remove
                  </button>
                </div>
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" className="preview-image" />
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={() => navigate("/farmerdashboard")}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading || !isFormValid()}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Creating Product...
                </>
              ) : (
                'Create Product'
              )}
            </button>
          </div>

          <div className="form-debug-info">
            <details>
              <summary>Debug Information</summary>
              <pre>{JSON.stringify(formData, null, 2)}</pre>
              <p>Form Valid: {isFormValid() ? 'Yes' : 'No'}</p>
              <p>Image Selected: {imageFile ? imageFile.name : 'No'}</p>
            </details>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Form;