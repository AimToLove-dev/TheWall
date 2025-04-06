"use client";

import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Surface, IconButton, Text, useTheme } from "react-native-paper";
import { Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";

export const VideoUpload = ({
  onVideoSelect,
  initialVideo,
  style,
  label = "Upload Video",
  maxDuration = 60,
}) => {
  const [video, setVideo] = useState(initialVideo);
  const theme = useTheme();

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
      quality: 1,
    });

    if (!result.canceled) {
      setVideo(result.assets[0].uri);
      onVideoSelect && onVideoSelect(result.assets[0].uri);
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

      {video ? (
        <View>
          <Video
            source={{ uri: video }}
            style={{ width: 200, height: 150, borderRadius: 4 }}
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
            borderRadius: 4,
            padding: 16,
            alignItems: "center",
            width: 200,
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
