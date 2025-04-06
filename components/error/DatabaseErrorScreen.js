"use client";

import { Surface, Text, Button, useTheme, Icon } from "react-native-paper";
import { View } from "components/View";

export const DatabaseErrorScreen = ({ onRetry, retryText = "Try Again" }) => {
  const theme = useTheme();

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
        <Icon
          source="database-off"
          size={48}
          color={theme.colors.error}
          style={{ marginBottom: 16 }}
        />
        <Text
          variant="headlineMedium"
          style={{ marginBottom: 12, textAlign: "center" }}
        >
          Database Error
        </Text>
        <Text
          variant="bodyLarge"
          style={{
            marginBottom: 24,
            textAlign: "center",
            color: theme.colors.onSurfaceVariant,
          }}
        >
          There was a problem connecting to the database. Please check your
          connection and try again.
        </Text>
        <Button mode="contained" onPress={onRetry}>
          {retryText}
        </Button>
      </View>
    </Surface>
  );
};
