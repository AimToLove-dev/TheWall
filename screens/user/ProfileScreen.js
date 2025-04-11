"use client";

import { useContext, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import {
  Avatar,
  Card,
  Divider,
  IconButton,
  Text,
  Title,
  Subheading,
  Paragraph,
  Surface,
  Banner,
} from "react-native-paper";
import { View } from "components/View";
import { AuthenticatedUserContext } from "providers";
import { FormContainer } from "components/FormContainer";
import { checkProfileCompleteness } from "@utils/profileUtils";
import { EditProfileForm } from "components/EditProfileForm";
import { getThemeColors } from "styles/theme";
import { CustomButton } from "components/CustomButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { spacing, shadows } from "styles/theme";

export const ProfileScreen = ({ navigation, route }) => {
  const { user, profile, updateProfile, refreshProfile } = useContext(
    AuthenticatedUserContext
  );
  const [isEditing, setIsEditing] = useState(
    route?.params?.startEditing || false
  );
  const [loading, setLoading] = useState(false);
  const colors = getThemeColors();

  const { isComplete, missingFields } = checkProfileCompleteness(profile);

  const handleBackPress = () => {
    navigation.navigate("user");
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleProfileUpdate = async (updatedProfile) => {
    setLoading(true);

    try {
      await updateProfile(updatedProfile);
      await refreshProfile();
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (profile?.displayName) {
      return profile.displayName.charAt(0).toUpperCase();
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const renderProfileInfo = () => (
    <>
      <Surface style={styles.profileHeader}>
        <Avatar.Text size={100} label={getInitials()} style={styles.avatar} />
        <Title style={styles.title}>{profile?.displayName || "User"}</Title>
        <Subheading style={styles.subtitle}>
          {user?.email || "No email provided"}
        </Subheading>

        {!isComplete && (
          <Banner
            visible={true}
            icon="alert-circle"
            actions={[
              { label: "Complete Profile", onPress: handleEditProfile },
            ]}
          >
            Your profile is incomplete. Please complete your profile to submit
            testimonies.
          </Banner>
        )}
      </Surface>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Personal Information</Title>
          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>Full Name:</Paragraph>
            <Paragraph>{profile?.displayName || "Not provided"}</Paragraph>
          </View>

          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>Email:</Paragraph>
            <Paragraph>{user?.email || "Not provided"}</Paragraph>
          </View>

          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>Phone:</Paragraph>
            <Paragraph>{profile?.phoneNumber || "Not provided"}</Paragraph>
          </View>

          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>Address:</Paragraph>
            <Paragraph>{profile?.address || "Not provided"}</Paragraph>
          </View>

          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>Date of Birth:</Paragraph>
            <Paragraph>{profile?.dob || "Not provided"}</Paragraph>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Account Information</Title>
          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>User ID:</Paragraph>
            <Paragraph>
              {user?.uid ? user.uid.substring(0, 8) + "..." : "Unknown"}
            </Paragraph>
          </View>

          <View style={styles.infoRow}>
            <Paragraph style={styles.infoLabel}>Role:</Paragraph>
            <Paragraph>{user?.isAdmin ? "Admin" : "User"}</Paragraph>
          </View>
        </Card.Content>
      </Card>

      <CustomButton
        title="Edit Profile"
        variant="primary"
        leftIcon={
          <MaterialCommunityIcons name="account-edit" size={20} color="white" />
        }
        onPress={handleEditProfile}
        style={styles.editButton}
      />
    </>
  );

  return (
    <FormContainer>
      <View style={styles.container}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={handleBackPress}
          style={styles.backButton}
        />
        {isEditing ? (
          <Card style={styles.editProfileCard}>
            <Card.Content>
              <Title>Edit Profile</Title>
              <Divider style={styles.divider} />
              <EditProfileForm
                profile={{ ...profile, uid: user.uid }}
                onSuccess={handleProfileUpdate}
                onCancel={handleCancelEdit}
              />
            </Card.Content>
          </Card>
        ) : (
          renderProfileInfo()
        )}
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  backButton: {
    marginBottom: spacing.md,
    alignSelf: "flex-start",
  },
  profileHeader: {
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.md,
    ...shadows.small,
  },
  avatar: {
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.xs / 2,
  },
  subtitle: {
    marginBottom: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
    ...shadows.small,
  },
  editProfileCard: {
    ...shadows.small,
  },
  divider: {
    marginVertical: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  infoLabel: {
    fontWeight: "bold",
  },
  editButton: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
});
