import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import { UserContext } from '../App';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/contactmsyt/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })

      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('name', data.name); 
        setUser(data);
        toast.success("Connexion réussie ! Redirection vers le tableau de bord...");
        setTimeout(() => navigate('/dashboard'), 1000);
        
      }
      else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Échec de la connexion.");
      }
    } catch (err) {
      console.error('Error:', err);
      setErrorMessage("Erreur réseau ou serveur injoignable.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Veuillez entrer votre adresse email pour réinitialiser le mot de passe.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/contactmsyt/login/forgot-password", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (response.ok) {
        toast.info("Un email de réinitialisation a été envoyé. Veuillez vérifier votre boîte de réception.");
        setShowResetModal(false);
        
      } else {
        toast.error(data.message || "Erreur lors de la demande de réinitialisation.");
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error("Erreur réseau ou serveur injoignable.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container fluid className="d-flex justify-content-center align-items-center login-container">
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <Form onSubmit={handleSubmit} className="p-4 shadow-lg login-form bg-white rounded">
        <h2 className="text-center mb-4">Accéder à mon compte</h2>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            id="email"
            placeholder="Tapez votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control
            type="password"
            id="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading} className="form-btn w-100">{loading ? 'Chargement...' : 'Connexion'}</Button>
        <div className="text-center mt-3">
          <Button variant="link" onClick={() => setShowResetModal(true)} disabled={loading}>Mot de passe oublié?</Button>
        </div>
      </Form>

      <Modal show={showResetModal} onHide={() => setShowResetModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Réinitialiser le mot de passe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Email pour réinitialiser le mot de passe</Form.Label>
            <Form.Control
              type="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResetModal(false)}>Fermer</Button>
          <Button variant="primary" onClick={handleForgotPassword}>Envoyer le lien de réinitialisation</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Login;