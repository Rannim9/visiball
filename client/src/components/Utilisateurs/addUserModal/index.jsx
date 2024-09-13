import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddUserModal = ({ show, handleClose, handleSave }) => {      
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const onSave = () => {    
        setEmailError('');
        setPasswordError('');
        setConfirmPasswordError('');
        
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setEmailError('Veuillez entrer une adresse email valide.');
            return;
        }
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!passwordPattern.test(password)) {
          setPasswordError('Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial.');
          return;
        }
        if (confirmPassword !== password) {
            setConfirmPasswordError('Veuillez confirmer votre mot de passe.');
            return;
        }

        const newUser = { name, email, role, password };
        handleSave(newUser);
        onExit();
    };

    const onExit = () => {
        setName("")
        setEmail("")
        setRole("")
        setPassword("")
        setConfirmPassword("")
        handleClose()
    }

    return (
        <Modal show={show} onHide={onExit}>
            <Modal.Header closeButton>
                <Modal.Title>Ajouter Utilisateur</Modal.Title>
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

                    <Form.Group controlId="formRole">
                        <Form.Label>Rôle</Form.Label>
                        <Form.Select
                            value={role}
                            aria-label="Sélectionner un rôle"
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="">Sélectionner un rôle</option>
                            <option value="admin">Admin</option>
                            <option value="client">Client</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="formPassword">
                        <Form.Label>Mot de passe</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Entrer le mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            isInvalid={!!passwordError}
                        />
                        <Form.Control.Feedback type="invalid">
                            {passwordError}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formConfirmPassword">
                        <Form.Label>Confirmer le mot de passe</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirmer le mot de passe"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            isInvalid={!!confirmPasswordError}
                        />
                        <Form.Control.Feedback type="invalid">
                            {confirmPasswordError}
                        </Form.Control.Feedback>
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

export default AddUserModal;
