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
    <View>

    </View>
  );
};
