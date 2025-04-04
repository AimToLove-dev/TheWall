"use client";

import { useEffect } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

/**
 * A simplified SpeakingImage component that shows a speech bubble next to an image
 */
export const SpeakingImage = ({
  source,
  imageStyle,
  message,
  position = "left",
  delay = 0,
  duration = 10000,
}) => {
  // Animation value for opacity
  const opacity = useSharedValue(0);

  // Set up the animation
  useEffect(() => {
    // Show the bubble after delay
    const showTimeout = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 300 });

      // Hide the bubble after duration
      const hideTimeout = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 });
      }, duration);

      return () => clearTimeout(hideTimeout);
    }, delay);

    return () => clearTimeout(showTimeout);
  }, [delay, duration]);

  // Animated style for the bubble
  const bubbleStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  // Determine position styles
  const getBubbleStyle = () => {
    if (position === "left") {
      return styles.bubbleLeft;
    } else if (position === "right") {
      return styles.bubbleRight;
    } else if (position === "top") {
      return styles.bubbleTop;
    } else {
      return styles.bubbleBottom;
    }
  };

  // Determine arrow styles
  const getArrowStyle = () => {
    if (position === "left") {
      return styles.arrowRight;
    } else if (position === "right") {
      return styles.arrowLeft;
    } else if (position === "top") {
      return styles.arrowBottom;
    } else {
      return styles.arrowTop;
    }
  };

  return (
    <View style={styles.container}>
      {/* The image */}
      <Image
        source={source}
        style={[styles.image, imageStyle]}
        resizeMode="contain"
      />

      {/* The speech bubble */}
      <Animated.View style={[styles.bubble, getBubbleStyle(), bubbleStyle]}>
        <View style={[styles.arrow, getArrowStyle()]} />
        <Text style={styles.message}>{message}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 60,
    height: 60,
  },
  bubble: {
    position: "absolute",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    width: "max-content",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 2,
  },
  message: {
    fontSize: 14,
    color: "#333",
  },
  // Bubble positions
  bubbleLeft: {
    right: "100%",
    top: "50%",
    transform: [{ translateY: -20 }],
    marginRight: 15,
  },
  bubbleRight: {
    left: "100%",
    top: "50%",
    transform: [{ translateY: -20 }],
    marginLeft: 15,
  },
  bubbleTop: {
    bottom: "100%",
    marginBottom: 15,
  },
  bubbleBottom: {
    top: "100%",
    marginTop: 15,
  },
  // Arrow styles
  arrow: {
    position: "absolute",
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderWidth: 8,
    borderColor: "transparent",
  },
  arrowRight: {
    left: "100%",
    top: 12,
    borderLeftColor: "white",
    borderRightWidth: 0,
  },
  arrowLeft: {
    right: "100%",
    top: 12,
    borderRightColor: "white",
    borderLeftWidth: 0,
  },
  arrowBottom: {
    top: "100%",
    left: "50%",
    marginLeft: -8,
    borderTopColor: "white",
    borderBottomWidth: 0,
  },
  arrowTop: {
    bottom: "100%",
    left: "50%",
    marginLeft: -8,
    borderBottomColor: "white",
    borderTopWidth: 0,
  },
});
