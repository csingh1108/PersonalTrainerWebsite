import React, {useState} from 'react';
import {Col, Container, Row, Form, Button, FloatingLabel, Alert} from "react-bootstrap";
import NavBar from "../NavBar";
import {useNavigate} from "react-router-dom";
import {useJwt} from "../UserGlobalProvider";


const Login = () => {
    let navigate = useNavigate()

    const [ email, setEmail] = useState("");
    const [ password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState(null);
    const user = useJwt();

    function sendLoginRequest() {
        setErrorMsg("");
        const reqBody = {
            username: email,
            password: password
        };

        fetch("/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
        })
            .then((response) => {
                if (response.status === 200) return response.text();
                else if (response.status === 401 || response.status === 403) {
                    setErrorMsg("Invalid username or password. Please try again or contact Administrator.");
                } else {
                    setErrorMsg(
                        "Something went wrong."
                    );
                }
            })
            .then((data) => {
                if (data) {
                    user.setJwt(data);
                    navigate("/");
                }
            });
    }

    return (
        <>
            <Container>
                <NavBar/>
                {errorMsg && <Alert variant="danger" className="d-flex justify-content-center">{errorMsg}</Alert>}
                <Row className="justify-content-center">
                    <Col md="8" lg="6">
                        <Form.Group className="mt-4" >
                            <FloatingLabel
                                label="Email"
                                className="mb-3"
                                >
                            <Form.Control
                                type="email"
                                id="email"
                                placeholder="John@example.com"
                                value={email}
                                onChange={ (event) => setEmail(event.target.value)}/>
                            </FloatingLabel>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col md="8" lg="6">
                        <Form.Group className="mb-3">
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

                <Row className="justify-content-center mt-3">
                    <Button
                        variant="dark"
                        onClick={sendLoginRequest}
                        style={{width:"auto"}}
                    >Submit</Button>
                </Row>

                <Row className="justify-content-center mt-4">
                    <Button
                        variant="outline-dark"
                        onClick={ () => {
                            navigate("/register")}
                        }
                        style={{width:"auto"}}
                        size="sm"
                    >Register</Button>

                </Row>
            </Container>
        </>
    );
};

export default Login;