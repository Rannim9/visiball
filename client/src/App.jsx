import React, { createContext, useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './components/Home';  
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Devis from './components/Devis';
import Contrat from './components/Contrat';
import Parrainage from './components/Parrainage';
import Réclamation from './components/Réclamation';
import Suivie from './components/Suivie';
import Factures from './components/Facture';
import Assistance from './components/Assistance';
import Avis from './components/Avis';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import { Container, Row, Col } from 'react-bootstrap';

export const UserContext = createContext(null);
const Layout = ({ children }) => {
  return (
    <UserContext.Consumer>
      {({ user, handleLogout }) => (
        <Container fluid className="p-0">
          <Navbar user={user} handleLogout={handleLogout} />
          <Row className="no-gutters">
            <Col md={3} className="sidebar-col mx-auto">
              <Sidebar />
            </Col>
            <Col md={9} className="main-content-col mx-auto p-4">
              {children}
            </Col>
          </Row>
        </Container>
      )}
    </UserContext.Consumer>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,  
  },
  {
    path: "/login",
    element: <Login />,  
  },
  {
    path: "/dashboard",
    element: <Layout><Dashboard /></Layout>,  
  },
  {
    path: "/devis",
    element: <Layout><Devis /></Layout>,
  },
  {
    path: "/avis",
    element: <Layout><Avis /></Layout>,
  },
  {
    path: "/facture",
    element: <Layout><Factures /></Layout>,
  },
  {
    path: "/assistance",
    element: <Layout><Assistance /></Layout>,
  },
  {
    path: "/suivie",
    element: <Layout><Suivie /></Layout>,
  },
  {
    path: "/contrat",
    element: <Layout><Contrat /></Layout>,
  },
  {
    path: "/réclamation",
    element: <Layout><Réclamation /></Layout>,
  },
  {
    path: "/parrainage",
    element: <Layout><Parrainage /></Layout>,
  },
]);

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {

    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <>
      <ToastContainer />
      <UserContext.Provider value={{ user, setUser, handleLogout }}>
        <RouterProvider router={router} />
      </UserContext.Provider>
    </>
  );
};

export default App;
