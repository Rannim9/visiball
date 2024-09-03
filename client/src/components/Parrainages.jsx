import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
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
        return <p>Chargement en cours...</p>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <Container>
            <h1 className="mt-4">Gestion des Parrainages</h1>
            {parrainages.length > 0 ? (
                <Table striped bordered hover className="mt-4">
                    <thead>
                        <tr>
                            <th>Nom du Bénéficiaire</th>
                            <th>Email du Bénéficiaire</th>
                            <th>Téléphone du Bénéficiaire</th>
                            <th>Service à parrainer</th>
                            <th>Date de Demande</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parrainages.map((parrainage) => (
                            <tr key={parrainage._id}>
                                <td>{parrainage.nomBeneficiaire}</td>
                                <td>{parrainage.emailBeneficiaire}</td>
                                <td>{parrainage.telephoneBeneficiaire}</td>
                                <td>{parrainage.serviceParraine}</td>
                                <td>{new Date(parrainage.requestDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>Aucune demande de parrainage trouvée.</p>
            )}
        </Container>
    );
};

export default ParrainagesAdmin;
