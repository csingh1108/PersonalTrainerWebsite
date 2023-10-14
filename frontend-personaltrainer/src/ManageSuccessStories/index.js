import React, {useEffect, useState} from 'react';
import {Button, Container, OverlayTrigger, Tooltip} from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import NavBar from "../NavBar";
import {useJwt} from "../UserGlobalProvider";
import backendService from "../Services/BackendService";
import SearchBar from "../SearchBar";
import SuccessStoryCard from "../SuccessStoryCard";
import jwtDecode from "jwt-decode";
import CreateSuccessStoryModal from "../CreateSuccessStoryModal";

const ManageSuccessStories = () => {
    const user = useJwt();
    const [authority, setAuthority]= useState();

    const [successStories, setSuccessStories] = useState([]);
    const [showCreateSuccessModal, setShowCreateSuccessModal] = useState(false);
    const [checkboxStates, setCheckboxStates] = useState({});

    useEffect(() => {
        if (user && user.jwt) {
            const decodedJwt = jwtDecode(user.jwt);
            setAuthority(decodedJwt.authorities);

        }
    }, [user, user.jwt]);
    const fetchSuccessStories = () => {
        backendService("/api/success-story/all", "GET", user.jwt).then((successResponse) => {
            if (successResponse.status === 200) {
                const initialCheckboxStates = successResponse.data.map(() => false);
                setCheckboxStates(initialCheckboxStates);
                setSuccessStories(successResponse.data);
            }
        });
    };

    useEffect(() => {
        fetchSuccessStories(user.jwt);
    }, []);

    function openSuccessStoryModal() {
        setShowCreateSuccessModal(true)
    }
    function closeCreateSuccessModalSave() {
        setShowCreateSuccessModal(false)
        fetchSuccessStories();
    }

    function closeCreateSuccessModalNoSave() {
        setShowCreateSuccessModal(false)
    }

    function toggleCheckbox(id) {
        setCheckboxStates((prevStates) => ({
            ...prevStates,
            [id]: !prevStates[id] || false,
        }));
    }


    function enableStory() {
        const enabledStoryIds = successStories
            .filter((story) => checkboxStates[story.id])
            .map((story) => story.id);

        console.log("Enabled IDs before call", enabledStoryIds)

        backendService("/api/success-story/enable", "PUT", user.jwt, enabledStoryIds).then(
            (updatedIds) => {
                fetchSuccessStories();
            }
        )
        setCheckboxStates({})

    }

    function disableStory() {
        const disabledStoryIds = successStories
            .filter((story) => checkboxStates[story.id])
            .map((story) => story.id);

        console.log("Disabled IDs before call", disabledStoryIds)

        backendService("/api/success-story/disable", "PUT", user.jwt, disabledStoryIds).then(
            (updatedIds) => {
                console.log(updatedIds.data)
                console.log(successStories);
                console.log(checkboxStates);
                fetchSuccessStories();
            }
        )
        setCheckboxStates({})
    }

    const renderCreateText = (props) => (
        <Tooltip id="create-tooltip" {...props}>
            Click to create new Success story
        </Tooltip>
    );

    const renderEnableText = (props) => (
        <Tooltip id="enable-tooltip" {...props}>
            Hit checkbox(es) on stories you want to enable. Then click me.
        </Tooltip>
    );

    const renderDisableText = (props) => (
        <Tooltip id="disable-tooltip" {...props}>
            Hit checkbox(es) on stories you want to disable. Then click me.
        </Tooltip>
    );

    const updateSearchResults = (results) => {
        setSuccessStories(results);
    };


    return (
        <>
            <Container>
                <NavBar />
                <div className="mt-3">
                    <SearchBar
                        type="story"
                        updateSearchResults={updateSearchResults}
                        visible={false}
                    >


                    </SearchBar>
                </div>
                {showCreateSuccessModal && (
                    <CreateSuccessStoryModal
                        onClose={closeCreateSuccessModalNoSave}
                        onSave={closeCreateSuccessModalSave}/>
                )}
                <div className="d-flex justify-content-start">
                    <OverlayTrigger overlay={renderCreateText}  placement="top" defaultShow={false}><Button className="mx-2" variant="dark" onClick={openSuccessStoryModal} >
                        Create
                    </Button>
                    </OverlayTrigger>

                    <OverlayTrigger overlay={renderEnableText}  placement="top" defaultShow={false}>
                    <Button className="mx-2" variant="success" onClick={enableStory}>
                        Enable
                    </Button>
                    </OverlayTrigger>

                    <OverlayTrigger overlay={renderDisableText}  placement="top" defaultShow={false}>
                    <Button className="mx-2" variant="danger" onClick={disableStory}>
                        Disable
                    </Button></OverlayTrigger>

                </div>
                <div className="mt-4">
                    {successStories
                        .sort((a, b) => a.id - b.id)
                        .map((story) => (
                            <div key={story.id} className="d-flex align-items-center mb-3">
                                <Form.Check
                                    className="checkbox-column"
                                    type="checkbox"
                                    checked={checkboxStates[story.id] || false}
                                    onChange={() => toggleCheckbox(story.id)}
                                />
                                <SuccessStoryCard
                                    name={story.name}
                                    month={story.month}
                                    year={story.year}
                                    customerImage={story.imgUrl}
                                    successStory={story.story}
                                    className="success-story-card-admin"
                                    authority={authority}
                                    enabled={story.enabled}
                                    id={story.id}
                                />
                            </div>
                        ))}
                </div>

            </Container>

        </>
    );
};

export default ManageSuccessStories;