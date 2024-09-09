import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Card, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Réclamation.css'; 

const ReclamationsAdmin = () => {
    const [reclamations, setReclamations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);       

    useEffect(() => {
        const fetchReclamation = async () => {
            try {
                const response = await fetch('http://localhost:3000/contactmsyt/reclamations', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
    
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des réclamations');
                }
    
                const data = await response.json();
                setReclamations(data.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
    
        fetchReclamation();
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
        <Container className="mt-5 bg-light rounded-2 p-4">
            <Card className="shadow-lg p-4 mb-5 bg-white rounded">
                <Card.Body>
                    <h2 className="text-center mb-4 ">Gestion des Réclamations</h2>
                    {reclamations.length > 0 ? (
                        <Table striped bordered hover responsive className="mt-4" style={{ tableLayout: 'auto' }}>
                            <thead >
                                <tr>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Nom du Client</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Email du Client</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Objet</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Description</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Service Concerné</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reclamations.map((reclamation) => (
                                    <tr key={reclamation._id}>
                                        <td style={{ height: '40px', lineHeight: '40px', textAlign: 'center' }}>{reclamation.nomClient || 'Nom non disponible'}</td>
                                        <td style={{ height: '40px', lineHeight: '40px', textAlign: 'center' }}>{reclamation.emailClient || 'Email non disponible'}</td>
                                        <td style={{ height: '40px', lineHeight: '40px', textAlign: 'center' }}>{reclamation.objet}</td>
                                        <td style={{ height: '40px', lineHeight: '40px', textAlign: 'center' }}>{reclamation.description}</td>
                                        <td style={{ height: '40px', lineHeight: '40px', textAlign: 'center' }}>{reclamation.serviceConcerne}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <Alert variant="info" className="text-center">Aucune demande de réclamation trouvée.</Alert>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ReclamationsAdmin;
