"use client";

import { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
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
  const inputRef = useRef(null);

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
            style={styles.input}
            value={soulName}
            onChangeText={setSoulName}
            placeholder="Lost Soul"
            placeholderTextColor="#999"
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            editable={!isSubmitting}
            autoCapitalize="words"
            maxLength={30}
          />
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!soulName.trim() || isSubmitting) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting || !soulName.trim()}
          >
            <Feather
              name="check"
              size={24}
              color={soulName.trim() && !isSubmitting ? "#fff" : "#999"}
            />
          </TouchableOpacity>
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
    borderRadius: 28,
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
    backgroundColor: "#fff",
    borderRadius: 30,
    width: 280,
    height: 50,
    alignItems: "center",
    paddingHorizontal: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 100,
    marginRight: 20,
    marginBottom: 10,
    paddingRight: 5,
  },
  input: {
    flex: 1,
    height: 40,
    color: "#333",
    fontSize: 16,
  },
  submitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4a6da7",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
});
