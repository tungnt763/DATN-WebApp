import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="app-background">
      <Navbar bg="light" expand="lg" className="shadow-sm fixed-top">
        <Container>
          <Navbar.Brand href="/">📦 Retail Data Portal</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Tải lên</Nav.Link>
            <Nav.Link as={Link} to="/history">Lịch sử</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container className="main-content" style={{ paddingTop: '80px' }}>
        {children}
      </Container>
      <footer className="text-center text-muted py-3 border-top mt-4">
        © 2025 Retail Insight Platform
      </footer>
    </div>
  );
};

export default Layout;