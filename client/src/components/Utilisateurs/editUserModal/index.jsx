import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditUserModal = ({ show, handleClose, handleSave, user }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [activated, setActivated] = useState(false)
    const [role, setRole] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [confirmPasswordError, setConfirmPasswordError] = useState("")
    
    useEffect(() => { 
        if (user) {
            console.log(user.activated)
            setName(user.name || '');
            setEmail(user.email || '');
            setActivated(user.activated || false)
            setRole(user.role || '');
        }
    }, [user]);

    const onSave = () => {
        setEmailError('')
        setPasswordError('')
        setConfirmPasswordError('')
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setEmailError('Veuillez entrer une adresse email valide.');
            return;
        }
        if (password.length < 8 && password.length > 0) {
            setPasswordError('un mot de passe doit avoir plus que 8 caracteres')
            return;
        }
        if (confirmPassword !== password) {
            setConfirmPasswordError('Veuillez confirmer votre nouveau mot de passe')
            return;
        }
        setEmailError('')
        setPasswordError('')
        setConfirmPasswordError('')
    
        const updatedUser = { ...user, name, email, activated, role, password };
        handleSave(updatedUser);
        onExit();
    };

    const onExit = () => {
        setPassword("")
        setConfirmPassword("")
        setPasswordError("")
        setConfirmPasswordError("")
        handleClose()
    }
    

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
                    <Form.Group controlId="formRole">
                        <Form.Label>Role </Form.Label>
                        <Form.Select
                            value={role}
                            aria-label="Role select"
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="admin">Admin</option>
                            <option value="client">Client</option>
                        </Form.Select>
                       
                    </Form.Group>
                    <Form.Group controlId="formPassword">
                        <Form.Label>Nouveau mot de passe</Form.Label>
                        <Form.Control 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        isInvalid={!!passwordError}
                    />
                    <Form.Control.Feedback type="invalid">
                        {passwordError}
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formConfirmPassword">
                        <Form.Label>Confirmer mot de passe</Form.Label>
                        <Form.Control 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        isInvalid={!!confirmPasswordError}
                    />
                    <Form.Control.Feedback type="invalid">
                        {confirmPasswordError}
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formStatus">
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

export default EditUserModal;
