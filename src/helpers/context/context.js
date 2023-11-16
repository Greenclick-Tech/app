import React, { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert } from 'react-native';

//Create context
export const Context = React.createContext({
    user: null,
    login: () => { },
    logout: () => { },
    RequestHandler: () => { },
    location: null,
});

//Provide react context wih states to define global state
const ContextProvider = ({ children }) => {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [location, setLocation] = useState();
    const [locationStatus, setLocationStatus] = useState();
    const expiryRef = useRef(null);
    const [pushToken, setPushToken] = useState(null);
    const [notificationStatus, setNotificationStatus] = useState();
    const [currentPhone, setCurrentPhone] = useState("");

    const debounceExpiry = (expiry, destination) => {
        expiryRef.current = setTimeout(()=> {
            Alert.alert("Session has expired", "your verification code has expired, please try again.")
            setCurrentPhone("")
            navigation.navigate(destination)
            return () => {
                clearTimeout(expiryRef.current);
            };
        }, 1000 * expiry)
        return () => {
            clearInterval(expiryRef.current);
        };
    }

    const clearExpiry = () => {
        // Log the value of expiryRef.current before attempting to clear the interval
        console.log('Before clearInterval:', expiryRef.current);

        clearTimeout(expiryRef.current);
        clearInterval(expiryRef.current)
        expiryRef.current = 0;

        // Log the value of expiryRef.current after clearing the interval
        console.log('After clearInterval:', expiryRef.current);
    }
    
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
            setNotificationStatus,
            expiryRef,
            debounceExpiry,
            currentPhone,
            setCurrentPhone,
            clearExpiry
        }}>
            {children}
        </Context.Provider>
    );
};

export default ContextProvider;