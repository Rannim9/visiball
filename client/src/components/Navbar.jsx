import React, { useContext, useState } from 'react';
import { Navbar, Nav, Container, Modal, Button, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import '../App.css';

const MyNavbar = () => {
  const userName = localStorage.getItem('name');
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    setUser(null); 
    localStorage.removeItem('name'); 
    localStorage.removeItem('token'); 
    navigate('/'); 
    setShowLogoutModal(false);
};

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  return (
    <>
      <Navbar expand="lg" className="mb-3">
        <Container fluid>
          <Navbar.Brand as={Link} to="/Dashboard" className="mr-auto">
            <img src="https://visiball360.com/wp-content/uploads/2023/05/Logo-visiball360-agence-web-blanc.svg" alt="Logo" height="40" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto align-items-center social-icons">
          <Nav.Link href="https://www.facebook.com/visiball360" target="_blank" className="text-white">
                <FontAwesomeIcon icon={faFacebook} style={{ fontSize: '2rem' }} />
              </Nav.Link>
              <Nav.Link href="https://www.instagram.com/visiball360/" target="_blank" className="text-white">
                <FontAwesomeIcon icon={faInstagram} style={{ fontSize: '2rem' }} />
              </Nav.Link>
              <Nav.Link href="https://fr.linkedin.com/company/visiball360" target="_blank" className="text-white">
                <FontAwesomeIcon icon={faLinkedin} style={{ fontSize: '2rem' }} />
              </Nav.Link>
            </Nav>
              <NavDropdown.Divider />
            <Nav className="ml-auto align-items-center">
              {userName && (
                <div className="welcome-message d-flex align-items-center">
                  <p className="mb-0 mr-3 text-white">Bienvenue, {userName}</p>
                  {user && (
                    <FontAwesomeIcon icon={faSignOutAlt} style={{ color: 'white', cursor: 'pointer' }} onClick={handleLogoutClick} />
                  )}
                </div>
              )}
              <FontAwesomeIcon icon={faSignOutAlt} style={{ fontSize: '1.5rem', color: 'white', cursor: 'pointer' }} onClick={handleLogoutClick} />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showLogoutModal} onHide={handleLogoutCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de déconnexion</Modal.Title>
=        </Modal.Header>
        <Modal.Body>Êtes-vous sûr de vouloir vous déconnecter ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleLogoutCancel}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleLogoutConfirm}>
            Confirmer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MyNavbar;


