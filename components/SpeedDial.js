"use client";

import { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Speed options
const SPEED_OPTIONS = [
  { id: "pause", label: "Pause", icon: "pause", value: 0 },
  { id: "slow", label: "0.5x", icon: "play-back", value: 0.5 },
  { id: "normal", label: "Play", icon: "play", value: 1 },
  { id: "fast", label: "2x", icon: "play-forward", value: 2 },
];

export const SpeedDial = ({ onSpeedChange, initialSpeed = 1 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState(
    SPEED_OPTIONS.find((option) => option.value === initialSpeed) ||
      SPEED_OPTIONS[2]
  );

  // Animation for the dial opening/closing
  const [animation] = useState(new Animated.Value(0));

  const toggleDial = () => {
    const toValue = isOpen ? 0 : 1;

    Animated.spring(animation, {
      toValue,
      friction: 6,
      useNativeDriver: true,
    }).start();

    setIsOpen(!isOpen);
  };

  const handleSpeedSelect = (option) => {
    setSelectedSpeed(option);
    onSpeedChange(option.value);
    toggleDial();
  };

  // Render the speed options when dial is open
  const renderSpeedOptions = () => {
    return SPEED_OPTIONS.map((option, index) => {
      // Calculate the position for each option button
      const offsetY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -60 * (index + 1)],
      });

      // Skip the currently selected option
      if (option.id === selectedSpeed.id) return null;

      return (
        <Animated.View
          key={option.id}
          style={[
            styles.optionButton,
            {
              transform: [{ translateY: offsetY }],
              opacity: animation,
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.button, styles.optionButtonInner]}
            onPress={() => handleSpeedSelect(option)}
          >
            <Ionicons name={option.icon} size={20} color="#fff" />
            <Text style={styles.optionLabel}>{option.label}</Text>
          </TouchableOpacity>
        </Animated.View>
      );
    });
  };

  return (
    <View style={styles.container}>
      {isOpen && (
        <TouchableOpacity
          style={styles.backdrop}
          onPress={toggleDial}
          activeOpacity={0}
        />
      )}

      {renderSpeedOptions()}

      <TouchableOpacity
        style={[styles.button, styles.mainButton]}
        onPress={toggleDial}
      >
        <Ionicons name={selectedSpeed.icon} size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    right: 20,
    alignItems: "center",
    zIndex: 999,
  },
  backdrop: {
    position: "absolute",
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000,
    backgroundColor: "transparent",
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  mainButton: {
    backgroundColor: "#B33A30",
  },
  optionButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  optionButtonInner: {
    backgroundColor: "#421712",
    flexDirection: "row",
    width: "auto",
    paddingHorizontal: 16,
  },
  optionLabel: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "500",
  },
});
