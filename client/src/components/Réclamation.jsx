import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

const ReclamationComponent = ({ data, role }) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [editMode, setEditMode] = useState({});
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [localRole, setLocalRole] = useState(role || "admin");
  const user = JSON.parse(localStorage.getItem('user'));
  const [formData, setFormData] = useState({
    clientId: user._id,
    serviceConcerne: '',
    objet: '',
    description: ''
  });

  const fetchReclamations = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log("Token JWT utilisé:", token);

      const response = await fetch('http://localhost:3000/contactmsyt/reclamations', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setReclamations(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des réclamations: ", error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReclamations();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const validateInput = (name, value) => {
    let errors = { ...validationErrors };
    if (!value.trim()) {
      errors[name] = 'Ce champ ne peut pas être vide.';
    } else {
      switch (name) {
        case 'nomBeneficiaire':
          if (!/^[a-zA-Z\s]+$/.test(value)) {
            errors[name] = 'Le nom doit contenir uniquement des lettres.';
          } else {
            delete errors[name];
          }
          break;
        case 'telephoneBeneficiaire':
          if (!/^\d{8}$/.test(value)) {
            errors[name] = 'Le numéro de téléphone doit contenir exactement 8 chiffres et aucune lettre.';
          } else {
            delete errors[name];
          }
          break;
        case 'emailBeneficiaire':
          if (!/\S+@\S+\.\S+/.test(value)) {
            errors[name] = 'L\'adresse e-mail n\'est pas valide.';
          } else {
            delete errors[name];
          }
          break;
        default:
          break;
      }
    }
    setValidationErrors(errors);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/contactmsyt/reclamations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Réclamation soumise avec succès!');
        setFormData({
          serviceConcerne: '',
          objet: '',
          description: ''
        });
        fetchReclamations(); 
      } else {
        toast.error(data.message || 'Échec de la soumission de la réclamation.');
      }
    } catch (err) {
      toast.error('Erreur réseau ou serveur injoignable.');
    }
  };

  const handleSaveChanges = async () => {
    const updatedReclamations = reclamations.map(async (p) => {
      if (!p.objet.trim()) {
        alert("L'objet est requis.");
        return p;
      }
      if (p._id && Object.values(editMode[p._id] || {}).some(field => field)) {
        try {
          console.log('Updating reclamation with data:', p);
          const response = await fetch(`http://localhost:3000/contactmsyt/updateReclamation/${p._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(p),
          });
          if (!response.ok) {
            throw new Error('Échec de la mise à jour de la réclamation');
          }
          return await response.json();
        } catch (error) {
          console.error('Erreur lors de la mise à jour:', error);
          throw error;
        }
      }
      return p;
    });

    Promise.all(updatedReclamations)
      .then(updatedData => {
        setReclamations(updatedData);
        setEditMode({});
        alert('Modifications enregistrées avec succès!');
      })
      .catch(error => {
        alert('Erreur lors de l\'enregistrement des modifications.');
      });
  };

  const toggleFieldEditMode = (reclamationId, field) => {
    setEditMode(prev => ({
      ...prev,
      [reclamationId]: {
        ...prev[reclamationId],
        [field]: !prev[reclamationId]?.[field]
      }
    }));
  };

  if (loading) return <p>Chargement en cours...</p>;
  if (error) return <p>{error}</p>;

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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              placeholder="Décrivez le problème ou la situation"
              required
              style={{ resize: 'none' }}
            />
          </Form.Group>
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
            Soumettre la demande
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default ReclamationComponent;
