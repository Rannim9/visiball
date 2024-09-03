import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import ParrainageForm from './ParrainageComponent';

const ParrainageComponent = ({ data, role }) => {
    const [validationErrors, setValidationErrors] = useState({});
    const [editMode, setEditMode] = useState({});
    const [parrainages, setParrainages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [localRole, setLocalRole] = useState(role || "admin");

    const fetchParrainages = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log("Token JWT utilisé:", token);

            const response = await fetch('http://localhost:3000/contactmsyt/parrainages', {
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
            setParrainages(data.data);
            setLoading(false);
        } catch (error) {
            console.error("Erreur lors de la récupération des parrainages: ", error);
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (data && parrainages.length === 0) {
            setParrainages((prevParrainages) => {
                if (prevParrainages.length === 0) {
                    return [...prevParrainages, data];
                }
                return prevParrainages;
            });
            setLoading(false);
        } else {
            fetchParrainages();
        }
    }, [data]);

    const handleInputChange = (event, id, field) => {
        const { value } = event.target;
        let updatedParrainages = [...parrainages];
        let index = updatedParrainages.findIndex(item => item._id === id);
        if (index !== -1) {
            updatedParrainages[index][field] = value;
            setParrainages(updatedParrainages);
        }
        validateInput(field, value);
    };

    const confirmEdit = (id, field) => {
        const fieldError = validationErrors[field];
        const fieldValue = parrainages.find(item => item._id === id)[field];
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
                case 'nomBeneficiaire':
                    if (!/^[a-zA-Z\s]+$/.test(value)) {
                        errors[name] = 'Le nom doit contenir uniquement des lettres.';
                    } else {
                        delete errors[name];
                    }
                    break;
                case 'telephoneBeneficiaire':
                    if (!/^\d{8}$/.test(value)) {
                        errors[name] = 'Le numéro de téléphone doit contenir exactement 8 chiffres et aucune lettre.';
                    } else {
                        delete errors[name];
                    }
                    break;
                case 'emailBeneficiaire':
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
        const updatedParrainages = parrainages.map(async (p) => {
            if (!p.nomBeneficiaire.trim()) {
                alert("Le nom du bénéficiaire est requis.");
                return p;
            }
            if (p._id && Object.values(editMode[p._id] || {}).some(field => field)) {
                try {
                    console.log('Updating parrainage with data:', p);
                    const response = await fetch(`http://localhost:3000/contactmsyt/updateParrainage/${p._id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify(p),
                    });
                    if (!response.ok) {
                        throw new Error('Échec de la mise à jour du parrainage');
                    }
                    return await response.json();
                } catch (error) {
                    console.error('Erreur lors de la mise à jour:', error);
                    throw error;
                }
            }
            return p;
        });

        Promise.all(updatedParrainages)
            .then(updatedData => {
                setParrainages(updatedData);
                setEditMode({});
                alert('Modifications enregistrées avec succès!');
            })
            .catch(error => {
                alert('Erreur lors de l\'enregistrement des modifications.');
            });
    };

    const toggleFieldEditMode = (parrainageId, field) => {
        setEditMode(prev => ({
            ...prev,
            [parrainageId]: {
                ...prev[parrainageId],
                [field]: !prev[parrainageId]?.[field]
            }
        }));
    };

    if (loading) return <p>Chargement en cours...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Container fluid className="d-flex flex-column justify-content-center bg-light p-4 rounded-3 shadow mt-5">
            <h1 className="text-center mb-4">Gestion des Parrainages</h1>
            {parrainages.length > 0 ? (
                parrainages.map((parrainage) => (
                    <ParrainageForm 
                        key={parrainage._id}
                        parrainage={parrainage}
                        editMode={editMode}
                        validationErrors={validationErrors}
                        handleInputChange={handleInputChange}
                        toggleFieldEditMode={toggleFieldEditMode}
                        confirmEdit={confirmEdit}
                        role={localRole}
                    />
                ))
            ) : <p>Aucun parrainage disponible.</p>}
            <div className="d-flex justify-content-center">
                <Button variant="primary" type="button" className="mt-3" onClick={handleSaveChanges}>Modifier</Button>
            </div>
        </Container>
    );
}

export default ParrainageComponent;
