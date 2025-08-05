// import React from 'react';
// import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
// import { BookOpen, CheckCircle, Shield, Users, BarChart3 } from 'lucide-react';

// function About() {
//   const features = [
//     { icon: BookOpen, text: 'Conduct online exams with ease' },
//     { icon: BarChart3, text: 'Instant results and analytics' },
//     { icon: Shield, text: 'Secure and reliable platform' },
//     { icon: Users, text: 'Student-teacher interaction and support' }
//   ];

//   return (
//     <Container className="py-5">
//       <Row className="justify-content-center">
//         <Col lg={8}>
//           <Card className="shadow-lg">
//             <Card.Header className="gradient-primary text-white text-center py-4">
//               <div className="d-flex justify-content-center align-items-center mb-2">
//                 <BookOpen size={40} />
//               </div>
//               <h2 className="h1 fw-bold mb-0">About Us</h2>
//             </Card.Header>
//             <Card.Body className="p-5">
//               <p className="fs-5 text-muted mb-4">
//                 Exam Portal is a modern online examination platform designed to simplify the process of conducting, taking, and managing exams for both students and teachers. Our mission is to provide a seamless, secure, and user-friendly experience for all users.
//               </p>
              
//               <h4 className="fw-bold mb-3 text-primary">Key Features</h4>
//               <ListGroup variant="flush">
//                 {features.map(function(feature, index) {
//                   const Icon = feature.icon;
//                   return (
//                     <ListGroup.Item key={index} className="d-flex align-items-center border-0 px-0 py-3">
//                       <div className="gradient-primary rounded-circle p-2 me-3">
//                         <Icon className="text-white" size={20} />
//                       </div>
//                       <span className="fs-6">{feature.text}</span>
//                     </ListGroup.Item>
//                   );
//                 })}
//               </ListGroup>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default About;


import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaLinkedin, FaGithub, FaInstagram, FaYoutube } from 'react-icons/fa';
import './AboutUs.css';
// import AbhishekImage from './Abhishek.jpg';
// import AnjaliImage from './Anjali.jpg';
// import AmanImage from './Aman.jpg';

const About = () => {
  return (
    <div className="about-us-page">
      <Container className="py-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-success mb-3">Our Team</h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '800px' }}>
            We're a passionate team dedicated to building amazing experiences. 
            Our diverse skills come together to create something truly special.
          </p>
        </div>

        <Row className="g-4 justify-content-center">
          {/* Team Member 1 */}
          <Col lg={4} md={6}>
            <Card className="team-card h-100 border-0 shadow-sm  ">
              <div className="team-img-container mx-auto mt-4">
                <Card.Img 
                  variant="top" 
                
                  // src={AbhishekImage}

                  alt="Abhishek Yadav"
                  className="rounded-circle"
                />
              </div>
              <Card.Body className="text-center">
                <Card.Title className="fw-bold fs-5 mb-1">ABHISHEK YADAV</Card.Title>
                <Card.Text className="text-secondary mb-3">BACKEND DEVELOPER</Card.Text>
                <div className="social-links d-flex justify-content-center gap-3">


                  <a href="https://www.linkedin.com/in/abhishek-yadav-79a930234" className="text-primary"  target="_blank" rel="noopener noreferrer" ><FaLinkedin size={20} /></a>
                  <a href="https://github.com/Abhishek102509" target="_blank" className="text-dark"><FaGithub size={20} /></a>
                  <a href="https://www.instagram.com/itsabhi_yaduvanshi/?igsh=c2pnaDNrMWxqdDdp&utm_source=qr#"  target="_blank"  className="text-danger"><FaInstagram size={20} /></a>
                  <a href="https://www.youtube.com/@AAbhishekVlog" className="text-danger"  target="_blank" rel="noopener noreferrer" ><FaYoutube size={20} /></a>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Team Member 2 */}
          <Col lg={4} md={6}>
            <Card className="team-card h-100 border-0 shadow-sm">
              <div className="team-img-container mx-auto mt-4">
                <Card.Img 
                  variant="top" 

                //  src={AmanImage}

                  alt="Nitish Pawar"
                  className="rounded-circle"
                />
              </div>
              <Card.Body className="text-center">
                <Card.Title className="fw-bold fs-5 mb-1">Nitish Pawar</Card.Title>
                <Card.Text className="text-secondary mb-3">bl</Card.Text>
                <div className="social-links d-flex justify-content-center gap-3">
                  <a href="https://www.linkedin.com/in/aman-sharma-54875a203?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app " target="_blank" className="text-primary"><FaLinkedin size={20} /></a>
                  <a href="https://github.com/AmanSharma202" target="_blank" className="text-dark"><FaGithub size={20} /></a>
                  <a href="https://www.instagram.com/__devilscaf__jay/" target="_blank" className="text-danger"><FaInstagram size={20} /></a>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Team Member 3 */}
          <Col lg={4} md={6}>
            <Card className="team-card h-100 border-0 shadow-sm">
              <div className="team-img-container mx-auto mt-4">
                <Card.Img 
                  variant="top" 
               
                  // src={AnjaliImage}

                  alt="Himanshu"
                  className="rounded-circle"
                />
              </div>
              <Card.Body className="text-center">
                <Card.Title className="fw-bold fs-5 mb-1">Himanshu</Card.Title>
                <Card.Text className="text-secondary mb-3">Bl </Card.Text>
                <div className="social-links d-flex justify-content-center gap-3">
                  <a href="https://www.linkedin.com/in/anjali-pal-131a71149?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app " target="_blank" className="text-primary"><FaLinkedin size={20} /></a>
                  <a href="https://github.com/Anjalipal99" target="_blank" className="text-dark"><FaGithub size={20} /></a>
                  <a href="#" target="_blank"className="text-danger"><FaInstagram size={20} /></a>
                </div>
              </Card.Body>
            </Card>
          </Col>

             {/* Team Member 4 */}
          <Col lg={4} md={6}>
            <Card className="team-card h-100 border-0 shadow-sm  ">
              <div className="team-img-container mx-auto mt-4">
                <Card.Img 
                  variant="top" 
                
                  // src={AbhishekImage}

                  alt="Sakshi Todmal"
                  className="rounded-circle"
                />
              </div>
              <Card.Body className="text-center">
                <Card.Title className="fw-bold fs-5 mb-1">Sakshi Todmal</Card.Title>
                {/* <Card.Text className="text-secondary mb-3">FRONTEND DEVELOPER</Card.Text> */}
                <div className="social-links d-flex justify-content-center gap-3">


                  <a href="https://www.linkedin.com/in/abhishek-yadav-79a930234" className="text-primary"  target="_blank" rel="noopener noreferrer" ><FaLinkedin size={20} /></a>
                  <a href="https://github.com/Abhishek102509" target="_blank" className="text-dark"><FaGithub size={20} /></a>
                  <a href="https://www.instagram.com/itsabhi_yaduvanshi/?igsh=c2pnaDNrMWxqdDdp&utm_source=qr#"  target="_blank"  className="text-danger"><FaInstagram size={20} /></a>
                  <a href="https://www.youtube.com/@AAbhishekVlog" className="text-danger"  target="_blank" rel="noopener noreferrer" ><FaYoutube size={20} /></a>
                </div>
              </Card.Body>
            </Card>
          </Col>

           {/* Team Member 5 */}
          <Col lg={4} md={6}>
            <Card className="team-card h-100 border-0 shadow-sm  ">
              <div className="team-img-container mx-auto mt-4">
                <Card.Img 
                  variant="top" 
                
                  // src={AbhishekImage}

                  alt="Manisha Gore"
                  className="rounded-circle"
                />
              </div>
              <Card.Body className="text-center">
                <Card.Title className="fw-bold fs-5 mb-1">Manisha Gore</Card.Title>
                {/* <Card.Text className="text-secondary mb-3">FRONTEND DEVELOPER</Card.Text> */}
                <div className="social-links d-flex justify-content-center gap-3">


                  <a href="https://www.linkedin.com/in/abhishek-yadav-79a930234" className="text-primary"  target="_blank" rel="noopener noreferrer" ><FaLinkedin size={20} /></a>
                  <a href="https://github.com/Abhishek102509" target="_blank" className="text-dark"><FaGithub size={20} /></a>
                  <a href="https://www.instagram.com/itsabhi_yaduvanshi/?igsh=c2pnaDNrMWxqdDdp&utm_source=qr#"  target="_blank"  className="text-danger"><FaInstagram size={20} /></a>
                  {/* <a href="https://www.youtube.com/@AAbhishekVlog" className="text-danger"  target="_blank" rel="noopener noreferrer" ><FaYoutube size={20} /></a> */}
                </div>
              </Card.Body>
            </Card>
          </Col>



        </Row>
      </Container>
    </div>
  );
};

export default About;