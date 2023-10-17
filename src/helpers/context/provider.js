import React from "react";
import ContextProvider from "./context";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import Routes from "../../pages/navigation-routes/routes"
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

//Provide routes with global context for persistance and management
const Provider = () => {
    //Defining a theme for react navigation to follow
    const MyTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: "white"
        },
    };

    return (
        // Safe area around screens
        <SafeAreaProvider>
            {/* ReactQuery provider */}
            <QueryClientProvider client={queryClient}>
                <NavigationContainer theme={MyTheme}>
                    <ContextProvider>
                        {/* Application routes */}
                        <Routes></Routes>
                    </ContextProvider>
                </NavigationContainer>
            </QueryClientProvider>

        </SafeAreaProvider>
    );
};

export default Provider;
