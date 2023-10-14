import React from 'react';
import NavBar from "../NavBar";
import {Container} from "react-bootstrap";
import aboutMeBackground from "../Images/WebpageBackgrounds/aboutMeBackground.jpg"
import AboutMeCard from "../AboutMeCard";


const About = () => {

    return (
        <>
            <div className="backgroundStyles" style={{backgroundImage:  `url(${aboutMeBackground})`}}>
                <div className="overlay"></div>
                <Container>
                    <NavBar/>
                    <h1 style={{textAlign:"center"}} className="mt-3">Meet your trainers</h1>
                    <div className="glide-in-bottom" style={{textAlign:"center"}}>
                        <AboutMeCard></AboutMeCard>
                    </div>

                </Container>
            </div>

        </>
    );
};

export default About;