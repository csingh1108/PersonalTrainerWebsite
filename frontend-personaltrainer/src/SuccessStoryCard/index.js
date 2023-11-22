import React, {useEffect, useState} from 'react';
import Card from 'react-bootstrap/Card';
import { Badge, Button, Form, InputGroup } from 'react-bootstrap';
import backendService from "../Services/BackendService";
import {useJwt} from "../UserGlobalProvider";
import jwtDecode from "jwt-decode";

const SuccessStoryCard = ({ name, month, year, customerImage, successStory, className, authority, enabled, id, style }) => {
    const user =useJwt()
    const [authorities, setAuthorities] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(name);
    const [editedMonth, setEditedMonth] = useState(month);
    const [editedYear, setEditedYear] = useState(year);
    const [editedStory, setEditedStory] = useState(successStory);
    const [role, setRole] = useState(null);

    useEffect(() => {
        if (user && user.jwt) {
            const decodedJwt = jwtDecode(user.jwt);
            setAuthorities(decodedJwt.authorities);
        }
    }, [user, user.jwt]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        const updatedData = {
            name: editedName,
            month: editedMonth,
            year: editedYear,
            story: editedStory,
        };

        backendService(`/api/success-story?storyId=${id}`, 'PUT', user.jwt, updatedData)
            .then((response) => {

                if (response.status === 200) {

                    setIsEditing(false);
                } else {
                    response.text().then((errorMessage) => {
                        alert(`An error occurred: ${errorMessage}`);
                    });
                }
            })
            .catch((error) => {
                alert('An error occurred while updating the story');
            });
    };

    function handleCancelClick() {
        setIsEditing(false);
    }

    return (
        <Card className={className} style={style}>
            <div className="d-flex">
                <div className="image-container">
                    <Card.Img src={customerImage} alt="Success Client" />
                    {isEditing && (
                        <Form.Group>
                            <Form.Control type="file" />
                        </Form.Group>
                    )}
                </div>
                <div className="story-container">
                    <Card.Body>
                        {authorities.includes('ROLE_ADMIN') && (
                            enabled ? (
                                <Badge bg="success">Enabled</Badge>
                            ) : (
                                <Badge bg="danger">Disabled</Badge>
                            )
                        )}

                        {isEditing ? (
                            <Form.Group>
                                <Form.Control
                                    type="text"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                />
                            </Form.Group>
                        ) : (
                            <Card.Title className="success-title">{editedName}</Card.Title>
                        )}
                        {isEditing ? (
                            <Form.Group>
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        value={editedMonth}
                                        onChange={(e) => setEditedMonth(e.target.value)}
                                    />
                                    <Form.Control
                                        type="text"
                                        value={editedYear}
                                        onChange={(e) => setEditedYear(e.target.value)}
                                    />
                                </InputGroup>
                            </Form.Group>
                        ) : (
                            <Card.Subtitle>
                                {editedMonth} {editedYear}
                            </Card.Subtitle>
                        )}
                        {isEditing ? (
                            <Form.Group>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={editedStory}
                                    onChange={(e) => setEditedStory(e.target.value)}
                                />
                            </Form.Group>
                        ) : (
                            <Card.Text className="success-story">"{editedStory}"</Card.Text>
                        )}
                        {isEditing ? (
                            <div className="mt-2">
                                <Button className="me-3" variant="success" onClick={handleSaveClick}>
                                    Save
                                </Button>
                                <Button variant="dark" onClick={handleCancelClick}>
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            authority && authority.includes('ROLE_ADMIN') && (
                                <div className="d-flex justify-content-end">
                                    <Button variant="dark" onClick={handleEditClick}>
                                        Edit
                                    </Button>
                                </div>
                            )
                        )}
                    </Card.Body>
                </div>
            </div>
        </Card>
    );
};

export default SuccessStoryCard;
