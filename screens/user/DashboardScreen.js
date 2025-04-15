"use client";

import { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import { Easing } from "react-native-reanimated";

import { signOut } from "firebase/auth";
import { auth } from "config";
import { AuthenticatedUserContext } from "providers";
import { getUserSouls } from "utils"; // Import getUserSouls function

import {
  View,
  HeaderText,
  SubtitleText,
  BodyText,
  CustomButton,
  CustomDialog,
  FormContainer,
  CardGrid,
} from "components";

import { getThemeColors, spacing, shadows } from "styles/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Surface, Card, Divider, useTheme } from "react-native-paper";

export const DashboardScreen = ({ navigation }) => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const colors = getThemeColors();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const [signOutDialogVisible, setSignOutDialogVisible] = useState(false);
  const theme = useTheme();
  const [greeting, setGreeting] = useState("Welcome");

  // Check if user is admin to redirect to admin dashboard
  const isAdmin = user?.isAdmin || false;

  useEffect(() => {
    // Redirect to admin dashboard if user is an admin
    if (isAdmin) {
      navigation.replace("DashboardAdmin");
    }
  }, [isAdmin, navigation]);

  // Set greeting based on time of day
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good morning");
    } else if (hours < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  const handleSignOut = () => {
    setSignOutDialogVisible(true);
  };

  const confirmSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      })
      .finally(() => {
        setSignOutDialogVisible(false);
      });
  };

  const handleBackPress = () => {
    // Use goBack with custom animation options to slide from left to right
    navigation.navigate("Home", {
      transitionSpec: {
        open: {
          animation: "timing",
          config: {
            duration: 350,
            easing: Easing.out(Easing.cubic),
          },
        },
        close: {
          animation: "timing",
          config: {
            duration: 350,
            easing: Easing.out(Easing.cubic),
          },
        },
      },
      // Reverse the animation direction for back navigation
      cardStyleInterpolator: ({ current, next, layouts }) => {
        return {
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-layouts.screen.width, 0],
                }),
              },
            ],
          },
          // Handle next screen animation
          nextCardStyle: next
            ? {
                transform: [
                  {
                    translateX: next.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, layouts.screen.width * 0.3],
                    }),
                  },
                ],
                opacity: next.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.7],
                }),
              }
            : {},
        };
      },
    });
  };

  const handleMyWallPress = () => {
    navigation.navigate("MyWall");
  };

  const handleTestimonyPress = () => {
    navigation.navigate("Testimony");
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: colors.card }]}
        onPress={handleBackPress}
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <HeaderText style={styles.title}>Dashboard</HeaderText>
        <SubtitleText style={styles.subtitle}>
          {greeting}, {user?.displayName || "User"}
        </SubtitleText>
      </View>
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: colors.card }]}
        onPress={handleSignOut}
      >
        <Ionicons name="log-out-outline" size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );

  return (
    <FormContainer style={{ backgroundColor: colors.background }}>
      <View style={styles.content}>
        {renderHeader()}

        {/* Quick actions section */}
        <View style={styles.quickActionsSection}>
          <HeaderText style={styles.sectionTitle}>Quick Actions</HeaderText>
          <View
            style={[
              styles.quickActions,
              isLargeScreen && styles.quickActionsLarge,
            ]}
          >
            <CardGrid
              cards={[
                {
                  image: require("assets/whale_wall.png"),
                  text: "Loved Ones",
                  onPress: handleMyWallPress,
                  icon: (
                    <Ionicons name="people" size={28} color={colors.primary} />
                  ),
                },
                {
                  image: require("assets/bird_wall.png"),
                  text: "Testimony",
                  onPress: handleTestimonyPress,
                  icon: (
                    <MaterialCommunityIcons
                      name="message-text"
                      size={28}
                      color={colors.primary}
                    />
                  ),
                },
              ]}
              gap={spacing.md}
            />
          </View>
        </View>
      </View>

      <CustomDialog
        visible={signOutDialogVisible}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        confirmText="Sign Out"
        cancelText="Cancel"
        onCancel={() => setSignOutDialogVisible(false)}
        onConfirm={confirmSignOut}
      />
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    fontSize: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  quickActionsSection: {
    marginBottom: spacing.lg,
  },
  quickActions: {
    width: "100%",
  },
  quickActionsLarge: {
    alignSelf: "center",
  },
  recentActivitySection: {
    flex: 1,
    marginBottom: spacing.lg,
  },
  activityCard: {
    padding: spacing.md,
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    marginTop: spacing.sm,
    opacity: 0.7,
  },
});
