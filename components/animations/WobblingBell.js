import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  Easing,
} from "react-native-reanimated";

export const WobblingBell = ({
  imageSrc,
  style,
  size = 40,
  wobbleDelay = 2000,
  startingDelay = 0,
  children,
}) => {
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotation.value}deg`,
        },
      ],
    };
  });

  useEffect(() => {
    // Initial delay before starting the wobble cycle
    const timer = setTimeout(() => {
      startWobble();
    }, startingDelay);

    const startWobble = () => {
      rotation.value = withDelay(
        wobbleDelay, // wait before each ring
        withRepeat(
          withSequence(
            withTiming(-15, { duration: 100, easing: Easing.linear }),
            withTiming(15, { duration: 100, easing: Easing.linear }),
            withTiming(-10, { duration: 100, easing: Easing.linear }),
            withTiming(10, { duration: 100, easing: Easing.linear }),
            withTiming(0, { duration: 100, easing: Easing.linear })
          ),
          1,
          false,
          () => {
            startWobble(); // loop again after current wobble
          }
        )
      );
    };

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [startingDelay, wobbleDelay]);

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.ringBox, animatedStyle]}>
        {imageSrc ? (
          <Image
            source={imageSrc}
            style={[styles.image, { width: size, height: size }]}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.text}>🔔</Text>
        )}
      </Animated.View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  ringBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    aspectRatio: 1,
  },
  text: {
    fontSize: 60,
  },
});
