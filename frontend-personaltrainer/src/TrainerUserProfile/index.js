import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar';
import {Container, Row, Col, Image, Card, Breadcrumb, Button, Form, Table} from 'react-bootstrap';
import backendService from '../Services/BackendService';
import { useJwt } from '../UserGlobalProvider';
import profileWallpaper from "../Images/WebpageBackgrounds/circles-background-dark-tones_60389-166.jpg";
import Cookies from "js-cookie";
import {useParams} from "react-router";
import WorkoutNoteDetailsModal from "../WorkoutNoteDetailsModal";
import CreateWorkoutModal from "../CreateWorkoutModal";


const TrainerUserProfile = () => {
    const user = useJwt();
    const {userId} = useParams()
    const trainerId = Cookies.get('userId');
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
    const [workoutNotes, setWorkoutNotes] = useState([]);

    const [editGoalsMode, setEditGoalsMode] = useState(false);
    const [editedGoals, setEditedGoals] = useState(userData.workoutGoals);

    const [showWorkoutDetails, setShowWorkoutDetails] = useState(false);
    const [showWorkoutCreate, setShowWorkoutCreate] = useState(false);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);

    const fetchUserData = async (userId, userJwt) => {
        const userResponse = await backendService(`/api/users/${userId}`, 'GET', userJwt);
        if (userResponse.status === 200) {
            setUserData(userResponse.data);
        }
    };

    const fetchWorkoutNotes = async (userId, userJwt) => {
        const notesResponse = await backendService(`/api/workout/profile-workout-notes?userId=${userId}`, 'GET', userJwt);
        if (notesResponse.status === 200) {
            setWorkoutNotes(notesResponse.data);
        }
    };

    useEffect(() => {
        fetchUserData(userId, user.jwt);
    }, []);

    useEffect(() => {
        setEditedGoals(userData.workoutGoals || '');
    }, [userData]);

    useEffect(() => {
        fetchWorkoutNotes(userId, user.jwt);
    }, []);

    const toggleGoalsEditMode = () => {
        setEditGoalsMode(true);
    };

    const cancelEdit = () => {
        setEditGoalsMode(false);
        setEditedGoals(userData.workoutGoals);
    };

    const handleSave = () => {
        backendService(`/api/users/savegoals/${userId}`, 'PUT', user.jwt, { goals: editedGoals }).then(
            (updatedResponse) => {
                if(updatedResponse.status === 200){
                    setUserData(updatedResponse.data);
                }
            }
        );
        setEditGoalsMode(false);
    };

    const openWorkoutDetailsModal = (workoutId) => {
        setSelectedWorkoutId(workoutId);
        setShowWorkoutDetails(true);
    };

    const closeWorkoutDetailsModal = () => {
        setSelectedWorkoutId(null);
        setShowWorkoutDetails(false);
        backendService(`/api/workout/profile-workout-notes?userId=${userId}`, 'GET', user.jwt).then(
            (notesResponse)  => {
                if(notesResponse.status ===200){
                    setWorkoutNotes(notesResponse.data)
                }
            }
        )
    };

    const openWorkoutCreateModal = () => {
        setShowWorkoutCreate(true);
    }

    const closeWorkoutCreateModal = () => {
        setShowWorkoutCreate(false);
        fetchWorkoutNotes(userId, user.jwt);
    }

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
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </section>

                    <div>
                        <section className="noteContainer  p-3">
                            <h2>Workout Goals</h2>
                            {editGoalsMode ? (
                                <Form.Control
                                    as="textarea"
                                    style={{height:'150px'}}
                                    value={editedGoals}
                                    onChange={(e) => setEditedGoals(e.target.value)}
                                />
                            ) : (
                                <ul>
                                    {userData.workoutGoals !== null &&
                                        userData.workoutGoals.split('\n').map((goal, index) => (
                                            <li key={index}>{goal}</li>
                                        ))}
                                </ul>
                            )}
                        </section>
                        <div className="d-flex justify-content-end mt-2 gap-3">
                            {editGoalsMode ? (
                                <>
                                    <Button variant="outline-success" onClick={handleSave}>
                                        Update
                                    </Button>
                                    <Button variant="danger" onClick={cancelEdit}>
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <Button variant="light" onClick={toggleGoalsEditMode}>
                                    Edit Goals
                                </Button>
                            )}
                        </div>
                    </div>

                    {showWorkoutDetails && (
                        <WorkoutNoteDetailsModal workoutId={selectedWorkoutId}
                                                 onClose={closeWorkoutDetailsModal}/>
                    )}
                    {showWorkoutCreate && (
                        <CreateWorkoutModal trainerId={trainerId}
                                            userId={userId}
                                            onClose={closeWorkoutCreateModal}/>
                    )}

                    <div className="border rounded p-3 mt-4">
                        <div className="d-flex align-items-center justify-content-between">
                            <h2>Workout Notes</h2>
                            <Button
                                variant="light"
                                onClick={openWorkoutCreateModal}
                                className="ml-auto"
                            >
                                Create
                            </Button>
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
                                    .map((note, index) => (
                                    <tr key={note.workoutId}>
                                        <td>
                                            <Breadcrumb.Item
                                                onClick={() => openWorkoutDetailsModal(note.workoutId)}
                                            >
                                                <strong>Workout Note {index+1}</strong>
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
                            <p>You have no workout notes yet</p>
                        )}
                    </div>
                </Container>
            </div>
        </>
    );
};

export default TrainerUserProfile;
