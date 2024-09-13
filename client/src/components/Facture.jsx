import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import FactureForm from './FactureComponent'

const FactureComponent = ({ role }) => {
    const [factures, setFactures] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFactures = async () => {
            setLoading(true);
            try {
                 const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/contactmsyt/factures', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP! status: ${response.status}`);
                }

                const data = await response.json();
                setFactures(data); 
            } catch (err) {
                console.error("Erreur lors de la récupération des factures:", err);
                setError("Erreur lors de la récupération des factures.");
            } finally {
                setLoading(false);
            }
        };

        fetchFactures();  // Appelle la fonction pour récupérer les factures
    }, []);  // Effectue l'appel une seule fois au chargement du composant

    const handleDownload = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/contactmsyt/factures/pdf', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/pdf',
                },
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP! status: ${response.status}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'factures.pdf';
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Erreur lors du téléchargement du PDF:", error);
            setError(error.message);
        }
    };

    return (
        <Container fluid className="d-flex flex-column justify-content-center bg-light p-4 rounded-3 shadow mt-5">
            <h1 className="text-center mb-4">Mes factures</h1>
            {loading ? (
                <p>Chargement en cours...</p>
            ) : error ? (
                <p>{error}</p>
            ) : factures && factures.length > 0 ? (
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
                                            <td>{facture.montantHT ? facture.montantHT.toFixed(2) : 'N/A'} dt</td>
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
            ) : (
                <p>Aucune facture disponible.</p>
            )}
        </Container>
    );
}

export default FactureComponent;
