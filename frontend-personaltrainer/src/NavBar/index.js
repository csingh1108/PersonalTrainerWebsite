import React, {useEffect, useState} from 'react';
import {Alert, Container, Nav, Navbar} from "react-bootstrap";
import {useLocation, useNavigate} from "react-router-dom";
import {useJwt} from "../UserGlobalProvider";
import jwtDecode from "jwt-decode";

import Cookies from "js-cookie";



const NavBar = () => {
    const user = useJwt();
    let navigate = useNavigate();
    let location= useLocation();

    const [authorities, setAuthorities] = useState("");
    const [ userId, setUserId ] = useState(null)
    const [showLogoutAlert, setShowLogoutAlert] = useState(false);

    useEffect(() => {
        if (user && user.jwt) {
            const decodedJwt = jwtDecode(user.jwt);
            setAuthorities(decodedJwt.authorities);
            setUserId(decodedJwt.userId);
            Cookies.set('userId', decodedJwt.userId);
        }
    }, [user, user.jwt]);

    const handleLogout = () => {
        fetch('/api/auth/logout', {
            method: 'GET',
            credentials: 'include',
        })
            .then(response => {
                if (response.ok) {
                    user.setJwt(null)
                    setShowLogoutAlert(true);
                    navigate('/home');
                } else {
                    console.error('Logout failed');
                }
            })
            .catch(error => {
                console.error('An error occurred during logout', error);
            });
    };


    return (
        <>

            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand>
                        <Nav.Link onClick={ () => {
                            navigate("/home")
                        }}>
                            Peak Performance Training
                        </Nav.Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                        <Nav className="gap-3">
                            <Nav.Link onClick={ () => {
                                navigate("/home")
                            }}>Home</Nav.Link>
                            <Nav.Link onClick={ () => {
                                navigate("/about")
                            }}>About</Nav.Link>
                            <Nav.Link onClick={ () => {
                                navigate("/stories")
                            }}>Success Stories</Nav.Link>
                            <Nav.Link onClick={ () => {
                                navigate("/programs")
                            }}>Training Programs</Nav.Link>
                            <Nav.Link href="#pricing">Blog</Nav.Link>
                            <Nav.Link onClick={ () => {
                                navigate("/contact")
                            }}>Contact</Nav.Link>
                            {(user.jwt && authorities.includes('ROLE_CLIENT')) && (
                                <Nav.Link onClick={() => {
                                    navigate(`/profile/`)
                                }}>Client Profile</Nav.Link>
                            )}
                            {(user.jwt && authorities.includes('ROLE_TRAINER')) && (
                                <Nav.Link onClick={() => {
                                    navigate(`/trainer`)
                                }}>Trainer Dashboard</Nav.Link>
                            )}
                            {(user.jwt && authorities.includes('ROLE_ADMIN')) && (
                                <Nav.Link onClick={() => {
                                    navigate(`/admin`)
                                }}>Admin Dashboard</Nav.Link>
                            )}
                            {user && user.jwt ? (
                                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                            ) : (
                                location.pathname !== '/login' && (
                                    <Nav.Link onClick={() => navigate('/login')}>Login</Nav.Link>
                                )
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Alert
                variant="success"
                show={showLogoutAlert}
                onClose={() => setShowLogoutAlert(false)}
                dismissible
            >
                Logout successful!
            </Alert>
        </>
    );
};

export default NavBar;