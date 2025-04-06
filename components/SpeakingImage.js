"use client";

import { useState, useEffect } from "react";
import { View, Image, StyleSheet, Animated } from "react-native";
import { Text, useTheme } from "react-native-paper";

export const SpeakingImage = ({
  imageSrc,
  message,
  position = "right",
  delay = 0,
  duration = 300,
  style,
  imageStyle,
  bubbleStyle,
}) => {
  const [animation] = useState(new Animated.Value(0));
  const theme = useTheme();

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: duration,
      delay: delay,
      useNativeDriver: false,
    }).start();
  }, []);

  const getBubbleStyle = () => {
    switch (position) {
      case "left":
        return {
          right: "100%",
          marginRight: 10,
          transform: [
            {
              translateX: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        };
      case "right":
        return {
          left: "100%",
          marginLeft: 10,
          transform: [
            {
              translateX: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        };
      case "top":
        return {
          bottom: "100%",
          marginBottom: 10,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        };
      case "bottom":
        return {
          top: "100%",
          marginTop: 10,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        };
    }
  };

  const getArrowStyle = () => {
    switch (position) {
      case "left":
        return [styles.arrow, styles.arrowRight];
      case "right":
        return [styles.arrow, styles.arrowLeft];
      case "top":
        return [styles.arrow, styles.arrowBottom];
      case "bottom":
        return [styles.arrow, styles.arrowTop];
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Image
        source={imageSrc}
        style={[styles.image, imageStyle]}
        resizeMode="contain"
      />

      <Animated.View
        style={[
          styles.bubble,
          getBubbleStyle(),
          { backgroundColor: theme.colors.surface },
          bubbleStyle,
        ]}
      >
        <View
          style={[getArrowStyle(), { borderColor: theme.colors.surface }]}
        />
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
          {message}
        </Text>
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
    borderRadius: 10,
    width: "max-content",
    elevation: 2,
    zIndex: 2,
  },
  arrow: {
    position: "absolute",
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderWidth: 8,
    borderColor: "transparent",
  },
  arrowLeft: {
    right: "100%",
    top: "50%",
    marginTop: -8,
    borderRightWidth: 8,
  },
  arrowRight: {
    left: "100%",
    top: "50%",
    marginTop: -8,
    borderLeftWidth: 8,
  },
  arrowBottom: {
    top: "100%",
    left: "50%",
    marginLeft: -8,
    borderTopWidth: 8,
  },
  arrowTop: {
    bottom: "100%",
    left: "50%",
    marginLeft: -8,
    borderBottomWidth: 8,
  },
});
