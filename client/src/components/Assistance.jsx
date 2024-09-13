import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Assistance() {

  const user = JSON.parse(localStorage.getItem("user"))
  console.log(user._id)
  const [formData, setFormData] = useState({
    clientId: user._id,
    serviceType: '',
    description: ''
  });

  const handleOptionChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("Submitting form data:", formData); 
      const response = await fetch("http://localhost:3000/contactmsyt/addAssistance", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });                              

      const data = await response.json();
      if (response.ok) {
        toast.success("Nous avons bien reçu votre demande d'assistance. Nous la traiterons et vous répondrons dans les plus brefs délais");
      } else {
        toast.error(data.message || "Échec de l'ajout de la demande d'assistance");
      }
    } catch (err) {
      toast.error("Erreur réseau ou serveur injoignable.");
    }
  };

  return (
    <Container fluid className="d-flex flex-column justify-content-center bg-light p-4 rounded-3 shadow mt-5">
      <ToastContainer position="bottom-center" className="custom-toast-container" autoClose={5000} />
      <h1 className="text-center mb-4">Ajouter une demande d'assistance</h1>
      <Form onSubmit={handleSubmit} className="p-4 bg-white shadow-sm rounded">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Choisissez le service concerné :</Form.Label>
              <Form.Check 
                type="radio" 
                label="Service technique"
                id="serviceTechnique-check"
                name="serviceType"
                value="serviceTechnique"
                checked={formData.serviceType === "serviceTechnique"}
                onChange={handleOptionChange}
              />
              <Form.Check
                type="radio"
                label="Service commercial"
                id="serviceCommerciale-check"
                name="serviceType"
                value="serviceCommerciale"
                checked={formData.serviceType === "serviceCommerciale"}
                onChange={handleOptionChange}
              />
              <Form.Check
                type="radio"
                label="Service juridique"
                id="serviceJuridique-check"
                name="serviceType"
                value="serviceJuridique"
                checked={formData.serviceType === "serviceJuridique"}
                onChange={handleOptionChange}
              />
              <Form.Check
                type="radio"
                label="Service administratif"
                id="serviceAdministratif-check"
                name="serviceType"
                value="serviceAdministratif"
                checked={formData.serviceType === "serviceAdministratif"}
                onChange={handleOptionChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Veuillez préciser votre demande :</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
              
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{ resize: 'none' }}
              />
            </Form.Group>
          </Col>
        </Row>
        <div style={{ textAlign: 'center' }}>
          <Button variant="primary" type="submit" style={{
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
            fontWeight: 'bold',
            border: '2px solid #007bff'
          }}>
            Envoyer
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default Assistance;

