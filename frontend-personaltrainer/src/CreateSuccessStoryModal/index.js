import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useJwt } from '../UserGlobalProvider';
import backendService from "../Services/BackendService";

const CreateSuccessStoryModal = ({ onClose, onSave }) => {
    const user = useJwt();
    const [showModal, setShowModal] = useState(true);
    const [successStory, setSuccessStory] = useState({
        name: '',
        story: '',
        month: '',
        year: null,
    });

    const handleClose = () => {
        setShowModal(false);
        onClose();
    };

    const handleSave = () => {
        backendService("/api/success-story/create", "POST", user.jwt, successStory).then(
            (saveResponse)=> {
                if(saveResponse.status === 200 ){
                    onSave();
                } else {
                    saveResponse.text().then((errorMessage) => {
                        alert(`An error occurred: ${errorMessage}`);
                    });
                }
            }
        ).catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while saving the story');
        });
    };

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create Success Story</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={successStory.name}
                            onChange={(e) =>
                                setSuccessStory({ ...successStory, name: e.target.value })
                            }
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Story</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={successStory.story}
                            onChange={(e) =>
                                setSuccessStory({ ...successStory, story: e.target.value })
                            }
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Month</Form.Label>
                        <Form.Control
                            type="text"
                            value={successStory.month}
                            onChange={(e) =>
                                setSuccessStory({ ...successStory, month: e.target.value })
                            }
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Year</Form.Label>
                        <Form.Control
                            type="number"
                            value={successStory.year}
                            onChange={(e) =>
                                setSuccessStory({ ...successStory, year: parseInt(e.target.value) || 0 })
                            }
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateSuccessStoryModal;
