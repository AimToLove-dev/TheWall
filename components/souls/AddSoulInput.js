"use client";

import { useState, useRef } from "react";
import {
  View,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { TextInput, HelperText, Button } from "react-native-paper";
import { addSoul } from "../../utils/soulsUtils";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
  useAnimatedKeyboard,
} from "react-native-reanimated";
import { SpeakingImage } from "../SpeakingImage"; // Ensure you have this component in your project
import { getThemeColors } from "styles/theme";

export const AddSoulInput = ({
  onSuccess,
  onError,
  userId = null,
  style,
  iconSource = require("assets/whale.png"), // Path to your PNG icon
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [soulName, setSoulName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const colors = getThemeColors();

  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 20,
      right: 20,
      alignItems: "flex-end",
      zIndex: 100,
    },
    backdrop: {
      position: "absolute",
      top: -1000,
      left: -1000,
      right: -1000,
      bottom: -1000,
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 99,
    },
    iconButton: {
      width: 56,
      height: 56,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 101,
      backgroundColor: "transparent",
    },
    icon: {
      width: 56,
      height: 56,
      resizeMode: "contain",
    },
    inputContainer: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      width: 280,
      height: 50,
      alignItems: "center",
      paddingHorizontal: 15,
      zIndex: 100,
      marginRight: 20,
      marginBottom: 10,
      paddingRight: 5,
    },
    input: {
      flex: 1,
      fontSize: 16,
      marginRight: 10,
      color: colors.text,
    },
    sendButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.primary,
    },
  });

  // Animation values
  const progress = useSharedValue(0);
  const keyboard = useAnimatedKeyboard();

  // Handle input container animation
  const inputContainerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      progress.value,
      [0, 1],
      [100, 0],
      Extrapolate.CLAMP
    );

    // Adjust position based on keyboard height
    const keyboardAdjustment =
      keyboard.height.value > 0
        ? -Math.min(keyboard.height.value * 0.5, 150)
        : 0;

    return {
      transform: [{ translateY: translateY + keyboardAdjustment }],
      opacity: progress.value,
    };
  });

  // Handle backdrop animation
  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value * 0.5,
    };
  });

  const toggleInput = () => {
    if (isOpen) {
      // Close the input
      progress.value = withTiming(0, { duration: 300 });
      setTimeout(() => {
        setIsOpen(false);
        setSoulName("");
        setError(null);
        Keyboard.dismiss();
      }, 300);
    } else {
      // Open the input
      setIsOpen(true);
      progress.value = withTiming(1, { duration: 300 });
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  const handleSubmit = async () => {
    if (!soulName.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const soulData = {
        name: soulName.trim(),
        userId,
        createdAt: new Date().toISOString(),
        status: "active",
      };

      const soulId = await addSoul(soulData);

      // Reset and close
      setSoulName("");
      toggleInput();

      if (onSuccess) {
        onSuccess(soulId, soulData);
      }
    } catch (error) {
      console.error("Error adding soul:", error);
      setError("Failed to add soul. Please try again.");
      if (onError) {
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {isOpen && (
        <TouchableWithoutFeedback onPress={toggleInput}>
          <Animated.View style={[styles.backdrop, backdropStyle]} />
        </TouchableWithoutFeedback>
      )}

      {isOpen && (
        <Animated.View style={[styles.inputContainer, inputContainerStyle]}>
          <TextInput
            ref={inputRef}
            value={soulName}
            onChangeText={setSoulName}
            placeholder="Enter name for prayer..."
            mode="outlined"
            error={!!error}
            left={<TextInput.Icon icon="account-heart" />}
            right={
              <TextInput.Icon
                icon="send"
                disabled={!soulName.trim() || isSubmitting}
                onPress={handleSubmit}
              />
            }
            onSubmitEditing={handleSubmit}
            returnKeyType="send"
            style={{ backgroundColor: colors.surface }}
          />
          {error && (
            <HelperText type="error" visible={!!error}>
              {error}
            </HelperText>
          )}
        </Animated.View>
      )}

      <TouchableOpacity
        style={styles.iconButton}
        onPress={toggleInput}
        disabled={isSubmitting}
      >
        <SpeakingImage
          source={iconSource}
          imageStyle={{ width: 70, height: 70 }}
          message="Add a loved one!"
          position="left"
          delay={10000}
          duration={10000}
        />
      </TouchableOpacity>
    </View>
  );
};
