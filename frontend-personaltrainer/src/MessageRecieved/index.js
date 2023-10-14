import React from 'react';
import {Button} from "react-bootstrap";
import tick from "../Images/checkmark.jpg"
import {useNavigate} from "react-router-dom";


const MessageSuccessPopup = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className="popup-container">
                <div className="popup">
                    <img className="popup-image" src={tick} alt="checkmark"/>
                    <h2>Thank You!</h2>
                    <p>Your message has been received. We will contact you as soon as we can!</p>
                    <Button type="button"
                    onClick={ () => {
                        navigate("/")
                    }}>OK</Button>
                </div>

            </div>

        </>

    );
};

export default MessageSuccessPopup;
