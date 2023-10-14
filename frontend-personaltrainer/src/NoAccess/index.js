import React from 'react';
import noaccess from '../Images/NoAccessIcon.png'



const NoAccessPage = () => {
    return (
    <>
        <div className="popup-container">
            <div className="popup">
                <img className="popup-image" src={noaccess} alt="redx"/>
                <h2>Access Denied</h2>
                <h5>You do not have permission to view this page.</h5>
                <p>Please check credentials and try again.</p>
                <p>Error: 403</p>
            </div>

        </div>

    </>
    );
};

export default NoAccessPage;