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
  CustomInput,
  CustomButton,
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

  const handleSaveInviteForm = async () => {
    try {
      setIsSaving(true);
      await updateConfigSettings({
        inviteFormUrl: config.inviteFormUrl,
      });
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
          <HeaderText style={styles.sectionTitle}>
            Invite Form
          </HeaderText>

          <View style={styles.infoCard}>
            <SubtitleText style={styles.infoTitle}>
              Invitation Form URL
            </SubtitleText>
            <BodyText style={styles.infoText}>
              Enter the Google Form URL for the invitation request form. This link will be used in the app for users to request invitations.
            </BodyText>
            
            <CustomInput
              label="Google Form URL"
              value={config.inviteFormUrl}
              onChangeText={(text) => setConfig({ ...config, inviteFormUrl: text })}
              placeholder="https://forms.google.com/..."
              keyboardType="url"
              autoCapitalize="none"
            />
            
            <CustomButton
              title={isSaving ? "Saving..." : "Save Invite Form URL"}
              onPress={handleSaveInviteForm}
              disabled={isLoading || isSaving}
              style={styles.actionButton}
            />
          </View>

          <View style={styles.infoCard}>
            <SubtitleText style={styles.infoTitle}>
              Using Google Forms
            </SubtitleText>
            <BodyText style={styles.infoText}>
              To create a new Google Form, visit forms.google.com and design your invitation request form. Once created, copy the form's URL and paste it above.
            </BodyText>
            <BodyText style={styles.infoText}>
              Make sure your form is set to "Anyone with the link can view" for proper access from the app.
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