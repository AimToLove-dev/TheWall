import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Animated, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BackButton } from "./BackButton";
import { useNavigation } from "@react-navigation/native";

export const WallButtons = ({
  onPlusPress,
  backNavigateTo = "Home",
  fadeAnimation = true,
}) => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Effect for button fade animation
  useEffect(() => {
    if (fadeAnimation) {
      // Start the fade animation
      Animated.timing(fadeAnim, {
        toValue: 0.2, // Fade to 20% opacity
        duration: 10000, // 10 seconds
        useNativeDriver: true,
      }).start();
    }

    return () => {
      // Reset animation when component unmounts
      fadeAnim.setValue(1);
    };
  }, [fadeAnimation, fadeAnim]);

  const handleBackPress = () => {
    if (fadeAnimation) {
      // Reset the opacity when button is pressed
      fadeAnim.setValue(1);
      // Start fade animation again
      Animated.timing(fadeAnim, {
        toValue: 0.2,
        duration: 10000,
        useNativeDriver: true,
      }).start();
    }

    // Navigate to specified screen
    navigation.navigate(backNavigateTo);
  };

  const handlePlusPress = () => {
    if (fadeAnimation) {
      // Reset the opacity when button is pressed
      fadeAnim.setValue(1);
      // Start fade animation again
      Animated.timing(fadeAnim, {
        toValue: 0.2,
        duration: 10000,
        useNativeDriver: true,
      }).start();
    }

    // Call the onPlusPress callback
    if (onPlusPress) {
      onPlusPress();
    }
  };

  return (
    <View>
      {/* Back Button with fade animation */}
      <Animated.View style={{ opacity: fadeAnimation ? fadeAnim : 1 }}>
        <BackButton customOnPress={handleBackPress} />
      </Animated.View>

      {/* Plus Button with fade animation */}
      <Animated.View style={{ opacity: fadeAnimation ? fadeAnim : 1 }}>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={handlePlusPress}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  plusButton: {
    position: "fixed",
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2e2e2e",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1,
  },
});
