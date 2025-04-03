"use client";

import { useContext } from "react";
import { StyleSheet, useColorScheme, useWindowDimensions } from "react-native";
import { View } from "components/View";
import { AuthenticatedUserContext } from "providers";
import { CustomButton } from "components/CustomButton";
import { HeaderText, SubtitleText, BodyText } from "components/Typography";
import { getThemeColors, spacing } from "styles/theme";
import { FormContainer } from "components/FormContainer";
import { Ionicons } from "@expo/vector-icons";

export const ProfileScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  const handleBackPress = () => {
    navigation.navigate("Dashboard");
  };

  return (
    <FormContainer style={{ backgroundColor: colors.background }}>
      <View style={styles.content}>
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
              <BodyText style={{ color: colors.textSecondary }}>Role:</BodyText>
              <BodyText>{user?.isAdmin ? "Admin" : "User"}</BodyText>
            </View>
            <View style={styles.infoRow}>
              <BodyText style={{ color: colors.textSecondary }}>
                Account Created:
              </BodyText>
              <BodyText>
                {user?.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString()
                  : "Unknown"}
              </BodyText>
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
            title="Edit Profile"
            onPress={() => {
              /* Future implementation */
            }}
            variant="primary"
            size="large"
            style={styles.editButton}
            leftIcon={
              <Ionicons name="create-outline" size={20} color="#FFFFFF" />
            }
          />
        </View>
      </View>
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
  editButton: {
    marginBottom: spacing.md,
  },
});
