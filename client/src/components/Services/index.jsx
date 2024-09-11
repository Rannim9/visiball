import React, { useEffect, useState } from 'react';
import { Container, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';
import './style.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import ContratComponent from '../Contrat';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

const Services = () => {
    const [services, setServices] = useState([]);
    const [showModal, setShowModal] = useState(false); // Controls modal visibility
    const [selectedService, setSelectedService] = useState(null); // Holds the selected contract data
    const token = localStorage.getItem('token');
    const fetchServices = async () => {
        try {
            const response = await fetch("http://localhost:3000/contactmsyt/devis", {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log('data ::', data);
                const array = data.data.map(
                    item => {
                        const { snapchat, tiktok, linkedin, instagram, facebook, validate, approved, ...rest } = item;
                        return {
                            ...rest,
                            socialMedia: {
                                snapchat,
                                tiktok,
                                linkedin,
                                instagram,
                                facebook,
                            },
                            state: {
                                validate, 
                                approved
                            }
                        }
                    }
                );
                console.log('fixed data ::', array);
                setServices(array);
            } else {
                const errorData = await response.json();
                console.log(errorData.message || "Échec de la connexion.");
            }
        } catch (err) {
            console.error('Error:', err);
            console.log("Erreur réseau ou serveur injoignable.");
        }
    };

    const validateDevis = async (_id, bool) => {
        try {
            const response = await fetch(`http://localhost:3000/contactmsyt/devis/validate/${_id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    approved: bool
                })
            });
            if (response.ok) {
                fetchServices()
            }
            else {
                const errorData = await response.json();
                console.log(errorData.message || "Échec de la connexion.");
            }
        }
        catch (err) 
        {
            console.error('Error:', err);
            console.log("Erreur réseau ou serveur injoignable.");
        }
    }
    useEffect(() => {
        fetchServices();
    }, []);
    // const handleShowModal = (service) => {
    //     setSelectedService(service);
    //     setShowModal(true);
    // };
    
    // const handleCloseModal = () => {
    //     setShowModal(false);
    //     setSelectedService(null);
    // };
    
    const { SearchBar } = Search;

    const columns = [ {
        dataField: 'creationSite',
        text: 'Type Site',
        headerStyle: { textAlign: 'center' } 
    }, {
        dataField: 'seo',
        text: 'SEO',
        headerStyle: { textAlign: 'center' }
    },{
        dataField: 'sea',
        text: 'SEA',
        headerStyle: { textAlign: 'center' }
    },
    {
        dataField: 'productCount',
        text: 'Product Count',
        headerStyle: { textAlign: 'center' }
    },
    {
        dataField: 'productSize',
        text: 'Product Size',
        headerStyle: { textAlign: 'center' }
    },
    {
        dataField: 'visite',
        text: 'Visite',
        headerStyle: { textAlign: 'center' }
    },
    {
        dataField: 'pieceCount',
        text: 'Piece Count',
        headerStyle: { textAlign: 'center' }
    },
    {
        dataField: 'pieceSize',
        text: 'Piece Size',
        headerStyle: { textAlign: 'center' }
    },
    {
        dataField: 'socialMedia',
        text: 'Social Media',
        headerStyle: { textAlign: 'center' },
        formatter: (cell, row) => (
            
            <div class="d-inline-flex gap-2">
            {/* <button type="button" class="btn btn-primary btn-sm" onClick={() => handleShowModal(row)}>
                <span class="bi bi-pencil-fill"></span>
            </button> */}
            {cell.snapchat}
                    <div>
                    <span class="bi bi-snapchat" style={{borderRadius: 5, backgroundColor: cell.snapchat? '#FFFC00' : "" }}></span> 
                    </div>
                    <span class="bi bi-tiktok" style={{ color: cell.tiktok? '#69C9D0' : "" }}></span> 
                    <span class="bi bi-linkedin" style={{ color: cell.linkedin? '#0077B5' : "" }}></span> 
                    <span class="bi bi-instagram" style={{ color: cell.instagram? '#C13584' : "" }}></span> 
                    <span class="bi bi-facebook" style={{ color: cell.facebook? '#1877F2' : "" }}></span> 
                    
                    
            </div>
    
            
            
            ),
    },
    {
        dataField: 'autreValue',
        text: 'Autre',
        headerStyle: { textAlign: 'center' }
    }, 
    {
        dataField: 'state',
        text: 'Validation',
        formatter: (cell, row) => {
          if (cell.validate === false) {
            return (
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-primary btn-sm">
                  <span className="bi bi-check-circle-fill" onClick={() => validateDevis(row._id, true)}></span>
                </button>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => validateDevis(row._id, false)}>
                  <span className="bi bi-x-circle-fill"></span>
                </button>
              </div>
            );
          }
      
          return cell.approved ? (
            <button type="button" className="btn btn-primary btn-sm" disabled>
              <span className="bi bi-check-circle-fill"></span> Valide
            </button>
          ) : (
            <button type="button" className="btn btn-danger btn-sm" disabled>
              <span className="bi bi-x-circle-fill"></span> Invalide
            </button>
          );
        },
        headerStyle: { textAlign: 'center' }
      }      
      ];

    return (
        <Container className="mt-5 bg-light rounded-2">
            <div className="d-flex p-2 bd-highlight justify-content-between align-items-center bg-red">
                <h2 className="mb-4">Liste des Devis</h2>
            </div>
            <ToolkitProvider keyField="_id" data={services} columns={columns} search>
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

        </Container>
        
    );
};

export default Services;
