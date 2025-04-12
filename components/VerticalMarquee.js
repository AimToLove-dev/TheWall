import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";

// Vertical Marquee Implementation - Modified for twice screen height
const TranslatedElement = ({
  index,
  children,
  offset,
  screenHeight,
  cycleCount,
}) => {
  // Log when this specific element cycles
  const prevIndexRef = useRef(index);
  const contentHeight = screenHeight * 2; // Using double height for content

  useEffect(() => {
    if (cycleCount > 0 && prevIndexRef.current !== index) {
      console.log(
        `TranslatedElement ${prevIndexRef.current} moved to position ${index}`
      );
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

const ChildrenScroller = ({ duration, screenHeight, children, isPaused }) => {
  const contentHeight = screenHeight * 2; // Using double height for content
  const offset = useSharedValue(0);
  const [cycleCount, setCycleCount] = useState(0);
  const lastCycleRef = useRef(-1);

  // Use a frame callback for smooth animation
  useFrameCallback((i) => {
    // Only update animation if not paused
    if (!isPaused) {
      const timeSincePreviousFrame = i.timeSincePreviousFrame ?? 16;
      // Previous offset value
      const prevOffset = offset.value;

      // Move the content upward (negative value) - adjust for double height
      offset.value += (timeSincePreviousFrame * contentHeight) / duration;

      // Check if we've completed a cycle (when offset jumps from near contentHeight back to 0)
      if (
        prevOffset > 0.9 * contentHeight &&
        offset.value % contentHeight < 0.1 * contentHeight
      ) {
        const currentCycle = Math.floor(offset.value / contentHeight);
        if (currentCycle !== lastCycleRef.current) {
          console.log(
            "Element completed a cycle! Moving from end to beginning."
          );
          setCycleCount((prev) => prev + 1);
          lastCycleRef.current = currentCycle;
        }
      }

      offset.value = offset.value % contentHeight;
    }
  }, true);

  // Always use 3 elements for smooth looping (previous, current, next)
  const count = 3;
  const renderChild = (index) => (
    <TranslatedElement
      key={`clone-${index}`}
      index={index}
      offset={offset}
      screenHeight={screenHeight}
      cycleCount={cycleCount}
    >
      {children}
    </TranslatedElement>
  );

  return <>{Array.from({ length: count }, (_, i) => renderChild(i))}</>;
};

export const VerticalMarquee = ({
  duration = 3000,
  children,
  style,
  isPaused,
}) => {
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );

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
      <ChildrenScroller
        duration={duration}
        screenHeight={screenHeight}
        isPaused={isPaused}
      >
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
