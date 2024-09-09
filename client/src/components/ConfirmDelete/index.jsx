import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmDeleteModal = ({ show, handleClose, handleConfirm }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmer la supression</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      Etes-vous sûr de vouloir supprimer cet utilisateur ?      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Exit
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Supprimer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDeleteModal;
