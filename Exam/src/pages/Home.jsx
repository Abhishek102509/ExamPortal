import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaUserGraduate, FaClipboardCheck, FaChartLine, FaBookOpen } from 'react-icons/fa';

const DEFAULT_BACKGROUND = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

function Home() {
  const [backgroundUrl, setBackgroundUrl] = useState(DEFAULT_BACKGROUND);

  useEffect(function() {
    // Fetch a random education-related background
    fetch("https://api.unsplash.com/photos/random?query=education&client_id=YOUR_UNSPLASH_ACCESS_KEY")
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data && data.urls && data.urls.regular) {
          setBackgroundUrl(data.urls.regular);
        }
      })
      .catch(function() {
        setBackgroundUrl(DEFAULT_BACKGROUND); // fallback
      });
  }, []);

  const features = [
    {
      icon: <FaClipboardCheck size={40} className="text-primary mb-3" />,
      title: "Online Exams",
      description: "Take exams anytime, anywhere with our secure online platform."
    },
    {
      icon: <FaChartLine size={40} className="text-primary mb-3" />,
      title: "Instant Results",
      description: "Get your results immediately after submission with detailed analytics."
    },
    {
      icon: <FaBookOpen size={40} className="text-primary mb-3" />,
      title: "Study Materials",
      description: "Access curated study materials and previous question papers."
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div 
        className="hero-section position-relative min-vh-80 d-flex align-items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <Container className="position-relative text-white text-center">
          <h1 className="display-4 fw-bold mb-4">Welcome to Exam Portal</h1>
          <p className="lead mb-5">
            A comprehensive platform for students and educators to conduct and manage examinations online
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/login" variant="primary" size="lg" className="px-4">
              Login
            </Button>
            <Button as={Link} to="/Signup" variant="outline-light" size="lg" className="px-4">
              Register
            </Button>
          </div>
        </Container>
      </div>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">Key Features</h2>
          <Row>
            {features.map((feature, index) => (
              <Col md={4} key={index} className="mb-4">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    {feature.icon}
                    <h3>{feature.title}</h3>
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
      <section className="py-5 bg-primary text-white">
        <Container className="text-center">
          <h2 className="mb-4">Ready to Get Started?</h2>
          <p className="lead mb-5">Join thousands of students and educators using our platform</p>
          <Button as={Link} to="/register" variant="light" size="lg" className="px-5">
            Sign Up Now
          </Button>
        </Container>
      </section>
    </div>
  );
};

export default Home;