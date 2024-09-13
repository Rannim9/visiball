import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FactureForm =({
        facture = {}, 
        editMode = {}, 
        validationErrors = {}, 
        handleInputChange, 
        toggleFieldEditMode, 
        confirmEdit, 
        role 
      }) => {
        const {
        numeroFacture= '',
        montantTH= '',
        tva= '',
        ttc= '',
        dateEdition= ''
    }=facture;

    return (
        <Form key={formData._id || 'default-key'}>
          <Row className="mb-3">
            <EditableField
              label="Numéro de Facture"
              field="numeroFacture"
              value={formData.numeroFacture}
              factureId={formData._id || 'default-key'}
              editMode={editMode}
              validationErrors={validationErrors}
              handleInputChange={handleInputChange}
              toggleFieldEditMode={toggleFieldEditMode}
              confirmEdit={confirmEdit}
            />
    
            <EditableField
              label="Montant HT"
              field="montantTH"
              value={formData.montantTH}
              factureId={formData._id || 'default-key'}
              editMode={editMode}
              validationErrors={validationErrors}
              handleInputChange={handleInputChange}
              toggleFieldEditMode={toggleFieldEditMode}
              confirmEdit={confirmEdit}
            />
    
            <EditableField
              label="TVA (%)"
              field="tva"
              value={formData.tva}
              factureId={formData._id || 'default-key'}
              editMode={editMode}
              validationErrors={validationErrors}
              handleInputChange={handleInputChange}
              toggleFieldEditMode={toggleFieldEditMode}
              confirmEdit={confirmEdit}
            />
    
            <EditableField
              label="Montant TTC"
              field="ttc"
              value={formData.ttc}
              factureId={formData._id || 'default-key'}
              editMode={editMode}
              validationErrors={validationErrors}
              handleInputChange={handleInputChange}
              toggleFieldEditMode={toggleFieldEditMode}
              confirmEdit={confirmEdit}
            />
          </Row>
    
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Enregistrement..." : "Ajouter la facture"}
          </Button>
    
          <hr />
    
          {factures.length > 0 ? (
            <>
              <h2>Liste des factures</h2>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Numéro de Facture</th>
                    <th>Nom du Client</th>
                    <th>Email du Client</th>
                    <th>Montant HT</th>
                    <th>TVA</th>
                    <th>TTC</th>
                    <th>Date d'Édition</th>
                  </tr>
                </thead>
                <tbody>
                  {factures.map(facture => (
                    <tr key={facture._id}>
                      <td>{facture.numeroFacture}</td>
                      <td>{facture.nomClient}</td>
                      <td>{facture.emailClient}</td>
                      <td>{facture.montantTH ? facture.montantTH.toFixed(2) : 'N/A'} dt</td>
                      <td>{facture.tva ? facture.tva.toFixed(0) : 'N/A'} %</td>
                      <td>{facture.ttc ? facture.ttc.toFixed(2) : 'N/A'} €</td>
                      <td>{facture.dateEdition ? new Date(facture.dateEdition).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="d-flex justify-content-center mt-4">
                <Button onClick={handleDownload} variant="primary">
                  Télécharger PDF
                </Button>
              </div>
            </>
          ) : (
            <p>Aucune facture disponible.</p>
          )}
        </Form>
      );
    };
    
    const EditableField = ({
      label,
      field,
      value = '',
      factureId,
      editMode,
      validationErrors,
      handleInputChange,
      toggleFieldEditMode,
      confirmEdit,
    }) => (
      <Form.Group as={Col} controlId={`formGrid${field}`}>
        <Form.Label>{label}</Form.Label>
        <div className="d-flex align-items-center">
          <Form.Control
            type="text"
            name={field}
            defaultValue={value}
            onChange={(e) => handleInputChange(e, factureId, field)}
            readOnly={!editMode[factureId]?.[field]}
          />
          {!editMode[factureId]?.[field] && (
            <Button
              variant="link"
              onClick={() => toggleFieldEditMode(factureId, field)}
              className="ml-2 p-0"
              style={{ border: 'none', background: 'none' }}
            >
              <i className="bi bi-pencil" style={{ fontSize: '0.75rem' }}></i>
            </Button>
          )}
          {editMode[factureId]?.[field] && (
            <Button variant="link" onClick={() => confirmEdit(factureId, field)} className="confirm-icon">
              <i className="bi bi-check-circle"></i>
            </Button>
          )}
        </div>
        {validationErrors[field] && <Alert variant="danger">{validationErrors[field]}</Alert>}
      </Form.Group>
    );
    
    export default FactureForm;