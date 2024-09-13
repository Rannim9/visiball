import React, { useEffect, useState } from 'react';
import { Modal, Button, Dropdown, InputGroup, Form, ListGroup } from 'react-bootstrap'; // Using React Bootstrap for the modal component

const AssistanceModal = ({ show, onClose, assistance, onSave }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [reply, setReply] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('en_cours');
  
  useEffect(() => {
    if (assistance) {
      setSelectedStatus(assistance.status || 'en_cours'); // Default to 'en_cours' if status is undefined
    }
  }, [assistance]); // Dependency array to update when assistance changes

  if (!assistance) return null; // Return null if no assistance object is provided

  const { serviceType, clientId, description, responses } = assistance;

  // Function to handle status change
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  // Function to handle sending the reply
  const handleSendReply = () => {
    if (reply.trim() === '') {
      alert('Please enter a reply message.');
      return;
    }
    // Handle the reply logic (e.g., API call to send the reply)
    console.log(`Sending reply: ${reply}`);
    console.log(`Updating status to: ${selectedStatus}`);
    setReply(''); // Clear the input after sending
  };

  const handleSave = () => {
    const updatedData = {
      status: selectedStatus,
      message: reply,
      sender: user._id
    };
    setReply('')
    onSave(updatedData);
  };

  const getStatusStyles = () => {
    switch (selectedStatus) {
      case 'en_attente':
        return { backgroundColor: 'red', color: 'white', label: 'En Attente' };
      case 'en_cours':
        return { backgroundColor: 'green', color: 'white', label: 'En Cours' };
      case 'cloturé':
        return { backgroundColor: 'grey', color: 'white', label: 'Cloturé' };
      default:
        return { backgroundColor: 'default', color: 'default', label: '' };
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Assistance Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <strong>Service Type:</strong> {serviceType}
        </div>
        <div>
          <strong>Client:</strong> {clientId.name} {/* Ensure clientId includes client name */}
        </div>
        <div>
          <strong>Description:</strong> {description}
        </div>
        <div className="d-flex flex-row gap-2">
          <strong>Status:</strong>
          <Dropdown>
            <Dropdown.Toggle
              variant="secondary"
              id="dropdown-basic"
              style={{ 
                width: '150px',
                backgroundColor: getStatusStyles().backgroundColor,
                color: getStatusStyles().color
              }}
            >
              {getStatusStyles().label}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleStatusChange('en_attente')}>
                <span style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'red',
                  marginRight: '8px'
                }}></span>
                En Attente
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleStatusChange('en_cours')}>
                <span style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'green',
                  marginRight: '8px'
                }}></span>
                En Cours
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleStatusChange('cloturé')}>
                <span style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'grey',
                  marginRight: '8px'
                }}></span>
                Cloturé
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* Chat Messages Area */}
        <div className="mt-3" style={{ maxHeight: '300px', overflowY: 'scroll' }}>
          <ListGroup>
            {responses.map((response, index) => (
              <ListGroup.Item key={index}>
                <strong>{response.sender.name}:</strong> {response.message}
                <div className="text-muted small">{new Date(response.timestamp).toLocaleString()}</div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between align-items-center">
        {/* Input group for reply functionality */}
        <InputGroup className="flex-grow-1 me-2">
          <Form.Control
            as="textarea"
            rows={3} // Adjust the number of rows as needed
            placeholder="Écrire votre réponse..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            style={{ resize: 'none' }} // Optional: Disable resizing
          />
        </InputGroup>
        <Button variant="secondary" onClick={onClose}>
          Annuler
        </Button>
        <Button variant='primary' onClick={handleSave}>Sauvegarder</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssistanceModal;
