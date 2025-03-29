"use client";

import React from "react";
import { StyleSheet, useColorScheme, Platform } from "react-native";
import { View } from "./View"; // Import your custom View component
import { HeaderText, BodyText } from "./Typography";
import { CustomButton } from "./CustomButton";
import { getThemeColors, spacing } from "../styles/theme";

// Define __DEV__ if it's not already defined
const __DEV__ =
  Platform.OS === "android" || Platform.OS === "ios"
    ? process.env.NODE_ENV !== "production"
    : true;

class ErrorBoundaryClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <this.props.FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

// Default fallback component
const DefaultErrorFallback = ({ error, resetError }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <HeaderText style={styles.title}>Oops! Something went wrong</HeaderText>
        <BodyText style={[styles.message, { color: colors.textSecondary }]}>
          We're sorry, but we encountered an unexpected error.
        </BodyText>

        {__DEV__ && error && (
          <View style={[styles.errorDetails, { backgroundColor: colors.card }]}>
            <BodyText style={{ color: colors.error }}>
              {error.toString()}
            </BodyText>
          </View>
        )}

        <CustomButton
          title="Try Again"
          onPress={resetError}
          variant="primary"
          style={styles.button}
        />
      </View>
    </View>
  );
};

// Wrapper component that provides the colorScheme context
export const ErrorBoundary = ({
  children,
  FallbackComponent = DefaultErrorFallback,
  onReset,
}) => {
  return (
    <ErrorBoundaryClass FallbackComponent={FallbackComponent} onReset={onReset}>
      {children}
    </ErrorBoundaryClass>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  content: {
    width: "100%",
    maxWidth: 500,
    alignItems: "center",
  },
  title: {
    marginBottom: spacing.md,
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  errorDetails: {
    padding: spacing.md,
    borderRadius: 8,
    width: "100%",
    marginBottom: spacing.xl,
  },
  button: {
    minWidth: 200,
  },
});
