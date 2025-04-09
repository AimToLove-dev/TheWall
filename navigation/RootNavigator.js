"use client";

import { useState, useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import { ActivityIndicator, Surface } from "react-native-paper";
import { Linking } from "react-native";

import { AuthStack } from "./AuthStack";
import { UserStack } from "./UserStack";
import { HomeScreen, WailingWallScreen, TestimonyWallScreen } from "../screens";
import { AuthenticatedUserContext } from "../providers";
import { Header } from "components";
import { auth } from "config";

const Stack = createStackNavigator();

export const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuthStateChanged = onAuthStateChanged(
      auth,
      (authenticatedUser) => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );

    // unsubscribe auth listener on unmount
    return unsubscribeAuthStateChanged;
  }, []);

  // Simple deep linking configuration
  const linking = {
    prefixes: ["thewall://", "https://thewall.app"],
    config: {
      screens: {
        Home: "",
        WailingWall: "wailing-wall",
        TestimonyWall: "testimonies",
        Auth: {
          screens: {
            Login: "login", // Maps /login to the existing LoginScreen
            Signup: "signup",
            ForgotPassword: "forgot-password",
          },
        },
        App: "dashboard",
      },
    },
  };

  if (isLoading) {
    return (
      <Surface
        mode="flat"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" animating={true} />
      </Surface>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      <Header></Header>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Home screen is always accessible */}
        <Stack.Screen name="Home" component={HomeScreen} />

        {/* Wailing Wall screen is always accessible */}
        <Stack.Screen name="WailingWall" component={WailingWallScreen} />
        <Stack.Screen name="TestimonyWall" component={TestimonyWallScreen} />

        {/* Auth stack for login/signup */}
        <Stack.Screen name="Auth" component={AuthStack} />

        {/* Protected routes that require authentication */}
        <Stack.Screen name="App" component={UserStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
