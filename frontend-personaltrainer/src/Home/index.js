import React from 'react';
import NavBar from "../NavBar";
import {Button, Col, Container, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import PersonalTrainerBackground from "../Images/WebpageBackgrounds/PersonalTrainerBackground.jpg"
import '../App.css'

const Home = () => {
    let navigate = useNavigate()

    return (
        <>
            <div className="backgroundStyles" style={{backgroundImage:  `url(${PersonalTrainerBackground})`}}>
                <div className="overlay"></div>
                <Container>
                    <NavBar></NavBar>
                    <Row
                        className="justify-content-center"
                        style={{marginTop:"8em",
                            fontSize:"large"}}>
                        <Col md="8" lg="7" sm="10">
                            <div className="textContainerStyles">
                                Welcome to Peak Performance Training, where we're not just about workouts; we're about unlocking your full potential. Our mission is to inspire and empower you to achieve greatness in every rep, set, and stride. We believe in the relentless pursuit of your fitness goals, the unwavering commitment to your dreams, and the unyielding dedication to your health. With our expert guidance and your sheer determination, you'll not only transform your body but also your life. Join us on this fitness revolution, embrace the grind, and discover the champion within you. Together, we'll conquer every challenge and elevate your fitness journey to new heights.
                                <br/> <br/>
                                What are you waiting for?
                                Level up your game today!

                            </div>
                        </Col>
                    </Row>

                    <Row
                        className="justify-content-center mt-3">
                        <Button style={{width:"auto"}} variant="danger" onClick={ () => navigate("/programs")}>Learn More</Button>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default Home;