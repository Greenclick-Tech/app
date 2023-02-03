import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomePage from '../../../screens/appScreens/home-page';
import MapPage from '../../../screens/appScreens/main-map';
import ActivityPage from '../../../screens/appScreens/activity-page';
import Events from '../../app/pages/pages-app/events';
import CarLoad from '../carLoad';
import { Context } from '../../../../helpers/context/context';

const Nav = createBottomTabNavigator();

//Navigation through bottom tabs

const InvalidLocation = () => {
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
    const {location, pushToken} = useContext(Context)
    return (
        
        <Nav.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: '#4aaf6e',
                tabBarStyle: { display: location && pushToken ? "flex" : "none" },
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
            {location && pushToken  && (
                <Nav.Screen name="Home" component={HomePage} options={{
                    headerShown: false
                }}  />
            )}
            {location && pushToken  && (<Nav.Screen name="Map" options={{
                headerShown: false
            }}  component={MapPage} />) }

            {/* {location && pushToken  && (
                <Nav.Screen name='Events' component={Events}></Nav.Screen>
            )} */}
            
            {location && pushToken  && (
                <Nav.Screen name='Activity' options={{
                    headerTitle: "Your Purchases"
                }} component={ActivityPage}></Nav.Screen>
            )}

            {!location && (
                <Nav.Screen name='Location not Found'  options={{
                    headerShown: false
                }} component={InvalidLocation}></Nav.Screen>
            )}

            {!pushToken && (
                <Nav.Screen name='Notification not Found'  options={{
                    headerShown: false
                }} component={InvalidPushToken}></Nav.Screen>
            )}

        </Nav.Navigator>
    )
};


export default BottomNavigationRoutes;