import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Send, Mail, MessageCircle } from 'lucide-react';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={6}>
          <Card className="shadow-lg">
            <Card.Header className="gradient-primary text-white text-center py-4">
              <div className="d-flex justify-content-center align-items-center mb-2">
                <MessageCircle size={40} />
              </div>
              <h2 className="h1 fw-bold mb-0">Contact Us</h2>
            </Card.Header>
            <Card.Body className="p-5">
              {submitted ? (
                <div className="text-success text-center fw-semibold fs-4">Thank you for contacting us! We'll get back to you soon.</div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="name" 
                      value={form.name} 
                      onChange={handleChange} 
                      placeholder="Enter your name" 
                      required 
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      name="email" 
                      value={form.email} 
                      onChange={handleChange} 
                      placeholder="Enter your email" 
                      required 
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-medium">Message</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      name="message" 
                      value={form.message} 
                      onChange={handleChange} 
                      rows={4} 
                      placeholder="Type your message here..." 
                      required 
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="btn-gradient w-100 fw-semibold">
                    <Send size={16} className="me-2" />
                    Send Message
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
