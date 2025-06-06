"use client";

import { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  Image,
  Linking,
} from "react-native";
import { Easing } from "react-native-reanimated";

import { signOut } from "firebase/auth";
import { auth } from "config";
import { AuthenticatedUserContext } from "providers";
import { queryDocuments } from "utils/firebaseUtils"; // Import query function
import { getUserSouls } from "utils";

import {
  View,
  HeaderText,
  BodyText,
  CustomDialog,
  FormContainer,
  DashboardHeader,
  AdminFunctionButton,
} from "components";

import { getThemeColors, spacing, shadows } from "styles/theme";
import { Surface, useTheme } from "react-native-paper";

export const DashboardAdminScreen = ({ navigation }) => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const [signOutDialogVisible, setSignOutDialogVisible] = useState(false);
  const theme = useTheme();
  const [greeting, setGreeting] = useState("Welcome");

  // Admin-specific stats
  const [totalSoulsCount, setTotalSoulsCount] = useState(0);
  const [pendingTestimoniesCount, setPendingTestimoniesCount] = useState(0);
  const [approvedTestimoniesCount, setApprovedTestimoniesCount] = useState(0);
  const [testimonySubmissionsCount, setTestimonySubmissionsCount] = useState(0);
  const [testimoniesCount, setTestimoniesCount] = useState(0);

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

  // Fetch admin stats
  useEffect(() => {
    const fetchAdminStats = async () => {
      if (user) {
        try {
          // Get total souls count
          const allSouls = await queryDocuments("souls", [], [], 0);
          setTotalSoulsCount(allSouls.length);

          // Get all documents from testimonySubmissions collection
          const submissions = await queryDocuments(
            "testimonySubmissions",
            [],
            [],
            0
          );
          setTestimonySubmissionsCount(submissions.length);

          // Get all documents from testimonies collection
          const testimonies = await queryDocuments("testimonies", [], [], 0);
          setTestimoniesCount(testimonies.length);

          // Get pending testimonies count (previously using "testimonies" collection only)
          const pendingTestimonies = await queryDocuments(
            "testimonies",
            [["email", "!=", null]],
            [],
            0
          );
          setPendingTestimoniesCount(pendingTestimonies.length);

          // Get approved testimonies count (previously using "testimonies" collection only)
          const approvedTestimonies = await queryDocuments(
            "testimonies",
            [["email", "!=", null]],
            [],
            0
          );
          setApprovedTestimoniesCount(approvedTestimonies.length);
        } catch (error) {
          console.error("Error fetching admin stats:", error);
        }
      }
    };

    fetchAdminStats();
  }, [user]);

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

  const handleCreateTestimony = () => {
    navigation.navigate("Testimony");
  };
  const handleTestimonyReviewPress = () => {
    navigation.navigate("TestimonyReview");
  };

  const handleConfigurationPress = () => {
    navigation.navigate("ConfigurationManager");
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
      textAlign: "center",
    },
    adminSection: {
      marginBottom: spacing.lg,
    },
    adminCard: {
      ...shadows.small,
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

  return (
    <FormContainer style={{ backgroundColor: colors.background }}>
      <View style={styles.content}>
        <DashboardHeader
          title="Admin Dashboard"
          subtitle={`${greeting}, ${user?.displayName || "Admin"}`}
          onBackPress={handleBackPress}
          onSignOutPress={handleSignOut}
          colors={colors}
        />

        {/* Admin Dashboard stats section */}
        <View style={styles.statsContainer}>
          <HeaderText style={styles.sectionTitle}>Overview</HeaderText>
          <View style={styles.statsGrid}>
            <Surface style={[styles.statCard, { backgroundColor: "#ffd2d2" }]}>
              <Image
                source={require("assets/megaphone.png")}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
              <BodyText style={styles.statValue}>{totalSoulsCount}</BodyText>
              <BodyText style={styles.statLabel}>Total Souls</BodyText>
            </Surface>

            <Surface style={[styles.statCard, { backgroundColor: "#fbffd2" }]}>
              <Image
                source={require("assets/bell.png")}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
              <BodyText style={styles.statValue}>
                {testimonySubmissionsCount}
              </BodyText>
              <BodyText style={styles.statLabel}>Submissions</BodyText>
            </Surface>

            <Surface style={[styles.statCard, { backgroundColor: "#ddffd2" }]}>
              <Image
                source={require("assets/bell.png")}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
              <BodyText style={styles.statValue}>{testimoniesCount}</BodyText>
              <BodyText style={styles.statLabel}>Testimonies</BodyText>
            </Surface>
          </View>
        </View>

        {/* Admin Section */}
        <View style={styles.adminSection}>
          <HeaderText style={styles.sectionTitle}>Admin Functions</HeaderText>
          <Surface
            mode="elevated"
            elevation={1}
            style={[styles.adminCard, { backgroundColor: colors.surface }]}
          >
            <AdminFunctionButton
              title="Create Testimony"
              description="Add submission on behalf of a user"
              iconName="person-add"
              onPress={handleCreateTestimony}
              colors={colors}
            />
            <AdminFunctionButton
              title="Testimony Approval"
              description="Manage pending testimony submissions"
              iconName="shield-checkmark"
              onPress={handleTestimonyReviewPress}
              colors={colors}
            />
            {/*database: collections/config/[myCustomPageId]*/}
            <AdminFunctionButton
              title="Custom Pages"
              description="Manage home page links and page embeds"
              iconName="link"
              onPress={handleConfigurationPress}
              colors={colors}
            />
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
