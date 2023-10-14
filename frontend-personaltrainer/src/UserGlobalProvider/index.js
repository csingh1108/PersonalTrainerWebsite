import React, {createContext, useContext, useState} from 'react';
import Cookies from "js-cookie";


const UserContext = createContext();

const UserGlobalProvider = ({ children }) => {
    const [jwt, setJwt] = useState(Cookies.get("jwt"));

    const value = {jwt, setJwt};

    return <UserContext.Provider value ={value}>{children}</UserContext.Provider>;
};

function useJwt() {
    const context = useContext(UserContext);
    if (context === undefined){
        throw new Error("useJwt must be used in UserProvider")
    }
    return context;

}

export { useJwt, UserGlobalProvider}