import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavBar from "../NavBar";
import strengthimg from "../Images/TrainingPageImages/strengthbackground.jpg"
import mainpimg from "../Images/WebpageBackgrounds/cardiobackground.jpg"
import remoteimg from "../Images/TrainingPageImages/remotebackground.jpg"
import personalimg from "../Images/TrainingPageImages/personalworkoutbackground.jpg"
import cardioimg from "../Images/TrainingPageImages/carioworkoutbackground.jpg"
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";


const TrainingPrograms = () => {
    let navigate = useNavigate();

    return (
        <>
            <div className="backgroundStyles" style={{backgroundImage:  `url(${mainpimg})`}}>
                <div className="overlay"></div>
                <Container>
                    <NavBar/>
                    <h1 style={{textAlign:"center", fontWeight:"bolder"}} className="mt-3">Training Programs</h1>
                    <p style={{ fontSize:'20px', fontWeight:'bold', textAlign:"center"}}>
                        Welcome to our fitness training programs! Our dedicated programs require a <span style={{color:"red"}}>multi-week commitment</span> because we want to make sure you get the results you deserve.
                        <br/>
                        <br/>
                        Here's an overview of what we offer:
                    </p>

                    <div className="textContainerStyles2" >
                        <h2>Program 1: Strength Training</h2>
                        <Row>
                            <Col md={6}>
                                <p className="mt-3">
                                    Discover the essence of our comprehensive strength training program, designed to help you achieve your fitness goals. This program, typically spanning over <b style={{color: "orangered", fontSize:'18px'}}>12 weeks</b>, prioritizes the development of muscle strength and endurance. Throughout your journey, you can expect a range of benefits, including customized workout plans meticulously tailored to your current fitness level. Our expert trainers will also provide invaluable guidance on proper lifting techniques, minimizing the risk of injuries and ensuring optimal muscle engagement. In addition to this, our program offers nutritional advice specially crafted to support muscle growth, enabling you to reach your fitness milestones with confidence.
                                </p>
                            </Col>
                            <Col md={6}>
                                <img src={strengthimg} alt="Profile" className="img-fluid program-image"  />
                            </Col>
                        </Row>
                    </div>

                    <div className="textContainerStyles2">
                        <h2>Program 2: Cardiovascular Conditioning</h2>
                        <Row>
                            <Col md={6}>
                                <p className="mt-3">
                                    Experience the ideal path to enhanced heart health and stamina through our dynamic cardiovascular conditioning program. With a typical duration of <b style={{color: "orangered", fontSize:'18px'}}>10 weeks</b>, this program is meticulously designed for individuals seeking to elevate their cardiovascular fitness. It encompasses a wide range of cardio exercises, including running, cycling, and swimming, to provide diversity and challenge to your workouts. Our program's secret weapon is interval training, a proven method to not only boost your metabolism but also maximize calorie burn. As you progress, we'll help you keep tabs on your achievements by incorporating heart rate monitors and fitness apps, ensuring you stay motivated and on track to reach your fitness aspirations.
                                </p>
                            </Col>
                            <Col md={6}>
                                <img src={cardioimg} alt="Profile" className="img-fluid program-image"  />
                            </Col>
                        </Row>
                    </div>

                    <div className="textContainerStyles2">
                        <h2>Program 3: Remote Training Program</h2>
                        <Row>
                            <Col md={6}>
                                <p className="mt-3">
                                    Unveil the convenience and effectiveness of our remote training program, offering you the opportunity to collaborate with a dedicated personal trainer without leaving the comfort of your home. This flexible program is structured for a duration of <b style={{color: "orangered", fontSize:'18px'}}>16 weeks</b>, allowing you to embark on a fitness journey at your own pace. Experience virtual one-on-one training sessions via video calls, where your personal trainer will provide guidance, motivation, and expertise tailored to your unique needs. We understand that everyone's home setup is different, so rest assured that our program includes customized workout plans specifically designed to align with your available space and equipment. Additionally, our commitment to your progress extends to regular online check-ins and progress tracking, ensuring that you stay motivated and accountable throughout your transformative fitness experience.
                                </p>
                            </Col>
                            <Col md={6}>
                                <img src={remoteimg} alt="Profile" className="img-fluid program-image"  />
                            </Col>
                        </Row>
                    </div>


                    <div className="textContainerStyles2">
                        <h2>Program 4: 1-on-1 Conditioning</h2>
                        <Row>
                            <Col md={6}>
                                <p className="mt-3">
                                    Experience the pinnacle of personalized fitness with our 1-on-1 conditioning program, where you'll receive exclusive training sessions led by a dedicated coach. This transformative program is <b style={{color: "orangered", fontSize:'18px'}}>tailored to your schedule</b> and is meticulously designed to cater to your unique fitness goals. You'll benefit from individualized workout plans crafted to align perfectly with your aspirations, ensuring every session brings you closer to your desired outcome. Our coaching sessions are intense and focused, providing expert guidance on your progress and form, enabling you to optimize your performance and reduce the risk of injury. We understand the importance of convenience, so our program offers flexible scheduling options to accommodate your busy lifestyle, ensuring that you can consistently engage in rewarding training sessions.
                                </p>
                            </Col>
                            <Col md={6}>
                                <img src={personalimg} alt="Profile" className="img-fluid program-image"  />
                            </Col>
                        </Row>
                    </div>
                    <Row
                        className="justify-content-center mt-3 mb-5">
                        <Button style={{width:"auto"}} variant="danger" onClick={ () => navigate("/contact")}>Contact us</Button>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default TrainingPrograms;

