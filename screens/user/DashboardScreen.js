"use client";

import { useContext, useState } from "react";
import {
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";

import { signOut } from "firebase/auth";
import { auth } from "config";
import { AuthenticatedUserContext } from "providers";

import {
  View,
  HeaderText,
  SubtitleText,
  CustomButton,
  CustomDialog,
  FormContainer,
  CardGrid,
} from "components";

import { getThemeColors, spacing } from "styles/theme";
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

  const handleTestimonyPress = () => {
    navigation.navigate("MyTestimony");
  };

  return (
    <FormContainer style={{ backgroundColor: colors.background }}>
      <View style={styles.content}>
        <View style={styles.welcomeContainer}>
          <HeaderText style={styles.welcomeText}>
            Welcome, {user?.displayName || "User"}
          </HeaderText>
          <SubtitleText style={styles.emailText}>
            {user?.email || "No email provided"}
          </SubtitleText>
        </View>

        <View style={styles.menuContainer}>
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
            ]}
          />
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
