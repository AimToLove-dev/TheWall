import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthenticatedUserProvider } from "./providers";
import { RootNavigator } from "./navigation/RootNavigator";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
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
