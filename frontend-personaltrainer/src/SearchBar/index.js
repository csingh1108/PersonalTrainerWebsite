import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useJwt } from '../UserGlobalProvider';
import jwtDecode from 'jwt-decode';
import backendService from "../Services/BackendService";

const SearchBar = ({ type, updateSearchResults, visible }) => {
    const user = useJwt();
    const [searchValue, setSearchValue] = useState('');
    const [filterValue, setFilterValue] = useState('client');
    const [authorities, setAuthorities] = useState('');

    useEffect(() => {
        if (user && user.jwt) {
            const decodedJwt = jwtDecode(user.jwt);
            setAuthorities(decodedJwt.authorities);
        }
    }, [user, user.jwt]);

    const handleSearchAssignedToUser = () => {
        const searchParams = new URLSearchParams();
        searchParams.append('searchValue', searchValue);

        if (filterValue === 'trainer') {
            searchParams.append('filterValue', 'trainer');
        } else if (filterValue === 'unassigned') {
            searchParams.append('filterValue', 'unassigned');
        } else {
            searchParams.append('filterValue', 'client');
        }

        backendService(`/api/users/search?${searchParams.toString()}`, 'GET', user.jwt).then(
            (responseData) => {
                updateSearchResults(responseData.data);
            }
        );
    };

    function handleSearchTrainer() {
        const searchParams = new URLSearchParams();
        searchParams.append('searchValue', searchValue);

        backendService(`/api/users/searchTrainers?${searchParams.toString()}`, 'GET', user.jwt).then(
            (responseData) => {
                updateSearchResults(responseData.data);
            }
        );
    }

    function handleSearchStory() {
        const searchParams = new URLSearchParams();
        searchParams.append('searchValue', searchValue);

        backendService(`/api/success-story/searchStories?${searchParams.toString()}`, 'GET', user.jwt).then(
            (responseData) => {
                console.log(responseData.data);
                updateSearchResults(responseData.data);
            }
        );
    }

    const handleSearchClick = (type) => {
        if(type === 'user'){
            handleSearchAssignedToUser();
        } else if(type === "trainer"){
            handleSearchTrainer();
        }else if( type === 'story'){
            handleSearchStory();
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-4">
                    {authorities.includes('ROLE_ADMIN') && visible && type === 'user' && (
                        <div>
                            <Form.Select
                                aria-label="Floating label select example"
                                onChange={(e) => setFilterValue(e.target.value)}
                            >
                                <option value="client">By Client Name</option>
                                <option value="trainer">By Assigned Trainer</option>
                                <option value="unassigned">By Unassigned</option>
                            </Form.Select>
                        </div>
                    )}
                </div>
                <div className="col-md-5">
                    <FloatingLabel controlId="floatingInput" label="Search By Name" className="mb-2">
                        <Form.Control
                            type="text"
                            placeholder="Enter a name"
                            style={{ width: '100%' }}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </FloatingLabel>
                </div>
                <div className="col-md-3">
                    <button
                        onClick={() =>handleSearchClick(type)}
                        className="btn btn-primary w-40 h-70 mt-2"
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
