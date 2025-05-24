import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav, NavDropdown, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Layout = ({ children }) => {
  const [email, setEmail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/whoami')
      .then(res => setEmail(res.data.email))
      .catch(() => navigate('/login'));
  }, [navigate]);

  const handleLogout = () => {
    api.get('/logout', { withCredentials: true })
      .then(() => {
        setEmail(null);
        navigate('/login');
      })
      .catch((err) => {
        console.error('Logout failed:', err);
        navigate('/login');
      });
  };

  return (
    <div className="app-background" style={{ background: 'linear-gradient(to bottom right, #f5f7fa, #c3cfe2)', minHeight: '100vh' }}>
      <Navbar bg="white" expand="lg" className="shadow-sm fixed-top border-bottom py-2 px-3">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="fw-bold text-primary fs-4">
            <span role="img" aria-label="logo">📦</span> Retail Data Portal
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" className="fw-medium">📤 Upload</Nav.Link>
              <Nav.Link as={Link} to="/history" className="fw-medium">📁 History</Nav.Link>
            </Nav>
            {email && (
              <Nav>
                <NavDropdown title={<span className="fw-semibold text-dark">👤 {email}</span>} align="end">
                  <NavDropdown.Item onClick={handleLogout}>🚪 Log out</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="main-content" style={{ paddingTop: '110px' }}>
        <Row className="justify-content-center">
          <Col xs={12} md={11} lg={10} xl={9} className="bg-white shadow rounded-4 p-4">
            {children}
          </Col>
        </Row>
      </Container>

      <footer className="text-center text-muted py-3 border-top mt-4 small bg-white shadow-sm">
        © 2025 Retail Insight Platform
      </footer>
    </div>
  );
};

export default Layout;
