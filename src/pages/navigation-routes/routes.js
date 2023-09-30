import React, { useState, useContext, useEffect, useRef } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Context } from "../../helpers/context/context";
import AuthRoutes from "./auth_routes/main_routes";
import AppRoutes from "./app_routes/main_routes";
import LoadingScreen from "../../components/loading";
import * as Location from "expo-location";
import RequestHandler from "../../helpers/api/rest_handler";
import endpoints from "../../constants/endpoints";
import { StatusBar } from 'expo-status-bar';
navigator.geolocation = require('@react-native-community/geolocation');
navigator.geolocation = require('react-native-geolocation-service');




//Creating Routes for each page in application
const Routes = ({ }) => {

    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    const {
        user,
        location,
        pushToken,
        setPushToken,
        setLocation,
        setUser,
        setLocationStatus,
        setNotificationStatus
    } = useContext(Context);

    //Retrieving the users information defined by the "access_token" within asynchronous storage. { first_name: "", last_name: "" }
    async function getUser() {
        return await RequestHandler(
            "GET",
            endpoints.GET_CURRENT_USER(),
            undefined,
            undefined,
            true
        );
    }

    //Retrieving the users location to populate context location state.
    //{ location: { coordinates: {} } }
    

    //Retriving notifications push token to populate context
    //If user denies push token or an emulator is being used, push token will not generate.



    //Function for async retrival of location

    // async function getPushToken() {
    //     if (Device.isDevice) {
    //         const { status: existingStatus } =
    //             await Notifications.getPermissionsAsync();
    //         let finalStatus = existingStatus;
    //         if (existingStatus !== "granted") {
    //             const { status } = await Notifications.requestPermissionsAsync();
    //             finalStatus = status;
    //         }
    //         if (finalStatus !== "granted") {
    //             alert("Failed to get push token for push notification!");
    //             return;
    //         }
    //         const token = (await Notifications.getExpoPushTokenAsync()).data;
    //         setPushToken(token);
    //         setNotificationStatus(finalStatus)

    //     } else {
    //         setNotificationStatus("Device")
    //     }

    //     if (Platform.OS === "android") {
    //         Notifications.setNotificationChannelAsync("default", {
    //             name: "default",
    //             importance: Notifications.AndroidImportance.MAX,
    //             vibrationPattern: [0, 250, 250, 250],
    //             lightColor: "#FF231F7C",
    //         });
    //     }
    // }


    //Function for asnyc retrival of notification pushToken

    //Function for async retrival of user
    let returnUser = async () => {
        let res = await getUser();
        if (!("user" in res)) {
            setUser();
            setLoading(false);
        } else {

            setUser(res.user);
            setLoading(false);
        }
    };
    
    //Trigger functions on component mount

    useEffect(() => {

        returnUser();
    
      }, []);

    //Return pages wrapped in navigation corrisponding to users
    return (
        <>
            <StatusBar style="dark" />
            {loading ? (
                <LoadingScreen />
            ) : user ? (
                <AppRoutes />
            ) : (
                //User Doesn't Exist
                <AuthRoutes />
            )}
        </>
    );
};

export default Routes;
