"use client";

import { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  TouchableOpacity,
  Image,
  Linking,
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
  DashboardHeader,
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
    if (!user?.emailVerified) {
      navigation.replace("Home");
    }
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
    Linking.openURL("https://mailchi.mp/aimtolove/welcome");
  };

  return (
    <FormContainer style={{ backgroundColor: colors.background }}>
      <View style={styles.content}>
        <DashboardHeader
          title="Dashboard"
          subtitle={greeting}
          onBackPress={handleBackPress}
          onSignOutPress={handleSignOut}
          colors={colors}
        />

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
                  text: "Manage\nLoved Ones",
                  onPress: handleMyWallPress,
                  icon: (
                    <Image
                      source={require("../../assets/megaphone.png")}
                      style={{ width: 28, height: 28, marginBottom: 8 }}
                      resizeMode="contain"
                    />
                  ),
                },
                {
                  text: "Submit\nTestimony",
                  onPress: handleTestimonyPress,
                  icon: (
                    <Image
                      source={require("../../assets/bell.png")}
                      style={{ width: 28, height: 28, marginBottom: 8 }}
                      resizeMode="contain"
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
