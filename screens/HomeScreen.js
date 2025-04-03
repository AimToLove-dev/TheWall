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
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthenticatedUserContext } from "../providers";
import { Header, SubtitleText, BodyText, CustomButton } from "components";
import { getThemeColors, spacing, shadows } from "../styles/theme";
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

  const handleTestimonyPress = () => {
    // Navigate to testimony wall when implemented
    navigation.navigate("TestimonyWall"); // For now, navigate to the same screen
  };

  const handleDashboardPress = () => {
    navigation.navigate("App", { screen: "Dashboard" });
  };

  const handleMenuPress = () => {
    // Handle menu press
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["bottom"]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.contentWrapper]}>
          {/* Text Content */}
          <View style={[styles.textContent]}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/TheWall.png")} // Replace with your logo path
                style={[styles.logoImage]}
                resizeMode="cover"
              />
            </View>

            <SubtitleText style={[styles.subtitle]}>
              A place to submit names for prayer and support
            </SubtitleText>

            {/* Square buttons side by side */}
            <View style={styles.squareButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.squareButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={handleWallPress}
                activeOpacity={0.8}
              >
                <Image
                  source={require("../assets/whale.png")}
                  style={styles.buttonImage}
                  resizeMode="contain"
                />
                <BodyText style={styles.buttonText}>
                  Wailing<br></br>Wall
                </BodyText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.squareButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={handleTestimonyPress}
                activeOpacity={0.8}
              >
                <Image
                  source={require("../assets/bird.png")}
                  style={styles.buttonImage}
                  resizeMode="contain"
                />
                <BodyText style={styles.buttonText}>Testimony Wall</BodyText>
              </TouchableOpacity>
            </View>

            {user ? (
              <CustomButton
                title="Dashboard"
                onPress={handleDashboardPress}
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
    paddingTop: 80, // Add padding for the header
  },
  contentWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: 0,
  },

  // Image content section
  imageContent: {
    width: "100%",
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },

  // Logo
  logoContainer: {
    marginBottom: spacing.lg,
  },
  logoImage: {
    width: 315,
    height: 151,
  },

  // Text styles
  subtitle: {
    textAlign: "center",
    marginBottom: spacing.xl,
    maxWidth: 300,
  },

  // Square buttons container
  squareButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  squareButton: {
    width: 150,
    height: 150,
    borderRadius: 12,
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#3f162",
    boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
    padding: spacing.md,
    ...shadows.medium,
  },
  buttonImage: {
    width: 120,
    height: 70,
    marginBottom: spacing.sm,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },

  // Other buttons
  secondaryButton: {
    marginBottom: spacing.lg,
    width: "100%",
    maxWidth: 400,
  },
});
