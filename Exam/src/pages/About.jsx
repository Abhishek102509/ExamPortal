import React from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { BookOpen, CheckCircle, Shield, Users, BarChart3 } from 'lucide-react';

function About() {
  const features = [
    { icon: BookOpen, text: 'Conduct online exams with ease' },
    { icon: BarChart3, text: 'Instant results and analytics' },
    { icon: Shield, text: 'Secure and reliable platform' },
    { icon: Users, text: 'Student-teacher interaction and support' }
  ];

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-lg">
            <Card.Header className="gradient-primary text-white text-center py-4">
              <div className="d-flex justify-content-center align-items-center mb-2">
                <BookOpen size={40} />
              </div>
              <h2 className="h1 fw-bold mb-0">About Us</h2>
            </Card.Header>
            <Card.Body className="p-5">
              <p className="fs-5 text-muted mb-4">
                Exam Portal is a modern online examination platform designed to simplify the process of conducting, taking, and managing exams for both students and teachers. Our mission is to provide a seamless, secure, and user-friendly experience for all users.
              </p>
              
              <h4 className="fw-bold mb-3 text-primary">Key Features</h4>
              <ListGroup variant="flush">
                {features.map(function(feature, index) {
                  const Icon = feature.icon;
                  return (
                    <ListGroup.Item key={index} className="d-flex align-items-center border-0 px-0 py-3">
                      <div className="gradient-primary rounded-circle p-2 me-3">
                        <Icon className="text-white" size={20} />
                      </div>
                      <span className="fs-6">{feature.text}</span>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
