import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import '../App.css';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import AssistanceModal from './Assistances/assistanceDescription';

function SuivieComponent() {
  const [suivie, setSuivie] = useState([]);
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
  const user = JSON.parse(localStorage.getItem('user'));
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
  const fetchSuivie = async () => {
    try {
      const response = await fetch(`http://localhost:3000/contactmsyt/assistance/${user._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`            },
      });            
      const data = await response.json();
      console.log(data)
      if (Array.isArray(data.data)) {
        setSuivie(data.data);
      } else {
        console.error('La réponse n\'est pas un tableau:', data.data);
      }
    } catch (error) {
        console.error('Erreur lors du chargement des demandes :', error);
    }
};
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
            fetchSuivie();
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
      fetchSuivie();
  }, []);

  const handleConsult = (suiviereferent) => {
    alert(`Consulter les détails pour: ${suiviereferent}`);
  };
  const { SearchBar } = Search;

  return (
    <Container fluid className="d-flex flex-column justify-content-center bg-light p-4 rounded-3 shadow mt-5">
      <h1 className="text-center mb-4">Mes demandes d'assistance</h1>
      {/* <div className="row">
        <div className="col-12">
          <div className="d-none d-md-block">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Date d'envoie</th>
                  <th>Service</th>
                  <th>Statut</th>
                  <th>Date de Traitement</th>
                  <th>Référent</th>
                  <th>Consulter</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(suivie) && suivie.map(suivieItem => (
                  <tr key={suivieItem._id}>
                    <td>{new Date(suivieItem.dateEnvoie).toLocaleDateString()}</td>
                    <td>{suivieItem.service}</td>
                    <td>{suivieItem.statut}</td>
                    <td>{new Date(suivieItem.dateTraitement).toLocaleDateString()}</td>
                    <td>{suivieItem.referent}</td>
                    <td>
                      <Button variant="primary" onClick={() => handleConsult(suivieItem.referent)}>
                        Consulter
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="d-block d-md-none">
        {Array.isArray(suivie) && suivie.map(suivieItem => (
          <div key={suivieItem._id} className="card mb-3">
            <div className="card-body">
              <p className="card-text">Date d'envoie: {new Date(suivieItem.dateEnvoie).toLocaleDateString()}</p>
              <p className="card-text">Service: {suivieItem.service}</p>
              <p className="card-text">Statut: {suivieItem.statut}</p>
              <p className="card-text">Date de traitement: {new Date(suivieItem.dateTraitement).toLocaleDateString()}</p>
              <p className="card-text">Référent: {suivieItem.referent}</p>
              <Button variant="primary" onClick={() => handleConsult(suivieItem.referent)}>
                Consulter
              </Button>
            </div>
          </div>
        ))}
      </div> */}
                  {suivie.length === 0 ? (
              <Alert variant="info" className="text-center">Aucune demande d'assistance trouvée.</Alert>
            ) : (
                <ToolkitProvider keyField="_id" data={suivie} columns={columns} search>
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
}

export default SuivieComponent;
