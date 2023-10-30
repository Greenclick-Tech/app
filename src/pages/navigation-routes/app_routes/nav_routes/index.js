import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomePage from '../../../screens/appScreens/home-page';
import MapPage from '../../../screens/appScreens/main-map';
import ActivityPage from '../../../screens/appScreens/activity-page';
//import Events from '../../app/pages/pages-app/events';
import CarLoad from '../../../../components/car-load';
import { Context } from '../../../../helpers/context/context';

const Nav = createBottomTabNavigator();

//Navigation through bottom tabs

const InvalidLocation = ({ }) => {
    const { locationStatus } = useContext(Context)
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <CarLoad></CarLoad>
        </View>
    )
}

const InvalidPushToken = () => {
    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <CarLoad></CarLoad>
        </View>
    )
}

const BottomNavigationRoutes = () => {
    const { location, pushToken } = useContext(Context)
    return (

        <Nav.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: '#4aaf6e',
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    //Current Page = Home
                    if (route.name === "Home") {
                        iconName = focused
                            ? 'home'
                            : 'home-outline';
                    }
                    //Current Page = Map
                    if (route.name === "Map") {
                        iconName = focused
                            ? 'search'
                            : 'search-outline';
                    }
                    //Current Page = Activity
                    if (route.name === "Activity") {
                        iconName = focused
                            ? 'receipt'
                            : 'receipt-outline';
                    }
                    //Current Page = Events
                    if (route.name === "Events") {
                        iconName = focused
                            ? 'location'
                            : 'location-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color}></Ionicons>

                },
            })}
        >

            <Nav.Screen name="Home" component={HomePage} options={{
                headerShown: false
            }} />

            <Nav.Screen name="Map" options={{
                headerShown: false
            }} component={MapPage} />

            {/* {location && pushToken  && (
                <Nav.Screen name='Events' component={Events}></Nav.Screen>
            )} */}

            <Nav.Screen name='Activity' options={{
                headerTitle: "Your Purchases"
            }} component={ActivityPage}></Nav.Screen>


        </Nav.Navigator>
    )
};


export default BottomNavigationRoutes;