import React, { useState} from 'react';
import {Col, Container, Row, Form, Button, FloatingLabel} from "react-bootstrap";
import NavBar from "../NavBar";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {useJwt} from "../UserGlobalProvider";



const Register = () => {
    let navigate = useNavigate()
    const user = useJwt();

    const [ email, setEmail] = useState("");
    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastname ] = useState("");
    const [ password, setPassword] = useState("");

    function createUser() {
        const reqBody= {
            firstName: firstName,
            lastName: lastName,
            username : email,
            password: password
        }

        fetch("/api/users/register", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(reqBody),
        })
            .then ( (response) => {
                if(response.status === 200) {
                    return Promise.all([response.json(), response.headers]);
                }else return Promise.reject("Invalid registration");
            })
            .then (([body, headers]) => {
                user.setJwt(Cookies.get("jwt"));
                navigate("/login")
            })
            .catch((message) => {
                alert(message);
            });
    }

    return (
        <>
            <Container>
                <NavBar/>
                <Row className="justify-content-center">
                    <Col md="8" lg="6">
                        <Form.Group className="mt-4" >
                            <FloatingLabel label="First Name">
                            <Form.Control
                                type="email"
                                id="username"
                                placeholder="John"
                                value={firstName}
                                onChange={ (event) => setFirstName(event.target.value)}/>
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col md="8" lg="6">
                        <Form.Group className="mt-4" >
                            <FloatingLabel label="Last Name">
                            <Form.Control
                                type="email"
                                id="username"
                                placeholder="Smith"
                                value={lastName}
                                onChange={ (event) => setLastname(event.target.value)}/>
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col md="8" lg="6">
                        <Form.Group className="mt-3" >
                            <FloatingLabel label="Email">
                            <Form.Control
                                type="email"
                                id="username"
                                placeholder="John@example.com"
                                value={email}
                                onChange={ (event) => setEmail(event.target.value)}/>
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col md="8" lg="6">
                        <Form.Group className="mt-3">
                            <FloatingLabel label="Password">
                            <Form.Control
                                type="password"
                                id="password"
                                placeholder="Type in password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}/>
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mt-4 d-flex">
                    <Col md="6" lg="6" className="justify-content-end d-flex">
                        <Button
                            id="submit"
                            variant="dark"
                            size="lg"
                            onClick={() => createUser()}
                            style={{ width: "auto" }}
                        >
                            Submit
                        </Button>
                    </Col>
                    <Col md="6" lg="6" className="justify-content-start d-flex">
                        <Button
                            variant="secondary"
                            type="button"
                            size="lg"
                            onClick={() => {
                                navigate('/login');
                            }}
                            style={{ width: '100px' }}
                        >
                            Exit
                        </Button>
                    </Col>
                </Row>


            </Container>
        </>
    );
};

export default Register;