"use client";

import { View } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";
import { AddSoulInput } from "./AddSoulInput";

export const AddSoul = ({ onSuccess, onError, userId, style }) => {
  const theme = useTheme();

  return (
    <Surface
      mode="elevated"
      elevation={1}
      style={[
        {
          padding: 16,
          borderRadius: 8,
        },
        style,
      ]}
    >
      <Text variant="titleMedium" style={{ marginBottom: 16 }}>
        Add Soul for Prayer
      </Text>
      <AddSoulInput onSuccess={onSuccess} onError={onError} userId={userId} />
    </Surface>
  );
};
