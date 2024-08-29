import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import './Contrat.css';
import '../App.css';
import ContratForm from './ContratComponent';

const ContratComponent = ({data}) => {
    const [validationErrors, setValidationErrors] = useState({});
    const [editMode, setEditMode] = useState({});
    const [contrat, setContrat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
 
    const fetchContrat = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log("Token JWT utilisé:", token);

            const response = await fetch(`http://localhost:3000/contactmsyt/contrat`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setContrat(data);
            setLoading(false);
        } catch (error) {
            console.error("Erreur lors de la récupération des contrats: ", error);
            setError(error.message);
            setLoading(false);
        }
    };
    useEffect(() => {
        if (data && contrat.length === 0) {
            setContrat((prevContrat) => {
                if (prevContrat.length === 0) { // Only update if contrat is still empty
                    return [...prevContrat, data];
                }
                return prevContrat; // No update, to prevent re-trigger
            });
            setLoading(false);
        } else {
            fetchContrat();
        }
    }, [data]); // Only depend on `data`
     // Add dependencies to control execution
    

    const handleInputChange = (event, id, field) => {
        const { value } = event.target;
        let updatedContrat = [...contrat];
        let index = updatedContrat.findIndex(item => item._id === id);
        if (index !== -1) {
            updatedContrat[index][field] = value;
            setContrat(updatedContrat);
        }
        validateInput(field, value);
    };

    const confirmEdit = (id, field) => {
        const fieldError = validationErrors[field];
        const fieldValue = contrat.find(item => item._id === id)[field];
        if (!fieldError && fieldValue.trim() !== '') {
            toggleFieldEditMode(id, field);
        } else {
            setValidationErrors({
                ...validationErrors,
                [field]: 'Ce champ ne peut pas être vide.'
            });
        }
    };

    const validateInput = (name, value) => {
        let errors = { ...validationErrors };
        if (!value.trim()) {
            errors[name] = 'Ce champ ne peut pas être vide.';
        } else {
            switch (name) {
                case 'nomreferent':
                    if (!/^[a-zA-Z\s]+$/.test(value)) {
                        errors[name] = 'Le nom doit contenir uniquement des lettres.';
                    } else {
                        delete errors[name];
                    }
                    break;
                case 'telephone':
                    if (!/^\d{8}$/.test(value)) {
                        errors[name] = 'Le numéro de téléphone doit contenir exactement 8 chiffres et aucune lettre.';
                    } else {
                        delete errors[name];
                    }
                    break;
                case 'email':
                    if (!/\S+@\S+\.\S+/.test(value)) {
                        errors[name] = 'L\'adresse e-mail n\'est pas valide.';
                    } else {
                        delete errors[name];
                    }
                    break;
                default:
                    break;
            }
        }
        setValidationErrors(errors);
    };

    const handleSaveChanges = async () => {
      const updatedContrats = contrat.map(async (ct) => {
          if (!ct.raisonsociale.trim()) {
              alert("La raison sociale est requise.");
              return ct;
          }
          if (ct._id && Object.values(editMode[ct._id] || {}).some(field => field)) {
              try {
                  console.log('Updating contrat with data:', ct);
                  const response = await fetch(`http://localhost:3000/contactmsyt/updateContrat/${ct._id}`, {
                      method: 'PUT',
                      headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${localStorage.getItem('token')}`
                      },
                      body: JSON.stringify(ct),
                  });
                  if (!response.ok) {
                      throw new Error('Échec de la mise à jour du contrat');
                  }
                  return await response.json();
              } catch (error) {
                  console.error('Erreur lors de la mise à jour:', error);
                  throw error;
              }
          }
          return ct;
      });
  
      Promise.all(updatedContrats)
          .then(updatedData => {
              setContrat(updatedData);
              setEditMode({});
              alert('Modifications enregistrées avec succès!');
          })
          .catch(error => {
              alert('Erreur lors de l\'enregistrement des modifications.');
          });
  };
  
  

    const toggleFieldEditMode = (contratId, field) => {
        setEditMode(prev => ({
            ...prev,
            [contratId]: {
                ...prev[contratId],
                [field]: !prev[contratId]?.[field]
            }
        }));
    };

    const formatNumber = (value) => {
        return typeof value === 'number' ? value.toFixed(2) : 'N/A';
    };

    if (loading) return <p>Chargement en cours...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Container fluid className="d-flex flex-column justify-content-center bg-light p-4 rounded-3 shadow mt-5">
            <h1 className="text-center mb-4">Mes Contrats</h1>
            {contrat.length > 0 ? (
                contrat.map((ct) => (
                <ContratForm 
                    key={ct._id}
                    ct={ct}
                    editMode={editMode}
                    validationErrors={validationErrors}
                    handleInputChange={handleInputChange}
                    toggleFieldEditMode={toggleFieldEditMode}
                    confirmEdit={confirmEdit}
                    formatNumber={formatNumber}
                />
                ))
            ) : <p>Aucun contrat disponible.</p>}
            <div className="d-flex justify-content-center">
                <Button variant="primary" type="button" className="mt-3" onClick={handleSaveChanges}>Modifier</Button>
            </div>
        </Container>
    );
}

export default ContratComponent;
