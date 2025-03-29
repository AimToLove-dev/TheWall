import React from "react";
import { ActivityIndicator, StyleSheet, useColorScheme } from "react-native";
import { getThemeColors, spacing } from "../styles/theme";
import { View } from "./View";

export const LoadingIndicator = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
