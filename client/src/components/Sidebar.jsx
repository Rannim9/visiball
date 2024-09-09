import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css';
import '../App.css';

const Sidebar = ({ children, userProp }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState({});
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [openSubmenus, setOpenSubmenus] = useState({});

    useEffect(() => {
        setUser(JSON.parse(userProp));
        console.log('user from sidebar ::', user.value);
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const toggleSubmenu = (index) => {
        setOpenSubmenus(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    const userMenu = [
        { path: "/Dashboard", name: "Accueil" },
        { path: "/Contrat", name: "Gérer mes contrats" },
        { path: "/Facture", name: "Mes Factures" },
        { path: "/Devis", name: "Ajouter un service" },
        {
            name: "Assistance",
            submenu: [
                { path: "/Assistance", name: "Nouvelle demande d'assistance" },
                { path: "/Suivie", name: "Suivre mes demandes" }
            ]
        },
        { path: "/Réclamation", name: "Réclamation" },
        { path: "/Parrainage", name: "Parrainage" },
        { path: "/Avis", name: "Avis" }
    ];

    const adminMenu = [
        { path: "/dashboard", name: "Accueil" },
        { path: "/utilisateurs", name: "Utilisateurs" },
<<<<<<< Updated upstream
        { path: "/contrats", name: "Gestion des contrats" },
        { path: "/Factures", name: "Gestion des factures" },
        { path: "/Réclamations", name: "Retours & Reclamations" },
        { path: "/Parrainages", name: "Demandes des Parrainages" },
        { path: "/services", name: "Services" },
=======
        { path: "/Reclamations", name: "Retours & Reclamations" },
        { path: "/factures", name: "Gestion des factures" },
        { path: "/Parrainages", name: "Demande des parrainages" },
        { path: "/contrats", name: "Gestion des contrats" },
        { path: "/services", name: "Demande des devis" },
>>>>>>> Stashed changes
        { path: "/assistances", name: "Demande d'assistances" }
    ];

    return (
        <Container fluid className="p-0">
            <Row className="g-0">
                {isMobile && (
                    <Col xs={12} className="text-right">
                        <Button onClick={toggleSidebar} className="menu-button p-2">
                            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
                        </Button>
                    </Col>
                )}
                {isMobile ? (
                    <div className={`offcanvas offcanvas-start ${isOpen ? 'show' : ''}`} tabIndex="-1" id="sidebar">
                        <div className="offcanvas-header">
                            <Button type="button" className="btn-close" onClick={toggleSidebar} aria-label="Close"></Button>
                        </div>
                        <div className="offcanvas-body">
                            {user?.role}
                            {user?.role === 'admin' && adminMenu.map((item, index) => item.submenu ? (
                                <div key={index}>
                                    <div className="link" onClick={() => toggleSubmenu(index)}>
                                        {item.name}
                                    </div>
                                    {openSubmenus[index] && (
                                        <div className="submenu">
                                            {item.submenu.map((subItem, subIndex) => (
                                                <NavLink to={subItem.path} key={subIndex} className="sublink" onClick={toggleSidebar}>
                                                    {subItem.name}
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <NavLink to={item.path} key={index} className="link" onClick={toggleSidebar}>
                                    {item.name}
                                </NavLink>
                            ))}
                            <div className="social-icons mt-3">
                                <a href="https://www.facebook.com/visiball360" target="_blank" rel="noopener noreferrer" className="me-3">
                                    <FontAwesomeIcon icon={faFacebook} size="lg" />
                                </a>
                                <a href="https://www.instagram.com/visiball360/" target="_blank" rel="noopener noreferrer" className="me-3">
                                    <FontAwesomeIcon icon={faInstagram} size="lg" />
                                </a>
                                <a href="https://www.linkedin.com/company/visiball360/?originalSubdomain=fr" target="_blank" rel="noopener noreferrer">
                                    <FontAwesomeIcon icon={faLinkedin} size="lg" />
                                </a>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Col xs={2} className="sidebar open">
                        <div className="menu-container">
                            {(user?.role === 'client') && userMenu.map((item, index) => item.submenu ? (
                                <div key={index}>
                                    <div className="link" onClick={() => toggleSubmenu(index)}>
                                        {item.name}
                                    </div>
                                    {openSubmenus[index] && (
                                        <div className="submenu">
                                            {item.submenu.map((subItem, subIndex) => (
                                                <NavLink to={subItem.path} key={subIndex} className="sublink">
                                                    {subItem.name}
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <NavLink to={item.path} key={index} className="link">
                                    {item.name}
                                </NavLink>
                            ))}

                            {(user?.role === 'admin') && adminMenu.map((item, index) => item.submenu ? (
                                <div key={index}>
                                    <div className="link" onClick={() => toggleSubmenu(index)}>
                                        {item.name}
                                    </div>
                                    {openSubmenus[index] && (
                                        <div className="submenu">
                                            {item.submenu.map((subItem, subIndex) => (
                                                <NavLink to={subItem.path} key={subIndex} className="sublink">
                                                    {subItem.name}
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <NavLink to={item.path} key={index} className="link">
                                    {item.name}
                                </NavLink>
                            ))}
                        </div>
                    </Col>
                )}
                <Col md={isOpen ? 9 : 12}>
                    <div className="main-content">
                        {children}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Sidebar;
