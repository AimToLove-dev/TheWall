"use client";

import { useContext, useState } from "react";
import {
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { View } from "components/View";
import { signOut } from "firebase/auth";
import { auth } from "config";
import { AuthenticatedUserContext } from "providers";
import { CustomButton } from "components/CustomButton";
import { HeaderText, SubtitleText } from "components/Typography";
import { CustomDialog } from "components/CustomDialog";
import { getThemeColors, spacing } from "styles/theme";
import { FormContainer } from "components/FormContainer";
import { Ionicons } from "@expo/vector-icons";

export const DashboardScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const [signOutDialogVisible, setSignOutDialogVisible] = useState(false);

  const handleSignOut = () => {
    setSignOutDialogVisible(true);
  };

  const confirmSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      })
      .finally(() => {
        setSignOutDialogVisible(false);
      });
  };

  const handleBackPress = () => {
    navigation.navigate("Home");
  };

  const handleProfilePress = () => {
    navigation.navigate("Profile");
  };

  const handleMyWallPress = () => {
    navigation.navigate("MyWall");
  };

  const handlePublicWallPress = () => {
    navigation.navigate("WailingWall");
  };

  return (
    <FormContainer style={{ backgroundColor: colors.background }}>
      <View style={styles.content}>
        <View
          style={[
            styles.welcomeContainer,
            isLargeScreen && styles.welcomeContainerLarge,
          ]}
        >
          <View
            style={[
              styles.avatarPlaceholder,
              { backgroundColor: colors.primary },
            ]}
          >
            <HeaderText style={styles.avatarText}>
              {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
            </HeaderText>
          </View>
          <HeaderText style={styles.welcomeText}>
            Welcome, {user?.displayName || "User"}
          </HeaderText>
          <SubtitleText style={styles.emailText}>
            {user?.email || "No email provided"}
          </SubtitleText>
        </View>

        <View
          style={[
            styles.menuContainer,
            isLargeScreen && styles.menuContainerLarge,
          ]}
        >
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.card }]}
            onPress={handleProfilePress}
          >
            <View
              style={[
                styles.menuIconContainer,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <Ionicons
                name="person-outline"
                size={24}
                color={colors.primary}
              />
            </View>
            <View style={styles.menuTextContainer}>
              <HeaderText style={styles.menuTitle}>Profile</HeaderText>
              <SubtitleText style={styles.menuSubtitle}>
                View and edit your profile information
              </SubtitleText>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.card }]}
            onPress={handleMyWallPress}
          >
            <View
              style={[
                styles.menuIconContainer,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <Ionicons
                name="people-outline"
                size={24}
                color={colors.primary}
              />
            </View>
            <View style={styles.menuTextContainer}>
              <HeaderText style={styles.menuTitle}>My Wall</HeaderText>
              <SubtitleText style={styles.menuSubtitle}>
                Manage your personal wall of souls
              </SubtitleText>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
          <View
            style={[
              styles.actionContainer,
              isLargeScreen && styles.actionContainerLarge,
            ]}
          >
            <CustomButton
              title="Sign Out"
              onPress={handleSignOut}
              variant="outline"
              size="large"
              leftIcon={
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color={colors.primary}
                />
              }
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  welcomeContainerLarge: {
    marginBottom: spacing.xxl,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  avatarText: {
    color: "white",
    fontSize: 32,
  },
  welcomeText: {
    marginBottom: spacing.xs,
    fontSize: 24,
  },
  emailText: {
    marginBottom: 0,
  },
  menuContainer: {
    marginBottom: spacing.xl,
  },
  menuContainerLarge: {
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    marginBottom: spacing.xs / 2,
  },
  menuSubtitle: {
    fontSize: 14,
    marginBottom: 0,
  },
  actionContainer: {
    marginTop: "auto",
  },
  actionContainerLarge: {
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },
});
