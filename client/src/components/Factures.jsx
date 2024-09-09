import React, { useEffect, useState } from 'react';
import { Container, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import FactureComponent from './Facture';

const FacturesAdmin = () => {
    const [factures, setFactures] = useState([]);
    const [showModal, setShowModal] = useState(false); 
    const [selectedFacture, setSelectedFacture] = useState(null); 
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const fetchFactures = async () => {
        try {
            const response = await fetch('http://localhost:3000/contactmsyt/factures/all', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setFactures(data);
            } else {
                const errorData = await response.json();
                console.error(errorData.message || "Échec de la récupération des factures.");
            }
        } catch (err) {
            console.error("Erreur réseau ou serveur injoignable.", err);
        }
    };

    useEffect(() => {
        fetchFactures();
    }, []);

    const handleShowModal = (facture) => {
        setSelectedFacture(facture);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedFacture(null);
    };

    const columns = [
        {
            dataField: 'numeroFacture',
            text: 'Numéro de facture',
            filter: textFilter({
                placeholder: "Chercher",
                style: { marginLeft: 5 },
            }),
            headerStyle: { textAlign: 'center' }
        },
        {
            dataField: 'montantHT',
            text: 'Montant HT',
            filter: textFilter({
                placeholder: "Chercher",
                style: { marginLeft: 5 },
            }),
            headerStyle: { textAlign: 'center' }
        },
        {
            dataField: 'tva',
            text: 'TVA',
            filter: textFilter({
                placeholder: "Chercher",
                style: { marginLeft: 5 },
            }),
            headerStyle: { textAlign: 'center' }
        },
        {
            dataField: 'ttc',
            text: 'TTC',
            filter: textFilter({
                placeholder: "Chercher",
                style: { marginLeft: 5 },
            }),
            headerStyle: { textAlign: 'center' }
        },
        {
            dataField: 'dateEdition',
            text: 'Date d\'édition',
            filter: textFilter({
                placeholder: "Chercher",
                style: { marginLeft: 5 },
            }),
            headerStyle: { textAlign: 'center' }
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
            headerStyle: { textAlign: 'center' }
        }
    ];

    return (
        <Container className="mt-5">
            <h2>Gestion des factures</h2>
            <BootstrapTable
                keyField='_id'
                data={factures}
                columns={columns}
                pagination={paginationFactory()}
                filter={filterFactory()}
                striped
                bordered={false}
                wrapperClasses="table-responsive"
            />
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Modifier Facture</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedFacture && (
                        <FactureComponent data={selectedFacture} role={role} onClose={handleCloseModal} />
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default FacturesAdmin;
