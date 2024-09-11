import React, { useEffect, useState } from 'react';
import { Container, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import './style.css';
import ContratComponent from '../Contrat';

const Contrats = () => {
  const [contracts, setContracts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const fetchContracts = async () => {
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
        setContracts(data);
      } else {
        const errorData = await response.json();
        console.log(errorData.message || 'Échec de la connexion.');
      }
    } catch (err) {
      console.error('Error:', err);
      console.log('Erreur réseau ou serveur injoignable.');
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleShowModal = (contract) => {
    setSelectedContract(contract);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedContract(null);
  };

  const { SearchBar } = Search;

  const columns = [
    {
      dataField: 'nomreferent',
      text: 'Nom Referent',
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
          <button type="button" className="btn btn-danger btn-sm">
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
      </div>
      <ToolkitProvider keyField="_id" data={contracts} columns={columns} search>
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
          <Modal.Title>Edit Contract</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedContract && <ContratComponent data={selectedContract} role={role} onClose={handleCloseModal} />}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Contrats;
