// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import FarmerDashboard from './components/FarmerDashboard/FarmerDashboard';
import CustomerDashboard from './components/CustomerDashboard/CustomerDashboard';
import RetailerDashboard from './components/RetailerDashboard/RetailerDashboard';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import Form from './components/Form/Form';
import QRcode from './components/QRcode/QRcode';
import InventoryReport from './components/InventoryReport/InventoryReport';
import SalesOverview from './components/SalesOverview/SalesOverview';
import './styles/globals.css';
import Chatbot from "./pages/chatbot";
import FarmerChatbot from "./pages/FarmerChatbot";
import FruitClassifier from "./pages/FruitClassifier";
import { useNavigate } from "react-router-dom";



function App() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        fetchAllProducts(token);
      } catch (error) {
        console.error('Error parsing user data:', error);
        handleLogout();
      }
    }
    setLoading(false);
  }, []);

  const fetchAllProducts = async (token = null) => {
    try {
      const authToken = token || localStorage.getItem('token');
      if (!authToken) return;

      const response = await fetch('http://localhost:8080/api/products', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        const productsData = await response.json();
        setProducts(productsData);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addProduct = (newProduct) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  const onDeleteProduct = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    fetchAllProducts(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setProducts([]);
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading FarmChainX...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/fruit-classifier" element={<FruitClassifier />} />
          <Route path="/farmer/chatbot" element={<FarmerChatbot />} />
          {/* Default route should go to Login, not Register */}
          <Route path="/" element={user ? <Navigate to={`/${user.role.toLowerCase()}dashboard`} /> : <Navigate to="/login" />} />
          
          {/* Login route with onLogin prop */}
          <Route path="/login" element={
            user ? <Navigate to={`/${user.role.toLowerCase()}dashboard`} /> : 
            <Login onLogin={handleLogin} />
          } />
          
          {/* Register route */}
          <Route path="/register" element={
            user ? <Navigate to={`/${user.role.toLowerCase()}dashboard`} /> : 
            <Register onLogin={handleLogin} />
          } />
          
          {/* Dashboard routes */}
          <Route path="/farmerdashboard" element={
            user?.role === 'FARMER' ? 
            <FarmerDashboard 
              user={user} 
              products={products} 
              onDeleteProduct={onDeleteProduct} 
              onLogout={handleLogout} 
            /> : 
            <Navigate to="/login" />
          } />
          
          <Route path="/customerdashboard" element={
            user?.role === 'CUSTOMER' ? 
            <CustomerDashboard 
              user={user} 
              products={products} 
              onLogout={handleLogout} 
            /> : 
            <Navigate to="/login" />
          } />
          
          <Route path="/retailerdashboard" element={
            user?.role === 'RETAILER' ? 
            <RetailerDashboard 
              user={user} 
              products={products} 
              onLogout={handleLogout} 
            /> : 
            <Navigate to="/login" />
          } />
          
          <Route path="/admindashboard" element={
            user?.role === 'ADMIN' ? 
            <AdminDashboard 
              user={user} 
              products={products} 
              onDeleteProduct={onDeleteProduct} 
              onLogout={handleLogout} 
            /> : 
            <Navigate to="/login" />
          } />
          
          {/* Form route - make sure FarmerDashboard can navigate to this */}
          <Route path="/form" element={
            user?.role === 'FARMER' ? 
            <Form user={user} addProduct={addProduct} /> : 
            <Navigate to="/login" />
          } />
          
          {/* Inventory Report route - Farmer only */}
          <Route path="/inventory" element={
            user?.role === 'FARMER' ? 
            <InventoryReport user={user} onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } />
          
          {/* Sales Overview route - Farmer only */}
          <Route path="/sales" element={
            user?.role === 'FARMER' ? 
            <SalesOverview user={user} onLogout={handleLogout} /> : 
            <Navigate to="/login" />
          } />
          
          {/* QR code route - make it accessible to all authenticated users */}
          <Route path="/qrcode" element={
            user ? 
            <QRcode user={user} /> : 
            <Navigate to="/login" />
          } />
          <Route path="/chatbot" element={<Chatbot />} />
          
          {/* Fallback route for unknown paths */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;