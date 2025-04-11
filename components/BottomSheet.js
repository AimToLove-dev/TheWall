import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  withDelay,
  runOnJS,
} from "react-native-reanimated";

const BottomSheet = ({ isVisible, onClose, duration = 400, children }) => {
  // Create a shared value from the isVisible prop
  const isOpen = useSharedValue(isVisible);
  const height = useSharedValue(0);

  // Use derived value for smoother animation
  const progress = useDerivedValue(() =>
    withTiming(isOpen.value ? 0 : 1, { duration })
  );

  // Update isOpen when isVisible changes
  React.useEffect(() => {
    isOpen.value = isVisible;
  }, [isVisible]);

  // Animated styles for the backdrop and sheet
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    zIndex: isOpen.value
      ? 100
      : withDelay(duration, withTiming(-1, { duration: 0 })),
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * height.value }],
  }));

  return (
    <>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <TouchableOpacity style={styles.flex} onPress={onClose} />

        {/* Bottom Sheet */}
        <Animated.View
          onLayout={(e) => {
            height.value = e.nativeEvent.layout.height;
          }}
          style={[styles.sheet, sheetStyle]}
        >
          <View style={styles.handle} />
          {children}
        </Animated.View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  sheet: {
    padding: 16,
    paddingTop: 20,
    width: "100%",
    position: "fixed", // Changed from "fixed" to "absolute" for better React Native compatibility
    bottom: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: "white",
    zIndex: 2,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  flex: {
    flex: 1,
  },
  handle: {
    width: 75,
    height: 4,
    backgroundColor: "grey",
    alignSelf: "center",
    marginBottom: 10,
    borderRadius: 2,
  },
  // Removed the hidden style as we're using z-index and opacity now
});

export default BottomSheet;
