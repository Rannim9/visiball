import React from 'react';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';

const ParrainageForm = ({ 
  parrainage = {}, 
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
    nomBeneficiaire = '',
    emailBeneficiaire = '',
    telephoneBeneficiaire = '',
    serviceParraine = '',
  } = parrainage;

  return (
    <Form key={parrainage._id || 'default-key'}>
      <Row className="mb-3">
      <EditableField 
          label="Nom du Client:" 
          field="nomClient" 
          value={nomClient} 
          parrainageId={parrainage._id || 'default-key'} 
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
          parrainageId={parrainage._id || 'default-key'} 
          editMode={editMode} 
          validationErrors={validationErrors} 
          handleInputChange={handleInputChange} 
          toggleFieldEditMode={toggleFieldEditMode} 
          confirmEdit={confirmEdit} 
        />
        <EditableField 
          label="Nom du Bénéficiaire:" 
          field="nomBeneficiaire" 
          value={nomBeneficiaire} 
          parrainageId={parrainage._id || 'default-key'} 
          editMode={editMode} 
          validationErrors={validationErrors} 
          handleInputChange={handleInputChange} 
          toggleFieldEditMode={toggleFieldEditMode} 
          confirmEdit={confirmEdit} 
        />
        <EditableField 
          label="Email du Bénéficiaire:" 
          field="emailBeneficiaire" 
          value={emailBeneficiaire} 
          parrainageId={parrainage._id || 'default-key'} 
          editMode={editMode} 
          validationErrors={validationErrors} 
          handleInputChange={handleInputChange} 
          toggleFieldEditMode={toggleFieldEditMode} 
          confirmEdit={confirmEdit} 
        />
      </Row>
      
      <Row className="mb-3">
        <EditableField 
          label="Téléphone du Bénéficiaire:" 
          field="telephoneBeneficiaire" 
          value={telephoneBeneficiaire} 
          parrainageId={parrainage._id || 'default-key'} 
          editMode={editMode} 
          validationErrors={validationErrors} 
          handleInputChange={handleInputChange} 
          toggleFieldEditMode={toggleFieldEditMode} 
          confirmEdit={confirmEdit} 
        />
      </Row>
      
      <Row className="mb-3">
        {(role !== '"admin"') ? 
          <StaticField label="Service à parrainer:" value={serviceParraine} />
          :
          <EditableField 
            label="Service à parrainer:" 
            field="serviceParraine" 
            value={serviceParraine} 
            parrainageId={parrainage._id || 'default-key'} 
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
  parrainageId, 
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
        onChange={(e) => handleInputChange(e, parrainageId, field)} 
        readOnly={!editMode[parrainageId]?.[field]} 
      />
      {!editMode[parrainageId]?.[field] && (
        <Button 
          variant="link" 
          onClick={() => toggleFieldEditMode(parrainageId, field)} 
          className="ml-2 p-0" 
          style={{ border: 'none', background: 'none' }}
        >
          <i className="bi bi-pencil" style={{ fontSize: '0.75rem' }}></i>
        </Button>
      )}
      {editMode[parrainageId]?.[field] && (
        <Button 
          variant="link" 
          onClick={() => confirmEdit(parrainageId, field)} 
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

export default ParrainageForm;
