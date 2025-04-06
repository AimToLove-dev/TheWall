"use client";

import { useContext } from "react";
import {
  View,
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthenticatedUserContext } from "../providers";
import { Surface } from "react-native-paper";
import { CustomButton } from "components";
import { getThemeColors, spacing, shadows } from "../styles/theme";
import { Ionicons } from "@expo/vector-icons";

export const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  const handleLoginPress = () => {
    navigation.navigate("Auth", { screen: "Login" });
  };

  const handleWallPress = () => {
    navigation.navigate("WailingWall");
  };

  const handleTestimonyPress = () => {
    navigation.navigate("TestimonyWall");
  };

  const handleDashboardPress = () => {
    navigation.navigate("App", { screen: "Dashboard" });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["bottom"]}
    >
      <Surface
        style={[styles.content, { backgroundColor: colors.background }]}
        elevation={0}
      >
        <View
          style={[
            styles.buttonContainer,
            isLargeScreen && styles.largeScreenButtonContainer,
          ]}
        >
          <CustomButton
            title="Wailing Wall"
            onPress={handleWallPress}
            variant="primary"
            size="large"
            style={styles.button}
            leftIcon={
              <Ionicons name="wallet-outline" size={24} color="#FFFFFF" />
            }
          />

          <CustomButton
            title="Testimony Wall"
            onPress={handleTestimonyPress}
            variant="primary"
            size="large"
            style={styles.button}
            leftIcon={
              <Ionicons name="book-outline" size={24} color="#FFFFFF" />
            }
          />

          {user ? (
            <CustomButton
              title="Dashboard"
              onPress={handleDashboardPress}
              variant="secondary"
              size="large"
              style={styles.button}
              leftIcon={
                <Ionicons
                  name="person-outline"
                  size={24}
                  color={colors.primary}
                />
              }
            />
          ) : (
            <CustomButton
              title="Sign In"
              onPress={handleLoginPress}
              variant="secondary"
              size="large"
              style={styles.button}
              leftIcon={
                <Ionicons
                  name="log-in-outline"
                  size={24}
                  color={colors.primary}
                />
              }
            />
          )}
        </View>
      </Surface>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 400,
    gap: spacing.md,
  },
  largeScreenButtonContainer: {
    maxWidth: 500,
  },
  button: {
    width: "100%",
    ...shadows.medium,
  },
});
