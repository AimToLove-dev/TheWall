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
import { Ionicons } from "@expo/vector-icons";
import { Surface, Card, Avatar, Divider, useTheme } from "react-native-paper";

export const DashboardScreen = ({ navigation }) => {
  const { user, profile, setUser } = useContext(AuthenticatedUserContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const [signOutDialogVisible, setSignOutDialogVisible] = useState(false);
  const theme = useTheme();
  const [greeting, setGreeting] = useState("Welcome");
  const [lovedOnesCount, setLovedOnesCount] = useState(0); // State for loved ones count
  const [testimoniesCount, setTestimoniesCount] = useState(0); // State for testimonies count

  // Check if user is admin to redirect to admin dashboard
  const isAdmin = profile?.isAdmin || user?.isAdmin || false;

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

  // Fetch souls count for the user
  useEffect(() => {
    const fetchSoulsCount = async () => {
      if (user) {
        try {
          const userSouls = await getUserSouls(user.uid);
          setLovedOnesCount(userSouls.length);
        } catch (error) {
          console.error("Error fetching souls count:", error);
        }
      }
    };

    fetchSoulsCount();
  }, [user]);

  // Get initials for avatar
  const getInitials = () => {
    if (!user?.displayName) return "U";
    return user.displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

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

  const handleProfilePress = () => {
    navigation.navigate("Profile");
  };

  const handleMyWallPress = () => {
    navigation.navigate("MyWall");
  };

  const handleTestimonyPress = () => {
    navigation.navigate("MyTestimony");
  };

  return (
    <FormContainer style={{ backgroundColor: colors.background }}>
      <View style={styles.content}>
        {/* Header with back button */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.card }]}
            onPress={handleBackPress}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.card }]}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Profile section with avatar */}
        <Surface
          mode="elevated"
          elevation={2}
          style={[styles.profileCard, { backgroundColor: colors.surface }]}
        >
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleProfilePress}
          >
            {user?.photoURL ? (
              <Avatar.Image size={80} source={{ uri: user.photoURL }} />
            ) : (
              <Avatar.Text size={80} label={getInitials()} />
            )}
            <View style={styles.profileInfo}>
              <HeaderText style={styles.welcomeText}>
                {greeting}, {user?.displayName || profile?.displayName || ""}
              </HeaderText>
              <SubtitleText style={styles.emailText}>
                {user?.email || "No email provided"}
              </SubtitleText>
              <View style={styles.profileEditBadge}>
                <Ionicons
                  name="pencil-outline"
                  size={12}
                  color={colors.primary}
                />
                <BodyText
                  style={{ color: colors.primary, fontSize: 12, marginLeft: 4 }}
                >
                  Edit profile
                </BodyText>
              </View>
            </View>
          </TouchableOpacity>
        </Surface>

        {/* Dashboard stats section */}
        <View style={styles.statsContainer}>
          <HeaderText style={styles.sectionTitle}>Overview</HeaderText>
          <View style={styles.statsGrid}>
            <Surface
              style={[styles.statCard, { backgroundColor: colors.surface }]}
            >
              <Ionicons
                name="people-outline"
                size={24}
                color={colors.primary}
              />
              <BodyText style={styles.statValue}>{lovedOnesCount}</BodyText>
              <BodyText style={styles.statLabel}>Loved Ones</BodyText>
            </Surface>

            <Surface
              style={[styles.statCard, { backgroundColor: colors.surface }]}
            >
              <Ionicons
                name="document-text-outline"
                size={24}
                color={colors.primary}
              />
              <BodyText style={styles.statValue}>{testimoniesCount}</BodyText>
              <BodyText style={styles.statLabel}>Testimonies</BodyText>
            </Surface>

            <Surface
              style={[styles.statCard, { backgroundColor: colors.surface }]}
            >
              <Ionicons name="heart-outline" size={24} color={colors.primary} />
              <BodyText style={styles.statValue}>0</BodyText>
              <BodyText style={styles.statLabel}>Prayers</BodyText>
            </Surface>
          </View>
        </View>

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
                  text: "My\nLoved Ones",
                  onPress: handleMyWallPress,
                },
                {
                  image: require("assets/bird_wall.png"),
                  text: "My\nTestimony",
                  onPress: handleTestimonyPress,
                },
                {
                  image: require("assets/whale.png"),
                  text: "My\nProfile",
                  onPress: handleProfilePress,
                },
              ]}
              gap={spacing.md}
            />
          </View>
        </View>

        {/* Recent activity section */}
        <View style={styles.recentActivitySection}>
          <HeaderText style={styles.sectionTitle}>Recent Activity</HeaderText>
          <Surface
            mode="elevated"
            elevation={1}
            style={[styles.activityCard, { backgroundColor: colors.surface }]}
          >
            <View style={styles.emptyState}>
              <Ionicons
                name="information-circle-outline"
                size={32}
                color={colors.textSecondary}
              />
              <BodyText style={styles.emptyStateText}>
                No recent activity
              </BodyText>
            </View>
          </Surface>
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  profileCard: {
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.small,
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  welcomeText: {
    marginBottom: spacing.xs / 2,
    fontSize: 20,
  },
  emailText: {
    marginBottom: spacing.xs,
    opacity: 0.7,
  },
  profileEditBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    fontSize: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  statsContainer: {
    marginBottom: spacing.lg,
  },
  statsGrid: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    alignItems: "center",
    ...shadows.small,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
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
