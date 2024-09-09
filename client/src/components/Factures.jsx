        import React, { useState, useEffect } from 'react';
        import { Container, Table, Button, Alert, Card, Spinner } from 'react-bootstrap';
        import 'bootstrap/dist/css/bootstrap.min.css';
        
        const FacturesAdmin = () => {
          const [factures, setFactures] = useState([]);
          const [loading, setLoading] = useState(true);
          const [error, setError] = useState(null);
        
          useEffect(() => {
            const fetchFactures = async () => {
              try {
                const response = await fetch('http://localhost:3000/contactmsyt/factures', {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                  }
                });
        
                if (!response.ok) {
                  throw new Error('Erreur lors de la récupération des factures');
                }
        
                const data = await response.json();
                setFactures(data.data);
                setLoading(false);
              } catch (err) {
                setError(err.message);
                setLoading(false);
              }
            };
        
            fetchFactures();
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
                      <h2 className="text-center mb-4 ">Gestion des Factures</h2>
                      {factures && factures.length > 0 ? (
                          <Table striped bordered hover responsive className="mt-4" style={{ tableLayout: 'auto' }}>
                              <thead >
                                  <tr>
                      <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Numéro de Facture</th>
                      <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Nom du Client</th>
                      <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Email du Client</th>
                      <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Date d'Émission</th>
                      <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Montant</th>
                      <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Statut</th>
                      <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {factures.map((facture) => (
                      <tr key={facture._id}>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{facture.numero}</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{facture.nomClient}</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{facture.emailClient}</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{new Date(facture.dateEmission).toLocaleDateString()}</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{facture.montant} €</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{facture.statut}</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                          <Button variant="primary" size="sm" onClick={() => handleShowModal(facture)}>Modifier</Button>
                        </td>
                        </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <Alert variant="info" className="text-center">Aucune factures trouvée.</Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Container>
            );
        };
        
        export default FacturesAdmin;
        