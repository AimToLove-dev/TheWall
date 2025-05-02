"use client";

import { useContext, useState, useEffect } from "react";
import { StyleSheet, Alert, ScrollView, View } from "react-native";

import { AuthenticatedUserContext } from "providers";
import {
  HeaderText,
  SubtitleText,
  BodyText,
  FormContainer,
  DashboardHeader,
  CustomButton,
  UrlInput, // Added UrlInput import
} from "components";
import { getThemeColors, spacing } from "styles/theme";
import { getConfigSettings, updateConfigSettings } from "utils/configUtils";

export const ConfigurationManagerScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const colors = getThemeColors();

  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState({
    inviteFormUrl: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [updatedUrl, setUpdatedUrl] = useState("");

  // Load config settings when component mounts
  useEffect(() => {
    loadConfigSettings();
  }, []);

  const loadConfigSettings = async () => {
    try {
      setIsLoading(true);
      const configData = await getConfigSettings();
      setConfig({
        inviteFormUrl: configData.inviteFormUrl || "",
      });
    } catch (error) {
      console.error("Error loading configuration:", error);
      Alert.alert("Error", "Failed to load configuration settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSaveInviteForm = async (url) => {
    try {
      setIsSaving(true);
      setUpdatedUrl(url); // Store the URL being updated

      // Call the actual update function
      await updateConfigSettings({
        inviteFormUrl: url,
      });

      // Update our local state to reflect the change
      setConfig((prevConfig) => ({
        ...prevConfig,
        inviteFormUrl: url,
      }));

      Alert.alert("Success", "Invite Form URL saved successfully");
    } catch (error) {
      console.error("Error saving configuration:", error);
      Alert.alert("Error", "Failed to save configuration settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <FormContainer style={{ backgroundColor: colors.background }}>
      <View style={styles.content}>
        <DashboardHeader
          title="Configuration Manager"
          subtitle="Manage app configuration settings"
          onBackPress={handleBackPress}
          colors={colors}
        />

        <ScrollView
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
        >
          <HeaderText style={styles.sectionTitle}>Invite Form</HeaderText>

          <View style={styles.infoCard}>
            <SubtitleText style={styles.infoTitle}>
              Invitation Form URL
            </SubtitleText>
            <BodyText style={styles.infoText}>
              Enter the Google Form URL for the invitation request form. This
              link will be used in the app for users to request invitations.
            </BodyText>

            <UrlInput
              initialUrl={config.inviteFormUrl}
              onUrlChange={handleSaveInviteForm}
              colors={colors}
              isLoading={isSaving}
              label="Google Form URL"
              placeholder="https://forms.google.com/..."
            />
          </View>

          <View style={styles.infoCard}>
            <SubtitleText style={styles.infoTitle}>
              Using Google Forms
            </SubtitleText>
            <BodyText style={styles.infoText}>
              Create a Google Form for invitation requests, then copy the
              shareable link from Google Forms and paste it here. Make sure the
              form is set to "Anyone with the link can view" in the sharing
              settings.
            </BodyText>
          </View>
        </ScrollView>
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  formContainer: {
    marginTop: spacing.lg,
    flex: 1,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  infoCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  infoTitle: {
    marginBottom: spacing.sm,
    fontWeight: "600",
  },
  infoText: {
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  actionButton: {
    marginTop: spacing.md,
  },
});
