import React, { useEffect, useState } from "react";
import {Modal, Button, Form, Alert} from "react-bootstrap";
import backendService from "../Services/BackendService";
import { useJwt } from "../UserGlobalProvider";

const AssignTrainerModal = ({ show, handleClose, userId }) => {
    const user = useJwt();
    const [selectedTrainer, setSelectedTrainer] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [trainers, setTrainers] = useState([]);

    function getTrainerDetails() {
        backendService("/api/users/getTrainers", "GET", user.jwt).then((trainerInfo) => {
            if (trainerInfo.status === 200) {
                setTrainers(trainerInfo.data);
            }
        });
    }

    useEffect(() => {
        getTrainerDetails();
    }, []);

    const assignTrainer = () => {
        if (!selectedTrainer) {
            setErrorMessage("Please select a trainer.");
            return;
        }

        backendService(`/api/users/assignTrainer?userId=${userId}&trainerId=${selectedTrainer}`, "POST", user.jwt)
            .then((response) => {
                if (response.status === 200) {
                    handleClose();
                } else {
                    setErrorMessage("Failed to assign trainer.");
                }
            });
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Assign Trainer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Select
                    aria-label="Select a Trainer"
                    value={selectedTrainer}
                    size="lg"
                    onChange={(e) => setSelectedTrainer(e.target.value)}
                >
                    <option value="">Select a Trainer</option>
                    <option value="unassign">Unassigned</option>
                    {trainers.map((trainer) => (
                        <option key={trainer.trainerId} value={trainer.trainerId}>
                            {trainer.firstName} {trainer.lastName}
                        </option>
                    ))}
                </Form.Select>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={assignTrainer}>
                    Assign Trainer
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AssignTrainerModal;
