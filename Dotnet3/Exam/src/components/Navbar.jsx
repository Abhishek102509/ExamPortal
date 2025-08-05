import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Navbar = () => {
  return (
    <BootstrapNavbar 
      expand="lg" 
      className="gradient-primary shadow-sm sticky-top"
      variant="dark"
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="fw-bold fs-4 text-white d-flex align-items-center">
          <BookOpen className="me-2" size={28} />
          Exam Portal
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="text-white fw-medium px-3 me-2 rounded" style={{background: 'rgba(255,255,255,0.1)'}}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="text-white fw-medium px-3 me-2 rounded" style={{background: 'rgba(255,255,255,0.1)'}}>
              About Us
            </Nav.Link>
            <Nav.Link as={Link} to="/login" className="text-white fw-medium px-3 me-2 rounded" style={{background: 'rgba(255,255,255,0.1)'}}>
              Login
            </Nav.Link>
            <Nav.Link as={Link} to="/signup" className="text-white fw-medium px-3 me-2 rounded" style={{background: 'rgba(255,255,255,0.1)'}}>
              Sign Up
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="text-white fw-medium px-3 me-2 rounded" style={{background: 'rgba(255,255,255,0.1)'}}>
              Contact Us
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
