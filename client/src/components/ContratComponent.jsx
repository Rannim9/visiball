import React from 'react';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';

const ContratForm = ({ 
  ct, 
  editMode, 
  validationErrors, 
  handleInputChange, 
  toggleFieldEditMode, 
  confirmEdit, 
  formatNumber,
  role
}) => {
  return (
    <Form key={ct._id}>
      <Row className="mb-3">
        <EditableField 
          label="Nom et prénom:" 
          field="nomreferent" 
          value={ct.nomreferent} 
          ctId={ct._id} 
          editMode={editMode} 
          validationErrors={validationErrors} 
          handleInputChange={handleInputChange} 
          toggleFieldEditMode={toggleFieldEditMode} 
          confirmEdit={confirmEdit} 
        />
        {/* Raison Sociale */}
        <EditableField 
          label="Raison sociale :" 
          field="raisonsociale" 
          value={ct.raisonsociale} 
          ctId={ct._id} 
          editMode={editMode} 
          validationErrors={validationErrors} 
          handleInputChange={handleInputChange} 
          toggleFieldEditMode={toggleFieldEditMode} 
          confirmEdit={confirmEdit} 
        />
      </Row>
      
      {/* Telephone and Email */}
      <Row className="mb-3">
        <EditableField 
          label="Numéro de téléphone :" 
          field="telephone" 
          value={ct.telephone} 
          ctId={ct._id}   
          editMode={editMode} 
          validationErrors={validationErrors} 
          handleInputChange={handleInputChange} 
          toggleFieldEditMode={toggleFieldEditMode} 
          confirmEdit={confirmEdit} 
        />
        <EditableField 
          label="Adresse e-mail :" 
          field="email" 
          value={ct.email} 
          ctId={ct._id} 
          editMode={editMode} 
          validationErrors={validationErrors} 
          handleInputChange={handleInputChange} 
          toggleFieldEditMode={toggleFieldEditMode} 
          confirmEdit={confirmEdit} 
        />
      </Row>
      
      {/* Physical Address */}
      <Row className="mb-3">
        <EditableField 
          label="Adresse physique :" 
          field="adresse" 
          value={ct.adresse} 
          ctId={ct._id} 
          editMode={editMode} 
          validationErrors={validationErrors} 
          handleInputChange={handleInputChange} 
          toggleFieldEditMode={toggleFieldEditMode} 
          confirmEdit={confirmEdit} 
        />
      </Row>
      
      {/* Siret Number and Engagement Duration */}
      
        {(role !== '"admin"') ? 
        <Row className="mb-3">
            <StaticField label="Numéro de Siret :" value={ct.siret} /> 
            <StaticField label="Durée d'engagement :" value={ct.duree} />
        </Row>
        
        :  
        <Row className="mb-3">
            <EditableField 
                label="Numéro de Siret :" 
                field="siret" 
                value={ct.siret} 
                ctId={ct._id} 
                editMode={editMode} 
                validationErrors={validationErrors} 
                handleInputChange={handleInputChange} 
                toggleFieldEditMode={toggleFieldEditMode} 
                confirmEdit={confirmEdit} 
            />
            <EditableField 
                label="Durée d'engagement :" 
                field="duree" 
                value={ct.duree} 
                ctId={ct._id} 
                editMode={editMode} 
                validationErrors={validationErrors} 
                handleInputChange={handleInputChange} 
                toggleFieldEditMode={toggleFieldEditMode} 
                confirmEdit={confirmEdit} 
            />
        </Row>

        }
      
      {/* Monthly Payments */}
      {(role !== '"admin"') ? 
              <Row className="mb-3">
              <StaticField label="Mensualité HT :" value={formatNumber(ct.ht)} />
              <StaticField label="TVA :" value={formatNumber(ct.tva)} />
              <StaticField label="Mensualité TTC :" value={formatNumber(ct.ttc)} />
            </Row>
            :
            <Row className="mb-3">
             <EditableField 
                label="Mensualité HT :" 
                field="ht" 
                value={ct.ht} 
                ctId={ct._id} 
                editMode={editMode} 
                validationErrors={validationErrors} 
                handleInputChange={handleInputChange} 
                toggleFieldEditMode={toggleFieldEditMode} 
                confirmEdit={confirmEdit} 
            />
            <EditableField 
                label="TVA :" 
                field="tva" 
                value={ct.tva} 
                ctId={ct._id} 
                editMode={editMode} 
                validationErrors={validationErrors} 
                handleInputChange={handleInputChange} 
                toggleFieldEditMode={toggleFieldEditMode} 
                confirmEdit={confirmEdit} 
            />
            <EditableField 
                label="Mensualité TTC :" 
                field="ttc" 
                value={ct.ttc} 
                ctId={ct._id} 
                editMode={editMode} 
                validationErrors={validationErrors} 
                handleInputChange={handleInputChange} 
                toggleFieldEditMode={toggleFieldEditMode} 
                confirmEdit={confirmEdit} 
            />
          </Row>
    }
    {
        (role !== '"admin"')?
        <Row className="mb-3">
            <StaticField label="Date de signature :" value={ct.signature ? new Date(ct.signature).toLocaleDateString() : 'N/A'} />
        </Row>
        :
        <Row className="mb-3">
            <EditableField 
                label="Date de signature :" 
                field="signature" 
                value={ct.signature ? new Date(ct.signature).toLocaleDateString() : 'N/A'} 
                ctId={ct._id} 
                editMode={editMode} 
                validationErrors={validationErrors} 
                handleInputChange={handleInputChange} 
                toggleFieldEditMode={toggleFieldEditMode} 
                confirmEdit={confirmEdit} 
            />
        </Row>
    }

{
        (role !== '"admin"')?
        <Row className="mb-3">
        <StaticField label="Commercial référent :" value={ct.referent} />
        </Row>
        :
        <Row className="mb-3">
            <EditableField 
                label="Commercial référent :" 
                field="referent" 
                value={ct.referent} 
                ctId={ct._id} 
                editMode={editMode} 
                validationErrors={validationErrors} 
                handleInputChange={handleInputChange} 
                toggleFieldEditMode={toggleFieldEditMode} 
                confirmEdit={confirmEdit} 
            />
        </Row>
    }


    </Form>
  );
};

// Editable Field Component
const EditableField = ({ 
  label, 
  field, 
  value, 
  ctId, 
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
        onChange={(e) => handleInputChange(e, ctId, field)} 
        readOnly={!editMode[ctId]?.[field]} 
      />
      {!editMode[ctId]?.[field] && (
        <Button 
          variant="link" 
          onClick={() => toggleFieldEditMode(ctId, field)} 
          className="ml-2 p-0" 
          style={{ border: 'none', background: 'none' }}
        >
          <i className="bi bi-pencil" style={{ fontSize: '0.75rem' }}></i>
        </Button>
      )}
      {editMode[ctId]?.[field] && (
        <Button 
          variant="link" 
          onClick={() => confirmEdit(ctId, field)} 
          className="confirm-icon"
        >
          <i className="bi bi-check-circle"></i>
        </Button>
      )}
    </div>
    {validationErrors[field] && <Alert variant="danger">{validationErrors[field]}</Alert>}
  </Form.Group>
);

// Static Field Component
const StaticField = ({ label, value }) => (
  <Form.Group as={Col}>
    <Form.Label>{label}</Form.Label>
    <Form.Control type="text" defaultValue={value} readOnly />
  </Form.Group>
);

export default ContratForm;
