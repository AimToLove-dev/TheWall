"use client";

import { Surface, Text, Button } from "react-native-paper";
import { View } from "@components/views/View";
import { getThemeColors } from "styles/theme";

export const ErrorScreen = ({
  title = "Error",
  message = "Something went wrong",
  onRetry,
  retryText = "Try Again",
}) => {
  const colors = getThemeColors();

  return (
    <Surface
      mode="flat"
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
          {title}
        </Text>
        <Text
          variant="bodyLarge"
          style={{
            marginBottom: 24,
            textAlign: "center",
            color: colors.textSecondary,
          }}
        >
          {message}
        </Text>
        {onRetry && (
          <Button mode="contained" onPress={onRetry} style={{ minWidth: 200 }}>
            {retryText}
          </Button>
        )}
      </View>
    </Surface>
  );
};
