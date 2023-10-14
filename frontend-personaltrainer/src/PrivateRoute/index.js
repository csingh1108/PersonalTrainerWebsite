import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useJwt } from '../UserGlobalProvider';
import backendService from '../Services/BackendService';

const PrivateRoute = ({ children }) => {
    const user = useJwt();
    const [isLoading, setIsLoading] = useState(true);
    const [isValid, setIsValid] = useState(null);

    useEffect(() => {
        if (user.jwt) {
            backendService(`/api/auth/validate?token=${user.jwt}`, 'GET', user.jwt)
                .then((isValid) => {
                    setIsValid(isValid.data);
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [user.jwt]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isValid === true) {
        return children;
    }

    return <Navigate to="/login" />;
};

export default PrivateRoute;
