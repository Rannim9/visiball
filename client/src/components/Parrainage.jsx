import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import { ToastContainer, toast } from 'react-toastify'; 

const ParrainageComponent = ({ role }) => {
    const [formData, setFormData] = useState({
        nomBeneficiaire: '',
        emailBeneficiaire: '',
        telephoneBeneficiaire: '',
        siteweb: false,
        referencement: false,
        gestion: false,
        shooting: false,
        visite: false,
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [localRole, setLocalRole] = useState(role || "client");

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        validateInput(name, type === 'checkbox' ? checked : value);
    };

    const validateInput = (name, value) => {
        let errors = { ...validationErrors };
    
        if (typeof value === 'string' && !value.trim()) {
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
                        errors[name] = 'Le numéro de téléphone doit contenir exactement 8 chiffres.';
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
    

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (Object.keys(validationErrors).length > 0) {
            toast.error("Veuillez corriger les erreurs dans le formulaire.");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/contactmsyt/parrainages', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Parrainage ajouté avec succès!");
                setFormData({
                    nomBeneficiaire: '',
                    emailBeneficiaire: '',
                    telephoneBeneficiaire: '',
                    siteweb: false,
                    referencement: false,
                    gestion: false,
                    shooting: false,
                    visite: false,
                });
            } else {
                toast.error(data.message || "Une erreur est survenue.");
            }
        } catch (err) {
            toast.error("Erreur lors de la soumission du parrainage.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="d-flex flex-column justify-content-center bg-light p-4 rounded-3 shadow mt-5">
            <ToastContainer position="bottom-center" autoClose={5000} />
            <h1 className="text-center mb-4">Soumettre un Parrainage</h1>
            <Form onSubmit={handleSubmit} className="p-4 bg-white shadow-sm rounded">
                <Row>
                    <Form.Group as={Col} md={12} className="mb-3">
                        <Form.Label>Nom du Bénéficiaire :</Form.Label>
                        <Form.Control
                            type="text"
                            name="nomBeneficiaire"
                            value={formData.nomBeneficiaire}
                            onChange={handleInputChange}
                            placeholder="Entrez le nom du bénéficiaire"
                            required
                        />
                        {validationErrors.nomBeneficiaire && (
                            <p className="text-danger">{validationErrors.nomBeneficiaire}</p>
                        )}
                    </Form.Group>
                    <Form.Group as={Col} md={12} className="mb-3">
                        <Form.Label>Email du Bénéficiaire :</Form.Label>
                        <Form.Control
                            type="email"
                            name="emailBeneficiaire"
                            value={formData.emailBeneficiaire}
                            onChange={handleInputChange}
                            placeholder="Entrez l'email du bénéficiaire"
                            required
                        />
                        {validationErrors.emailBeneficiaire && (
                            <p className="text-danger">{validationErrors.emailBeneficiaire}</p>
                        )}
                    </Form.Group>
                    <Form.Group as={Col} md={12} className="mb-3">
                        <Form.Label>Téléphone du Bénéficiaire :</Form.Label>
                        <Form.Control
                            type="text"
                            name="telephoneBeneficiaire"
                            value={formData.telephoneBeneficiaire}
                            onChange={handleInputChange}
                            placeholder="Entrez le téléphone du bénéficiaire"
                            required
                        />
                        {validationErrors.telephoneBeneficiaire && (
                            <p className="text-danger">{validationErrors.telephoneBeneficiaire}</p>
                        )}
                    </Form.Group>
                    <Form.Group as={Col} md={12} className="mb-3">
                        <Form.Label>Services Parrainés :</Form.Label>
                        <Form.Check
                            type="checkbox"
                            label="Création de Site Web"
                            name="siteweb"
                            checked={formData.siteweb}
                            onChange={handleInputChange}
                        />
                        <Form.Check
                            type="checkbox"
                            label="Référencement"
                            name="referencement"
                            checked={formData.referencement}
                            onChange={handleInputChange}
                        />
                        <Form.Check
                            type="checkbox"
                            label="Gestion des réseaux sociaux"
                            name="gestion"
                            checked={formData.gestion}
                            onChange={handleInputChange}
                        />
                        <Form.Check
                            type="checkbox"
                            label="Shooting Produits"
                            name="shooting"
                            checked={formData.shooting}
                            onChange={handleInputChange}
                        />
                        <Form.Check
                            type="checkbox"
                            label="Visite Virtuelle 360°"
                            name="visite"
                            checked={formData.visite}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Row>
                <div style={{ textAlign: 'center' }}>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? "Envoi en cours..." : "Soumettre"}
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default ParrainageComponent;
