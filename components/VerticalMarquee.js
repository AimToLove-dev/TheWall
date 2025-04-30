import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";

// Vertical Marquee Implementation - Modified for speed-based scrolling
const TranslatedElement = ({
  index,
  children,
  offset,
  contentHeight,
  cycleCount,
}) => {
  // Log when this specific element cycles
  const prevIndexRef = useRef(index);

  useEffect(() => {
    if (cycleCount > 0 && prevIndexRef.current !== index) {
      prevIndexRef.current = index;
    }
  }, [cycleCount, index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      top: (index - 1) * contentHeight,
      transform: [
        {
          translateY: -offset.value,
        },
      ],
      height: contentHeight,
      overflow: "hidden",
    };
  });

  return (
    <Animated.View style={[styles.animatedStyle, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

const ChildrenScroller = ({ speed, contentHeight, children }) => {
  const offset = useSharedValue(0);
  const [cycleCount, setCycleCount] = useState(0);
  const lastCycleRef = useRef(-1);
  const lastFrameTimestamp = useRef(null);

  // Use a frame callback for smooth animation
  useFrameCallback((i) => {
    // If this is the first frame or we're resuming from pause
    if (lastFrameTimestamp.current === null) {
      lastFrameTimestamp.current = i.timestamp;
      return;
    }

    // Only update animation if speed is not zero
    if (speed > 0) {
      // Calculate time passed since the last frame (in milliseconds)
      const timePassed = i.timestamp - lastFrameTimestamp.current;

      // Calculate pixels to move based on speed (pixels per second)
      const pixelsToMove = (speed * timePassed) / 1000;

      // Previous offset value for cycle detection
      const prevOffset = offset.value;

      // Move the content upward
      offset.value += pixelsToMove;

      // Check if we've completed a cycle
      if (
        prevOffset > 0.9 * contentHeight &&
        offset.value % contentHeight < 0.1 * contentHeight
      ) {
        const currentCycle = Math.floor(offset.value / contentHeight);
        if (currentCycle !== lastCycleRef.current) {
          setCycleCount((prev) => prev + 1);
          lastCycleRef.current = currentCycle;
        }
      }

      offset.value = offset.value % contentHeight;
    }

    // Always update the timestamp, even when paused
    lastFrameTimestamp.current = i.timestamp;
  }, true);

  // Reset timestamp when speed changes (to handle pause/resume)
  useEffect(() => {
    lastFrameTimestamp.current = null;
  }, [speed === 0]); // Only trigger when pausing state changes

  // Always use 3 elements for smooth looping
  const count = 3;
  const renderChild = (index) => (
    <TranslatedElement
      key={`clone-${index}`}
      index={index}
      offset={offset}
      contentHeight={contentHeight}
      cycleCount={cycleCount}
    >
      {children}
    </TranslatedElement>
  );

  return <>{Array.from({ length: count }, (_, i) => renderChild(i))}</>;
};

export const VerticalMarquee = ({
  speed = 25, // Default speed in pixels per second (instead of duration)
  children,
  style,
  contentHeight, // Direct contentHeight parameter
}) => {
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );

  // Ensure content height is at least 100vh (screen height)
  const effectiveContentHeight = Math.max(contentHeight || 0, screenHeight);

  // Update screen height when dimensions change
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenHeight(window.height);
    });

    return () => subscription?.remove();
  }, []);

  return (
    <View
      style={style}
      onLayout={(ev) => {
        setScreenHeight(ev.nativeEvent.layout.height);
      }}
      pointerEvents="box-none"
    >
      <ChildrenScroller speed={speed} contentHeight={effectiveContentHeight}>
        {children}
      </ChildrenScroller>
    </View>
  );
};

const styles = StyleSheet.create({
  animatedStyle: {
    position: "absolute",
    width: "100%",
  },
});
