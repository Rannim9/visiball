import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';
import './style.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import EditUserModal from './editUserModal';
import ConfirmDeleteModal from '../ConfirmDelete';
import AddUserModal from './addUserModal';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

const Utilisateurs = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [usersData, setUsersData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [notification, setNotification] = useState(false)
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
            const data = {
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                activated: updatedUser.activated,
                password: updatedUser.password
            }
            const response = await fetch(`http://localhost:3000/contactmsyt/users/${id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                setSelectedUser(null)
                fetchUsers(); 
                setErrorMessage("utilisateur mis a jour avec sucess")
                setNotification(true)
            } else {
                const errorData = await response.json();
                console.log(errorData.message || "Échec de la connexion.");
                setErrorMessage(errorData.message)
                setNotification(true)
            }
        } catch (err) {
            console.error('Error:', err);
            console.log("Erreur réseau ou serveur injoignable.");
            setErrorMessage(err)
            setNotification(true)
        }
    };

    const deleteUser = async (user) => {
        try {
            const id = user._id
            console.log('id ::', user)
            const response = await fetch(`http://localhost:3000/contactmsyt/users/${id}`, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (response.ok) {
                setSelectedUser(null)
                fetchUsers();
                setErrorMessage("utilisateur effacé avec sucess")
                setNotification(true)
            } else {
                const errorData = await response.json();
                console.log(errorData.message || "Échec de la connexion.");
                setErrorMessage(errorData.message)
            }
        } catch (err) {
            console.error('Error:', err);
            console.log("Erreur réseau ou serveur injoignable.");
            setErrorMessage(err)

        }
    };
    


    const addUser = async (newUser) => {
        try {
            const response = await fetch("http://localhost:3000/contactmsyt/createUser", {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser)
            });
            if (response.ok) {
                const data = await response.json();
                setUsersData([...usersData, data.user]);
                setErrorMessage("utilisateur ajouté avec sucess")
                setNotification(true)
            } else {
                const errorData = await response.json();
                console.log(errorData.message || "Échec de la connexion.");
                setErrorMessage(errorData.message)
            }
        } catch (err) {
            console.error('Error:', err);
            console.log("Erreur réseau ou serveur injoignable.");
            setErrorMessage(err)
        }
    };

    useEffect(() => {
        setTimeout(()=> {
            setNotification(false)
        }, 5000)
    }, [notification])

    useEffect(() => {
        fetchUsers();
    }, []);
    const handleAddUser = (user) => {
        console.log('new User:', user);
        setShowModal(false);
        addUser(user);
    };
    const handleSaveUser = (user) => {
        console.log('Updated User:', user);
        setShowEditModal(false);
        updateUser(user);
    };
    const handleDeleteUser = () => {
        console.log("deleting user with id :", selectedUser._id)
        setShowConfirmDelete(false);
        deleteUser(selectedUser)
    }
    const { SearchBar } = Search;
    const columns = [ {
        dataField: 'name',
        text: 'Nom du client',
        headerStyle: { textAlign: 'center' } 
    }, {
        dataField: 'email',
        text: 'Email',
        headerStyle: { textAlign: 'center' } 
    }, {
        dataField: 'role',
        text: 'Role',
        headerStyle: { textAlign: 'center' } 
        
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
        headerStyle: { textAlign: 'center' } 
    },{
        text: 'Action',
        formatter: (cell, row) => (
        <div class="d-flex gap-2">
        <button type="button" class="btn btn-primary btn-sm" onClick={() => {
            setSelectedUser(row)
            console.log('edit :', selectedUser)
            setShowEditModal(true)
        }}>
            <span class="bi bi-pencil-fill"></span>
        </button>

        <button type="button" class="btn btn-danger btn-sm" onClick={() => {
            setSelectedUser(row)
            console.log('delete :', row)
            setShowConfirmDelete(true)
        }}>
            <span class="bi bi-trash-fill"></span>
        </button>        </div>

        
        
        ),
        headerStyle: { textAlign: 'center' } 
    }];

    return (
        <Container className="mt-5 bg-light rounded-2">
            <div className="d-flex p-2 bd-highlight justify-content-between align-items-center bg-red">
                <h2 className="mb-4">Liste des utilisateurs</h2>
                <div>
                    <Button 
                        variant="outline-primary" 
                        onClick={() => setShowModal(true)}
                        className="me-2">
                        <i className="bi bi-plus"></i>
                        Ajouter Utilisateur
                    </Button>
                </div>
            </div>
            <ToolkitProvider keyField="_id" data={usersData} columns={columns} search>
                {(props) => (
                <div>
                    <SearchBar {...props.searchProps} placeholder="Chercher..." className="mb-3" />
                    <BootstrapTable
                    {...props.baseProps}
                    pagination={paginationFactory()}
                    filter={filterFactory()}
                    striped
                    bordered={false}
                    wrapperClasses="table-responsive"
                    />
                </div>
                )}
            </ToolkitProvider>

            <AddUserModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                handleSave={handleAddUser}
            />
            <EditUserModal
                show={showEditModal}
                handleClose={() => setShowEditModal(false)}
                handleSave={handleSaveUser}
                user={selectedUser}
            />
            <ConfirmDeleteModal 
                show={showConfirmDelete}
                handleClose={() => setShowConfirmDelete(false)}
                handleConfirm={handleDeleteUser}
            />
            {notification && (
            <div
                className="alert alert-warning alert-dismissible fade show"
                role="alert"
                style={{
                position: "fixed",
                top: "0",
                left: "0",
                right: "0",
                zIndex: "1050",
                }}
            >
                <strong>Avertissement</strong> {errorMessage}
                <button
                type="button"
                className="close"
                data-dismiss="alert"
                aria-label="Close"
                >
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            )}


        </Container>
    );
};

export default Utilisateurs;
