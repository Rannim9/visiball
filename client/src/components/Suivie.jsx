import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../App.css';

function SuivieComponent() {
  const [suivie, setSuivie] = useState([]);

  useEffect(() => {
      const fetchSuivie = async () => {
          try {
            const response = await fetch('http://localhost:3000/contactmsyt/suivie');
            const data = await response.json();
            if (Array.isArray(data)) {
              setSuivie(data);
            } else {
              console.error('La réponse n\'est pas un tableau:', data);
            }
          } catch (error) {
              console.error('Erreur lors du chargement des demandes :', error);
          }
      };

      fetchSuivie();
  }, []);

  const handleConsult = (suiviereferent) => {
    alert(`Consulter les détails pour: ${suiviereferent}`);
  };

  return (
    <Container fluid className="d-flex flex-column justify-content-center bg-light p-4 rounded-3 shadow mt-5">
      <h1 className="text-center mb-4">Mes demandes</h1>
      <div className="row">
        <div className="col-12">
          <div className="d-none d-md-block">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Date d'envoie</th>
                  <th>Service</th>
                  <th>Statut</th>
                  <th>Date de Traitement</th>
                  <th>Référent</th>
                  <th>Consulter</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(suivie) && suivie.map(suivieItem => (
                  <tr key={suivieItem._id}>
                    <td>{new Date(suivieItem.dateEnvoie).toLocaleDateString()}</td>
                    <td>{suivieItem.service}</td>
                    <td>{suivieItem.statut}</td>
                    <td>{new Date(suivieItem.dateTraitement).toLocaleDateString()}</td>
                    <td>{suivieItem.referent}</td>
                    <td>
                      <Button variant="primary" onClick={() => handleConsult(suivieItem.referent)}>
                        Consulter
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="d-block d-md-none">
        {Array.isArray(suivie) && suivie.map(suivieItem => (
          <div key={suivieItem._id} className="card mb-3">
            <div className="card-body">
              <p className="card-text">Date d'envoie: {new Date(suivieItem.dateEnvoie).toLocaleDateString()}</p>
              <p className="card-text">Service: {suivieItem.service}</p>
              <p className="card-text">Statut: {suivieItem.statut}</p>
              <p className="card-text">Date de traitement: {new Date(suivieItem.dateTraitement).toLocaleDateString()}</p>
              <p className="card-text">Référent: {suivieItem.referent}</p>
              <Button variant="primary" onClick={() => handleConsult(suivieItem.referent)}>
                Consulter
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}

export default SuivieComponent;
