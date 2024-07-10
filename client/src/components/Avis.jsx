import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../App.css';

function Avis() {
  const [rating, setRating] = useState(0);
  const [commentaire, setCommentaire] = useState('');

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Authentification requise.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/contactmsyt/addAvis", {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, commentaire })
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Avis ajouté avec succès !");
        setRating(0);
        setCommentaire('');
      } else {
        toast.error(data.message || "Échec de l'ajout de l'avis");
      } 
    } catch (err) {
      console.error("Erreur réseau ou serveur injoignable:", err);
      toast.error("Erreur réseau ou serveur injoignable.");
    }
  };

  return (
    <Container fluid className=" d-flex flex-column justify-content-center bg-light p-3 rounded-3 shadow mt-5">
      <ToastContainer position="bottom-center" className="custom-toast-container" autoClose={5000} />
      <h1 className="text-center mb-4">Enquête de Satisfaction</h1>
      <Form onSubmit={handleSubmit} className="p-4 bg-white shadow-sm rounded">
        <Row>
          <Col md={12} className="mb-3">
            <Form.Group>
              <Form.Label>Niveau de satisfaction :</Form.Label>
              <div className="d-flex justify-content-center">
                {[1, 2, 3, 4, 5].map((star, index) => (
                  <i key={index}
                    className={`bi ${star <= rating ? 'bi-star-fill text-warning' : 'bi-star'}`}
                    onClick={() => setRating(star)}
                    style={{ cursor: 'pointer', fontSize: '24px' }}
                  />
                ))}
              </div>
            </Form.Group>
          </Col>
          <Col md={12} className="mb-3">
            <Form.Group>
              <Form.Label>Commentaire :</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                placeholder="Laissez un commentaire sur votre expérience"
                required
                style={{ resize: 'none' }}
              />
            </Form.Group>
          </Col>
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
    Soumettre
    </Button>
</div>
</Form>
    </Container>
  );
}

export default Avis;
