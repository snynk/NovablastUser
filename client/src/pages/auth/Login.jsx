import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Container, Row, Col, Card, Form, FormGroup, Input, Button, Spinner, Alert } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import "@/assets/css/login.css";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", passcode: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isAnimated, setIsAnimated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Apply background image to body element
    document.body.style.backgroundImage = "url('/images/login_bg-tQVGET2T.jpg')";
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    
    // Trigger animation after component mounts
    setTimeout(() => {
      setIsAnimated(true);
    }, 100);
    
    // Cleanup function to remove background when component unmounts
    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.backgroundAttachment = '';
    };
  }, []);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    let loginSuccessful = false;
    let loginError = null;

    const loginPromise = axios.post('http://localhost:3000/api/auth/login', { email: formData.email, passcode: formData.passcode });
    const delayPromise = new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const [response] = await Promise.all([loginPromise, delayPromise]);
      if (response.data.success) {
        loginSuccessful = true;
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else {
        loginError = response.data.message || "Login failed. Please check your credentials.";
      }
    } catch (err) {
      loginError = err.response?.data?.message || "Login failed. Please check your credentials.";
    } finally {
      setLoading(false);
      if (loginSuccessful) navigate('/');
      else if (loginError) setError(loginError);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="login-container">
      <div className={`login-card ${isAnimated ? 'animated' : ''}`}>
        <div className="login-visual">
          <div className="login-visual-content">
            <h1>Welcome Back</h1>
            <p>Secure login to your personalized dashboard. Your journey continues here.</p>
          </div>
          <div className="particles">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="particle"></div>
            ))}
          </div>
        </div>
        
        <div className="login-form">
          <div className="logo-container">
          {/* <img 
  src="\public\images\RDUzpIudSyC617i0fcGn8.jpg" 
  alt="Company Logo" 
  style={{ width: '80px', height: '70px' }} 
  className="logo" 
/> */}
          </div>
          
          <h2>Sign In</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <Form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-container">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                <Input 
                  type="email" 
                  id="email" 
                  name="email" 
                  className="control" 
                  placeholder="Enter your email"
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="password-header">
                <label htmlFor="passcode">Password</label>
                <a href="/forgot-password" className="forgot-password">Forgot password?</a>
              </div>
              <div className="input-container">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <Input 
                  type={showPassword ? "text" : "password"} 
                  id="passcode" 
                  name="passcode" 
                  className="control" 
                  placeholder="Enter your password"
                  value={formData.passcode} 
                  onChange={handleInputChange} 
                  required 
                />
                <div className="password-toggle" onClick={togglePasswordVisibility}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </div>
              </div>
            </div>
            
            <button 
              type="submit" 
              className={`login-btn ${loading ? 'loading' : ''}`} 
              disabled={loading}
            >
              {loading ? (
                <div className="loader">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : "Sign In"}
            </button>
          </Form>
          
          {/* <div className="sign-up-link">
            Don't have an account? <a href="/register">Sign up now</a>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;