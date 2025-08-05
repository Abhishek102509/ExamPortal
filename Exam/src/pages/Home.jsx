import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaUserGraduate, FaClipboardCheck, FaChartLine, FaBookOpen, FaPlay, FaStar, FaUsers } from 'react-icons/fa';
import './Home.css';

function Home() {

  const features = [
    {
      icon: <FaClipboardCheck size={50} className="text-primary mb-3" />,
      title: "Online Exams",
      description: "Take exams anytime, anywhere with our secure online platform equipped with advanced proctoring.",
      color: "primary"
    },
    {
      icon: <FaChartLine size={50} className="text-success mb-3" />,
      title: "Instant Results",
      description: "Get your results immediately after submission with detailed analytics and performance insights.",
      color: "success"
    },
    {
      icon: <FaBookOpen size={50} className="text-info mb-3" />,
      title: "Study Materials",
      description: "Access curated study materials, practice tests, and previous question papers.",
      color: "info"
    },
    {
      icon: <FaUsers size={50} className="text-warning mb-3" />,
      title: "Collaborative Learning",
      description: "Join study groups, participate in discussions, and learn from peers worldwide.",
      color: "warning"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Students", icon: <FaUserGraduate /> },
    { number: "500+", label: "Exams", icon: <FaClipboardCheck /> },
    { number: "50+", label: "Instructors", icon: <FaChalkboardTeacher /> },
    { number: "4.8★", label: "Rating", icon: <FaStar /> }
  ];

  return (
    <div className="home-page">
      {/* Hero Section with Video Background */}
      <div className="hero-section position-relative min-vh-100 d-flex align-items-center overflow-hidden">
        {/* Background Video */}
        <video 
          className="position-absolute w-100 h-100" 
          style={{
            top: 0,
            left: 0,
            objectFit: 'cover',
            zIndex: -2
          }}
          autoPlay 
          muted 
          loop
          playsInline
        >
          <source src="https://cdn.pixabay.com/vimeo/516045/education-49008.mp4?width=1280&hash=dcc17e64b45b90eb7a79736dfcab8b18bfbdaf37" type="video/mp4" />
          <source src="https://sample-videos.com/zip/10/mp4/480/mp4-sample-27-education.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          <div 
            className="position-absolute w-100 h-100"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </video>
        
        {/* Video Overlay */}
        <div className="video-overlay"></div>
        
        {/* Hero Content */}
        <Container className="position-relative text-white text-center" style={{ zIndex: 2 }}>
          <div className="hero-content fade-in">
            <h1 className="display-3 fw-bold mb-4 text-shadow">
              Transform Your Learning Experience
            </h1>
            <p className="lead mb-5 fs-4">
              Join the future of education with our comprehensive online examination platform
            </p>
            <div className="d-flex justify-content-center gap-3 mb-5">
              <Button 
                as={Link} 
                to="/login" 
                className="btn-gradient px-5 py-3 fw-bold" 
                size="lg"
              >
                <FaPlay className="me-2" />
                Get Started
              </Button>
              <Button 
                as={Link} 
                to="/Signup" 
                variant="outline-light" 
                size="lg" 
                className="px-5 py-3 fw-bold backdrop-blur"
              >
                Join Now
              </Button>
            </div>
            
            {/* Stats Row */}
            <Row className="justify-content-center mt-5">
              {stats.map((stat, index) => (
                <Col xs={6} md={3} key={index} className="text-center mb-3">
                  <div className="stat-item backdrop-blur p-3 rounded">
                    <div className="fs-1 mb-1">{stat.icon}</div>
                    <h3 className="fw-bold mb-0">{stat.number}</h3>
                    <p className="mb-0 text-light">{stat.label}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Container>
      </div>

      {/* Features Section */}
      <section className="py-5 bg-gradient-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Why Choose Our Platform?</h2>
            <p className="lead text-muted">Discover the features that make learning and testing effortless</p>
          </div>
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col lg={3} md={6} key={index} className="mb-4">
                <Card className={`h-100 border-0 shadow-hover feature-card border-${feature.color}`}>
                  <Card.Body className="text-center p-4">
                    <div className="feature-icon-wrapper mb-3">
                      {feature.icon}
                    </div>
                    <h4 className="fw-bold mb-3">{feature.title}</h4>
                    <p className="text-muted">{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h2 className="mb-4">How It Works</h2>
              <ListGroup variant="flush">
                <ListGroup.Item className="border-0 py-3">
                  <h5 className="fw-bold">1. Create an Account</h5>
                  <p>Register as a student or teacher to get started</p>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 py-3">
                  <h5 className="fw-bold">2. Access Exams</h5>
                  <p>Browse available exams or create new ones</p>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 py-3">
                  <h5 className="fw-bold">3. Take Exams</h5>
                  <p>Complete exams within the time limit</p>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 py-3">
                  <h5 className="fw-bold">4. View Results</h5>
                  <p>Get instant feedback and performance analysis</p>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={6}>
              <img 
                src="https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Exam process" 
                className="img-fluid rounded shadow"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-5 gradient-primary text-white position-relative">
        <Container className="text-center position-relative" style={{ zIndex: 2 }}>
          <h2 className="display-5 fw-bold mb-4">Ready to Transform Your Future?</h2>
          <p className="lead mb-5 fs-5">Join thousands of students and educators revolutionizing education</p>
          <div className="d-flex justify-content-center gap-3">
            <Button 
              as={Link} 
              to="/Signup" 
              variant="light" 
              size="lg" 
              className="px-5 py-3 fw-bold shadow-lg"
            >
              Start Your Journey
            </Button>
            <Button 
              as={Link} 
              to="/about" 
              variant="outline-light" 
              size="lg" 
              className="px-5 py-3 fw-bold"
            >
              Learn More
            </Button>
          </div>
        </Container>
        {/* Floating elements for visual appeal */}
        <div className="floating-elements">
          <div className="floating-element floating-element-1"></div>
          <div className="floating-element floating-element-2"></div>
          <div className="floating-element floating-element-3"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;