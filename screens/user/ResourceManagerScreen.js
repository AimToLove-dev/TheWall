"use client";

import { useContext, useState, useEffect } from "react";
import { StyleSheet, Alert } from "react-native";

import { AuthenticatedUserContext } from "providers";
import {
  View,
  HeaderText,
  SubtitleText,
  FormContainer,
  DashboardHeader,
} from "components";
import { GoogleDriveUrlInput } from "components/dashboard";
import { getThemeColors, spacing } from "styles/theme";
import {
  getResourceSettings,
  updateResourceSettings,
} from "utils/resourceUtils";

export const ResourceManagerScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const colors = getThemeColors();

  const [googleDriveUrl, setGoogleDriveUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load current settings on component mount
  useEffect(() => {
    loadResourceSettings();
  }, []);

  const loadResourceSettings = async () => {
    try {
      setIsLoading(true);
      const settings = await getResourceSettings();
      if (settings?.googleDriveFolderUrl) {
        setGoogleDriveUrl(settings.googleDriveFolderUrl);
      }
    } catch (error) {
      console.error("Error loading resource settings:", error);
      Alert.alert("Error", "Failed to load resource settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlChange = async (url) => {
    try {
      setIsLoading(true);
      await updateResourceSettings({
        googleDriveFolderUrl: url,
      });
      setGoogleDriveUrl(url);
    } catch (error) {
      console.error("Error saving resource settings:", error);
      Alert.alert("Error", "Failed to save resource settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <FormContainer style={{ backgroundColor: colors.background }}>
      <View style={styles.content}>
        <DashboardHeader
          title="Resource Manager"
          subtitle="Manage digital resources"
          onBackPress={handleBackPress}
          colors={colors}
        />

        <View style={styles.formContainer}>
          <HeaderText style={styles.sectionTitle}>
            Google Drive Settings
          </HeaderText>
          <SubtitleText style={styles.sectionDescription}>
            Enter the URL of a public Google Drive folder to use as your
            resources source.
          </SubtitleText>

          <GoogleDriveUrlInput
            initialUrl={googleDriveUrl}
            onUrlChange={handleUrlChange}
            colors={colors}
            isLoading={isLoading}
          />
        </View>
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
    marginTop: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    marginBottom: spacing.lg,
    opacity: 0.7,
  },
});
