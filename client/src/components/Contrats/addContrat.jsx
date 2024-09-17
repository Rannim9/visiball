import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddContratModal = ({ show, handleClose, handleSave }) => {
    const [nomreferent, setNomreferent] = useState('');
    const [raisonsociale, setRaisonsociale] = useState('');
    const [telephone, setTelephone] = useState('');
    const [email, setEmail] = useState('');
    const [adresse, setAdresse] = useState('');
    const [siret, setSiret] = useState('');
    const [duree, setDuree] = useState('');
    const [ht, setHt] = useState('');
    const [tva, setTva] = useState(19);
    const [ttc, setTtc] = useState('');
    const [emailError, setEmailError] = useState('');
    const [telephoneError, setTelephoneError] = useState('');
    const [users, setUsers] = useState([]); 
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/contactmsyt/users', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                console.log('Utilisateurs récupérés:', data);

                if (Array.isArray(data)) { 
                    setUsers(data); 
                } else {
                    console.error('Format inattendu de la réponse');
                }
            } catch (err) {
                console.error('Erreur lors de la récupération des utilisateurs:', err);
            } finally {
                setLoading(false);
            }
        };

        if (show) {
            fetchUsers();
        }
    }, [show]);

    const handleNomChange = (e) => {
        const selectedUserId = e.target.value; 
        const user = users.find((u) => u._id === selectedUserId); 

        if (user) {
            console.log(user)
            setNomreferent(user._id);
            setEmail(user.email);
            setTelephone(user.telephone || '');
        }
    };

    const onSave = () => {
        setEmailError('');
        setTelephoneError('');

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setEmailError('Veuillez entrer une adresse email valide.');
            return;
        }

        const telephonePattern = /^\d+$/;
        if (!telephonePattern.test(telephone)) {
            setTelephoneError('Le numéro de téléphone doit contenir uniquement des chiffres.');
            return;
        }

        const newContrat = {
            nomreferent,
            raisonsociale,
            telephone,
            email,
            adresse,
            siret,
            duree,
            ht,
            tva,
            ttc,
        };
        handleSave(newContrat); 
        onExit();
    };

    const onExit = () => {
        setNomreferent('');
        setRaisonsociale('');
        setTelephone('');
        setEmail('');
        setAdresse('');
        setSiret('');
        setDuree('');
        setHt('');
        setTva('');
        setTtc('');
        handleClose();
    };

    useEffect(()=> {
        setTtc(ht*tva/100)
    }, [ht, tva])

    useEffect(()=> {

    })

    return (
        <Modal show={show} onHide={onExit}>
            <Modal.Header closeButton>
                <Modal.Title>Ajouter un Contrat</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formNomReferent">
                        <Form.Label>Nom Référent</Form.Label>
                        <Form.Control
                            as="select"
                            value={nomreferent} // Lier avec l'état
                            onChange={handleNomChange}
                        >
                            <option value="">Sélectionner un utilisateur</option>
                            {loading ? (
                                <option>Chargement...</option>
                            ) : users.length > 0 ? (
                                users.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.name}
                                    </option>
                                ))
                            ) : (
                                <option>Aucun utilisateur disponible</option>
                            )}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formRaisonSociale">
                        <Form.Label>Raison Sociale</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrer la raison sociale"
                            value={raisonsociale}
                            onChange={(e) => setRaisonsociale(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formTelephone">
                        <Form.Label>Téléphone</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrer le numéro de téléphone"
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                            isInvalid={!!telephoneError}
                        />
                        <Form.Control.Feedback type="invalid">
                            {telephoneError}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Sélectionner l'email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            isInvalid={!!emailError}
                        />
                        <Form.Control.Feedback type="invalid">
                            {emailError}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formAdresse">
                        <Form.Label>Adresse</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrer l'adresse"
                            value={adresse}
                            onChange={(e) => setAdresse(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formSiret">
                        <Form.Label>SIRET</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrer le numéro SIRET"
                            value={siret}
                            onChange={(e) => setSiret(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formDuree">
                        <Form.Label>Durée</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrer la durée"
                            value={duree}
                            onChange={(e) => setDuree(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formHt">
                        <Form.Label>Montant HT</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Entrer le montant HT"
                            value={ht}
                            onChange={(e) => setHt(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formTva">
                        <Form.Label>TVA (%)</Form.Label>
                        <Form.Control
                            as="select"
                            value={tva} // Lier avec l'état
                            onChange={(e) => setTva(e.target.value)}
                        >
                            <option value="">Sélectionner TVA</option>
                                    <option value={15}>
                                    15%
                                    </option>
                                    <option value={19}>
                                        19%
                                    </option>
                                    <option value={35}>
                                     35%   
                                    </option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formTtc">
                        <Form.Label>Montant TTC</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Entrer le montant TTC"
                            value={ttc}
                            onChange={(e) => setTtc(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onExit}>
                    Annuler
                </Button>
                <Button variant="primary" onClick={onSave}>
                    Enregistrer
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddContratModal;
