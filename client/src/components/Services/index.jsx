import React, { useEffect, useState } from 'react';
import { Alert, Container, Modal } from 'react-bootstrap';
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
        dataField: 'site_web_creation',
        text: 'Type Site',
        headerStyle: { textAlign: 'center' } 
    }, {
        dataField: 'referencement',
        text: 'Referencement',
        headerStyle: { textAlign: 'center' },
        formatter: (cell, row) => ( 
            <div>
                {cell.seo ? 'SEO' : cell.sea ? "SEA" : "-"}
            </div>
            ),
    },
    {
        dataField: 'shooting_produits',
        text: 'Shooting produit',
        headerStyle: { textAlign: 'center' },
        formatter: (cell, row) => ( 
            <div>
                {cell? cell.nombre_de_produits + ' / ' +  cell.dimension_produit.charAt(0).toUpperCase() + cell.dimension_produit.slice(1) : "-"}
            </div>
            ),
    },
    {
        dataField: 'visite_virtuelle',
        text: 'Visite Virtuelle',
        headerStyle: { textAlign: 'center' },
        formatter: (cell, row) => ( 
            <div>
                {cell? cell.nombre_de_pieces + ' / ' +  cell.surface_metre_carree : "-"}
            </div>
            ),
    },
    {
        dataField: 'social_media_management',
        text: 'Social Media',
        headerStyle: { textAlign: 'center' },
        formatter: (cell, row) => (
            
            <div class="d-inline-flex gap-2">
            {/* <button type="button" class="btn btn-primary btn-sm" onClick={() => handleShowModal(row)}>
                <span class="bi bi-pencil-fill"></span>
            </button> */}
            {cell.snapchat}
                    {cell.snapchat && (
                      <span class="bi bi-snapchat"></span>  
                    )} 
                    {cell.tiktok && (
                      <span class="bi bi-tiktok"></span>  
                    )}
                    {cell.linkedin && (
                      <span class="bi bi-linkedin"></span>  
                    )} 
                    {cell.instagram && (
                      <span class="bi bi-instagram"></span>  
                    )} 
                    {cell.facebook && (
                      <span class="bi bi-facebook"></span>  
                    )}  
                    {cell.autre?.selected && (
                      <span> {cell.autre.description} </span>  
                    )}  
            </div>
    
            
            
            ),
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
        <Container className="mt-5 bg-light rounded-2 pb-2">
            <div className="d-flex p-2 bd-highlight justify-content-between align-items-center bg-red">
                <h2 className="mb-4">Liste des Devis</h2>
            </div>
            {services.length === 0 ? (
                 <Alert variant="info" className="text-center">Aucune devis ou demande de service trouvée.</Alert>
            ) : (
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
            )}



        </Container>
        
    );
};

export default Services;
