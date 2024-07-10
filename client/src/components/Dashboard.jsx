import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import './Dashboard.css';
import { Pie } from 'react-chartjs-2';
import { UserContext } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import '../App.css';


const actualites = [
    {
      image: "https://visiball360.com/wp-content/uploads/2023/11/pourquoi-le-passage-a-HTTPS-est-essentiel-pour-votre-site-internet-1024x768.jpg",
      content: () => (
        <div style={{ padding: '15px' }}>
            <h4 className="bold-title" style={{ marginBottom: '25px' }}>Pourquoi le passage à HTTPS est essentiel pour votre site web ?</h4>
            <h6>Qu’est-ce que le certificat HTTPS ? Le terme HTTPS est une abréviation de « Hyper Text Transfer...</h6>
        </div>
      ), 

      link: "https://visiball360.com/nos-actualites/importance-https-pour-votre-site-web/"
    },
    {
      image: "https://visiball360.com/wp-content/uploads/2023/10/obtenir-gerer-les-avis-google-1024x768.jpg",
      content: () => (
        <div style={{ padding: '15px' }}>
         
            <h4 className="bold-title" style={{ marginBottom: '25px' }}>Les 7 meilleurs conseils pour obtenir et gérer les avis Google</h4>
            <p> Les avis Google, également appelés avis clients, représentent les impressions et opinions exprimées par les clients concernant...
          </p>
        </div>
      ),
      link: "https://visiball360.com/nos-actualites/conseils-pour-obtenir-gerer-avis-google/"
    },
    {
      image: "https://visiball360.com/wp-content/uploads/2023/10/Les-mythes-du-referencement-naturel-SEO-Visiball-360-1024x768.jpg",
      content: () => (
        <div style={{ padding: '15px' }}>
         
            <h4 className="bold-title" style={{ marginBottom: '25px' }}>Les mythes du référencement naturel (SEO)</h4>
            <p> Le référencement naturel, plus connu sous le nom de SEO, est une discipline en constante évolution, mais...
          </p>
        </div>
      ),
      link: "https://visiball360.com/nos-actualites/mythes-referencement-naturel/"
    }
  ];


function Dashboard() {

  const [userName, setUserName] = useState(localStorage.getItem('name'));
  const [Email, setEmail] = useState(localStorage.getItem('email'));

  const navigate = useNavigate();
  const [avisData, setAvisData] = useState({
    labels: ['Positifs', 'Neutres', 'Négatifs'],
    datasets: [
      {
        label: 'Pourcentage des Avis',
        data: [0, 0, 0],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setUserName(localStorage.getItem('name'));
      setEmail(localStorage.getItem('email'));
    };

    window.addEventListener('storage', handleStorageChange);

    const fetchData = async () => {
      try {  
       const avisResponse = await fetch('http://localhost:3000/contactmsyt/avis/pourcentages');
        const avisPercentages = await avisResponse.json();
        if (avisResponse.ok) {
          setAvisData(currentData => ({
            ...currentData,
            datasets: [{
              ...currentData.datasets[0],
              data: [avisPercentages.pourcentages.positifs, avisPercentages.pourcentages.neutres, avisPercentages.pourcentages.negatifs]
            }]
          }));
        } else {
          console.error('Failed to fetch avis data:', avisResponse.status);
        }
      } catch (error) {
        console.error('Error while fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  return (

    <Container className="mt-5" style={{ textAlign: 'center', fontFamily: 'fantasy font' }}>
    <Carousel indicators={true} style={{ minHeight: '600px' }}> 
      <Carousel.Item>
        <Row className="justify-content-center">
        <Col sm={12} md={6} className="d-flex justify-content-center">
        <div className="p-5 border border-primary rounded bg-light" style={{ width: '80%' }}>
        {userName && (
         <div className="card-body">
              <p className="client-card-title">Nom et prénom:</p>
              <p className="client-card-text">{userName}</p>
      </div>
    )}
  </div>
  
  {Email && (
       <div className="card-body">
       <p className="client-card-title">Adresse e-mail:</p>
       <p className="client-card-text">{Email}</p>
       </div>
      
    )}
</Col>

            <Col sm={12} md={6} className="d-flex justify-content-center">
            <div className="p-5 border border-primary rounded bg-light" style={{ width: '80%' }}>
            <h2 className="client-card-title">Factures non payées</h2>
                <p className="client-card-text">Vous avez 0 factures non payées</p>
              </div>
            </Col>
     </Row>
        </Carousel.Item>
        <Carousel.Item>
          <Row className="justify-content-center">
            <Col sm={12} md={6} className="d-flex justify-content-center ">
            <div className="p-5 border border-primary rounded bg-light" style={{ width: '80%' }}>
            <h2 className="client-card-title">Pourcentage des Avis</h2>
      <Pie data={avisData} />
    </div>
            </Col>
            <Col sm={14} md={6} className="d-flex justify-content-center">
              <Carousel  indicators={false}>
                {actualites.map((actu, index) => (
                  <Carousel.Item key={index}>
                    <div className="p-0 border border-primary rounded bg-gradient-actualites" style={{ width: '80%' }}>
                    <img src={actu.image} alt={`Actualité ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
                      {actu.content()}
                      <div style={{ textAlign: 'center' }}>
                        <a href={actu.link} target="_blank" rel="noopener noreferrer" style={{
                          display: 'inline-block',
                          padding: '8px 50px',
                          margin: '6px 8px',
                          marginBottom: '35px',
                          color: '#000',
                          textDecoration: 'none',
                          borderRadius: '25px',
                          textAlign: 'center',
                          transition: 'background-color 0.3s',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          border: '1px solid #000'
                        }}>
                          Lire la suite
                        </a>
                      </div>
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </Col>
          </Row>
        </Carousel.Item>
      </Carousel>
    </Container>
  );
}

export default Dashboard;
