import React from 'react';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';

const ReclamationForm = ({ 
  reclamation = {}, 
  editMode = {}, 
  validationErrors = {}, 
  handleInputChange, 
  toggleFieldEditMode, 
  confirmEdit, 
  role 
}) => {
  const {
    nomClient = '',
    emailClient = '',
    telephone = '',
    objet = '',
    description = '',
    serviceConcerne = '',

  } = reclamation;

  return (
    <Form key={reclamation._id || 'default-key'}>
      <Row className="mb-3">
        <EditableField 
          label="Nom du Client:" 
          field="nomClient" 
          value={nomClient} 
          reclamationId={reclamation._id || 'default-key'} 
          editMode={editMode} 
          validationErrors={validationErrors} 
          handleInputChange={handleInputChange} 
          toggleFieldEditMode={toggleFieldEditMode} 
          confirmEdit={confirmEdit} 
        />
        <EditableField 
          label="Email du Client:" 
          field="emailClient" 
          value={emailClient} 
          reclamationId={reclamation._id || 'default-key'} 
          editMode={editMode} 
          validationErrors={validationErrors} 
          handleInputChange={handleInputChange} 
          toggleFieldEditMode={toggleFieldEditMode} 
          confirmEdit={confirmEdit} 
        />
      </Row>
      <Row className="mb-3">
      <EditableField 
          label="telephone:" 
          field="telephone" 
          value={telephone} 
          reclamationId={reclamation._id || 'default-key'} 
          editMode={editMode} 
          validationErrors={validationErrors} 
          handleInputChange={handleInputChange} 
          toggleFieldEditMode={toggleFieldEditMode} 
          confirmEdit={confirmEdit} 
        />
      </Row>
      
      <Row className="mb-3">
        <EditableField 
          label="Objet:" 
          field="objet" 
          value={objet} 
          reclamationId={reclamation._id || 'default-key'} 
          editMode={editMode} 
          validationErrors={validationErrors} 
          handleInputChange={handleInputChange} 
          toggleFieldEditMode={toggleFieldEditMode} 
          confirmEdit={confirmEdit} 
        />
      </Row>

      <Row className="mb-3">
      <EditableField 
          label="Description:" 
          field="description" 
          value={description} 
          reclamationId={reclamation._id || 'default-key'} 
          editMode={editMode} 
          validationErrors={validationErrors} 
          handleInputChange={handleInputChange} 
          toggleFieldEditMode={toggleFieldEditMode} 
          confirmEdit={confirmEdit} 
        />
      </Row>

      
      
      <Row className="mb-3">
        {(role !== '"admin"') ? 
          <StaticField label="Service Concérné:" value={serviceConcerne} />
          :
          <EditableField 
            label="Service Concérné :" 
            field="serviceconcérné" 
            value={serviceConcerne} 
            reclamationId={reclamation._id || 'default-key'} 
            editMode={editMode} 
            validationErrors={validationErrors} 
            handleInputChange={handleInputChange} 
            toggleFieldEditMode={toggleFieldEditMode} 
            confirmEdit={confirmEdit} 
          />
        }
      </Row>
    </Form>
  );
};

const EditableField = ({ 
  label, 
  field, 
  value = '',
  reclamationId, 
  editMode, 
  validationErrors, 
  handleInputChange, 
  toggleFieldEditMode, 
  confirmEdit 
}) => (
  <Form.Group as={Col} controlId={`formGrid${field}`}>
    <Form.Label>{label}</Form.Label>
    <div className="d-flex align-items-center">
      <Form.Control 
        type="text" 
        name={field} 
        defaultValue={value}
        onChange={(e) => handleInputChange(e, reclamationId, field)} 
        readOnly={!editMode[reclamationId]?.[field]} 
      />
      {!editMode[reclamationId]?.[field] && (
        <Button 
          variant="link" 
          onClick={() => toggleFieldEditMode(reclamationId, field)} 
          className="ml-2 p-0" 
          style={{ border: 'none', background: 'none' }}
        >
          <i className="bi bi-pencil" style={{ fontSize: '0.75rem' }}></i>
        </Button>
      )}
      {editMode[reclamationId]?.[field] && (
        <Button   
          variant="link" 
          onClick={() => confirmEdit(reclamationId, field)} 
          className="confirm-icon"
        >
          <i className="bi bi-check-circle"></i>
        </Button>
      )}
    </div>
    {validationErrors[field] && <Alert variant="danger">{validationErrors[field]}</Alert>}
  </Form.Group>
);

const StaticField = ({ label, value = '' }) => (
  <Form.Group as={Col}>
    <Form.Label>{label}</Form.Label>
    <Form.Control type="text" defaultValue={value} readOnly />
  </Form.Group>
);

export default ReclamationForm;
