"use client";

import { useContext, useState } from "react";
import { StyleSheet, useColorScheme, useWindowDimensions } from "react-native";
import { View } from "../components/View";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { AuthenticatedUserContext } from "../providers";
import { CustomButton } from "../components/CustomButton";
import { HeaderText, SubtitleText, BodyText } from "../components/Typography";
import { CustomDialog } from "../components/CustomDialog";
import { SoulsList } from "../components/souls/SoulsList";
import { AddSoul } from "../components/souls/AddSoul";
import { EditSoul } from "../components/souls/EditSoul";
import { ScreenHeader } from "../components/ScreenHeader";
import { getThemeColors, spacing } from "../styles/theme";
import { FormContainer } from "../components/FormContainer";

export const ProfileScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  const [signOutDialogVisible, setSignOutDialogVisible] = useState(false);
  const [currentView, setCurrentView] = useState("profile"); // 'profile', 'souls', 'addSoul', 'editSoul'
  const [selectedSoul, setSelectedSoul] = useState(null);

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
    if (currentView === "profile") {
      navigation.navigate("Home");
    } else {
      setCurrentView("profile");
    }
  };

  const handleViewSubmissions = () => {
    setCurrentView("souls");
  };

  const handleAddSoul = () => {
    setCurrentView("addSoul");
  };

  const handleEditSoul = (soul) => {
    setSelectedSoul(soul);
    setCurrentView("editSoul");
  };

  const handleSoulAdded = () => {
    setCurrentView("souls");
  };

  const handleSoulUpdated = () => {
    setCurrentView("souls");
  };

  const renderContent = () => {
    switch (currentView) {
      case "souls":
        return (
          <SoulsList
            navigation={navigation}
            onAddPress={handleAddSoul}
            onEditPress={handleEditSoul}
          />
        );
      case "addSoul":
        return (
          <AddSoul
            onSuccess={handleSoulAdded}
            onCancel={() => setCurrentView("souls")}
          />
        );
      case "editSoul":
        return (
          <EditSoul
            soul={selectedSoul}
            onSuccess={handleSoulUpdated}
            onCancel={() => setCurrentView("souls")}
          />
        );
      default:
        return (
          <>
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
                <View
                  style={[styles.divider, { backgroundColor: colors.border }]}
                />
                <View style={styles.infoRow}>
                  <BodyText style={{ color: colors.textSecondary }}>
                    Email:
                  </BodyText>
                  <BodyText>{user?.email}</BodyText>
                </View>
                <View style={styles.infoRow}>
                  <BodyText style={{ color: colors.textSecondary }}>
                    User ID:
                  </BodyText>
                  <BodyText>{user?.uid.substring(0, 8)}...</BodyText>
                </View>
                <View style={styles.infoRow}>
                  <BodyText style={{ color: colors.textSecondary }}>
                    Role:
                  </BodyText>
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
          </>
        );
    }
  };

  return (
    <FormContainer style={{ backgroundColor: colors.background }}>
      <ScreenHeader
        title={currentView === "profile" ? "Profile" : ""}
        onBackPress={handleBackPress}
        style={styles.header}
      />

      <View style={styles.content}>{renderContent()}</View>

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
