import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useJwt } from '../UserGlobalProvider';
import backendService from "../Services/BackendService";

const EditTrainerModal = ({ trainerId, show, handleClose }) => {
    const user = useJwt();
    const [editedData, setEditedData] = useState({});

    function getUserDetails() {
        backendService(`/api/users/${trainerId}`, 'GET', user.jwt).then(
            (userResponse) => {
                if (userResponse.status === 200) {
                    setEditedData(userResponse.data);
                }
            });
    }

    useEffect(() => {
        getUserDetails();
    }, []);

    function handleInputChange(event) {
        const { name, value } = event.target;
        setEditedData({ ...editedData, [name]: value });
    }

    function handleSubmit() {
        backendService(`/api/users/saveTrainer?trainerId=${trainerId}`, 'PUT', user.jwt, editedData).then(
            (updatedResponse) => {
                if(updatedResponse.status===200){
                    handleClose();
                }
            }
        )
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Update Trainer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="firstName"
                                    value={editedData.firstName}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="lastName"
                                    value={editedData.lastName}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={editedData.address}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            type="text"
                            name="phone"
                            value={editedData.phone}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="username"
                            readonly
                            value={editedData.username}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={editedData.password}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Age</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="age"
                                    value={editedData.age}
                                    onChange={handleInputChange}
                                >
                                    {Array.from({ length: 53 }, (_, i) => 18 + i).map((age) => (
                                        <option key={age} value={age}>
                                            {age}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Sex</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="sex"
                                    value={editedData.sex}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select an option</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="">Decline to Answer</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditTrainerModal;
