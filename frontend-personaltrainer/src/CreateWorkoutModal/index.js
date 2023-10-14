import React, {useState} from 'react';
import {Button, Card, Col, Container, Form, Modal, Row} from 'react-bootstrap';
import {useJwt} from '../UserGlobalProvider';
import backendService from "../Services/BackendService";

const CreateWorkoutModal = ({ trainerId, userId, onClose }) => {
    const user = useJwt();
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(true);
    const [workoutNote, setWorkoutNote] = useState({
        notes: '',
        trainerId: trainerId,
        userId: userId,
    });

    if (error) {
        return <p>Error: {error}</p>;
    }

    function handleSubmit() {
        const apiUrl = '/api/workout/create';
        backendService(apiUrl, 'POST', user.jwt, workoutNote)
            .then((response) => {
                if (response.status === 200) {
                    onClose();
                } else {
                    response.text().then((errorMessage) => {
                        alert(`An error occurred: ${errorMessage}`);
                    });
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred while submitting the workout note');
            });
    }

    function handleNoteChange(e) {
        setWorkoutNote({ ...workoutNote, notes: e.target.value });
    }

    function handleFileChange(e){
        //TODO handle files
    }


    return (
        <Modal show={showModal} onHide={onClose} contentClassName="modal-height">
            <Modal.Header closeButton>
                <Modal.Title>Workout Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row className="mt-4">
                        <Col md={10}>
                            <Card>
                                <Card.Body className="workoutdetails-main">
                                    <Form>
                                        <Form.Group controlId="workoutNotes">
                                            <Form.Label style={{fontSize: '20px'}}>Workout Notes</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={5}
                                                placeholder="Enter your workout notes here..."
                                                value={workoutNote.notes}
                                                onChange={handleNoteChange}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mt-3" controlId="workoutFile">
                                            <Form.Label>Upload File</Form.Label>
                                            <Form.Control
                                                id="custom-file"
                                                label="Choose file"
                                                type="file"
                                                onChange={handleFileChange}
                                            />
                                        </Form.Group>

                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row className="justify-content-center align-items-center mt-3">
                        <Button
                            type="submit"
                            variant="primary"
                            style={{width:'auto'}}
                            onClick={handleSubmit}>
                            Save
                        </Button>
                        <Button
                            type="submit"
                            className="mx-3"
                            style={{width:'auto', background:"gray", borderColor:'gray'}}
                            onClick={onClose}>
                            Cancel
                        </Button>
                    </Row>

                </Container>
                {error && <p>Error: {error}</p>}
            </Modal.Body>
        </Modal>
    );
};

export default CreateWorkoutModal;
