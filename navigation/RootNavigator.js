"use client";

import { useState, useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";

import { AuthStack } from "./AuthStack";
import { AppStack } from "./AppStack";
import { HomeScreen } from "../screens/HomeScreen";
import { WailingWallScreen } from "../screens/WailingWallScreen";
import { AuthenticatedUserContext } from "../providers";
import { LoadingIndicator } from "../components";
import { auth } from "../config/firebase";

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

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Home screen is always accessible */}
        <Stack.Screen name="Home" component={HomeScreen} />

        {/* Wailing Wall screen is always accessible */}
        <Stack.Screen name="WailingWall" component={WailingWallScreen} />

        {/* Auth stack for login/signup */}
        <Stack.Screen name="Auth" component={AuthStack} />

        {/* Protected routes that require authentication */}
        {user ? (
          <>
            <Stack.Screen name="App" component={AppStack} />
          </>
        ) : null}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
