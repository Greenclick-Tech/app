import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { Button } from "react-native";
import CarDetails from "../../../screens/appScreens/car-details";
import CarConfirm from "../../../screens/appScreens/car-confirm";
import OrderConfirmation from "../../../screens/appScreens/order-confirmation";
import KeyRetrival from "../../../screens/appScreens/keyretrival";
import KeyReturn from '../../../screens/appScreens/keyreturn'
import BottomNavigationRoutes from "../nav_routes";
//
import SettingsMain from "../../../screens/appScreens/settings";
import PageAccount from "../../../screens/appScreens/settings/nested-settings/account";
// import PageAppearance from "./pages/pages-app/settings/nested-settings/Appearance";
// import PageHelp from "./pages/pages-app/settings/nested-settings/help";
import PageNotifications from "../../../screens/appScreens/settings/nested-settings/notifications";
import PagePrivacy from "../../../screens/appScreens/settings/nested-settings/privacy";
import Faq from "../../../screens/appScreens/settings/nested-settings/faq";
import Support from "../../../screens/appScreens/settings/nested-settings/support";
import EmailVerifyPage from "../../../screens/appScreens/email-verification";
import UserVerifyPage from "../../../screens/appScreens/user-verification";
import NotificationsPage from "../../../screens/appScreens/notifications";

// import Activity from "./pages/pages-app/activity";
// import PaymentMethods from "./pages/pages-app/payment-methods";
// import PaymentSheet from "./pages/pages-app/paymentsheet";

// import Events from "./pages/pages-app/events";


const Stack = createStackNavigator();

//Screens under stack navigator
const AppRoutes = () => {

    return (
        <Stack.Navigator
            screenOptions={{
                headerTintColor: "#000",
                cardStyle: { backgroundColor: "#fff" },
            }}
            initialRouteName="Main"
        >
            {/* Navigation component, containing all bottom navigation tab pages */}
            <Stack.Screen
                name="Main"
                component={BottomNavigationRoutes}
                options={{
                    headerShown: false,
                    headerBackTitle: "Back",
                    headerTransparent: true,
                    cardStyle: {
                        backgroundColor: "#4aaf6e",
                    },
                }}
            />

            {/* Settings page, all settings */}

            <Stack.Screen
                name="Settings"
                component={SettingsMain}
            />

            {/* Account settings page, all user account settings */}

            <Stack.Screen
                name="Account-Page"
                component={PageAccount}
            />

            <Stack.Screen
                name="Support"
                component={Support}
            />

            {/* Application Appearance, no use for page at the moment */}

            {/* <Stack.Screen 
                name="Appearance" 
                component={PageAppearance} 
            /> */}

            {/* Settings page, holds all information for settings and portal to settings page on web */}

            {/* <Stack.Screen 
                name="HelpSupport" 
                component={PageHelp} 
            /> */}

            {/* Notification management, user managing all extra notifications that are not related to user experience */}

            {/* <Stack.Screen
                name="Notifications-Settings"
                component={PageNotifications}
            /> */}

            {/* Privacy and Security, privacy policy text scroll */}

            <Stack.Screen
                name="PrivacySecurity"
                component={PagePrivacy}
                options={{
                    headerTitle: "Privacy & Security"
                }}
            />

            <Stack.Screen
                name="Faq"
                component={Faq}
                options={{
                    headerTitle: "FAQ"
                }}
            />

            {/* Application Pages outside of Navigation */}

            {/* Details page that holds all details about vehicle */}
            <Stack.Screen
                name="Details"
                options={{
                    headerBackTitle: "Back",
                    headerTransparent: true,
                    headerTitle: "",
                    headerTintColor: "#fff",
                }}
                component={CarDetails}
            />

            {/* Confirmation page that holds all details about vehicle and pricing and opens payment with stripe */}
            <Stack.Screen
                name="Confirm"
                options={{
                    headerTitle: "Confirmation",
                }}
                component={CarConfirm}
            />

            {/* Order page containing all information about order post purchase, holds access to box management */}
            <Stack.Screen
                name="Order"
                options={({ navigation }) => ({
                    headerBackTitle: "Home",
                    headerTitle: "Your Order",
                    headerLeft: () => (
                        <Button color={"#000"} onPress={() => navigation.navigate("Home", {
                            refresh: true
                        })} title="Home" />
                    ),
                })}
                component={OrderConfirmation}
            ></Stack.Screen>

            {/* Key retrival page for recieving keys from box */}
            <Stack.Screen
                name="Key Retrival"
                options={{
                    headerTitle: "Get your Key",
                    headerTintColor: '#FFF',
                    headerStyle: {
                        backgroundColor: "#4aaf6d",
                    },
                    headerShadowVisible: false,
                    headerBackTitle: "Cancel"
                }}
                component={KeyRetrival}
            />

            {/* Key return page for returning key and ending order */}
            <Stack.Screen
                name="Key Return"
                options={{
                    headerTitle: "Return your Key",
                    headerTintColor: '#FFF',
                    headerStyle: {
                        backgroundColor: "#4aaf6d",
                    },
                    headerShadowVisible: false,
                    headerBackTitle: "Cancel"
                }}
                component={KeyReturn}
            />

            <Stack.Screen
                name="Email Verification"
                options={({ navigation }) => ({
                    headerBackTitle: "Home",
                    headerTitle: "Verify your Email",
                    headerLeft: () => (
                        <Button color={"#000"} onPress={() => navigation.navigate("Home", {
                            refresh: true
                        })} title="Home" />
                    ),
                })}
                component={EmailVerifyPage}
            />

            <Stack.Screen
                name="Notifications"
                options={({ navigation }) => ({
                    headerBackTitle: "Back",
                    headerTitle: "All Notifications"
                })}
                component={NotificationsPage}
            />

            <Stack.Screen
                name="User Verification"
                options={({ navigation }) => ({
                    headerBackTitle: "Home",
                    headerTitle: "Verify your Identification",
                    headerLeft: () => (
                        <Button color={"#000"} onPress={() => navigation.navigate("Home", {
                            refresh: true
                        })} title="Home" />
                    ),
                })}
                component={UserVerifyPage}
            />


        </Stack.Navigator>
    );
};

export default AppRoutes;
