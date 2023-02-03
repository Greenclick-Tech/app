import React, { useState, useContext, useEffect } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Context } from "../../helpers/context/context";
import AuthRoutes from "./auth_routes/main_routes";
import AppRoutes from "./app_routes/main_routes";
import LoadingScreen from "../../components/loading";
import * as Location from "expo-location";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import RequestHandler from "../../helpers/api/rest_handler";
import endpoints from "../../constants/endpoints";

//Defining a theme for react navigation to follow
const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "white"
    },
};

//Creating Routes for each page in application
const Routes = ({ }) => {

    const [loading, setLoading] = useState(true);
    
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
    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            setErrorMsgLocation(
                "Permission to access location was denied. Your location is required for greenclick to operate. You can enable your location in Settings > Greenclick"
            );
            return;
        }
        //obtaining the users location
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setLocationStatus(status);
    };

    //Retriving notifications push token to populate context
    //If user denies push token or an emulator is being used, push token will not generate.
    async function getPushToken() {
        if (Device.isDevice) {
            const { status: existingStatus } =
                await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== "granted") {
                alert("Failed to get push token for push notification!");
                return;
            }
            const token = (await Notifications.getExpoPushTokenAsync()).data;
            setPushToken(token);
            setNotificationStatus(finalStatus)

        } else {
            setNotificationStatus("Device")
        }

        if (Platform.OS === "android") {
            Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C",
            });
        }
    }

    //Function for async retrival of location
    const locationFunc = async () => {
        if (!location) {
            await getLocation();
        }
    };

    //Function for asnyc retrival of notification pushToken
    const notificationFunc = async () => {
        if (!pushToken) {
            await getPushToken();
        }
    };

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

        if (user) {
            if (!location) {
                locationFunc();
            }
        } else {
            console.log(pushToken)
            if (!pushToken) {
                notificationFunc();
            }
        }
    }, [user]);

    //Return pages wrapped in navigation corrisponding to users
    return (
        <NavigationContainer theme={MyTheme}>
            {loading ? (
                <LoadingScreen />
            ) : user ? (
                <AppRoutes />
            ) : (
                //User Doesn't Exist
                <AuthRoutes />
            )}
        </NavigationContainer>
    );
};

export default Routes;
