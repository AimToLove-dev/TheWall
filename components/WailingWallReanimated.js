import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { WallBrick } from "./WallBrick";
import { getAllSouls } from "../utils/firebaseUtils";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Brick Settings
const brickMargin = 8;
const brickWidth = 200;
const brickHeight = 80;
const fullBrickWidth = brickWidth + brickMargin;
const fullBrickHeight = brickHeight + brickMargin;

// Fit to Screen
const bricksPerRow = Math.ceil(SCREEN_WIDTH / fullBrickWidth);
const rowsPerColumn = Math.ceil(SCREEN_HEIGHT / fullBrickHeight);
const startPosition = SCREEN_WIDTH + fullBrickWidth;

export const WailingWall = ({ speed }) => {
  const xOffset = useSharedValue(startPosition);

  // Animate the bricks
  useEffect(() => {
    xOffset.value = withRepeat(
      withTiming(-startPosition, { duration: (startPosition / speed) * 1000 }),
      -1, // Infinite loop
      false
    );
  }, [speed]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: xOffset.value }],
  }));

  return (
    <Animated.View style={[styles.wall, animatedStyle]}>
      {Array(rowsPerColumn)
        .fill(0)
        .map((_, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {Array(bricksPerRow)
              .fill(0)
              .map((_, brickIndex) => (
                <WallBrick
                  key={`brick-${rowIndex}-${brickIndex}`}
                  style={{ width: brickWidth, height: brickHeight }}
                />
              ))}
          </View>
        ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wall: {
    position: "absolute",
    top: 0,
    height: SCREEN_HEIGHT,
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
  },
});
