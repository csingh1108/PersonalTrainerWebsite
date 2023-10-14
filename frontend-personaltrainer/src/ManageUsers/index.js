import React, {useEffect, useState} from 'react';
import {useJwt} from "../UserGlobalProvider";
import {useNavigate} from "react-router-dom";
import backendService from "../Services/BackendService";
import {Badge, Button, Container, Dropdown} from "react-bootstrap";
import NavBar from "../NavBar";
import SearchBar from "../SearchBar";
import CreateWorkoutModal from "../CreateWorkoutModal";
import AssignTrainerModal from "../AssignTrainerModal";

const ManageUsers = () => {
    const user = useJwt();
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [showAssignTrainerModal, setShowAssignTrainerModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const fetchInitialData = () => {
        backendService(`api/users/allclients`, "GET", user.jwt)
            .then((assignedResponse) => {
                if (assignedResponse.status === 200) {
                    setUsers(assignedResponse.data);
                }
            });
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const updateSearchResults = (results) => {
        setUsers(results);
    };

    const handleStatusToggle = (userId) => {
        backendService(`/api/users/changeEnabledStatus?userId=${userId}`, "POST", user.jwt).then(
            (updatedUser) => {
                if (updatedUser.status === 200) {
                    setUsers((prevUsers) => {
                        return prevUsers.map((user) => {
                            if (user.id === userId) {
                                user.enabledStatus = !user.enabledStatus;
                            }
                            fetchInitialData()
                            return user;
                        });
                    });
                }
            }
        );
    };

    function openAssignTrainerModal(userId) {
        setSelectedUserId(userId);
        setShowAssignTrainerModal(true);
    }

    function closeAssignTrainerModal() {
        setShowAssignTrainerModal(false);
        setSelectedUserId(null);
        fetchInitialData();
    }

    return (
        <>
            <Container>
                <NavBar/>
                <h2 className="mt-3 mb-3" style={{textAlign:"center"}}>Assigned Users</h2>
                <SearchBar
                    type="user"
                    updateSearchResults={updateSearchResults}
                    visible={true}
                ></SearchBar>

                {showAssignTrainerModal && (
                    <AssignTrainerModal
                        show={showAssignTrainerModal}
                        handleClose={closeAssignTrainerModal}
                        userId={selectedUserId}
                    />
                )}
                <table className="user-table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Sex</th>
                        <th>Age</th>
                        <th>Address</th>
                        <th>Assigned Trainer</th>
                        <th>Profile</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.userName}</td>
                            <td>{user.phone}</td>
                            <td>{user.sex}</td>
                            <td>{user.age}</td>
                            <td>{user.address}</td>
                            <td>
                                {user.trainerName ? (
                                    <span>
                                        {user.trainerName}
                                        <Badge
                                            bg="warning"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => openAssignTrainerModal(user.userId)}
                                        >Reassign
                                        </Badge>
                                    </span>
                                ) : (
                                    <Badge
                                        bg="primary"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => openAssignTrainerModal(user.userId)}
                                    >
                                        Assign
                                    </Badge>
                                )}
                            </td>

                            <td>
                                <Button onClick={() => navigate(`/userprofile/${user.id}`)}>
                                    Link
                                </Button>
                            </td>
                            <td>
                                <Badge
                                    bg={user.enabledStatus ? "success" : "danger"}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleStatusToggle(user.userId)}
                                >
                                    {user.enabledStatus ? 'Enabled' : 'Disabled'}
                                </Badge>
                            </td>

                        </tr>
                    ))}
                    </tbody>
                </table>
            </Container>
        </>
    );
};

export default ManageUsers;