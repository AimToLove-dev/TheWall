"use client";

import { useContext } from "react";
import {
  View,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { auth } from "../config";
import { AuthenticatedUserContext } from "../providers";
import { CustomButton } from "../components/CustomButton";
import { HeaderText, SubtitleText, BodyText } from "../components/Typography";
import { getThemeColors, spacing } from "../styles/theme";

export const ProfileScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  const handleSignOut = () => {
    onPress: () => {
      signOut(auth)
        .then(() => {
          navigation.navigate("Home");
        })
        .catch((error) => {
          console.error("Sign out error:", error);
        });
    };
  };

  const handleBackPress = () => {
    navigation.navigate("Home");
  };

  const handleViewSubmissions = () => {
    navigation.navigate("SoulSubmissions");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "bottom"]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.backButton,
            isDark && { backgroundColor: colors.card },
          ]}
          onPress={handleBackPress}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <HeaderText>Profile</HeaderText>
      </View>

      <View
        style={[
          styles.profileContainer,
          isLargeScreen && styles.profileContainerLarge,
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

        <HeaderText style={styles.nameText}>
          {user?.displayName || "User"}
        </HeaderText>

        <SubtitleText style={styles.emailText}>
          {user?.email || "No email provided"}
        </SubtitleText>
      </View>

      <View
        style={[
          styles.infoContainer,
          isLargeScreen && styles.infoContainerLarge,
        ]}
      >
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <BodyText>Account Information</BodyText>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.infoRow}>
            <BodyText style={{ color: colors.textSecondary }}>Email:</BodyText>
            <BodyText>{user?.email}</BodyText>
          </View>
          <View style={styles.infoRow}>
            <BodyText style={{ color: colors.textSecondary }}>
              User ID:
            </BodyText>
            <BodyText>{user?.uid.substring(0, 8)}...</BodyText>
          </View>
          <View style={styles.infoRow}>
            <BodyText style={{ color: colors.textSecondary }}>Role:</BodyText>
            <BodyText>{user?.isAdmin ? "Admin" : "User"}</BodyText>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.actionContainer,
          isLargeScreen && styles.actionContainerLarge,
        ]}
      >
        <CustomButton
          title="My Soul Submissions"
          onPress={handleViewSubmissions}
          variant="secondary"
          size="large"
          style={styles.submissionsButton}
        />

        <CustomButton
          title="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          size="large"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  profileContainerLarge: {
    marginBottom: spacing.xxl,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  avatarText: {
    color: "white",
    fontSize: 40,
  },
  nameText: {
    marginBottom: spacing.xs,
  },
  emailText: {
    marginBottom: 0,
  },
  infoContainer: {
    marginBottom: spacing.xl,
  },
  infoContainerLarge: {
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
  },
  infoCard: {
    padding: spacing.lg,
    borderRadius: 12,
  },
  divider: {
    height: 1,
    marginVertical: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  actionContainer: {
    marginTop: "auto",
  },
  actionContainerLarge: {
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },
  submissionsButton: {
    marginBottom: spacing.md,
  },
});
