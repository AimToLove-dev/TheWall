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
  TextInput,
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
import { checkProfileCompleteness } from "utils/userUtils";

export const ProfileScreen = ({ navigation, route }) => {
  const { user, setUser, refreshProfile } = useContext(
    AuthenticatedUserContext
  );
  const [isEditing, setIsEditing] = useState(
    route?.params?.startEditing || false
  );
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phoneNumber: "",
    address: "",
    dob: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const theme = useTheme();

  const { isComplete, missingFields } = checkProfileCompleteness(user);

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        dob: user.dob || "",
      });
    }
  }, [user]);

  const handleBackPress = () => {
    navigation.navigate("Dashboard");
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      displayName: user.displayName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
      dob: user.dob || "",
    });
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError("");

    try {
      setUser({
        ...user,
        ...formData,
      });
      await refreshProfile();
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const renderEditForm = () => (
    <Card>
      <Card.Content>
        <Title>Edit Profile</Title>
        <Divider style={{ marginVertical: 16 }} />

        <TextInput
          label="Full Name"
          value={formData.displayName}
          onChangeText={(text) => handleInputChange("displayName", text)}
          mode="outlined"
          left={<TextInput.Icon icon="account" />}
          style={{ marginBottom: 16 }}
        />

        <TextInput
          label="Email"
          value={formData.email}
          onChangeText={(text) => handleInputChange("email", text)}
          mode="outlined"
          disabled={true}
          left={<TextInput.Icon icon="email" />}
          style={{ marginBottom: 16 }}
        />

        <TextInput
          label="Phone Number"
          value={formData.phoneNumber}
          onChangeText={(text) => handleInputChange("phoneNumber", text)}
          mode="outlined"
          keyboardType="phone-pad"
          left={<TextInput.Icon icon="phone" />}
          style={{ marginBottom: 16 }}
        />

        <TextInput
          label="Address"
          value={formData.address}
          onChangeText={(text) => handleInputChange("address", text)}
          mode="outlined"
          left={<TextInput.Icon icon="home" />}
          style={{ marginBottom: 16 }}
        />

        <TextInput
          label="Date of Birth (YYYY-MM-DD)"
          value={formData.dob}
          onChangeText={(text) => handleInputChange("dob", text)}
          mode="outlined"
          left={<TextInput.Icon icon="calendar" />}
          style={{ marginBottom: 16 }}
        />

        {error ? (
          <Text style={{ color: theme.colors.error, marginBottom: 16 }}>
            {error}
          </Text>
        ) : null}

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Button
            mode="outlined"
            onPress={handleCancelEdit}
            style={{ flex: 1, marginRight: 8 }}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSaveProfile}
            loading={loading}
            style={{ flex: 1, marginLeft: 8 }}
          >
            Save Changes
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

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
        <Title style={{ marginBottom: 4 }}>{user?.displayName || "User"}</Title>
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
            <Paragraph>{user?.displayName || "Not provided"}</Paragraph>
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
            <Paragraph>{user?.phoneNumber || "Not provided"}</Paragraph>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Paragraph style={{ fontWeight: "bold" }}>Address:</Paragraph>
            <Paragraph>{user?.address || "Not provided"}</Paragraph>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Paragraph style={{ fontWeight: "bold" }}>Date of Birth:</Paragraph>
            <Paragraph>{user?.dob || "Not provided"}</Paragraph>
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
          {isEditing ? renderEditForm() : renderProfileInfo()}
        </ScrollView>
      </FormContainer>
    </PaperProvider>
  );
};
