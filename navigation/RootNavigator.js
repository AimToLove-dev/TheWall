"use client";

import { useState, useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import { ActivityIndicator, Surface } from "react-native-paper";
import { Linking, Image } from "react-native";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";

import { AuthStack } from "./AuthStack";
import { UserStack } from "./UserStack";
import {
  HomeScreen,
  WailingWallScreen,
  TestimonyWallScreen,
  ResourcesScreen,
  MoreScreen,
  GivingScreen,
  VisionScreen,
} from "../screens";
import { AuthenticatedUserContext } from "../providers";
// import { Header } from "components";
import { auth } from "config";
import { getThemeColors } from "../styles/theme";

const Stack = createStackNavigator();

export const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [fontLoaded, setFontLoaded] = useState(false);
  const theme = getThemeColors();

  useEffect(() => {
    // Load fonts
    async function loadFonts() {
      try {
        await Font.loadAsync({
          ...Ionicons.font,
          "XTypewriter-Regular": require("../assets/fonts/XTypewriter-Regular.ttf"),
          "XTypewriter-Bold": require("../assets/fonts/XTypewriter-Bold.ttf"),
        });
      } catch (error) {
        console.error("Error loading fonts:", error);
      } finally {
        setFontLoaded(true);
      }
    }

    loadFonts();
  }, []);

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

  // Deep linking configuration with support for dynamic more pages
  const linking = {
    prefixes: ["thewall://", "https://thewall.app"],
    config: {
      screens: {
        Home: "",
        WailingWall: "wailing-wall",
        TestimonyWall: "testimonies",
        Resources: "resources",
        More: {
          path: "more/:pageId",
          parse: {
            pageId: (pageId) => pageId,
          },
        },
        Giving: "giving",
        Vision: "vision",
        Auth: {
          screens: {
            Login: "login",
            Signup: "signup",
            ForgotPassword: "forgot-password",
          },
        },
        User: "user",
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      {/* <Header></Header> */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Home screen is always accessible */}
        <Stack.Screen name="Home" component={HomeScreen} />

        {/* Wailing Wall screen is always accessible */}
        <Stack.Screen name="WailingWall" component={WailingWallScreen} />
        <Stack.Screen name="TestimonyWall" component={TestimonyWallScreen} />

        {/* Our new screens */}
        <Stack.Screen name="More" component={MoreScreen} />

        {/* Auth stack for login/signup */}
        <Stack.Screen name="Auth" component={AuthStack} />

        {/* Protected routes that require authentication */}
        <Stack.Screen name="User" component={UserStack} />
      </Stack.Navigator>

      {/* Splash screen overlay */}
      {isLoading || !fontLoaded ? (
        <Surface
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.background,
            zIndex: 1,
          }}
        >
          <Image
            source={require("../assets/TheWall.png")}
            style={{ width: 315, height: 151 }}
            resizeMode="contain"
          />
        </Surface>
      ) : null}
    </NavigationContainer>
  );
};
