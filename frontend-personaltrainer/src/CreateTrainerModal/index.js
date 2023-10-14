import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useJwt } from '../UserGlobalProvider';
import backendService from "../Services/BackendService";

const CreateTrainerModal = ({ show, handleClose }) => {
    const user = useJwt();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        phone: '',
        username: '',
        password: '',
        age: '',
        sex: '',
    });

    const [formErrors, setFormErrors] = useState({});

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value.trim(),
        });
    };

    const handleSubmit = () => {
        console.log(formData);
        if (isFormValid()) {
            const ageAsInteger = parseInt(formData.age, 10);
            if (!isNaN(ageAsInteger)) {
                formData.age = ageAsInteger;

                const requestData = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    address: formData.address,
                    phone: formData.phone,
                    username: formData.username,
                    password: formData.password,
                    age: formData.age,
                    sex: formData.sex,
                };

                backendService("/api/users/registerTrainer", "POST", user.jwt, requestData).then(
                    (registerTrainerResponse) => {
                        if (registerTrainerResponse.status === 200) {
                            handleClose();
                        }
                    }
                );
            }
        }
    };


    const isFormValid = () => {
        const errors = {};

        if (formData.firstName.trim() === '') {
            errors.firstName= 'First Name is required';
        }
        if (formData.lastName.trim() === '') {
            errors.lastName = 'Last Name is required';
        }
        if (formData.address.trim() === '') {
            errors.address = 'Address is required';
        }
        if (formData.phone.trim() === '') {
            errors.phone = 'Phone is required';
        }
        if (formData.username.trim() === '') {
            errors.username = 'Email is required';
        }
        if (formData.password.trim() === '') {
            errors.password = 'Password is required';
        }
        if (formData.age === '') {
            errors.age = 'Age is required';
        }
        if (formData.sex === '') {
            errors.sex = 'Sex is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

        return (
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Create Trainer</Modal.Title>
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
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        isInvalid={formErrors.firstName}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        isInvalid={formErrors.lastName}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group>
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                isInvalid={formErrors.address}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                isInvalid={formErrors.phone}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                isInvalid={formErrors.username}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                isInvalid={formErrors.password}
                            />
                        </Form.Group>

                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Age</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        isInvalid={formErrors.age}
                                    >
                                        {Array.from({length: 53}, (_, i) => 18 + i).map((age) => (
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
                                        value={formData.sex}
                                        onChange={handleInputChange}
                                        isInvalid={formErrors.sex}
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

export default CreateTrainerModal;
