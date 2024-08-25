// EditUserModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditUserModal = ({ show, handleClose, handleSave, user }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setAge(user.age ? user.age.toString() : '');
        }
    }, [user]);

    const onSave = () => {
        const updatedUser = { ...user, name, email, age: parseInt(age) };
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
                        />
                    </Form.Group>

                    <Form.Group controlId="formAge">
                        <Form.Label>Âge</Form.Label>
                        <Form.Control 
                            type="number" 
                            placeholder="Entrer l'âge" 
                            value={age}
                            onChange={(e) => setAge(e.target.value)} 
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
