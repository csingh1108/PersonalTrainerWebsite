import React, {useEffect, useState} from 'react';
import {Button, Container} from "react-bootstrap";
import NavBar from "../NavBar";
import {useJwt} from "../UserGlobalProvider";
import backendService from "../Services/BackendService";
import {useNavigate} from "react-router-dom";
import SearchBar from "../SearchBar";

const TrainerDashboard = () => {
    const user = useJwt();
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        backendService(`api/users/assigned`,"GET", user.jwt).then(
            (assignedResponse) => {
                if(assignedResponse.status===200){
                    setUsers(assignedResponse.data);
                }
            }
        )
    }, []);

    const updateSearchResults = (results) => {
        setUsers(results);
    };

    return (
        <>
            <Container>
                <NavBar/>
                <h2 className="mt-3" style={{textAlign:"center"}}>Assigned Users</h2>
                <SearchBar
                    type="user"
                    updateSearchResults={updateSearchResults}
                ></SearchBar>
                <table className="user-table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone Number</th>
                        <th>Sex</th>
                        <th>Age</th>
                        <th>Profile Link</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.phone}</td>
                            <td>{user.sex}</td>
                            <td>{user.age}</td>
                            <td>
                                <Button onClick={() => navigate(`/userprofile/${user.id}`)}>
                                    Profile
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Container>
            
        </>
    );
};

export default TrainerDashboard;