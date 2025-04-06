import React, { useEffect, useState } from "react";
import { StatusBar, useColorScheme, View, Image } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import {
  Provider as PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  Surface,
} from "react-native-paper";
import { AuthenticatedUserProvider } from "./providers";
import { RootNavigator } from "./navigation/RootNavigator";
import { ErrorBoundary } from "components";
import "./styles/global.css";

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    async function prepareApp() {
      try {
        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
        });

        // Add minimum splash screen time
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Error loading fonts:", error);
      } finally {
        setIsReady(true);
      }
    }

    prepareApp();
  }, []);

  if (!isReady) {
    return (
      <Surface
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Image
          source={require("./assets/TheWall.png")}
          style={{ width: 315, height: 151 }}
          resizeMode="contain"
        />
      </Surface>
    );
  }

  return (
    <PaperProvider theme={isDark ? MD3DarkTheme : MD3LightTheme}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <AuthenticatedUserProvider>
            <StatusBar />
            <RootNavigator />
          </AuthenticatedUserProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
