import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, FormLabel, Alert } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Parrainage() {
const [formData, setFormData] = useState({
nomBeneficiaire: '',
emailBeneficiaire: '',
telephoneBeneficiaire: '',
serviceParrainage: '',
siteweb: false,
referencement: false,
gestion: false,
shooting: false,
visite: false,
});

const [validationErrors, setValidationErrors] = useState({});

const handleOptionChange = (event) => {
const { name, checked, type, value } = event.target;
setFormData(prev => ({
...prev,
[name]: type === 'checkbox' ? checked : value
}));
};

const handleChange = (event) => {
const { name, value } = event.target;
validateInput(name, value);
setFormData(prev => ({ ...prev, [name]: value }));
};

const validateInput = (name, value) => {
let errors = {...validationErrors};
switch (name) {
case 'nomBeneficiaire':
if (!value.match(/^[a-zA-Z\s]*$/)) {
errors[name] = "Le nom doit contenir uniquement des lettres et des espaces.";
} else {
delete errors[name];
}
break;
case 'telephoneBeneficiaire':
if (!value.match(/^\d{8}$/) && value !== "") {
errors[name] = "Le numéro de téléphone doit contenir 8 chiffres.";
} else {
delete errors[name];
}
break;
case 'emailBeneficiaire':
if (value && !/\S+@\S+.\S+/.test(value)) {
errors[name] = "L'adresse e-mail n'est pas valide.";
} else {
delete errors[name];
}
break;
default:
break;
}
setValidationErrors(errors);
};

const handleSubmit = async (event) => {
event.preventDefault();
if (Object.keys(validationErrors).length > 0) {
toast.error("Veuillez corriger les erreurs avant de soumettre.");
return;
}
try {
const response = await fetch('http://localhost:3000/contactmsyt/addParrainage', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
...formData,
siteweb: formData.siteweb.toString(),
referencement: formData.referencement.toString(),
gestion: formData.gestion.toString(),
shooting: formData.shooting.toString(),
visite: formData.visite.toString(),
}),
});
const data = await response.json();
if (response.ok) {
toast.success("Nous avons bien reçu votre demande de parrainage. Nous la traiterons et vous répondrons dans les plus brefs délais.");
} else {
toast.error(data.message || 'Échec de la soumission de parrainage.');
}
} catch (err) {
toast.error('Erreur réseau ou serveur injoignable.');
}
};

return (
<Container fluid className="d-flex flex-column justify-content-center bg-light p-4 rounded-3 shadow mt-5">
<ToastContainer position="bottom-center" autoClose={5000} />
<h1 className="text-center mb-4">Demande de Parrainage</h1>
<Form onSubmit={handleSubmit} className="p-4 bg-white shadow-sm rounded">
<Row className="g-2 mb-3">
<Col xs={12} md={6}>
<Form.Group>
<Form.Label>Nom du bénéficiaire :</Form.Label>
<Form.Control
type="text"
name="nomBeneficiaire"
value={formData.nomBeneficiaire}
onChange={handleChange}
/>
{validationErrors.nomBeneficiaire && <Alert variant="danger">{validationErrors.nomBeneficiaire}</Alert>}
</Form.Group>
</Col>
<Col xs={12} md={6}>
<Form.Group>
<Form.Label>Adresse e-mail du bénéficiaire :</Form.Label>
<Form.Control
type="email"
name="emailBeneficiaire"
value={formData.emailBeneficiaire}
onChange={handleChange}
/>
{validationErrors.emailBeneficiaire && <Alert variant="danger">{validationErrors.emailBeneficiaire}</Alert>}
</Form.Group>
</Col>
</Row>
<Row className="g-2 mb-3">
<Col xs={12} md={6}>
<Form.Group>
<Form.Label>Numéro de téléphone du bénéficiaire :</Form.Label>
<Form.Control
type="text"
name="telephoneBeneficiaire"
value={formData.telephoneBeneficiaire}
onChange={handleChange}
/>
{validationErrors.telephoneBeneficiaire && <Alert variant="danger">{validationErrors.telephoneBeneficiaire}</Alert>}
</Form.Group>
</Col>
</Row>
<Row className="g-2 mb-3">
<Col xs={12}>
<Form.Group>
<FormLabel>Service à parrainer :</FormLabel>
<Form.Check
type="checkbox"
label="Création d'un Site Web"
id="siteweb-check"
name="siteweb"
checked={formData.siteweb}
onChange={handleOptionChange}
/>
<Form.Check
type="checkbox"
label="Référencement"
id="referencement-check"
name="referencement"
checked={formData.referencement}
onChange={handleOptionChange}
/>
<Form.Check
type="checkbox"
label="Gestion des réseaux sociaux"
id="gestion-check"
name="gestion"
checked={formData.gestion}
onChange={handleOptionChange}
/>
<Form.Check
type="checkbox"
label="Shooting Produits"
id="shooting-check"
name="shooting"
checked={formData.shooting}
onChange={handleOptionChange}
/>
<Form.Check
type="checkbox"
label="Visite Virtuelle 360°"
id="visite-check"
name="visite"
checked={formData.visite}
onChange={handleOptionChange}
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
Parrainer
</Button>
</div>
</Form>
</Container>
);
}

export default Parrainage;