import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Card, Spinner, Modal, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

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

  const columns = [ 
    {
        dataField: 'numeroFacture',
        text: 'Numero facture',
        headerStyle: { textAlign: 'center' } 
    }, 
    {
        dataField: 'userId',
        text: 'Nom client',
        headerStyle: { textAlign: 'center' },
        formatter: (row) => (
          <div class="d-flex flex-column">
            <span>{row.name}</span>              
          </div>

      ), 
    }, 
    {
        dataField: 'userId',
        text: 'Email client',
        headerStyle: { textAlign: 'center' },
        formatter: (row) => (
          <div class="d-flex flex-column">
            <span>{row.email}</span>              
          </div>

      ), 
    },
    {
      dataField: 'montantTH',
      text: 'Montant',
      headerStyle: { textAlign: 'center' } 
  },
    {
        dataField: 'statut',
        text: 'Status',
        formatter: (row) => (
            <div class="d-flex justify-content-center">
                <i
                className="bi bi-dot"
                style={{
                    color: row === "non_payee" ?  'grey' : 'green',
                    fontSize: '2.5em'
                }}
            ></i>
            <span>{row === "non_payee" ? "Non Payée":"Payée"}</span>              
            </div>

        ),
        headerStyle: { textAlign: 'center' } 
    },
    // {
    //     text: 'Action',
    //     formatter: (cell, row) => (
    //     <div className="d-flex gap-2">
    //         <button type="button" className="btn btn-primary btn-sm" onClick={() => {
    //             setSelectedUser(row);
    //             setShowEditModal(true);
    //         }}>
    //             <span className="bi bi-pencil-fill"></span>
    //         </button>

    //         <button type="button" className="btn btn-danger btn-sm" disabled={row.role === "admin"} onClick={() => {
    //             setSelectedUser(row);
    //             setShowConfirmDelete(true);
    //         }}>
    //             <span className="bi bi-trash-fill"></span>
    //         </button>
    //     </div>
    //     ),
    //     headerStyle: { textAlign: 'center' } 
    // }
];

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


  const { SearchBar } = Search;
  return (
    <Container className="mt-5 bg-light rounded-2 p-4">
      <Card className="shadow-lg p-4 mb-5 bg-white rounded">
        <Card.Body>
          <h2 className="text-center mb-4">Gestion des Factures</h2>
          <div className="text-end mb-3">
            <Button variant="primary" onClick={handleShowAddModal}>Ajouter une Facture</Button> {/* Le bouton est maintenant bleu */}
          </div>
          {factures && factures.length > 0 ? (
                            <ToolkitProvider keyField="_id" data={factures} columns={columns} search>
                            {(props) => (
                            <div>
                                <SearchBar {...props.searchProps} placeholder="Chercher..." className="mb-3" />
                                <BootstrapTable
                                {...props.baseProps}
                                pagination={paginationFactory()}
                                filter={filterFactory()}
                                striped
                                bordered={false}
                                wrapperClasses="table-responsive"
                                />
                            </div>
                            )}
                        </ToolkitProvider>
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
