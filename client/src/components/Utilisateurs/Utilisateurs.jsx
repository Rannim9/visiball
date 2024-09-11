import React, { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';
import './style.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import AddUserModal from './addUserModal';
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

    // const handleAddUser = (newUser) => {
    //     addUser(newUser);
    //     setShowModal(false);
    // };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleSaveUser = (updatedUser) => {
        // Logic to update the user in your data source
        console.log('Updated User:', updatedUser);
        setShowEditModal(false);
    };

    const selectRow = {
        mode: 'checkbox', // single row selection
        clickToSelect: true,
        onSelect: (row, isSelect, rowIndex, e) => {
            setSelectedUser(row);
        }
    };

    const columns = [{
        dataField: '_id',
        text: 'ID'
    }, {
        dataField: 'name',
        text: 'Username',
        filter: textFilter({
            placeholder: "Chercher", 
            style: {
                marginLeft: 5,
            }
        })
    }, {
        dataField: 'email',
        text: 'Email',
        filter: textFilter({
            placeholder: "Chercher", 
            style: {
                marginLeft: 5,
            }
        })
    }, {
        dataField: 'role',
        text: 'Role',
        
    }];

    return (
        <Container className="mt-5 bg-light rounded-2">
            <div className="d-flex p-2 bd-highlight justify-content-between align-items-center bg-red">
                <h2 className="mb-4 text-center w-100">Liste des utilisateurs</h2>

                <div>
                    {/* <Button 
                        variant="outline-primary" 
                        onClick={() => setShowModal(true)}
                        className="me-2">
                        <i className="bi bi-plus"></i>
                        Ajouter Utilisateur
                    </Button> */}
                    <Button 
                        variant="outline-secondary" 
                        onClick={() => setShowEditModal(true)}
                        disabled={!selectedUser}>
                        <i className="bi bi-pencil"></i>
                        Modifier Utilisateur
                    </Button>
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
                selectRow={ selectRow }
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
