"use client";

import { useContext } from "react";
import {
  View,
  StyleSheet,
  useColorScheme,
  Image,
  StatusBar,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthenticatedUserContext } from "../providers";
import { CustomButton } from "../components/CustomButton";
import { HeaderText, SubtitleText } from "../components/Typography";
import { getThemeColors, spacing } from "../styles/theme";
import { Ionicons } from "@expo/vector-icons";

export const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);
  const { width } = useWindowDimensions();

  // Determine if we're on a large screen (tablet/desktop)
  const isLargeScreen = width > 768;

  const handleLoginPress = () => {
    navigation.navigate("Auth", { screen: "Login" });
  };

  const handleSignupPress = () => {
    navigation.navigate("Auth", { screen: "Signup" });
  };

  const handleWallPress = () => {
    navigation.navigate("WailingWall");
  };

  const handleProfilePress = () => {
    navigation.navigate("App", { screen: "Profile" });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "bottom"]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View
          style={[
            styles.contentWrapper,
            isLargeScreen && styles.largeScreenContent,
          ]}
        >
          {/* Text Content */}
          <View
            style={[
              styles.textContent,
              isLargeScreen && styles.largeScreenTextContent,
            ]}
          >
            <View style={styles.logoContainer}>
              <View
                style={[styles.logoCircle, { backgroundColor: colors.primary }]}
              >
                <HeaderText style={styles.logoText}>W</HeaderText>
              </View>
            </View>

            <HeaderText
              style={[styles.title, isLargeScreen && styles.largeScreenTitle]}
            >
              The Wailing Wall
            </HeaderText>

            <SubtitleText
              style={[
                styles.subtitle,
                isLargeScreen && styles.largeScreenSubtitle,
              ]}
            >
              A place to submit names for prayer and support
            </SubtitleText>

            <View
              style={[
                styles.buttonContainer,
                isLargeScreen && styles.largeScreenButtonContainer,
              ]}
            >
              <CustomButton
                title="Visit the Wailing Wall"
                onPress={handleWallPress}
                variant="primary"
                size="large"
                style={styles.button}
                leftIcon={
                  <Ionicons name="book-outline" size={20} color="#FFFFFF" />
                }
              />

              {user ? (
                <CustomButton
                  title="My Profile"
                  onPress={handleProfilePress}
                  variant="secondary"
                  size="large"
                  style={styles.secondaryButton}
                  leftIcon={
                    <Ionicons
                      name="person-outline"
                      size={20}
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
                  style={styles.secondaryButton}
                  leftIcon={
                    <Ionicons
                      name="log-in-outline"
                      size={20}
                      color={colors.primary}
                    />
                  }
                />
              )}
            </View>
          </View>

          {/* Image Content */}
          <View
            style={[
              styles.imageContent,
              isLargeScreen && styles.largeScreenImageContent,
            ]}
          >
            <Image
              source={{ uri: "https://via.placeholder.com/600x500" }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: "100%",
  },
  contentWrapper: {
    flex: 1,
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  // Large screen layout - side by side
  largeScreenContent: {
    flexDirection: "row",
    padding: spacing.xl,
  },

  // Text content section
  textContent: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  largeScreenTextContent: {
    width: "50%",
    alignItems: "flex-start",
    paddingRight: spacing.xl,
    marginBottom: 0,
  },

  // Image content section
  imageContent: {
    width: "100%",
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  largeScreenImageContent: {
    width: "50%",
    height: "auto",
    minHeight: 400,
  },
  image: {
    width: "100%",
    height: "100%",
  },

  // Logo
  logoContainer: {
    marginBottom: spacing.lg,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
  },

  // Text styles
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  largeScreenTitle: {
    fontSize: 48,
    textAlign: "left",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: spacing.xl,
    maxWidth: 300,
  },
  largeScreenSubtitle: {
    fontSize: 20,
    textAlign: "left",
    maxWidth: 450,
  },

  // Button container
  buttonContainer: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  largeScreenButtonContainer: {
    alignItems: "flex-start",
  },
  button: {
    width: "100%",
    marginBottom: spacing.md,
    height: 56,
  },
  secondaryButton: {
    marginBottom: spacing.lg,
    width: "100%",
  },
});
