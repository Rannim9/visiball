import React, { useState, useEffect } from 'react';
import { Container,Form, Button, Row, Col } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';

const FactureForm = ({role}) => {
    const [factures, setFactures] = useState({
        numeroFacture: '',
        montantHT: '',
        tva: '',
        ttc: '',  
        dateEdition: ''
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
    

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (Object.keys(validationErrors).length > 0) {
            toast.error("Veuillez corriger les erreurs dans le formulaire.");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/contactmsyt/factures', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Factures ajouté avec succès!");
                setFormData({
                    numeroFacture: '',
                    montantHT: '',
                    tva: '',
                    ttc: '',
                    dateEdition: ''
                });
            } else {
                toast.error(data.message || "Une erreur est survenue.");
            }
        } catch (err) {
            toast.error("Erreur lors de la soumission du Faacture.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <Container fluid className="d-flex flex-column justify-content-center bg-light p-4 rounded-3 shadow mt-5">
            <h1 className="text-center mb-4">Mes factures</h1>
            {factures && factures.length > 0 ? (
                <>
                    <div className="row">
                        <div className="col-12">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Numéro de Facture</th>
                                        <th>Montant HT</th>
                                        <th>TVA</th>
                                        <th>TTC</th>
                                        <th>Date d'Édition</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {factures.map(facture => (
                                        <tr key={facture._id}>
                                            <td>{facture.numeroFacture}</td>
                                            <td>{facture.montantTH ? facture.montantTH.toFixed(2) : 'N/A'} dt</td>
                                            <td>{facture.tva ? facture.tva.toFixed(0) : 'N/A'} %</td>
                                            <td>{facture.ttc ? facture.ttc.toFixed(2) : 'N/A'} dt</td>
                                            <td>{facture.dateEdition ? new Date(facture.dateEdition).toLocaleDateString() : 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center mt-4">
                        <Button onClick={handleDownload} variant="primary">
                            Télécharger PDF
                        </Button>
                    </div>
                </>
            ) : <p>Aucune facture disponible.</p>}
        </Container>
    );
}

export default FactureForm;
