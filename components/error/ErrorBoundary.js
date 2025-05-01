"use client";

import React from "react";
import { Surface, Text, Button } from "react-native-paper";
import { View } from "@components/views/View";
import { getThemeColors } from "styles/theme";

const __DEV__ = process.env.NODE_ENV !== "production";

class ErrorBoundaryClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  resetError = () => {
    this.setState({ error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.error) {
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
  const colors = getThemeColors();

  return (
    <Surface
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <View style={{ width: "100%", maxWidth: 500, alignItems: "center" }}>
        <Text
          variant="headlineMedium"
          style={{ marginBottom: 12, textAlign: "center" }}
        >
          Oops! Something went wrong
        </Text>

        <Text
          variant="bodyLarge"
          style={{
            marginBottom: 24,
            textAlign: "center",
            color: colors.textSecondary,
          }}
        >
          We're sorry, but we encountered an unexpected error.
        </Text>

        {__DEV__ && error && (
          <Surface
            mode="elevated"
            elevation={1}
            style={{
              padding: 16,
              width: "100%",
              marginBottom: 24,
              backgroundColor: colors.error + "15", // Adding 15% opacity
            }}
          >
            <Text style={{ color: colors.error }}>{error.toString()}</Text>
          </Surface>
        )}

        <Button mode="contained" onPress={resetError}>
          Try Again
        </Button>
      </View>
    </Surface>
  );
};

// Wrapper component that provides the theme context
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
