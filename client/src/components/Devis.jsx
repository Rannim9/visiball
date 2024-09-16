  import React, { useState } from 'react';
  import { Container, Form, Button, Row, Col } from 'react-bootstrap';
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

  function Devis() {
    const user = JSON.parse(localStorage.getItem("user"))
    const [formData, setFormData] = useState({
      creationSite: false,
      referencement: false,
      gestionReseaux: false,
      visite: false,
      shooting: false,
      siteCatalogue: false,
      siteVitrine: false,
      siteEcommerce: false,
      seo: false,
      sea: false,
      facebook: false,
      instagram: false,
      linkedin: false,
      snapchat: false,
      tiktok: false,
      isAutreChecked: false, 
      autreValue: '',
      productCount: '',
      productSize: '',
      pieceCount: '',
      pieceSize: ''
      });

    const [showSubOptions, setShowSubOptions] = useState({
      creationSite: false,
      referencement: false,
      gestionReseaux: false,
      visite: false,
      shooting: false,
    });

    const handleOptionChange = (event) => {
      const { name, value, checked, type } = event.target;
      
      
      if (type === "checkbox") {
          setFormData(prev => ({
              ...prev,
              [name]: checked
          }));
          if (!checked) {
              setShowSubOptions(prev => ({
                  ...prev,
                  [name]: false
              }));
          }
      } else {
          setFormData(prev => ({
              ...prev,
              [name]: value
          }));
      }
  };

    const toggleSubOptions = (option) => {
      setShowSubOptions(prev => ({
        ...prev,
        [option]: !prev[option] 
      }));
    };
    

    const handleSubmit = async (event) => {
      event.preventDefault();

      if (formData.shooting && (!formData.productCount || !formData.productSize)) {
          toast.error("Veuillez sélectionner le nombre et la dimension des produits pour le shooting.");
          return;
      }

      if (formData.visite && (!formData.pieceCount || !formData.pieceSize)) {
          toast.error("Veuillez sélectionner le nombre de pièces et la surface pour la visite virtuelle.");
          return;
      }
      if (formData.isAutreChecked && !formData.autreValue.trim()) {
          toast.error("Veuillez préciser le réseau social dans le champ 'Autre'.");
          return;
      }
      const transformedData = {
        userId: user._id,
        site_web_creation: formData.creationSite || null,
        referencement: {
          seo: formData.seo,
          sea: formData.sea,
        },
        social_media_management: {
          facebook: formData.facebook,
          instagram: formData.instagram,
          linkedin: formData.linkedin,
          tiktok: formData.tiktok,
          snapchat: formData.snapchat,
          autre: {
            selected: formData.isAutreChecked,
            description: formData.isAutreChecked ? formData.autreValue : '',
          },
        },
        shooting_produits: {
          nombre_de_produits: formData.productCount || null,
          dimension_produit: formData.productSize || null,
        },
        visite_virtuelle: {
          nombre_de_pieces: formData.pieceCount || null,
          surface_metre_carree: formData.pieceSize || null,
        }
      };
      try {
          const response = await fetch("http://localhost:3000/contactmsyt/addDevis", {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(transformedData)
          });

          const data = await response.json();
          if (response.ok) {
              toast.success("Nous avons bien reçu votre demande de devis. Nous la traiterons et vous répondrons dans les plus brefs délais !");
          } else {
              toast.error(data.message || "Échec de l'ajout du devis");
          }
      } catch (err) {
          toast.error("Erreur réseau ou serveur injoignable.");
      }
  };


    return (
      <Container fluid className=" d-flex flex-column justify-content-center bg-light p-4 rounded-3 shadow mt-5">
        <ToastContainer position="bottom-center" className="custom-toast-container-devis" autoClose={5000} />
        <h1 className="text-center mb-4">Ajouter un service</h1>
        <Form onSubmit={handleSubmit} className="p-4 bg-white shadow-sm rounded">
          <Row className="mb-3">
            <Col md={4}sm={12} >
              <Button variant="link" onClick={() => toggleSubOptions('creationSite')}>
                Création d'un site web
              </Button>
              {showSubOptions.creationSite && (
                <div className="ms-3 mb-2">
                  <Form.Check
                    type="radio"
                    id="creationsite-check"
                    label="Site de présentation de mon entreprise (Site Vitrine)" 
                    name="creationSite"
                    value="sitevitrine"
                    checked={formData.creationSite === 'sitevitrine'}
                    onChange={handleOptionChange}
                    />
                    <Form.Check
                    type="radio"
                    id="sitecatalogue-check" 
                    label="Site de présentation de mes produits (Site Catalogue)"
                    name="creationSite"
                    value="sitecatalogue"
                    checked={formData.creationSite === 'sitecatalogue'}
                    onChange={handleOptionChange}
                  />
                  <Form.Check
                    type="radio"
                    id="siteecommerce-check"
                    label="Site de vente de mes produits (Site E-commerce)"
                    name="creationSite"
                    value="siteecommerce"
                    checked={formData.creationSite === 'siteecommerce'}
                    onChange={handleOptionChange}
                  />
                </div>
              )}
            </Col>
            <Col md={4} sm={12}>
              <Button variant="link" onClick={() => toggleSubOptions('referencement')}>
                Référencement
              </Button>
              {showSubOptions.referencement && (
                <div className="ms-3 mb-2">
                  <Form.Check
                    type="checkbox"
                    id="seo-check"
                    label="Référencement Naturel (SEO)"
                    name="seo"
                    checked={formData.seo}
                    onChange={handleOptionChange}
                  />
                  <Form.Check
                    type="checkbox"
                    id="sea-check"
                    label="Référencement Payant (SEA)"
                    name="sea"
                    checked={formData.sea}
                    onChange={handleOptionChange}
                  />
                </div>
              )}
            </Col>
            <Col md={4} sm={12}>
              <Button variant="link" onClick={() => toggleSubOptions('gestionReseaux')}>
                Gestion des réseaux sociaux
              </Button>
              {showSubOptions.gestionReseaux && (
                <div className="ms-3 mb-2">
                  <Form.Check
                    type="checkbox"
                    id="facebook-check"
                    label="Facebook"
                    name="facebook"
                    checked={formData.facebook}
                    onChange={handleOptionChange}
                  />
                  <Form.Check
                    type="checkbox"
                    id="instagram-check"
                    label="Instagram"
                    name="instagram"
                    checked={formData.instagram}
                    onChange={handleOptionChange}
                  />
                  <Form.Check
                    type="checkbox"
                    id="linkedin-check"
                    label="LinkedIn"
                    name="linkedin"
                    checked={formData.linkedin}
                    onChange={handleOptionChange}
                  />
                  <Form.Check
                    type="checkbox"
                    id="tiktok-check"
                    label="TikTok"
                    name="tiktok"
                    checked={formData.tiktok}
                    onChange={handleOptionChange}
                  />
                  <Form.Check
                    type="checkbox"
                    id="snapchat-check"
                    label="Snapchat"
                    name="snapchat"
                    checked={formData.snapchat}
                    onChange={handleOptionChange}
                  />  
                  <Form.Check
                  type="checkbox"
                  id="autre-check"
                  label="Autre"
                  name="isAutreChecked"
                  checked={formData.isAutreChecked}
                  onChange={handleOptionChange}
        />
        
        {formData.isAutreChecked && (
          <Form.Control
            type="text"
            placeholder="Précisez le réseau social"
            value={formData.autreValue}
            onChange={(e) => setFormData({ ...formData, autreValue: e.target.value })}
          />
        )}
                </div>
              )}
            </Col>
            <Col md={4} sm={12}>
              <Button variant="link" onClick={() => toggleSubOptions('shooting')}>
                Shooting produits
              </Button>
              {showSubOptions.shooting && (
                <div className="ms-3 mb-2">
                  <Form.Group>
                    <Form.Label>Nombre de produits</Form.Label>
                    <Form.Check
                      type="radio"
                      id="10-29-check"
                      label="de 10 à 29"
                      name="productCount"
                      value="10-29"
                      checked={formData.productCount === '10-29'}
                      onChange={handleOptionChange}
                    />
                    <Form.Check
                      type="radio"
                      id="30-49-check"
                      label="de 30 à 49"
                      name="productCount"
                      value="30-49"
                      checked={formData.productCount === '30-49'}
                      onChange={handleOptionChange}
                    />
                    <Form.Check
                      type="radio"
                      id="+50-check"
                      label="supérieur ou égal à 50"
                      name="productCount"
                      value="50+"
                      checked={formData.productCount === '50+'}
                      onChange={handleOptionChange}
                    />
                  </Form.Group>
                  {formData.productCount && (
                    <Form.Group>
                      <Form.Label>Dimensions des produits</Form.Label>
                      <Form.Check
                        type="radio"
                        id="petit-check"
                        label="Petit"
                        name="productSize"
                        value="petit"
                        checked={formData.productSize === 'petit'}
                        onChange={handleOptionChange}
                      />
                      <Form.Check
                        type="radio"
                        id="moyenne-check"
                        label="Moyenne"
                        name="productSize"
                        value="Moyenne"
                        checked={formData.productSize === 'Moyenne'}
                        onChange={handleOptionChange}
                      />
                      <Form.Check
                        type="radio"
                        id="grand-check"
                        label="Grand"
                        name="productSize"
                        value="grand"
                        checked={formData.productSize === 'grand'}
                        onChange={handleOptionChange}
                      />
                    </Form.Group>
                  )}
                </div>
              )}
            </Col>
            <Col md={4} sm={12}>
              <Button variant="link" onClick={() => toggleSubOptions('visite')}>
                Visite Virtuelle 360°
              </Button>
              {showSubOptions.visite && (
                <div className="ms-3 mb-2">
                  <Form.Group>
                    <Form.Label>Nombre de pièces</Form.Label>
                    <Form.Check
                      type="radio"
                      id="5-9-check"
                      label="de 5 à 9"
                      name="pieceCount"
                      value="5-9"
                      checked={formData.pieceCount === '5-9'}
                      onChange={handleOptionChange}
                    />
                    <Form.Check
                      type="radio"
                      id="10-19-check"
                      label="de 10 à 19"
                      name="pieceCount"
                      value="10-19"
                      checked={formData.pieceCount === '10-19'}
                      onChange={ handleOptionChange }
                    />
                    <Form.Check
                      type="radio"
                      id="+20-check"
                      label="supérieur ou égal à 20"
                      name="pieceCount"
                      value="20+"
                      checked={formData.pieceCount === '+20'}
                      onChange={handleOptionChange}
                    />
                  </Form.Group>
                  {formData.pieceCount && (
                    <Form.Group>
                      <Form.Label>Surface en mètre carrée</Form.Label>
                      <Form.Check
                        type="radio"
                        id="100-check"
                        label="100 m²"
                        name="pieceSize"
                        value="100"
                        checked={formData.pieceSize === '100'}
                        onChange={handleOptionChange}
                      />
                      <Form.Check
                        type="radio"
                        id="200-check"
                        label="200 m²"
                        name="pieceSize"
                        value="200"
                        checked={formData.pieceSize === '200'}
                        onChange={handleOptionChange}
                      />
                      <Form.Check
                        type="radio"
                        id="300-check"
                        label="300 m²"
                        name="pieceSize"
                        value="300"
                        checked={formData.pieceSize === '300'}
                        onChange={handleOptionChange}
                      />
                    </Form.Group>
                  )}
                </div>
              )}
            </Col>
          </Row>
          <div style={{ textAlign: 'center' }}>
                          <Button variant="primary" type="submit"  style={{
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
                          fontWeight: 'bold' ,
                          border: '2px solid #007bff '
    }}>
      Ajouter 
      </Button>
  </div>
        </Form>
      </Container>
    );
  }

  export default Devis;