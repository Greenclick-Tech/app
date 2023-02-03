import React from 'react'
import { createStackNavigator } from '@react-navigation/native-stack';
import StartPage from '../../../screens/authScreens/start-page';
import PhonePage from '../../../screens/authScreens/phone-page';
import PhoneVerifyPage from '../../../screens/authScreens/phone-verify-page';
import ExtraInfo from '../../../screens/authScreens/signup-page';

const Stack = createStackNavigator()

//AuthRoutes - Application routes when user has not logged in.
const AuthRoutes = () => {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerTintColor: '#000',
                cardStyle: { backgroundColor: '#fff' }
            }}
        >
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
                options={{ title: 'Confirm', headerBackTitle: 'Back' }}
            />

            {/* Signup page, page where users are prompted to add more information to their profile, signup only */}
            <Stack.Screen 
                name="Signup" 
                component={ExtraInfo} 
            />

        </Stack.Navigator>
    )
}

export default AuthRoutes