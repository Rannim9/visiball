
import React from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const Layout = ({ children }) => {
  return (
    <div className="container-fluid p-0">
      <Navbar />
            <div className="row no-gutters">
        <div className="col-md-3 bg-light sidebar">
          <Sidebar />
        </div>
          <div className="col-md-9 main-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
