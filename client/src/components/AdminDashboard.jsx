import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDashboard.css'; 
import 'animate.css';

const AdminDashboard = () => {
    const [userCount, setUserCount] = useState(null);
    const [assistanceCount, setAssistanceCount] = useState(0); 
    const [reclamationCount, setReclamationCount] = useState(0); 
    const [parrainageCount, setParrainageCount] = useState(0); 

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');

                const userResponse = await fetch('http://localhost:3000/contactmsyt/users/count', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const userData = await userResponse.json();

                const assistanceResponse = await fetch('http://localhost:3000/contactmsyt/assistances/count', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const assistanceData = await assistanceResponse.json();

                const reclamationResponse = await fetch('http://localhost:3000/contactmsyt/reclamations/count', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const reclamationData = await reclamationResponse.json();

                const parrainageResponse = await fetch('http://localhost:3000/contactmsyt/parrainages/count', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const parrainageData = await parrainageResponse.json();

                setUserCount(userData.count);
                setAssistanceCount(assistanceData.count);
                setReclamationCount(reclamationData.count); 
                setParrainageCount(parrainageData.count); 

                setLoading(false);
            } catch (err) {
                setError('Erreur lors de la récupération des données');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (error) {
        return <Alert variant="danger" className="mt-4">{error}</Alert>;
    }

    return (
        <Container fluid className="mt-3 dashboard-container">
            <Row className="mb-4">
               
            </Row>
            <Row className="g-4 justify-content-center">
                <Col xs={12} sm={6} md={6} lg={5} className="d-flex">
                    <Card className="shadow-sm square-card animate__animated animate__fadeInUp flex-fill">
                        <Card.Body className="text-center d-flex flex-column justify-content-center">
                            <Card.Title className="fw-bold">Utilisateurs</Card.Title>
                            <Card.Text>
                                {userCount > 0 
                                    ? `Il y a actuellement ${userCount} utilisateurs inscrits.`
                                    : "Aucun utilisateur inscrit pour le moment."}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} sm={6} md={6} lg={5} className="d-flex">
                    <Card className="shadow-sm square-card animate__animated animate__fadeInUp flex-fill">
                        <Card.Body className="text-center d-flex flex-column justify-content-center">
                            <Card.Title className="fw-bold">Assistances en attente</Card.Title>
                            <Card.Text>
                                {assistanceCount > 0 
                                    ? `Il y a ${assistanceCount} assistances en attente de traitement.`
                                    : "Aucune assistance en attente."}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
              
                <Col xs={12} sm={6} md={6} lg={5} className="d-flex">
                    <Card className="shadow-sm square-card animate__animated animate__fadeInUp flex-fill">
                        <Card.Body className="text-center d-flex flex-column justify-content-center">
                            <Card.Title className="fw-bold">Réclamations en attente</Card.Title>
                            <Card.Text>
                                {reclamationCount > 0 
                                    ? `Il y a ${reclamationCount} réclamations en attente.`
                                    : "Aucune réclamation en attente."}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} sm={6} md={6} lg={5} className="d-flex">
                    <Card className="shadow-sm square-card animate__animated animate__fadeInUp flex-fill">
                        <Card.Body className="text-center d-flex flex-column justify-content-center">
                            <Card.Title className="fw-bold">Parrainages en attente</Card.Title>
                            <Card.Text>
                                {parrainageCount > 0 
                                    ? `Il y a ${parrainageCount} demandes de parrainage en attente.`
                                    : "Aucune demande de parrainage en attente."}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;
