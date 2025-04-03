import React, { useEffect, useState } from "react";
import { StatusBar, ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { AuthenticatedUserProvider } from "./providers";
import { RootNavigator } from "./navigation/RootNavigator";
import { ErrorBoundary } from "components";
import "./styles/global.css";

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepareApp() {
      try {
        // Preload fonts
        await Font.loadAsync({
          ...Ionicons.font,
        });
      } catch (error) {
        console.error("Error loading fonts:", error);
      } finally {
        setIsReady(true);
      }
    }

    prepareApp();
  }, []);

  if (!isReady) {
    // Show a loading indicator while the app is preparing
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AuthenticatedUserProvider>
          <StatusBar />
          <RootNavigator />
        </AuthenticatedUserProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
