import React, { useEffect, useState } from 'react';
import { Alert, Container, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import ContratComponent from '../Contrat';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import AssistanceModal from './assistanceDescription';

const Assistances = () => {
    const [demandes, setDemandes] = useState([]);
    const [showModal, setShowModal] = useState(false); // Controls modal visibility
    const [selectedDemande, setSelectedDemande] = useState(null); // Holds the selected contract data
      // Function to open the modal and set the selected assistance object
    const handleShowModal = (assistance) => {
        setSelectedDemande(assistance);
        setShowModal(true);
    };

    // Function to close the modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDemande(null);
    };

    const token = localStorage.getItem('token');
    const fetchDemandes = async () => {
        try {
            const response = await fetch("http://localhost:3000/contactmsyt/assistance", {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log('data ::', data);
                setDemandes(data.data)
            } else {
                const errorData = await response.json();
                console.log(errorData.message || "Échec de la connexion.");
            }
        } catch (err) {
            console.error('Error:', err);
            console.log("Erreur réseau ou serveur injoignable.");
        }
    };
    // Function to handle updating assistance
    const patchAssistance = async (id, updatedData) => {
        try {
            const response = await fetch(`http://localhost:3000/contactmsyt/assistance/${id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData),
            });
            if (response.ok) {
                // Refresh data after successful update
                fetchDemandes();
                handleCloseModal();
            } else {
                const errorData = await response.json();
                console.log(errorData.message || "Échec de la connexion.");
            }
        } catch (err) {
            console.error('Error:', err);
            console.log("Erreur réseau ou serveur injoignable.");
        }
    };

    useEffect(() => {
        fetchDemandes();
    }, []);
    
    const { SearchBar } = Search;

    const columns = 
    [ {
        dataField: 'date',
        text: 'Date de soumission',
        formatter: (cell, row) => {
          return (
            <div>{new Date(cell).toLocaleString()}</div>
          )
        }
      },{
        dataField: 'serviceType',
        text: 'Type Service',
        headerStyle: { textAlign: 'center' },
        formatter: (cell, row) => {
          let displayText;
      
          // Use switch statement to set the display text based on service type
          switch (cell) {
            case 'serviceTechnique':
              displayText = 'Service Technique';
              break;
            case 'serviceCommerciale':
              displayText = 'Service Commercial';
              break;
            case 'serviceJuridique':
              displayText = 'Service Juridique';
              break;
            case 'serviceAdministratif':
              displayText = 'Service Administratif';
              break;
            default:
              displayText = 'Unknown Service'; // Fallback text for unexpected values
          }
      
          return (
            <div className="d-flex gap-2 justify-content-center">
              {displayText}
            </div>
          );
        },
      },
      
        {
            dataField: 'description',
            text: 'Description',
            headerStyle: { textAlign: 'center' }
        },
        {
            dataField: 'clientId',
            text: 'Client',
            headerStyle: { textAlign: 'center' },
            formatter: (cell, row) => {
                return (
                <div className="d-flex gap-2 justify-content-center">
                    {cell.name}
                </div>
                );
            }
        },
        {
            dataField: 'status',
            text: 'Status',
            headerStyle: { textAlign: 'center' },
            formatter: (cell, row) => {
              // Determine the color and label based on the status
              const getStatusDetails = (status) => {
                switch (status) {
                  case 'en_attente':
                    return { color: 'red', label: 'En Attente' };
                  case 'en_cours':
                    return { color: 'green', label: 'En Cours' };
                  default:
                    return { color: 'grey', label: 'Cloturé' };
                }
              };
          
              const { color, label } = getStatusDetails(cell);
          
              return (
                <div className="d-flex gap-2 justify-content-center align-items-center">
                  <span
                    style={{
                      display: 'inline-block',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: color,
                    }}
                  ></span>
                  <span>{label}</span>
                </div>
              );
            },
          },          
        {
            text: 'Action',
            formatter: (cell, row) => {
                return (
                <div className="d-flex gap-2 justify-content-center">
                    <button type="button" className="btn btn-outline-primary btn-sm"
                            onClick={() => handleShowModal(row)}
                    >
                    <span className="bi bi-three-dots-vertical"></span>
                    </button>
                </div>
                );
            }
        }      
    ];

    return (
        <Container className="mt-5 bg-light rounded-2 pb-2">
            <div className="d-flex p-2 bd-highlight justify-content-between align-items-center bg-red">
                <h2 className="mb-4">Liste des Demandes d'assistance</h2>
            </div>
            {demandes.length === 0 ? (
              <Alert variant="info" className="text-center">Aucune demande d'assistance trouvée.</Alert>
            ) : (
                <ToolkitProvider keyField="_id" data={demandes} columns={columns} search>
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
)}

            <AssistanceModal
                show={showModal}
                onClose={handleCloseModal}
                assistance={selectedDemande}
                onSave={(updatedData) => patchAssistance(selectedDemande._id, updatedData)}
                />

        </Container>
        
    );
};

export default Assistances;
