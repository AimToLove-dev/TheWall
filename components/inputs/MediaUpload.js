"use client";

import { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  useColorScheme,
  Platform,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { BodyText, ErrorText } from "components";
import { getThemeColors, spacing } from "styles/theme";

/**
 * A component for uploading and displaying images
 */
export const MediaUpload = ({
  label,
  onImageSelected,
  error,
  touched,
  imageUri,
  style,
  aspectRatio = [4, 3],
  placeholder = "Upload Image",
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

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: aspectRatio,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
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
        onPress={pickImage}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : imageUri ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <TouchableOpacity
              style={[styles.removeButton, { backgroundColor: colors.error }]}
              onPress={() => onImageSelected(null)}
            >
              <Ionicons name="close" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons
              name="image-outline"
              size={40}
              color={colors.textSecondary}
            />
            <BodyText style={{ color: colors.textSecondary }}>
              {placeholder}
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
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
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
  },
});
