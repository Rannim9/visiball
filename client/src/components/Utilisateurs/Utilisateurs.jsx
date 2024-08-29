import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';
import './style.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import EditUserModal from './editUserModal';

const Utilisateurs = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [usersData, setUsersData] = useState([]);
    // const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const token = localStorage.getItem('token');

    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:3000/contactmsyt/users", {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log('data ::', data);
                setUsersData(data);
            } else {
                const errorData = await response.json();
                console.log(errorData.message || "Échec de la connexion.");
            }
        } catch (err) {
            console.error('Error:', err);
            console.log("Erreur réseau ou serveur injoignable.");
        }
    };



    const updateUser = async (updatedUser) => {
        try {
            const id = updatedUser._id
            console.log('id ::', updatedUser)
            const response = await fetch(`http://localhost:3000/contactmsyt/users/${id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    activated: updatedUser.activated
                })
            });
            if (response.ok) {
                setSelectedUser(null)
                fetchUsers(); // Refresh the user list after a successful update
            } else {
                const errorData = await response.json();
                console.log(errorData.message || "Échec de la connexion.");
            }
        } catch (err) {
            console.error('Error:', err);
            console.log("Erreur réseau ou serveur injoignable.");
        }
    };
    


    // const addUser = async (newUser) => {
    //     try {
    //         const response = await fetch("http://localhost:3000/contactmsyt/createUser", {
    //             method: 'POST',
    //             headers: { 
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(newUser)
    //         });
    //         if (response.ok) {
    //             const data = await response.json();
    //             console.log('data ::', data);
    //             setUsersData([...usersData, data]);
    //         } else {
    //             const errorData = await response.json();
    //             console.log(errorData.message || "Échec de la connexion.");
    //         }
    //     } catch (err) {
    //         console.error('Error:', err);
    //         console.log("Erreur réseau ou serveur injoignable.");
    //     }
    // };

    useEffect(() => {
        fetchUsers();
    }, []);
    const handleSaveUser = (updatedUser) => {
        // Logic to update the user in your data source
        console.log('Updated User:', updatedUser);
        setShowEditModal(false);
        updateUser(updatedUser);
    };
    const columns = [ {
        dataField: 'name',
        text: 'Username',
        filter: textFilter({
            placeholder: "Chercher", 
            style: {
                marginLeft: 5,
            }
        }),
        headerStyle: { textAlign: 'center' } // Adjust width to keep alignment
    }, {
        dataField: 'email',
        text: 'Email',
        filter: textFilter({
            placeholder: "Chercher", 
            style: {
                marginLeft: 5,
            }
        }),
        headerStyle: { textAlign: 'center' } // Adjust width to keep alignment
    }, {
        dataField: 'role',
        text: 'Role',
        headerStyle: { textAlign: 'center' } // Adjust width to keep alignment
        
    },{
        dataField: 'activated',
        text: 'Status',
        formatter: (row) => (
            <i
                className="bi bi-dot"
                style={{
                    color: row ? 'green' : 'grey',
                    fontSize: '2.5em'
                }}
            ></i>
        ),
        headerStyle: { textAlign: 'center' } // Adjust width to keep alignment
    },{
        text: 'Action',
        formatter: (cell, row) => (
        <div class="d-flex gap-2">
        <button type="button" class="btn btn-primary btn-sm" onClick={() => {
            console.log('message :', row)
            setSelectedUser(row)
            console.log('edit :', selectedUser)
            setShowEditModal(true)
        }}>
            <span class="bi bi-pencil-fill"></span>
        </button>

        <button type="button" class="btn btn-danger btn-sm">
            <span class="bi bi-trash-fill"></span>
        </button>        </div>

        
        
        ),
        headerStyle: { textAlign: 'center' } // Adjust width to keep alignment
    }];

    return (
        <Container className="mt-5 bg-light rounded-2">
            <div className="d-flex p-2 bd-highlight justify-content-between align-items-center bg-red">
                <h2 className="mb-4">Liste des utilisateurs</h2>
                <div>
                    {/* <Button 
                        variant="outline-primary" 
                        onClick={() => setShowModal(true)}
                        className="me-2">
                        <i className="bi bi-plus"></i>
                        Ajouter Utilisateur
                    </Button> */}
                </div>
            </div>
            <BootstrapTable
                keyField='_id' 
                data={ usersData } 
                columns={ columns } 
                pagination={ paginationFactory() } 
                filter={ filterFactory() }
                striped
                bordered={false}
                wrapperClasses="table-responsive"
            />

            {/* <AddUserModal 
                show={showModal}
                handleClose={() => setShowModal(false)}
                handleSave={handleAddUser}
            /> */}
            <EditUserModal
                show={showEditModal}
                handleClose={() => setShowEditModal(false)}
                handleSave={handleSaveUser}
                user={selectedUser}
            />
        </Container>
    );
};

export default Utilisateurs;
