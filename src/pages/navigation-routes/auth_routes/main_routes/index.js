import React, { useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import StartPage from '../../../screens/authScreens/start-page';
import PhonePage from '../../../screens/authScreens/phone-page';
import PhoneVerifyPage from '../../../screens/authScreens/phone-verify-page';
import ExtraInfo from '../../../screens/authScreens/signup-page';
import NotificationsPanel from '../../../screens/authScreens/notifications';
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Button } from 'react-native';
import * as Location from "expo-location";

const Stack = createStackNavigator()

//AuthRoutes - Application routes when user has not logged in.
const AuthRoutes = () => {

    const [notificationPermissions, setNotificationPermissions] = useState()
    const [locationPermissions] = Location.useForegroundPermissions();

    async function checkForPushNotificationsAsync() {
        if (Device.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          setNotificationPermissions(existingStatus)
        } else {
            setNotificationPermissions("granted")

        }
    }

    useEffect(()=> {
        checkForPushNotificationsAsync()
    }, [])

    return (
        
        notificationPermissions && (
        <Stack.Navigator
            initialRouteName="Notifications"
            screenOptions={{
                headerTintColor: '#000',
                cardStyle: { backgroundColor: '#fff' }
            }}
        >
            {
            notificationPermissions != "granted" &&
            <Stack.Screen
                options={{
                    headerShown: false
                }}
                name='Notifications'

            >
                {props=> <NotificationsPanel {...props} existingNotificationPermissions={notificationPermissions}></NotificationsPanel>}
            </Stack.Screen>
            }

            {/* Start page, first page shown to users. */}
            <Stack.Screen
                options={{
                    headerShown: false
                }}
                name='Start'
                component={StartPage}

            />

            {/* Phone page, page where users are prompted to enter their phone number, login or signup */}
            <Stack.Screen
                options={{
                    title: 'Phone Number',
                    headerBackTitle: 'Back'
                }}
                name='Phone'
                component={PhonePage}

            />

            {/* Phone verify page, page where users are prompted to verify their phone numbers after entering them, login or signup */}
            <Stack.Screen
                name='PhoneVerifyPage'
                component={PhoneVerifyPage}
                options={{ title: 'Confirm', headerBackTitle: 'Back', }}
            />

            {/* Signup page, page where users are prompted to add more information to their profile, signup only */}
            <Stack.Screen 
                name="Signup" 
                component={ExtraInfo} 
                options={({ navigation }) => ({
                    headerBackTitle: "Cancel",
                    headerTitle: "Create an Account",
                    headerLeft: () => (
                        <Button color={"#000"} onPress={() => navigation.navigate("Start")} title="Cancel" />
                    ),
                })}
            />

        </Stack.Navigator>
        )
    )
}

export default AuthRoutes