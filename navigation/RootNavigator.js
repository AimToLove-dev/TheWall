"use client";

import { useState, useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import { ActivityIndicator, Surface } from "react-native-paper";
import { Linking, Animated, Image } from "react-native";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";

import { AuthStack } from "./AuthStack";
import { UserStack } from "./UserStack";
import { HomeScreen, WailingWallScreen, TestimonyWallScreen, BeLoveScreen, InviteUsScreen } from "../screens";
import { AuthenticatedUserContext } from "../providers";
// import { Header } from "components";
import { auth } from "config";
import { getThemeColors } from "../styles/theme";

const Stack = createStackNavigator();

export const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const fadeAnim = useState(new Animated.Value(1))[0];
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
    // Minimum splash screen time (1 second)
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 1000);

    return () => clearTimeout(timer);
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

  useEffect(() => {
    // Fade out splash screen when all conditions are met:
    // 1. Fonts are loaded
    // 2. Minimum time has passed
    // 3. Authentication state is resolved
    if (fontLoaded && minTimePassed && !isLoading) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [fontLoaded, minTimePassed, isLoading, fadeAnim]);

  // Simple deep linking configuration
  const linking = {
    prefixes: ["thewall://", "https://thewall.app"],
    config: {
      screens: {
        Home: "",
        WailingWall: "wailing-wall",
        TestimonyWall: "testimonies",
        BeLove: "be-love",
        InviteUs: "invite-us",
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

  const splashScreenVisible =
    isLoading || !fontLoaded || !minTimePassed || fadeAnim._value > 0;

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
        <Stack.Screen name="BeLove" component={BeLoveScreen} />
        <Stack.Screen name="InviteUs" component={InviteUsScreen} />

        {/* Auth stack for login/signup */}
        <Stack.Screen name="Auth" component={AuthStack} />

        {/* Protected routes that require authentication */}
        <Stack.Screen name="User" component={UserStack} />
      </Stack.Navigator>

      {/* Splash screen overlay */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
          opacity: fadeAnim,
          zIndex: fadeAnim.interpolate({
            inputRange: [0, 0.01, 1],
            outputRange: [0, 1, 1],
          }),
        }}
        pointerEvents={"none"}
      >
        <Image
          source={require("../assets/TheWall.png")}
          style={{ width: 315, height: 151 }}
          resizeMode="contain"
        />
      </Animated.View>
    </NavigationContainer>
  );
};
