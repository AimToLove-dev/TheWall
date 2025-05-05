"use client";

import { useState, useEffect } from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Surface, IconButton, Text, useTheme } from "react-native-paper";
import { Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { uploadVideo } from "config";
import { auth } from "config";

export const VideoUpload = ({
  onVideoSelect,
  initialVideo,
  style,
  label = "Upload Video",
  maxDuration = 60,
  propertyName = "video", // Default property name
  isAdmin = false, // Admin flag
}) => {
  const [video, setVideo] = useState(initialVideo);
  const [uploading, setUploading] = useState(false);
  const theme = useTheme();

  // Update video state when initialVideo prop changes
  useEffect(() => {
    setVideo(initialVideo);
  }, [initialVideo]);

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      videoMaxDuration: maxDuration,
      quality: 0.8,
    });

    if (!result.canceled) {
      setUploading(true);
      try {
        const localUri = result.assets[0].uri;
        // Upload to Firebase Storage
        const userId = auth.currentUser ? auth.currentUser.uid : "anonymous";
        // Pass propertyName and isAdmin flag
        const downloadURL = await uploadVideo(
          localUri,
          userId,
          propertyName,
          isAdmin
        );

        // Update state with the download URL from Firebase
        setVideo(downloadURL);
        onVideoSelect && onVideoSelect(downloadURL);
      } catch (error) {
        console.error("Error uploading video:", error);
        alert("Failed to upload video. Please try again.");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <Surface
      mode="elevated"
      elevation={1}
      style={[
        {
          padding: 16,
        },
        style,
      ]}
    >
      <Text variant="labelLarge" style={{ marginBottom: 8 }}>
        {label}
      </Text>

      {uploading ? (
        <View
          style={{
            width: 200,
            height: 150,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 10 }}>Uploading video...</Text>
        </View>
      ) : video ? (
        <View>
          <Video
            source={{ uri: video }}
            style={{ width: "100%", height: 200, objectFit: "contain" }}
            videoStyle={{
              height: "100%",
              width: "100%",
              objectFit: "contain",
            }}
            useNativeControls
            resizeMode="contain"
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 8,
            }}
          >
            <IconButton
              icon="video-plus"
              mode="contained-tonal"
              onPress={pickVideo}
            />
            <IconButton
              icon="delete"
              mode="contained-tonal"
              onPress={() => {
                setVideo(null);
                onVideoSelect && onVideoSelect(null);
              }}
            />
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={pickVideo}
          style={{
            borderWidth: 1,
            borderColor: theme.colors.outline,
            borderStyle: "dashed",
            padding: 16,
            alignItems: "center",
            height: 150,
            justifyContent: "center",
          }}
        >
          <IconButton
            icon="video-plus"
            size={32}
            iconColor={theme.colors.primary}
          />
          <Text variant="bodyMedium">Choose Video</Text>
        </TouchableOpacity>
      )}
    </Surface>
  );
};
