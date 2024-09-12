import React, { useEffect, useState } from 'react';
import { Container, Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import './style.css';
import ConfirmDeleteModal from '../ConfirmDelete'; 
import AddContratModal from './addContrat';
import ContratComponent from '../Contrat';

const Contrats = () => {
  const [contrats, setContrats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedContrat, setSelectedContrat] = useState(null);
  const token = localStorage.getItem('token');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const role = localStorage.getItem('role');
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchContrats = async () => {
    try {
      const response = await fetch('http://localhost:3000/contactmsyt/contrat/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setContrats(data);
      } else {
        const errorData = await response.json();
        console.log(errorData.message || 'Échec de la connexion.');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    fetchContrats();
  }, []);

  const handleSaveNewContrat = async (newContrat) => {
    try {
      const response = await fetch('http://localhost:3000/contactmsyt/contrat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newContrat),
      });

      if (response.ok) {
        const savedContrat = await response.json();
        setContrats((prevContrats) => [...prevContrats, savedContrat]);
        setShowAddModal(false);
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de l\'ajout du contrat:', errorData.message);
      }
    } catch (err) {
      console.error('Error adding contrat:', err);
    }
  };

  const handleDeleteContrat = async () => {
    try {
      const response = await fetch(`http://localhost:3000/contactmsyt/contrat/${selectedContrat._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setContrats(contrats.filter((contrat) => contrat._id !== selectedContrat._id));
        setShowConfirmDelete(false);
        console.log("Contrat supprimé avec succès");
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de la suppression du contrat:', errorData.message);
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    }
  };

  const handleShowModal = (contrat) => {
    setSelectedContrat(contrat);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedContrat(null);
  };

  const handleShowAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const { SearchBar } = Search;

  const columns = [
    {
      dataField: 'nomreferent',
      text: 'Nom Référent',
      headerStyle: { textAlign: 'center' },
    },
    {
      dataField: 'email',
      text: 'Email',
      headerStyle: { textAlign: 'center' },
    },
    {
      text: 'Action',
      formatter: (cell, row) => (
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-primary btn-sm" onClick={() => handleShowModal(row)}>
            <span className="bi bi-pencil-fill"></span>
          </button>
          <button type="button" className="btn btn-danger btn-sm" onClick={() => {
            setSelectedContrat(row);
            setShowConfirmDelete(true); // Ouvre la fenêtre de confirmation
          }}>
            <span className="bi bi-trash-fill"></span>
          </button>
        </div>
      ),
      headerStyle: { textAlign: 'center' },
    },
  ];

  return (
    <Container className="mt-5 bg-light rounded-2">
      <div className="d-flex p-2 bd-highlight justify-content-between align-items-center bg-red">
        <h2 className="mb-4">Liste des contrats</h2>
        <Button variant="primary" onClick={handleShowAddModal}>
          Ajouter Contrat
        </Button>
      </div>
      <ToolkitProvider keyField="_id" data={contrats} columns={columns} search>
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
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Contrat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedContrat && <ContratComponent data={selectedContrat} role={role} onClose={handleCloseModal} />}
        </Modal.Body>
      </Modal>

      <AddContratModal
        show={showAddModal}
        handleClose={handleCloseAddModal}
        handleSave={handleSaveNewContrat}
      />

      <ConfirmDeleteModal
        show={showConfirmDelete}
        handleClose={() => setShowConfirmDelete(false)}
        handleConfirm={handleDeleteContrat}
      />
    </Container>
  );
};

export default Contrats;
