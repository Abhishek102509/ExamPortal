import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from 'react-bootstrap';

const DEFAULT_VIDEO =
  "https://apivideo-demo.s3.amazonaws.com/hello.mp4";

function Home() {
  const [videoUrl, setVideoUrl] = useState(DEFAULT_VIDEO);

  useEffect(function() {
    // Fetch a random video from Coverr API
    fetch("https://api.coverr.co/videos/random?category=nature")
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data && data.videos && data.videos.length > 0) {
          setVideoUrl(data.videos[0].video_url);
        }
      })
      .catch(function() {
        setVideoUrl(DEFAULT_VIDEO); // fallback
      });
  }, []);

  return (
    <Container fluid className="position-relative min-vh-80">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ objectFit: "cover", zIndex: 0, filter: "brightness(0.7)" }}
        src={videoUrl}
      />
      <div className="video-overlay" />

      {/* Content */}
      <Row className="justify-content-center align-items-center min-vh-80 text-center position-relative" style={{ zIndex: 2 }}>
        <Col md={8} lg={6} className="">
          <Card className="backdrop-blur shadow-lg">
            <Card.Body className="p-5">
              <h1 className="display-5 fw-bold text-dark mb-4">
                Welcome to Exam Portal
              </h1>
              <p className="lead text-secondary mb-5">
                Your one-stop solution for online exams, results, and student-teacher
                interaction. Get started by logging in or signing up!
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
