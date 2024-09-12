import React, { useState } from 'react';
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
    const [tva, setTva] = useState('');
    const [ttc, setTtc] = useState('');
    const [emailError, setEmailError] = useState('');
    const [telephoneError, setTelephoneError] = useState('');

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
            ttc
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

    return (
        <Modal show={show} onHide={onExit}>
            <Modal.Header closeButton>
                <Modal.Title>Ajouter Contrat</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formNomReferent">
                        <Form.Label>Nom Référent</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrer le nom référent"
                            value={nomreferent}
                            onChange={(e) => setNomreferent(e.target.value)}
                        />
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
                            placeholder="Entrer l'email"
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
                            type="number"
                            placeholder="Entrer le taux de TVA"
                            value={tva}
                            onChange={(e) => setTva(e.target.value)}
                        />
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
