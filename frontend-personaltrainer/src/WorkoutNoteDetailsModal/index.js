import React, { useEffect, useState } from 'react';
import { useJwt } from '../UserGlobalProvider';
import { Card, Col, Container, Image, Modal, Row } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';
import backendService from '../Services/BackendService';
import jwtDecode from "jwt-decode";

const WorkoutNoteDetailsModal = ({ workoutId, onClose }) => {
    const user = useJwt();
    const navigate = useNavigate();
    const [authorities, setAuthorities] = useState("");
    const [workoutNotes, setWorkoutNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(true);

    const [editMode, setEditMode] = useState(false);
    const [editedNotes, setEditedNotes] = useState(workoutNotes.notes)

    useEffect(() => {
        backendService(`/api/workout?workoutId=${workoutId}`, 'GET', user.jwt)
            .then((workoutResponse) => {
                if (workoutResponse && workoutResponse.notes !== null) {
                    setWorkoutNotes(workoutResponse.data);
                } else {
                    setError('Workout not found');
                    navigate('/profile');
                }
            })
            .catch((err) => {
                setError('Error fetching workout notes');
                console.error(err);
            })
            .finally(() => setIsLoading(false));
    }, [workoutId]);

    useEffect(() => {
        if (user && user.jwt) {
            const decodedJwt = jwtDecode(user.jwt);
            setAuthorities(decodedJwt.authorities);
        }
    }, [user, user.jwt]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    }

    function handleEditClick() {
        setEditMode(true);
        setEditedNotes(workoutNotes.notes);
    }

    function handleSaveClick() {
        const apiUrl = `/api/workout/update?workoutId=${workoutId}&editedNotes=${encodeURIComponent(editedNotes)}`;

        backendService(apiUrl, 'PUT', user.jwt)
            .then((responseData) => {

                if (responseData) {

                    if (responseData.status === 200) {
                        onClose();
                    } else {
                        if (responseData.errorMessage) {
                            alert('Error: ' + responseData.errorMessage);
                        } else {
                            alert('An error occurred');
                        }
                    }
                } else {
                    // Handle unexpected response data format
                    alert('Unexpected response format');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred');
            });
        setEditMode(false);
    }


    function handleNotesChange(event) {
        setEditedNotes(event.target.value);
    }

    function handleDelete() {
        const isConfirmed = window.confirm('Are you sure you want to delete this workout note?');

        if (isConfirmed) {
            const apiUrl = `/api/workout/delete?workoutId=${workoutId}`;

            backendService(apiUrl, 'DELETE', user.jwt)
                .then((response) => {
                    if (response) {
                        if (response.status === 204) {
                            onClose();
                        } else {
                            alert(`An error occurred: ${response}`);
                        }
                    } else {
                        alert('Unexpected response format');
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert('An error occurred while deleting the workout note');
                });
        }
    }



    return (
        <Modal show={showModal} size="lg" onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Workout Notes {workoutId}</Modal.Title>
            </Modal.Header>
            <div className="d-flex justify-content-between align-items-center p-2"
            style={{margin: '0 8em -2em 2em'}}>
                <div>Last updated on: {formatDate(workoutNotes.lastUpdatedDate)}</div>
                <div>Created on: {formatDate(workoutNotes.createdDate)}</div>
            </div>
            <Modal.Body>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <Container>
                        <Row className="mt-4">
                            <Col md={9}>
                                <Card>
                                    <Card.Body className="workoutdetails-main">
                                        <Card.Title className="text-primary">Workout Notes</Card.Title>
                                        <Card.Text>{editMode ? (
                                            <textarea
                                                className="form-control mt-4"
                                                rows="8"
                                                value={editedNotes}
                                                onChange={handleNotesChange}
                                            />
                                        ) : (
                                            <div className="mt-4">
                                                {workoutNotes.notes}
                                            </div>
                                        )}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            {workoutNotes.imgUrl && (
                                <Col md={3}>
                                    <Image src={workoutNotes.imgUrl} alt="Workout" fluid />
                                </Col>
                            )}
                        </Row>
                        <Row className="mt-4">
                            <Col md={12}>
                                <Card className="workoutdetails-trainerinfo">
                                    <Card.Body>
                                        <Card.Title className="text-primary">Trainer Information</Card.Title>
                                        <Card.Text>
                                            <strong>Trainer Name:</strong>{' '}
                                            {`${workoutNotes.trainerFirstName} ${workoutNotes.trainerLastName}`}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                )}
                {error && <p>Error: {error}</p>}
                {(authorities.includes('ROLE_TRAINER') || authorities.includes('ROLE_ADMIN')) && (
                    <div className="button-container mt-4 d-flex justify-content-end ">
                        {editMode ? (
                            <button className="btn btn-success" onClick={handleSaveClick}>Save</button>
                        ) : (
                            <button className="btn btn-primary" onClick={handleEditClick}>Update</button>
                        )}
                        <button className="btn btn-danger mx-4" onClick={handleDelete}>Delete</button>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default WorkoutNoteDetailsModal;
