"use client";

import { useState } from "react";
import { View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Surface, IconButton, Text, useTheme } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "../../config";
import { auth } from "../../config";

export const MediaUpload = ({
  onImageSelect,
  initialImage,
  style,
  label = "Upload Image",
}) => {
  const [image, setImage] = useState(initialImage);
  const [uploading, setUploading] = useState(false);
  const theme = useTheme();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setUploading(true);
      try {
        const localUri = result.assets[0].uri;
        // Upload to Firebase Storage
        const userId = auth.currentUser ? auth.currentUser.uid : "anonymous";
        const downloadURL = await uploadImage(localUri, userId);

        // Update state with the download URL from Firebase
        setImage(downloadURL);
        onImageSelect && onImageSelect(downloadURL);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
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
          <Text style={{ marginTop: 10 }}>Uploading...</Text>
        </View>
      ) : image ? (
        <View>
          <Image source={{ uri: image }} style={{ width: 200, height: 150 }} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 8,
            }}
          >
            <IconButton
              icon="image-edit"
              mode="contained-tonal"
              onPress={pickImage}
            />
            <IconButton
              icon="delete"
              mode="contained-tonal"
              onPress={() => {
                setImage(null);
                onImageSelect && onImageSelect(null);
              }}
            />
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={pickImage}
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
            icon="image-plus"
            size={32}
            iconColor={theme.colors.primary}
          />
          <Text variant="bodyMedium">Choose Image</Text>
        </TouchableOpacity>
      )}
    </Surface>
  );
};
