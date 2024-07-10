import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Reclamation() {
  const [formData, setFormData] = useState({
    objet: '',
    description: '',
    serviceConcerne: ''
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('userToken'); 
    try {
      const response = await fetch("http://localhost:3000/contactmsyt/addReclamations", {
        method: ' post',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Nous avons bien reçu votre réclamation .Nous la traiterons et vous répondrons dans les plus brefs délais.");
        setFormData({ objet: '', description: '', serviceConcerne: '' }); 
      } else {
        toast.error(data.message || "Échec de l'ajout de la réclamation");
      }
    } catch (err) {
      toast.error("Erreur réseau ou serveur injoignable.");
    }
  };

  return (
    <Container fluid className=" d-flex flex-column justify-content-center bg-light p-4 rounded-3 shadow mt-5">
      <ToastContainer position="bottom-center" className="custom-toast-container" autoClose={5000} />
      <h1 className="text-center mb-4">Ajouter une réclamation</h1>
      <Form onSubmit={handleSubmit} className="p-4 bg-white shadow-sm rounded">
        <Row>
          <Form.Group as={Col} md={12} className="mb-3">
            <Form.Label>Service concerné :</Form.Label>
            <Form.Control
              as="select"
              name="serviceConcerne"
              value={formData.serviceConcerne}
              onChange={handleInput}
              required
            >
              <option value="">Choisissez un service</option>
              <option value="technique">Service Technique</option>
              <option value="commercial">Service Commercial</option>
              <option value="juridique">Service Juridique</option>
              <option value="administratif">Service Administratif</option>
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} md={12} className="mb-3">
            <Form.Label>Objet de la réclamation :</Form.Label>
            <Form.Control
              type="text"
              name="objet"
              value={formData.objet}
              onChange={handleInput}
              placeholder="Entrez l'objet de la réclamation"
              required
            />
          </Form.Group>
          <Form.Group as={Col} md={12} className="mb-3">
            <Form.Label>Description de la réclamation :</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleInput}
              placeholder="Décrivez le problème ou la situation"
              required
              style={{ resize: 'none' }}

            />
          </Form.Group>
        </Row>
        <div style={{ textAlign: 'center' }}>
                        <Button  variant="primary" type="submit"  style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        margin: '10px auto', 
                        backgroundColor: '#007bff',
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: '25px',
                        textAlign: 'center',
                        transition: 'background-color 0.3s',
                        fontSize: '14px', 
                        fontWeight: 'bold' ,
                        border: '2px solid #007bff '
  }}>
    Soumettre la demande
    </Button>
</div>
    </Form>
    </Container>
  );
}

export default Reclamation;
