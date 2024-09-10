import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Card, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Parrainage.css';

const ParrainagesAdmin = () => {  
    const [parrainages, setParrainages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchParrainages = async () => {
            try {
                const response = await fetch('http://localhost:3000/contactmsyt/parrainages', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des parrainages');
                }

                const data = await response.json();
                setParrainages(data.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchParrainages();
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
        <Container className="mt- bg-light rounded-2 p-2">
            <Card className="shadow-lg p-4 mb-5 bg-white rounded">
            <Card.Body>
                    <h1 className="text-center mb-5 ">Gestion des Parrainages</h1>
                    {parrainages.length > 0 ? (
                        <Table striped bordered hover responsive className="mt-4" style={{ tableLayout: 'auto' }}>

                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Nom du Client</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Email du Client</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Nom du Bénéficiaire</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Email du Bénéficiaire</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Téléphone du Bénéficiaire</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Service à parrainer</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Date de Demande</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parrainages.map((parrainage) => (
                                    <tr key={parrainage._id}>
                                        <td style={{ height: '40px', lineHeight: '40px', textAlign: 'center' }}>{parrainage.nomClient || 'Nom non disponible'}</td>
                                        <td style={{ height: '40px', lineHeight: '40px', textAlign: 'center' }}>{parrainage.emailClient || 'Email non disponible'}</td>
                                        <td style={{ height: '40px', lineHeight: '40px', textAlign: 'center' }}>{parrainage.nomBeneficiaire}</td>
                                        <td style={{ height: '40px', lineHeight: '40px', textAlign: 'center' }}>{parrainage.emailBeneficiaire}</td>
                                        <td style={{ height: '40px', lineHeight: '40px', textAlign: 'center' }}>{parrainage.telephoneBeneficiaire}</td>
                                        <td style={{ height: '40px', lineHeight: '40px', textAlign: 'center' }}>{parrainage.serviceAParrainer}</td>
                                        <td style={{ height: '40px', lineHeight: '40px', textAlign: 'center' }}>{new Date(parrainage.requestDate).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <Alert variant="info" className="text-center">Aucune demande de parrainage trouvée.</Alert>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ParrainagesAdmin;
