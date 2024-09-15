import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Card, Spinner, Modal, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const FacturesAdmin = () => {
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // Modal pour l'ajout d'une facture
  const [newFacture, setNewFacture] = useState({
    numeroFacture: '',
    nomClient: '',
    emailClient: '',
    dateEdition: '',
    montantTH: '',
    statut: 'non-payée',
  });

  useEffect(() => {
    const fetchFactures = async () => {
      try {
        const response = await fetch('http://localhost:3000/contactmsyt/factures', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des factures');
        }

        const data = await response.json();
        setFactures(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFactures();
  }, []);

  const handleShowAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewFacture({
      numeroFacture: '',
      nomClient: '',
      emailClient: '',
      dateEdition: '',
      montantTH: '',
      statut: 'non-payée',
    });
  };

  const handleAddFacture = async () => {
    try {
      const response = await fetch(`http://localhost:3000/contactmsyt/factures`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFacture),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de la facture');
      }

      const addedFacture = await response.json();
      setFactures([...factures, addedFacture]);
      handleCloseAddModal();
    } catch (err) {
      setError(err.message);
    }
  };

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
          <h2 className="text-center mb-4">Gestion des Factures</h2>
          <div className="text-end mb-3">
            <Button variant="primary" onClick={handleShowAddModal}>Ajouter une Facture</Button> {/* Le bouton est maintenant bleu */}
          </div>
          {factures && factures.length > 0 ? (
            <Table striped bordered hover responsive className="mt-4" style={{ tableLayout: 'auto' }}>
              <thead>
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
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{facture.nomClient}</td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{facture.emailClient}</td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{facture.numeroFacture}</td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{new Date(facture.dateEdition).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{facture.montantTH} dt</td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{facture.statut}</td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      <Button variant="primary" size="sm">Modifier</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info" className="text-center">Aucune facture trouvée.</Alert>
          )}
        </Card.Body>
      </Card>

      {/* Modal pour ajouter une facture */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une Facture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column sm="4">Numéro de Facture</Form.Label>
              <Col sm="8">
                <Form.Control
                  type="text"
                  value={newFacture.numeroFacture}
                  onChange={(e) => setNewFacture({ ...newFacture, numeroFacture: e.target.value })}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mt-3">
              <Form.Label column sm="4">Nom du Client</Form.Label>
              <Col sm="8">
                <Form.Control
                  type="text"
                  value={newFacture.nomClient}
                  onChange={(e) => setNewFacture({ ...newFacture, nomClient: e.target.value })}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mt-3">
              <Form.Label column sm="4">Email du Client</Form.Label>
              <Col sm="8">
                <Form.Control
                  type="email"
                  value={newFacture.emailClient}
                  onChange={(e) => setNewFacture({ ...newFacture, emailClient: e.target.value })}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mt-3">
              <Form.Label column sm="4">Date d'Émission</Form.Label>
              <Col sm="8">
                <Form.Control
                  type="date"
                  value={newFacture.dateEdition}
                  onChange={(e) => setNewFacture({ ...newFacture, dateEdition: e.target.value })}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mt-3">
              <Form.Label column sm="4">Montant</Form.Label>
              <Col sm="8">
                <Form.Control
                  type="number"
                  value={newFacture.montantTH}
                  onChange={(e) => setNewFacture({ ...newFacture, montantTH: e.target.value })}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mt-3">
              <Form.Label column sm="4">Statut</Form.Label>
              <Col sm="8">
                <Form.Control
                  as="select"
                  value={newFacture.statut}
                  onChange={(e) => setNewFacture({ ...newFacture, statut: e.target.value })}
                >
                  <option value="payée">Payée</option>
                  <option value="non-payée">Non Payée</option>
                </Form.Control>
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleAddFacture}>
            Ajouter
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FacturesAdmin;
