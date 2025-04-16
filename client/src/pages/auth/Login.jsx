import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Container, Row, Col, Card, Form, FormGroup, Input, Button, Spinner, Alert } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    let loginSuccessful = false;
    let loginError = null;

    const loginPromise = axios.post('http://localhost:3000/api/auth/login', { email: formData.email, password: formData.password });
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

  const backgroundStyle = { backgroundImage: `url('/images/login_bg-tQVGET2T.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' };
  const logoStyle = { maxWidth: '150px', height: 'auto', marginBottom: '20px' };
  const passwordInputWrapperStyle = { position: 'relative' };
  const passwordInputStyle = { paddingRight: '35px' };
  const eyeIconStyle = { position: 'absolute', top: '70%', right: '10px', transform: 'translateY(-50%)', cursor: 'pointer', zIndex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '25px', height: '25px' };

  return (
    <div style={backgroundStyle}>
      <Container fluid className="">
        <Row className="justify-content-center align-items-center">
          <Col md={1} lg={6} xl={7}>
            <Card className="shadow-lg border-0 rounded-3">
              <Row className="g-0">
                <Col className="d-none d-md-flex align-items-center justify-content-center p-4" style={{ backgroundImage: `url('/images/teamworklogin.avif')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                  <div className="text-center">
                    <h4 className="mb-3 text-black">Welcome Back</h4>
                    <p className="text-muted small text-black-50">Secure login to your personalized dashboard. Your journey continues here.</p>
                  </div>
                </Col>
                <Col md={6} className="p-4">
                  <div className="text-center mb-3">
                    <img src="/images/Gemini_Generated_Image_xdat3dxdat3dxdat.jpeg" alt="Logo" style={logoStyle} />
                  </div>
                  {error && <Alert color="danger" className="mb-3">{error}</Alert>}
                  <Form onSubmit={handleSubmit}>
                    <FormGroup className="mb-3">
                      <label className="form-label" htmlFor="email">Email Address</label>
                      <Input type="email" id="email" name="email" className="form-control" placeholder="jake.stein@comcast.net" value={formData.email} onChange={handleInputChange} required />
                    </FormGroup>
                    <FormGroup className="mb-3" style={passwordInputWrapperStyle}>
                      <div className="d-flex justify-content-between">
                        <label className="form-label" htmlFor="password">Password</label>
                        <a href="/forgot-password" className="text-muted small">Forgot password?</a>
                      </div>
                      <Input type={showPassword ? "text" : "password"} id="password" name="password" className="form-control" placeholder="********" value={formData.password} onChange={handleInputChange} required style={passwordInputStyle} />
                      <span style={eyeIconStyle} onClick={togglePasswordVisibility}>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </span>
                    </FormGroup>
                    <div className="d-grid" style={{ width: '50%', margin: '0 auto' }}>
                      <Button type="submit" color="primary" size="lg" disabled={loading} style={{ width: '100%', height: '50px', padding: '15px', background: '#ADD8E11', color: 'white', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.4s ease', position: 'relative', overflow: 'hidden', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {loading ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner size="sm" className="me-2" /> Signing in...</span> : "Login"}
                      </Button>
                    </div>
                  </Form>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLogin;