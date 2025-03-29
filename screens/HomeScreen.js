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
                <Image
                  source={require("../assets/whale.svg")} // Whale logo from assets
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            </View>

            <HeaderText
              style={[styles.title, isLargeScreen && styles.largeScreenTitle]}
            >
              Learn Anything
            </HeaderText>

            <SubtitleText
              style={[
                styles.subtitle,
                isLargeScreen && styles.largeScreenSubtitle,
              ]}
            >
              The fun and effective way to master new skills
            </SubtitleText>

            <View
              style={[
                styles.buttonContainer,
                isLargeScreen && styles.largeScreenButtonContainer,
              ]}
            >
              {user ? (
                <CustomButton
                  title="Go to Profile"
                  onPress={handleProfilePress}
                  variant="primary"
                  size="large"
                  style={styles.button}
                />
              ) : (
                <>
                  <CustomButton
                    title="Get Started"
                    onPress={handleSignupPress}
                    variant="primary"
                    size="large"
                    style={styles.button}
                  />
                  <CustomButton
                    title="I already have an account"
                    onPress={handleLoginPress}
                    variant="text"
                    size="medium"
                    style={styles.secondaryButton}
                  />
                </>
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
  logo: {
    width: 70,
    height: 70,
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
  },
  secondaryButton: {
    marginBottom: spacing.lg,
  },
});
