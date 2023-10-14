import React, {useEffect, useState} from 'react';
import {useJwt} from "../UserGlobalProvider";

import backendService from "../Services/BackendService";
import {Badge, Button, Container} from "react-bootstrap";
import NavBar from "../NavBar";
import SearchBar from "../SearchBar";
import AssignTrainerModal from "../AssignTrainerModal";
import CreateTrainerModal from "../CreateTrainerModal";
import {PencilFill} from "react-bootstrap-icons";
import EditTrainerModal from "../EditTrainerModal";

const ManageTrainers = () => {
    const user = useJwt();
    const [trainers, setTrainers] = useState([]);

    const [showCreateTrainerModal, setShowCreateTrainerModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showEditTrainerModal, setShowEditTrainerModal] = useState(false);

    const fetchInitialData = () => {
        backendService(`/api/users/alltrainers`, "GET", user.jwt)
            .then((trainerResponse) => {
                if (trainerResponse.status === 200) {
                    setTrainers(trainerResponse.data);
                }
            })
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const updateSearchResults = (results) => {
        setTrainers(results);
    };

    const handleStatusToggle = (userId) => {
        backendService(`/api/users/changeEnabledStatus?userId=${userId}`, "POST", user.jwt).then(
            (updatedUser) => {
                if (updatedUser.status === 200) {
                    setTrainers((prevUsers) => {
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

    function openCreateTrainerModal() {
        setShowCreateTrainerModal(true);
    }

    function closeCreateTrainerModal() {
        setShowCreateTrainerModal(false);
        fetchInitialData();
    }

    function openEditTrainerModal(trainerId) {
        setSelectedUserId(trainerId);
        setShowEditTrainerModal(true);
    }

    function closeEditTrainerModal() {
        setShowEditTrainerModal(false);
        fetchInitialData();
    }

    return (
        <>
            <Container>
                <NavBar/>
                <h2 className="mt-3 mb-3" style={{textAlign:"center"}}>Assigned Users</h2>
                <SearchBar
                    type="trainer"
                    updateSearchResults={updateSearchResults}
                    visible={true}
                ></SearchBar>

                {showCreateTrainerModal && (
                    <CreateTrainerModal
                        show={showCreateTrainerModal}
                        handleClose={closeCreateTrainerModal}
                    />
                )}
                {showEditTrainerModal && (
                    <EditTrainerModal
                        show={showEditTrainerModal}
                        handleClose={closeEditTrainerModal}
                        trainerId={selectedUserId}
                        />
                )}
                <div className="d-flex "
                    style={{marginLeft:"1.5em"}}>
                    <Button
                        variant="outline-success"
                        onClick={openCreateTrainerModal}>
                        Create Trainer
                    </Button>
                </div>
                <table className="user-table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Sex</th>
                        <th>Age</th>
                        <th>Address</th>
                        <th>Num of Clients</th>
                        <th>Edit Details</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {trainers.map((trainer, index) => (
                        <tr key={index}>
                            <td>{trainer.trainer.firstName} {trainer.trainer.lastName}</td>
                            <td>{trainer.trainer.username}</td>
                            <td>{trainer.trainer.phone}</td>
                            <td>{trainer.trainer.sex}</td>
                            <td>{trainer.trainer.age}</td>
                            <td>{trainer.trainer.address}</td>
                            <td>{trainer.numOfClients}</td>
                            <td><Button
                                onClick={() => {openEditTrainerModal(trainer.trainer.id)}}
                            >
                                <PencilFill/>
                            </Button></td>
                            <td>
                                <Badge
                                    bg={trainer.trainer.enabled ? "success" : "danger"}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleStatusToggle(trainer.trainer.id)}
                                >
                                    {trainer.trainer.enabled ? 'Enabled' : 'Disabled'}
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

export default ManageTrainers;