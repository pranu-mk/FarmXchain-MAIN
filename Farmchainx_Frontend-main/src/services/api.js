// services/api.js
const API_BASE_URL = 'http://localhost:8080';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        
        // Prepare headers
        const headers = {
            ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
            ...(this.token && { Authorization: `Bearer ${this.token}` }),
            ...options.headers,
        };

        const config = {
            headers,
            ...options,
        };

        // Handle request body
        if (options.body) {
            if (options.body instanceof FormData) {
                config.body = options.body;
                // Don't set Content-Type for FormData - let browser set it with boundary
                delete config.headers['Content-Type'];
            } else if (typeof options.body === 'object') {
                config.body = JSON.stringify(options.body);
            } else {
                config.body = options.body;
            }
        }

        try {
            console.log(`🔄 API Call: ${config.method || 'GET'} ${url}`);
            
            const response = await fetch(url, config);
            
            // Handle non-JSON responses (like file downloads)
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response;
            }

            const data = await response.json();
            
            if (!response.ok) {
                console.error(`❌ API Error: ${response.status}`, data);
                throw new Error(data.error || data.message || `API error: ${response.status}`);
            }

            console.log(`✅ API Success: ${config.method || 'GET'} ${url}`);
            return data;

        } catch (error) {
            console.error(`🚨 API Request failed: ${error.message}`, {
                endpoint,
                method: options.method,
                error: error.message
            });
            
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                throw new Error('Cannot connect to server. Please check if the backend is running.');
            }
            
            throw error;
        }
    }

    // Product methods - UPDATED
    async createProduct(productData) {
        const formData = new FormData();
        
        console.log('📦 Creating product with data:', productData);
        
        // Append all product fields except image
        Object.keys(productData).forEach(key => {
            if (key !== 'image' && productData[key] !== undefined && productData[key] !== null) {
                // Handle different data types          
                if (productData[key] instanceof Date) {
                    formData.append(key, productData[key].toISOString());
                } else {
                    formData.append(key, productData[key]);
                }
                console.log(`📝 Added field: ${key} = ${productData[key]}`);
            }
        });

        // Append image file if exists
        if (productData.image && productData.image instanceof File) {
            formData.append('image', productData.image);
            console.log('📸 Added image file:', productData.image.name);
        }

        // Log FormData contents for debugging
        console.log('📋 FormData contents:');
        for (let [key, value] of formData.entries()) {
            console.log(`  ${key}:`, value);
        }

        return this.request('/api/products', {
            method: 'POST',
            body: formData,
        });
    }

    // Other methods remain the same...
    async getProducts() {
        return this.request('/api/products');
    }

    async getMyProducts() {
        return this.request('/api/products/my-products');
    }

    async updateProduct(id, productData) {
        return this.request(`/api/products/${id}`, {
            method: 'PUT',
            body: productData,
        });
    }

    async deleteProduct(id) {
        return this.request(`/api/products/${id}`, {
            method: 'DELETE',
        });
    }

    // Auth methods
    async login(email, password) {
        const data = await this.request('/api/auth/login', {
            method: 'POST',
            body: { email, password },
        });
        
        if (data.token) {
            this.setToken(data.token);
        }
        
        return data;
    }

    async register(userData) {
        return this.request('/api/auth/register', {
            method: 'POST',
            body: userData,
        });
    }

    // Rating methods
    async addRating(productId, rating) {
        return this.request(`/api/products/${productId}/ratings`, {
            method: 'POST',
            body: rating,
        });
    }

    async getRatings(productId) {
        return this.request(`/api/products/${productId}/ratings`);
    }

    // Admin methods
    async getUserStats() {
        return this.request('/api/admin/user-stats');
    }

    // Utility methods
    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    isAuthenticated() {
        return !!this.token;
    }

    getCurrentUser() {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }
}

// Create a singleton instance
const apiService = new ApiService();
export default apiService;