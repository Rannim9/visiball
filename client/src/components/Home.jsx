import React from 'react';
import Navbar from './Navbar';
import { Container, Row, Col } from 'react-bootstrap';
import Login from './Login'; 
import './Home.css';

const Home = () => {
  return (
    <>
      <Navbar />
      <Container fluid className='p-4'>
        <Row className="justify-content-center align-items-start">
          <Col md={4} className='home-container mt-4'>
            <div className='home'>
              <div className='home-title'>
                <h2>Votre Accès Privé à l'Excellence avec GetVisiball360</h2>
                <div className='home-description'>
                  <p>Découvrez une multitude de services à portée de clic. 
                  Notre plateforme est conçue pour vous offrir une expérience complète et personnalisée, 
                  répondant à tous vos besoins avec efficacité et simplicité.</p>
                 <p>Votre satisfaction est notre priorité numéro un.</p>
                 </div>
              </div>
            </div>
          </Col>
          <Col md={7} className='d-flex justify-content-center align-items-start mt-4'>
            <div className='login-wrapper'>
              <Login />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
