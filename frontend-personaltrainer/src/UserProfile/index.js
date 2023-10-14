import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar';
import {Container, Row, Col, Image, Card, Breadcrumb, Button, Dropdown, Form, Table} from 'react-bootstrap';
import backendService from '../Services/BackendService';
import { useJwt } from '../UserGlobalProvider';
import profileWallpaper from "../Images/WebpageBackgrounds/circles-background-dark-tones_60389-166.jpg";
import Cookies from "js-cookie";
import WorkoutNoteDetailsModal from "../WorkoutNoteDetailsModal";

const Profile = () => {
    const user = useJwt();
    const userId = Cookies.get('userId');
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        age: null,
        sex: '',
        phone: '',
        profileImgUrl: "",
        workoutGoals: '',
    });
    const [editMode, setEditMode] = useState(false);
    const [editedData, setEditedData] = useState({});

    const [workoutNotes, setWorkoutNotes] = useState([]);
    const [showWorkoutDetails, setShowWorkoutDetails] = useState(false);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);

    useEffect(() => {
        backendService(`/api/users/${userId}`, 'GET', user.jwt).then(
            (userResponse) => {
                if(userResponse.status === 200){
                    setUserData(userResponse.data);
                }

            });
    }, []);

    useEffect(() => {
        backendService(`/api/workout/profile-workout-notes?userId=${userId}`, 'GET', user.jwt).then(
            (notesResponse)  => {
                if(notesResponse.status === 200){
                    setWorkoutNotes(notesResponse.data);
                }
            }
        )
    }, []);

    function toggleEditMode() {
        setEditMode(!editMode);
        setEditedData({...userData})
    }
    function handleInputChange(event) {
        const { name, value } = event.target;
        setEditedData({ ...editedData, [name]: value });
    }

    function saveChanges() {
        backendService(`/api/users/save`, 'PUT', user.jwt, editedData).then(
            (updatedResponse) => {
                if(updatedResponse.status===200){
                    setUserData(updatedResponse.data)
                }
            }
        )
        setEditMode(false);
    }

    function cancelEdit() {
        setEditMode(false);
        setEditedData({});
    }

    const openWorkoutDetailsModal = (workoutId) => {
        setSelectedWorkoutId(workoutId);
        setShowWorkoutDetails(true);
    };

    const closeWorkoutDetailsModal = () => {
        setSelectedWorkoutId(null);
        setShowWorkoutDetails(false);
    };

    function formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    }

    return (
        <>
            <div className="backgroundStyles" style={{backgroundImage:  `url(${profileWallpaper})`}}>
                <NavBar />
                <Container>
                    <section className="mt-3">
                        <h2>Profile Information</h2>
                        <Row className="profileCardStyle">
                            <Col xs={12} md={3} className="profile-image-small-screen">
                                <div className="profile-image-container" style={{ width: '15em', height: '15em', position: 'relative' }}>
                                    {userData.profileImgUrl ? (
                                        <Image
                                            src={userData.profileImgUrl}
                                            alt="Profile image"
                                            className="profile-image-user"
                                            style={{ border: '1px solid black' }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                backgroundColor: 'rgba(150, 150, 150, .9)',
                                                padding: '10px',
                                                borderRadius: '5px',
                                            }}
                                        >
                                            No profile image
                                        </div>
                                    )}
                                </div>
                            </Col>
                            <Col xs={10} s={6} md={9}>
                                <Card className="profile-info-container" style={{ height: '240px' }}>
                                    <Card.Body>
                                        <Card.Title style={{ fontSize: '25px' }}>{userData.firstName} {userData.lastName}</Card.Title>
                                        <Card.Text>
                                            {editMode ? (
                                                <>
                                                    <Form>
                                                        <Form.Group>
                                                            <Form.Label style={{fontWeight:"bold"}}>Address:</Form.Label>
                                                            <input
                                                                style={{ width: '500px', marginLeft:'.5em'}}
                                                                className="inputFieldStyle"
                                                                type="text"
                                                                name="address"
                                                                value={editedData.address}
                                                                onChange={handleInputChange}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group>
                                                            <Form.Label style={{fontWeight:"bold"}}>(Username) Email:</Form.Label> {userData.username}
                                                        </Form.Group>
                                                        <Form.Group>
                                                            <Form.Label style={{fontWeight:"bold"}}>Phone:</Form.Label>
                                                            <input
                                                                style={{ marginLeft:'.5em'}}
                                                                type="text"
                                                                name="phone"
                                                                value={editedData.phone}
                                                                onChange={handleInputChange}
                                                            />
                                                        </Form.Group>
                                                        <Form.Group>
                                                            <Form.Label style={{fontWeight:"bold"}}>Age:</Form.Label>
                                                            <input
                                                                style={{ marginLeft:'.5em'}}
                                                                type="text"
                                                                name="age"
                                                                value={editedData.age}
                                                                onChange={handleInputChange}
                                                            />
                                                        </Form.Group>
                                                        <Dropdown className="mb-1">
                                                            <Form.Label style={{fontWeight:"bold"}}>Sex:</Form.Label>
                                                            <select
                                                                style={{ marginLeft:'.5em'}}
                                                                name="sex"
                                                                value={editedData.sex}
                                                                onChange={handleInputChange}
                                                            >
                                                                <option value="">---</option>
                                                                <option value="Male">Male</option>
                                                                <option value="Female">Female</option>
                                                                <option value="Do not wish to declare">Do not wish to declare</option>
                                                            </select>
                                                        </Dropdown>
                                                    </Form>

                                                </>
                                            ) : (
                                                <>
                                                    <div className="mb-2">
                                                        <strong>Address:</strong> {userData.address}
                                                    </div>
                                                    <div className="mb-2">
                                                        <strong>Email:</strong> {userData.username}
                                                    </div>
                                                    <div className="mb-2">
                                                        <strong>Phone:</strong> {userData.phone}
                                                    </div>
                                                    <div className="mb-2">
                                                        <strong>Age:</strong> {userData.age}
                                                    </div>
                                                    <div className="mb-2">
                                                        <strong>Sex:</strong> {userData.sex}
                                                    </div>
                                                </>
                                            )}
                                        </Card.Text>
                                    </Card.Body>

                                </Card>
                            </Col>
                            <div className="d-flex justify-content-end mt-2 gap-3">
                                {editMode ? (
                                    <>
                                        <Button variant="outline-success" onClick={saveChanges}>
                                            Update
                                        </Button>
                                        <Button variant="dark" onClick={cancelEdit}>
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <Button variant="dark" onClick={toggleEditMode}>
                                        Edit Profile
                                    </Button>
                                )}
                            </div>
                        </Row>
                    </section>

                    <section className="noteContainer">
                        <h2>Workout Goals</h2>
                        <ul>
                            {userData.workoutGoals !== null ? (
                                userData.workoutGoals.split('.').map((goal, index) => (
                                        <li key={index}>{goal}</li>
                                    ))
                            ) : (
                                <p>Your trainer has not set your goals yet.</p>
                            )}
                        </ul>
                    </section>
                    
                    {showWorkoutDetails && (
                        <WorkoutNoteDetailsModal workoutId={selectedWorkoutId}
                                                 onClose={closeWorkoutDetailsModal}/>
                    )}

                    <div className="border rounded p-3 mt-4">
                        <div className="d-flex align-items-center justify-content-between">
                            <h2>Workout Notes</h2>
                        </div>
                        {workoutNotes.length > 0 ? (
                            <Table
                                striped
                                bordered
                                hover
                                style={{borderRadius:'20px'}}
                                className="mt-2">
                                <thead>
                                <tr>
                                    <th>Note(s)</th>
                                    <th>Created Date</th>
                                    <th>Last Updated Date</th>
                                    <th>Trainer</th>
                                </tr>
                                </thead>
                                <tbody>
                                {workoutNotes
                                    .slice()
                                    .sort((a,b) => a.workoutId - b.workoutId)
                                    .map((note) => (
                                        <tr key={note.workoutId}>
                                            <td>
                                                <Breadcrumb.Item
                                                    onClick={() => openWorkoutDetailsModal(note.workoutId)}
                                                >
                                                    <strong>Workout Note {note.workoutId}</strong>
                                                </Breadcrumb.Item>
                                            </td>
                                            <td>{formatDate(note.createdDate)}</td>
                                            <td>{formatDate(note.lastUpdateDate)}</td>
                                            <td>{note.trainerFirstName} {note.trainerLastName}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p className="mx-4">You have no workout notes yet</p>
                        )}
                    </div>
                </Container>
            </div>
        </>
    );
};

export default Profile;
