import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import { AuthenticatedUserProvider } from "./providers";
import { RootNavigator } from "./navigation/RootNavigator";
import { ErrorBoundary } from "components";
import { getThemeColors } from "./styles/theme";
import "./styles/global.css";

export default function App() {
  const theme = getThemeColors();

  return (
    <PaperProvider theme={theme}>
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
