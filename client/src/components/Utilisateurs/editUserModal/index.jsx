// EditUserModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditUserModal = ({ show, handleClose, handleSave, user }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [activated, setActivated] = useState(false)
    const [emailError, setEmailError] = useState("")

    useEffect(() => {
        if (user) {
            console.log(user.activated)
            setName(user.name || '');
            setEmail(user.email || '');
            setActivated(user.activated || false)
        }
    }, [user]);

    const onSave = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setEmailError('Veuillez entrer une adresse email valide.');
            return;
        }
        setEmailError(''); // Clear any previous error if email is valid
    
        const updatedUser = { ...user, name, email, activated };
        handleSave(updatedUser);
        handleClose();
    };
    

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Modifier Utilisateur</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formName">
                        <Form.Label>Nom</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Entrer le nom" 
                            value={name}
                            onChange={(e) => setName(e.target.value)} 
                        />
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
                    <Form.Group controlId="formEmail">
                        <Form.Label>Status</Form.Label>
                        <Form.Check
                            checked={activated}
                            onChange={(e) => setActivated(e.target.checked)}
                            type="switch"
                            id="custom-switch"
                            label={activated ? "Activé" : "Desactivé"}
                        />
                       
                    </Form.Group>


                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Annuler
                </Button>
                <Button variant="primary" onClick={onSave}>
                    Enregistrer
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditUserModal;
