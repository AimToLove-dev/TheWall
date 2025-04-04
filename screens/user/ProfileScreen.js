"use client";

import { useContext, useState } from "react";
import {
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { View } from "components/View";
import { AuthenticatedUserContext } from "providers";
import { CustomButton } from "components/CustomButton";
import { HeaderText, SubtitleText, BodyText } from "components/Typography";
import { getThemeColors, spacing } from "styles/theme";
import { FormContainer } from "components/FormContainer";
import { Ionicons } from "@expo/vector-icons";
import { EditProfileForm } from "components/EditProfileForm";
import { checkProfileCompleteness } from "utils/userUtils";

export const ProfileScreen = ({ navigation, route }) => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isEditing, setIsEditing] = useState(
    route?.params?.startEditing || false
  );
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  const { isComplete, missingFields } = checkProfileCompleteness(user);

  const handleBackPress = () => {
    navigation.navigate("Dashboard");
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleProfileUpdated = (updatedProfile) => {
    // Update the user context with the new profile data
    setUser({
      ...user,
      ...updatedProfile,
    });
    setIsEditing(false);
  };

  const renderProfileInfo = () => (
    <>
      <View style={styles.profileContainer}>
        <View
          style={[
            styles.avatarPlaceholder,
            { backgroundColor: colors.primary },
          ]}
        >
          <HeaderText style={styles.avatarText}>
            {user?.displayName
              ? user.displayName.charAt(0).toUpperCase()
              : user?.email
              ? user.email.charAt(0).toUpperCase()
              : "U"}
          </HeaderText>
        </View>

        <HeaderText style={styles.nameText}>
          {user?.displayName || "User"}
        </HeaderText>
        <SubtitleText style={styles.emailText}>
          {user?.email || "No email provided"}
        </SubtitleText>

        {!isComplete && (
          <View style={styles.incompleteProfileBanner}>
            <Ionicons
              name="alert-circle-outline"
              size={20}
              color={colors.warning}
            />
            <BodyText
              style={[styles.incompleteText, { color: colors.warning }]}
            >
              Your profile is incomplete. Please complete your profile to submit
              testimonies.
            </BodyText>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <BodyText style={styles.sectionTitle}>Personal Information</BodyText>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <BodyText style={{ color: colors.textSecondary }}>
              Full Name:
            </BodyText>
            <BodyText>{user?.displayName || "Not provided"}</BodyText>
          </View>

          <View style={styles.infoRow}>
            <BodyText style={{ color: colors.textSecondary }}>Email:</BodyText>
            <BodyText>{user?.email || "Not provided"}</BodyText>
          </View>

          <View style={styles.infoRow}>
            <BodyText style={{ color: colors.textSecondary }}>Phone:</BodyText>
            <BodyText>{user?.phoneNumber || "Not provided"}</BodyText>
          </View>

          <View style={styles.infoRow}>
            <BodyText style={{ color: colors.textSecondary }}>
              Address:
            </BodyText>
            <BodyText>{user?.address || "Not provided"}</BodyText>
          </View>

          <View style={styles.infoRow}>
            <BodyText style={{ color: colors.textSecondary }}>
              Date of Birth:
            </BodyText>
            <BodyText>{user?.dob || "Not provided"}</BodyText>
          </View>
        </View>

        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.card, marginTop: spacing.md },
          ]}
        >
          <BodyText style={styles.sectionTitle}>Account Information</BodyText>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <BodyText style={{ color: colors.textSecondary }}>
              User ID:
            </BodyText>
            <BodyText>
              {user?.uid ? user.uid.substring(0, 8) + "..." : "Unknown"}
            </BodyText>
          </View>

          <View style={styles.infoRow}>
            <BodyText style={{ color: colors.textSecondary }}>Role:</BodyText>
            <BodyText>{user?.isAdmin ? "Admin" : "User"}</BodyText>
          </View>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <CustomButton
          title="Edit Profile"
          onPress={handleEditProfile}
          variant="primary"
          size="large"
          style={styles.editButton}
          leftIcon={
            <Ionicons name="create-outline" size={20} color="#FFFFFF" />
          }
        />
      </View>
    </>
  );

  return (
    <FormContainer style={{ backgroundColor: colors.background }}>
      <View style={styles.content}>
        <TouchableOpacity
          style={[
            styles.backButton,
            isDark && { backgroundColor: colors.card },
          ]}
          onPress={handleBackPress}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        {isEditing ? (
          <View style={styles.editFormContainer}>
            <HeaderText style={styles.editTitle}>Edit Profile</HeaderText>
            <SubtitleText style={styles.editSubtitle}>
              Update your personal information
            </SubtitleText>
            <EditProfileForm
              user={user}
              onSuccess={handleProfileUpdated}
              onCancel={handleCancelEdit}
            />
          </View>
        ) : (
          renderProfileInfo()
        )}
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
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
    marginBottom: spacing.md,
  },
  incompleteProfileBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 193, 7, 0.1)",
    padding: spacing.sm,
    borderRadius: 8,
    marginTop: spacing.sm,
  },
  incompleteText: {
    marginLeft: spacing.xs,
    fontSize: 14,
  },
  infoContainer: {
    marginBottom: spacing.xl,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  infoCard: {
    padding: spacing.lg,
    borderRadius: 12,
  },
  sectionTitle: {
    fontWeight: "bold",
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
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },
  editButton: {
    marginBottom: spacing.md,
  },
  editFormContainer: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  editTitle: {
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  editSubtitle: {
    textAlign: "center",
    marginBottom: spacing.xl,
  },
});
