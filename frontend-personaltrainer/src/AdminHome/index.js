import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import NavBar from '../NavBar';
import userImage from '../Images/AdminMainIcons/user-management-icon.png';
import trainerImage from '../Images/AdminMainIcons/TrainerManagmentIcon.png';
import successImage from '../Images/AdminMainIcons/successicon.png';
import {useNavigate} from "react-router-dom";

const AdminHome = () => {
    let navigate = useNavigate();
    return (
        <>
            <div className="backgroundStyles" style={{ backgroundColor: '#F8F8FF' }}>
            <Container >
                <NavBar />
                <Row className="mt-5">
                    <Col md="8" lg="12" sm="10" className="d-flex flex-row justify-content-evenly">

                        <div
                            className="square"
                            onClick={ () => navigate("/manageUsers")}>
                            <div className="content">
                                <img src={userImage} alt="User Management" />
                                <h5>User Management</h5>
                                <p>Assign users, enable/disable users</p>
                            </div>
                        </div>

                        <div
                            className="square"
                            onClick={ () => navigate("/manageTrainers")}>
                            <div className="content">
                                <img src={trainerImage} alt="Trainer Management" />
                                <h5 className="mt-2">Trainer Management</h5>
                                <p>Create, edit, enable, disable trainers, assign users  to trainer</p>
                            </div>
                        </div>

                        <div
                            className="square"
                            onClick={ () => navigate("/manageStories")}>
                            <div className="content">
                                <img src={successImage} alt="Success Story Management" />
                                <h5 className="mt-2">Success Story Management</h5>
                                <p>Create, edit, enable, disable success stories</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            </div>
        </>
    );
};

export default AdminHome;
