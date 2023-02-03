import React from 'react';
import { useState } from 'react';

//Create context
export const Context = React.createContext({
    user: null,
    login: () => { },
    logout: () => { },
    RequestHandler: () => { },
    location: null,
});

//Provide react context wih states to define global state
const ContextProvider = ({ children, navigation }) => {

    const [user, setUser] = useState(null);
    const [location, setLocation] = useState();
    const [locationStatus, setLocationStatus] = useState();
    const [pushToken, setPushToken] = useState();
    const [notificationStatus, setNotificationStatus] = useState();

    return (
        <Context.Provider value={{
            user,
            setUser,
            location,
            setLocation,
            locationStatus,
            setLocationStatus,
            pushToken,
            setPushToken,
            notificationStatus,
            setNotificationStatus
        }}>
            {children}
        </Context.Provider>
    );
};

export default ContextProvider;