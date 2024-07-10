import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import './Contrat.css';
import '../App.css';

function ContratComponent() {
    const [validationErrors, setValidationErrors] = useState({});
    const [editMode, setEditMode] = useState({});
    const [contrat, setContrat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
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
        fetchContrat();
    }, []);

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
                    <Form key={ct._id}>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridNomReferent">
                                <Form.Label>Nom et prénom:</Form.Label>
                                <div className="d-flex align-items-center">
                                    <Form.Control 
                                        type="text" 
                                        name="nomreferent" 
                                        defaultValue={ct.nomreferent}
                                        onChange={(e) => handleInputChange(e, ct._id, 'nomreferent')} 
                                        readOnly={!editMode[ct._id]?.nomreferent} 
                                    />
                                    {!editMode[ct._id]?.nomreferent && (
                                        <Button 
                                            variant="link" 
                                            onClick={() => toggleFieldEditMode(ct._id, 'nomreferent')} 
                                            className="ml-2 p-0" 
                                            style={{ border: 'none', background: 'none' }}
                                        >
                                            <i className="bi bi-pencil" style={{ fontSize: '0.75rem' }}></i>
                                        </Button>
                                    )}
                                    {editMode[ct._id]?.nomreferent && (
                                        <Button 
                                            variant="link" 
                                            onClick={() => confirmEdit(ct._id, 'nomreferent')} 
                                            className="confirm-icon"
                                        >
                                            <i className="bi bi-check-circle"></i>
                                        </Button>
                                    )}
                                </div>
                                {validationErrors.nomreferent && <Alert variant="danger">{validationErrors.nomreferent}</Alert>}
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridRaisonSociale">
                                <Form.Label>Raison sociale :</Form.Label>
                                <div className="d-flex align-items-center">
                                    <Form.Control 
                                        type="text" 
                                        name="raisonsociale" 
                                        defaultValue={ct.raisonsociale}
                                        onChange={(e) => handleInputChange(e, ct._id, 'raisonsociale')} 
                                        readOnly={!editMode[ct._id]?.raisonsociale} 
                                    />
                                    {!editMode[ct._id]?.raisonsociale && (
                                        <Button 
                                            variant="link" 
                                            onClick={() => toggleFieldEditMode(ct._id, 'raisonsociale')} 
                                            className="ml-2 p-0" 
                                            style={{ border: 'none', background: 'none' }}
                                        >
                                            <i className="bi bi-pencil" style={{ fontSize: '0.75rem' }}></i>
                                        </Button>
                                    )}
                                    {editMode[ct._id]?.raisonsociale && (
                                        <Button 
                                            variant="link" 
                                            onClick={() => confirmEdit(ct._id, 'raisonsociale')} 
                                            className="confirm-icon"
                                        >
                                            <i className="bi bi-check-circle"></i>
                                        </Button>
                                    )}
                                </div>
                                {validationErrors.raisonsociale && <Alert variant="danger">{validationErrors.raisonsociale}</Alert>}
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridNumeroTelephone">
                                <Form.Label>Numéro de téléphone :</Form.Label>
                                <div className="d-flex align-items-center">
                                    <Form.Control 
                                        type="text" 
                                        name="telephone" 
                                        defaultValue={ct.telephone}
                                        onChange={(e) => handleInputChange(e, ct._id, 'telephone')} 
                                        readOnly={!editMode[ct._id]?.telephone} 
                                    />
                                    {!editMode[ct._id]?.telephone && (
                                        <Button 
                                            variant="link" 
                                            onClick={() => toggleFieldEditMode(ct._id, 'telephone')} 
                                            className="ml-2 p-0" 
                                            style={{ border: 'none', background: 'none' }}
                                        >
                                            <i className="bi bi-pencil" style={{ fontSize: '0.75rem' }}></i>
                                        </Button>
                                    )}
                                    {editMode[ct._id]?.telephone && (
                                        <Button 
                                            variant="link" 
                                            onClick={() => confirmEdit(ct._id, 'telephone')} 
                                            className="confirm-icon"
                                        >
                                            <i className="bi bi-check-circle"></i>
                                        </Button>
                                    )}
                                </div>
                                {validationErrors.telephone && <Alert variant="danger">{validationErrors.telephone}</Alert>}
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>Adresse e-mail :</Form.Label>
                                <div className="d-flex align-items-center">
                                    <Form.Control 
                                        type="text" 
                                        name="email" 
                                        defaultValue={ct.email}
                                        onChange={(e) => handleInputChange(e, ct._id, 'email')} 
                                        readOnly={!editMode[ct._id]?.email} 
                                    />
                                    {!editMode[ct._id]?.email && (
                                        <Button 
                                            variant="link" 
                                            onClick={() => toggleFieldEditMode(ct._id, 'email')} 
                                            className="ml-2 p-0" 
                                            style={{ border: 'none', background: 'none' }}
                                        >
                                            <i className="bi bi-pencil" style={{ fontSize: '0.75rem' }}></i>
                                        </Button>
                                    )}
                                    {editMode[ct._id]?.email && (
                                        <Button 
                                            variant="link" 
                                            onClick={() => confirmEdit(ct._id, 'email')} 
                                            className="confirm-icon"
                                        >
                                            <i className="bi bi-check-circle"></i>
                                        </Button>
                                    )}
                                </div>
                                {validationErrors.email && <Alert variant="danger">{validationErrors.email}</Alert>}
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAdressePhysique">
                                <Form.Label>Adresse physique :</Form.Label>
                                <div className="d-flex align-items-center">
                                    <Form.Control 
                                        type="text" 
                                        name="adresse" 
                                        defaultValue={ct.adresse}
                                        onChange={(e) => handleInputChange(e, ct._id, 'adresse')} 
                                        readOnly={!editMode[ct._id]?.adresse} 
                                    />
                                    {!editMode[ct._id]?.adresse && (
                                        <Button 
                                            variant="link" 
                                            onClick={() => toggleFieldEditMode(ct._id, 'adresse')} 
                                            className="ml-2 p-0" 
                                            style={{ border: 'none', background: 'none' }}
                                        >
                                            <i className="bi bi-pencil" style={{ fontSize: '0.75rem' }}></i>
                                        </Button>
                                    )}
                                    {editMode[ct._id]?.adresse && (
                                        <Button 
                                            variant="link" 
                                            onClick={() => confirmEdit(ct._id, 'adresse')} 
                                            className="confirm-icon"
                                        >
                                            <i className="bi bi-check-circle"></i>
                                        </Button>
                                    )}
                                </div>
                                {validationErrors.adresse && <Alert variant="danger">{validationErrors.adresse}</Alert>}
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridSiret">
                                <Form.Label>Numéro de Siret :</Form.Label>
                                <Form.Control type="text" defaultValue={ct.siret} readOnly />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridDuree">
                                <Form.Label>Durée d'engagement :</Form.Label>
                                <Form.Control type="text" defaultValue={ct.duree} readOnly />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridHT">
                                <Form.Label>Mensualité HT :</Form.Label>
                                <Form.Control type="text" defaultValue={formatNumber(ct.ht)} readOnly />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridTVA">
                                <Form.Label>TVA :</Form.Label>
                                <Form.Control type="text" defaultValue={formatNumber(ct.tva)} readOnly />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridTTC">
                                <Form.Label>Mensualité TTC :</Form.Label>
                                <Form.Control type="text" defaultValue={formatNumber(ct.ttc)} readOnly />
                            </Form.Group>
                        </Row>
                        <Form.Group className="mb-3" controlId="formGridSignature">
                            <Form.Label>Date de signature :</Form.Label>
                            <Form.Control type="text" defaultValue={ct.signature ? new Date(ct.signature).toLocaleDateString() : 'N/A'} readOnly />
                        </Form.Group>

                        
                        <Form.Group className="mb-3" controlId="formGridCommercial">
                            <Form.Label>Commercial référent :</Form.Label>
                            <Form.Control type="text" defaultValue={ct.referent} readOnly />
                        </Form.Group>
                    </Form>
                ))
            ) : <p>Aucun contrat disponible.</p>}
            <div className="d-flex justify-content-center">
                <Button variant="primary" type="button" className="mt-3" onClick={handleSaveChanges}>Modifier</Button>
            </div>
        </Container>
    );
}

export default ContratComponent;
