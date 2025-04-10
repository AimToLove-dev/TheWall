import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
} from "react-native-reanimated";

const BottomSheet = ({ isVisible, onClose, duration = 400, children }) => {
  // Use a regular shared value instead of a derived value
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const [height, setHeight] = React.useState(0);
  const [display, setDisplay] = React.useState(false);

  // Update animation when visibility changes
  React.useEffect(() => {
    if (isVisible) {
      setDisplay(true);
      opacity.value = withTiming(1, { duration });
      translateY.value = withTiming(0, { duration });
    } else {
      opacity.value = withTiming(0, { duration });
      translateY.value = withTiming(1, { duration }, () => {
        runOnJS(setDisplay)(false);
      });
    }
  }, [isVisible, duration, opacity, translateY]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    display: display ? "flex" : "none",
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value * height }],
  }));

  return (
    <>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <TouchableOpacity style={styles.flex} onPress={onClose} />
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View
        onLayout={(e) => {
          setHeight(e.nativeEvent.layout.height);
        }}
        style={[styles.sheet, sheetStyle, !display && styles.hidden]}
      >
        <View style={styles.handle} />
        {children}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  sheet: {
    padding: 16,
    paddingTop: 20,
    width: "100%",
    position: "fixed",
    bottom: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: "white",
    zIndex: 2,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 1,
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
  hidden: {
    display: "none",
  },
});

export default BottomSheet;
