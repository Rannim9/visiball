import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Card, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Réclamation.css'; 
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';

const ReclamationsUser = () => {
    const [reclamations, setReclamations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);    
    const user = JSON.parse(localStorage.getItem('user'))   
   
    useEffect(() => {
        const fetchReclamation = async () => {
            try {
                const response = await fetch(`http://localhost:3000/contactmsyt/reclamations/me/${user._id}`, {
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

    const columns = [ 
        {
            dataField: 'requestDate',
            text: 'Date de soumission',
            headerStyle: { textAlign: 'center' },
            formatter: (cell, row) => {
                return (
                  <div>{new Date(cell).toLocaleString()}</div>
                )
              }
        },
        {
            dataField: 'nomClient',
            text: 'Nom client',
            headerStyle: { textAlign: 'center' } 
        }, 
        {
            dataField: 'emailClient',
            text: 'Email client',
            headerStyle: { textAlign: 'center' } 
        }, 
        {
            dataField: 'telephone',
            text: 'Telephone',
            headerStyle: { textAlign: 'center' } 
        }, 
        {
            dataField: 'objet',
            text: 'Objet',
            headerStyle: { textAlign: 'center' }
        }, 
        {
            dataField: 'description',
            text: 'Description',
            headerStyle: { textAlign: 'center' }
        },
        {
          dataField: 'serviceConcerne',
          text: 'Service Concerné',
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

    const { SearchBar } = Search;

    return (
        <Container className="mt-5 bg-light rounded-2 p-4">
            <Card className="shadow-lg p-4 mb-5 bg-white rounded">
                <Card.Body>
                    <h2 className="text-center mb-4 ">Gestion des Réclamations</h2>
                    {reclamations.length > 0 ? (
                        // <Table striped bordered hover responsive className="mt-4" style={{ tableLayout: 'auto' }}>
                        //     <thead >
                        //         <tr>
                        //             <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Nom du Client</th>
                        //             <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Email du Client</th>
                        //             <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Numéro de téléphone</th>
                        //             <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Objet</th>
                        //             <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Description</th>
                        //             <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Service Concerné</th>
                        //             <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Date de soumission</th>
                        //         </tr>
                        //     </thead>    
                        //     <tbody>
                        //         {reclamations.map((reclamation) => (
                        //             <tr key={reclamation._id}>
                        //                 <td style={{ height: '40px', lineHeight: '40px', textAlign: 'center' }}>{reclamation.nomClient || 'Nom non disponible'}</td>
                        //                 <td style={{ height: '40px', lineHeight: '40px', textAlign: 'center' }}>{reclamation.emailClient || 'Email non disponible'}</td>
                        //                 <td style={{ height: '40px', lineHeight: '40px', textAlign: 'center' }}>{reclamation.telephone}</td>
                        //                 <td style={{ height: '40px', lineHeight: '40px', textAlign: 'center' }}>{reclamation.objet}</td>
                        //                 <td style={{ height: '40px', lineHeight: '40px', textAlign: 'center' }}>{reclamation.description}</td>
                        //                 <td style={{ height: '40px', lineHeight: '40px', textAlign: 'center' }}>{reclamation.serviceConcerne}</td>
                        //                 <td style={{ height: '40px', lineHeight: '40px', textAlign: 'center' }}>{reclamation.requestDate}</td>

                        //             </tr>
                        //         ))}
                        //     </tbody>
                        // </Table>
                        <ToolkitProvider keyField="_id" data={reclamations} columns={columns} search>
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
                        <Alert variant="info" className="text-center">Aucune demande de réclamation trouvée.</Alert>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ReclamationsUser;
