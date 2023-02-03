import React from "react";
import ContextProvider from "./context";
import Routes from "../../pages/navigation-routes/routes"
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

//Provide routes with global context for persistance and management
const Provider = () => {
    return (
        // Safe area around screens
        <SafeAreaProvider>
            {/* ReactQuery provider */}
            <QueryClientProvider client={queryClient}>
                <ContextProvider>
                    {/* Application routes */}
                    <Routes></Routes>
                </ContextProvider>
            </QueryClientProvider>
        </SafeAreaProvider>
    );
};

export default Provider;
