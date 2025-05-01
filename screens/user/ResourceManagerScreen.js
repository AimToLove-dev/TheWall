"use client";

import { useContext, useState } from "react";
import { StyleSheet, Alert, ScrollView, Linking } from "react-native";

import { AuthenticatedUserContext } from "providers";
import {
  View,
  HeaderText,
  SubtitleText,
  BodyText,
  FormContainer,
  DashboardHeader,
  CustomButton,
} from "components";
import { getThemeColors, spacing } from "styles/theme";

export const ResourceManagerScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const colors = getThemeColors();

  const [isLoading, setIsLoading] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const openGoogleDrive = () => {
    // Open the Google Drive folder where resources are stored
    Linking.openURL(
      "https://drive.google.com/drive/folders/1yNAxbHAKZE7jzhVb3BZsks_ZLa7Ld8_Q"
    ).catch((err) => {
      Alert.alert("Error", "Could not open Google Drive folder");
    });
  };

  const openAppsScript = () => {
    // Open the Google Apps Script editor
    Linking.openURL("https://script.google.com").catch((err) => {
      Alert.alert("Error", "Could not open Google Apps Script editor");
    });
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

        <ScrollView
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
        >
          <HeaderText style={styles.sectionTitle}>
            How Resources Work
          </HeaderText>

          <View style={styles.infoCard}>
            <SubtitleText style={styles.infoTitle}>
              Resources Overview
            </SubtitleText>
            <BodyText style={styles.infoText}>
              Resources are files stored in Google Drive that appear in the
              Resources section of the app. These files are automatically loaded
              from a specific Google Drive folder.
            </BodyText>
          </View>

          <View style={styles.infoCard}>
            <SubtitleText style={styles.infoTitle}>
              Adding Resources
            </SubtitleText>
            <BodyText style={styles.infoText}>
              To add new resources, simply upload files to the Google Drive
              folder. The files will automatically appear in the app's Resources
              section. Click the button below to open the folder.
            </BodyText>
            <CustomButton
              title="Open Google Drive Folder"
              onPress={openGoogleDrive}
              style={styles.actionButton}
            />
          </View>

          <View style={styles.infoCard}>
            <SubtitleText style={styles.infoTitle}>
              Removing or Updating Resources
            </SubtitleText>
            <BodyText style={styles.infoText}>
              To remove resources, delete the files from the Google Drive
              folder. To update a resource, replace the existing file in the
              folder with a new version (keeping the same filename).
            </BodyText>
          </View>

          <View style={styles.infoCard}>
            <SubtitleText style={styles.infoTitle}>
              Resource Display
            </SubtitleText>
            <BodyText style={styles.infoText}>
              Files from the folder will be displayed in the Resources section
              with appropriate icons based on file type (documents,
              spreadsheets, PDFs, etc.). If no files are present, users will see
              a "Coming Soon" message.
            </BodyText>
          </View>

          <View style={styles.infoCard}>
            <SubtitleText style={styles.infoTitle}>
              Advanced: Changing the Folder
            </SubtitleText>
            <BodyText style={styles.infoText}>
              If you need to use a different Google Drive folder, this requires
              updating the Google Apps Script code. The script contains the
              folder ID that determines which files are displayed. Click below
              to open the Apps Script editor where you can modify the folder ID.
            </BodyText>
            <CustomButton
              title="Open Apps Script Editor"
              onPress={openAppsScript}
              style={styles.actionButton}
            />
          </View>

          <View style={styles.infoCard}>
            <SubtitleText style={styles.infoTitle}>
              Technical Support
            </SubtitleText>
            <BodyText style={styles.infoText}>
              If you need help with managing resources or modifying the Apps
              Script, please contact your technical administrator. Changes to
              the Apps Script require programming knowledge.
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
    marginTop: spacing.sm,
  },
});
