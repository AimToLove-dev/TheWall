"use client";

import { useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Surface, IconButton, Text, useTheme } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

export const MediaUpload = ({
  onImageSelect,
  initialImage,
  style,
  label = "Upload Image",
}) => {
  const [image, setImage] = useState(initialImage);
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
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      onImageSelect && onImageSelect(result.assets[0].uri);
    }
  };

  return (
    <Surface
      mode="elevated"
      elevation={1}
      style={[
        {
          padding: 16,
          borderRadius: 8,
        },
        style,
      ]}
    >
      <Text variant="labelLarge" style={{ marginBottom: 8 }}>
        {label}
      </Text>

      {image ? (
        <View>
          <Image
            source={{ uri: image }}
            style={{ width: 200, height: 150, borderRadius: 4 }}
          />
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
            borderRadius: 4,
            padding: 16,
            alignItems: "center",
            width: 200,
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
