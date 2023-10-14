import React, {useState} from 'react';
import NavBar from "../NavBar";
import { Container, Form, Button } from "react-bootstrap";
import {Facebook, Instagram, Snapchat, Tiktok, Youtube} from "react-bootstrap-icons";
import {useNavigate} from "react-router-dom";

const Contact = () => {
    const navigate = useNavigate();

    const [ name, setName ]= useState("");
    const [ email, setEmail ]= useState("");
    const [ message, setMessage ]= useState("");
    const [ subject, setSubject ]= useState("");

    const[ validationErrors, setValidationErrors ] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();
        const errors = {};

        if (!name) {
            errors.name = 'Name is required';
        }
        if (!email) {
            errors.email = 'Email is required';
        }
        if (!subject) {
            errors.subject = 'Subject is required';
        }
        if (!message) {
            errors.message = 'Message is required';
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
        } else {
            navigate("/messagerecieved")
        }
    };

    return (
        <>
            <Container>
                <NavBar />
                <h1 style={{textAlign:"center"}} className="mt-5">Contact Us</h1>
                <Form className="mx-auto" style={{ maxWidth: "400px" }}>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={ (event) => setName(event.target.value)}
                            style={{ borderColor: validationErrors.name ? 'red' : '' }}
                        />
                        {validationErrors.name && <div className="text-danger">{validationErrors.name}</div>}

                    </Form.Group>

                    <Form.Group controlId="formEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={ (event) => setEmail(event.target.value)}
                            style={{ borderColor: validationErrors.name ? 'red' : '' }}
                        />
                        {validationErrors.email && <div className="text-danger">{validationErrors.email}</div>}

                    </Form.Group>

                    <Form.Group controlId="formSubject">
                        <Form.Label>Subject</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter the subject"
                            value={subject}
                            onChange={ (event) => setSubject(event.target.value)}
                            style={{ borderColor: validationErrors.name ? 'red' : '' }}
                        />
                        {validationErrors.subject && <div className="text-danger">{validationErrors.subject}</div>}

                    </Form.Group>

                    <Form.Group controlId="formMessage">
                        <Form.Label>Message</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter your message"
                            value={message}
                            onChange={ (event) => setMessage(event.target.value)}
                            style={{ borderColor: validationErrors.name ? 'red' : '' }}
                        />
                        {validationErrors.message && <div className="text-danger">{validationErrors.message}</div>}

                    </Form.Group>

                    <div style={{textAlign:"center"}}>
                        <Button variant="primary" type="submit" className="mt-3" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </div>
                </Form>
            </Container>

            <Container className="mt-5" style={{textAlign:"center"}}>
                <h3>Follow us on Social Media</h3>
                <div className="d-flex gap-4 justify-content-center">
                    <span> <Facebook/> <a href="https://www.facebook.com">Facebook</a> </span>
                    <span> <Snapchat/> <a href="https://www.snapchat.com">Snapchat</a> </span>
                    <span> <Tiktok/> <a href="https://www.tiktok.com">TikTok</a> </span>
                    <span> <Instagram/> <a href="https://www.instagram.com">Instagram</a> </span>
                    <span><Youtube/> <a href="https://www.youtube.com">YouTube</a> </span>
                </div>
            </Container>
        </>
    );
};

export default Contact;
