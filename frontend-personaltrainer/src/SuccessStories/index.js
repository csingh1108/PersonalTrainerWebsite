import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import NavBar from '../NavBar';
import SuccessStoryCard from '../SuccessStoryCard';
import backendService from '../Services/BackendService';

const SuccessStories = () => {
    const [successStory, setSuccessStory] = useState({
        name: '',
        story: '',
        month: null,
        year: null,
        imgUrl: '',
    });
    const [stories, setStories] = useState([]);

    useEffect(() => {
        backendService('/api/success-story/all/enabled', 'GET').then((storyResponse) => {
            if(storyResponse.status === 200){
                setStories(storyResponse.data);
                console.log(storyResponse);
            }
        });
    }, []);

    const renderCards = () => {
        return stories.map((story, Index) => (
            <SuccessStoryCard
                key={story.id}
                name={story.name}
                month={story.month}
                year={story.year}
                customerImage={story.imgUrl}
                successStory={story.story}
                className={`success-story-card ${
                    (Index % 2 === 0 ? 'off-screen-right glide-in-right' : 'off-screen-left glide-in-left')
                }`} style={{
                    animationDelay: `${Index * .5}s`,
                }}
                Index={Index}
            ></SuccessStoryCard>
        ));
    };

    return (
        <>
            <Container>
                <NavBar />
                <div style={{ textAlign: 'center' }} className="mt-5">
                    <h4>We have been transforming lives for over 10 years.</h4>
                    <h4>Check out what some of our clients have had to say about us.</h4>
                </div>
                <div className="mt-4">{renderCards()}</div>
            </Container>
        </>
    );
};

export default SuccessStories;
