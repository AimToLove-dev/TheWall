"use client";

import { useContext, useState, useEffect } from "react";
import { ScrollView } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Divider,
  IconButton,
  Text,
  Title,
  Subheading,
  Paragraph,
  Surface,
  Banner,
  useTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { View } from "components/View";
import { AuthenticatedUserContext } from "providers";
import { FormContainer } from "components/FormContainer";
import { checkProfileCompleteness } from "@utils/profileUtils";
import { EditProfileForm } from "components/EditProfileForm";

export const ProfileScreen = ({ navigation, route }) => {
  const { user, profile, updateProfile, refreshProfile } = useContext(
    AuthenticatedUserContext
  );
  const [isEditing, setIsEditing] = useState(
    route?.params?.startEditing || false
  );
  const [loading, setLoading] = useState(false);

  const theme = useTheme();

  console.log(profile);
  const { isComplete, missingFields } = checkProfileCompleteness(profile);

  const handleBackPress = () => {
    navigation.navigate("Dashboard");
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
      <Surface
        style={{
          padding: 24,
          alignItems: "center",
          marginBottom: 16,
          borderRadius: 8,
        }}
      >
        <Avatar.Text
          size={100}
          label={getInitials()}
          style={{ marginBottom: 16 }}
        />
        <Title style={{ marginBottom: 4 }}>
          {profile?.displayName || "User"}
        </Title>
        <Subheading style={{ marginBottom: 16 }}>
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

      <Card style={{ marginBottom: 16 }}>
        <Card.Content>
          <Title>Personal Information</Title>
          <Divider style={{ marginVertical: 16 }} />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Paragraph style={{ fontWeight: "bold" }}>Full Name:</Paragraph>
            <Paragraph>{profile?.displayName || "Not provided"}</Paragraph>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Paragraph style={{ fontWeight: "bold" }}>Email:</Paragraph>
            <Paragraph>{user?.email || "Not provided"}</Paragraph>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Paragraph style={{ fontWeight: "bold" }}>Phone:</Paragraph>
            <Paragraph>{profile?.phoneNumber || "Not provided"}</Paragraph>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Paragraph style={{ fontWeight: "bold" }}>Address:</Paragraph>
            <Paragraph>{profile?.address || "Not provided"}</Paragraph>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Paragraph style={{ fontWeight: "bold" }}>Date of Birth:</Paragraph>
            <Paragraph>{profile?.dob || "Not provided"}</Paragraph>
          </View>
        </Card.Content>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <Card.Content>
          <Title>Account Information</Title>
          <Divider style={{ marginVertical: 16 }} />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Paragraph style={{ fontWeight: "bold" }}>User ID:</Paragraph>
            <Paragraph>
              {user?.uid ? user.uid.substring(0, 8) + "..." : "Unknown"}
            </Paragraph>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Paragraph style={{ fontWeight: "bold" }}>Role:</Paragraph>
            <Paragraph>{user?.isAdmin ? "Admin" : "User"}</Paragraph>
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        icon="account-edit"
        onPress={handleEditProfile}
        style={{ marginTop: 8, marginBottom: 24 }}
      >
        Edit Profile
      </Button>
    </>
  );

  return (
    <PaperProvider theme={theme}>
      <FormContainer>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={handleBackPress}
            style={{ marginBottom: 16, alignSelf: "flex-start" }}
          />
          {isEditing ? (
            <Card>
              <Card.Content>
                <Title>Edit Profile</Title>
                <Divider style={{ marginVertical: 16 }} />
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
        </ScrollView>
      </FormContainer>
    </PaperProvider>
  );
};
