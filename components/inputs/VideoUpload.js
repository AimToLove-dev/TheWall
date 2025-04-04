"use client";

import { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Platform,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { BodyText, ErrorText } from "../Typography";
import { getThemeColors, spacing } from "../../styles/theme";

/**
 * A component for uploading and displaying videos
 */
export const VideoUpload = ({
  label,
  onVideoSelected,
  error,
  touched,
  videoUri,
  style,
  placeholder = "Upload Video",
  maxDuration = 60, // Max duration in seconds
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);
  const [loading, setLoading] = useState(false);

  const hasError = error && touched;

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return false;
      }
      return true;
    }
    return true;
  };

  const pickVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: maxDuration,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onVideoSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking video:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && <BodyText style={styles.label}>{label}</BodyText>}
      <TouchableOpacity
        style={[
          styles.uploadContainer,
          {
            backgroundColor: colors.inputBackground,
            borderColor: hasError ? colors.error : colors.border,
          },
        ]}
        onPress={pickVideo}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : videoUri ? (
          <View style={styles.videoContainer}>
            <Video
              source={{ uri: videoUri }}
              style={styles.video}
              useNativeControls
              resizeMode="contain"
              isLooping
            />
            <TouchableOpacity
              style={[styles.removeButton, { backgroundColor: colors.error }]}
              onPress={() => onVideoSelected(null)}
            >
              <Ionicons name="close" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons
              name="videocam-outline"
              size={40}
              color={colors.textSecondary}
            />
            <BodyText style={{ color: colors.textSecondary }}>
              {placeholder}
            </BodyText>
            <BodyText
              style={{ color: colors.textTertiary, fontSize: 12, marginTop: 4 }}
            >
              Max {maxDuration} seconds
            </BodyText>
          </View>
        )}
      </TouchableOpacity>
      {hasError && <ErrorText>{error}</ErrorText>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
    fontWeight: "500",
  },
  uploadContainer: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 8,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  videoContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
