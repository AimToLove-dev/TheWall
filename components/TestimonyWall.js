"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { WallBrick } from "./WallBrick";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Size
const brickMargin = 8;
const baseBrickWidth = 200; // Base width of each brick without margin
const baseBrickHeight = 200;
const fullBrickWidth = baseBrickWidth + brickMargin; // Width of each brick
const fullBrickHeight = baseBrickHeight + brickMargin;

// Fit
const bricksThatFitPerRow = Math.ceil(SCREEN_WIDTH / fullBrickWidth); // Number of bricks that can cover one row
const bricksThatFitPerColumn = Math.ceil(SCREEN_HEIGHT / fullBrickHeight);

// Adjust brick
const brickWidth = SCREEN_WIDTH / bricksThatFitPerRow - brickMargin; // Width of each brick
const brickHeight = SCREEN_HEIGHT / bricksThatFitPerColumn - brickMargin; // Height of each brick, can be adjusted as needed
const rowCount = bricksThatFitPerColumn;

const rowWidth = bricksThatFitPerRow * brickWidth; // Total width of each row of bricks
const bricksPerRow = bricksThatFitPerRow + 1; // Total bricks per row including the offset for the animation

// Animation constants
const ANIMATION_DELAY_BETWEEN_BRICKS = 300; // ms
const ANIMATION_DURATION = 800; // ms
const PAUSE_DURATION = 1500; // ms

export const TestimonyWall = () => {
  // State to store the brick data
  const [brickData, setBrickData] = useState([]);
  // State to track which bricks are visible
  const [visibleBricks, setVisibleBricks] = useState({});

  // Animation shared values - Initialize here to avoid conditional hook calls
  const brickAnimationValues = useRef({});

  // Generate brick data once when the component mounts
  useEffect(() => {
    const generateInitialBrickData = () => {
      // Create rows from bottom to top for animation purposes
      const rows = [];
      for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        const bricks = [];
        for (let brickIndex = 0; brickIndex < bricksPerRow; brickIndex++) {
          const brickId = `${rowIndex}-${brickIndex}`;

          // Initialize animation values for each brick
          brickAnimationValues.current[brickId] = {
            opacity: useSharedValue(0), // Start hidden
            translateX: useSharedValue(SCREEN_WIDTH), // Start off-screen
            translateY: useSharedValue(0),
            scale: useSharedValue(1),
          };

          bricks.push({
            id: brickId,
            type: Math.floor(Math.random() * 6), // Random brick type
            sepia: Math.random() * 0.5, // Random sepia value between 0 and 0.5
            flipX: Math.random() < 0.5, // Randomly flip the brick on the X-axis
          });
        }
        rows.push(bricks);
      }
      return rows.reverse(); // Reverse to start from bottom row
    };

    setBrickData(generateInitialBrickData());
  }, []);

  // Start animations when brick data is ready
  useEffect(() => {
    if (brickData.length > 0) {
      startAnimations();
    }
  }, [brickData]);

  // Function to mark a brick as visible
  const setBrickVisible = (brickId) => {
    setVisibleBricks((prev) => ({
      ...prev,
      [brickId]: true,
    }));
  };

  // Function to start the animations
  const startAnimations = () => {
    let totalDelay = 0;

    // Animate each row
    brickData.forEach((row, rowIndex) => {
      // Animate each brick in the row
      row.forEach((brick, brickIndex) => {
        // Calculate delay based on position
        // Bottom rows and edge bricks go first
        const isEdgeBrick = brickIndex === 0 || brickIndex === row.length - 1;
        const isEvenRow = rowIndex % 2 === 0;

        // Prioritize edge bricks on even rows
        const priorityFactor = isEvenRow && isEdgeBrick ? 0 : 1;
        const brickDelay =
          totalDelay + priorityFactor * ANIMATION_DELAY_BETWEEN_BRICKS;

        // Calculate final position
        const finalX =
          isEvenRow && brickIndex === 0
            ? -brickWidth / 2
            : isEvenRow && brickIndex === row.length - 1
            ? rowWidth - brickWidth / 2
            : brickIndex * brickWidth;

        // Start animation sequence
        animateBrick(brick, brickDelay, finalX);

        // Increment total delay for staggered effect
        totalDelay += ANIMATION_DELAY_BETWEEN_BRICKS / 2;
      });
    });
  };

  // Function to animate a single brick
  const animateBrick = (brick, delay, finalX) => {
    const animationValues = brickAnimationValues.current[brick.id];

    // Step 1: Make brick visible
    animationValues.opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 100 })
    );

    // Step 2: Animate to center of screen
    const centerX = SCREEN_WIDTH / 2 - brickWidth / 2;
    const centerY = SCREEN_HEIGHT / 2 - brickHeight / 2;

    // Calculate current Y position
    const currentRowIndex = Number.parseInt(brick.id.split("-")[0]);
    const currentY = currentRowIndex * brickHeight;

    // Animate to center
    animationValues.translateX.value = withDelay(
      delay + 100,
      withTiming(centerX, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      })
    );

    animationValues.translateY.value = withDelay(
      delay + 100,
      withTiming(centerY - currentY, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      })
    );

    // Make brick slightly larger in center
    animationValues.scale.value = withDelay(
      delay + 100,
      withTiming(1.2, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      })
    );

    // Step 3: Pause in center
    // Step 4: Animate to final position
    animationValues.translateX.value = withDelay(
      delay + 100 + ANIMATION_DURATION + PAUSE_DURATION,
      withTiming(finalX, {
        duration: ANIMATION_DURATION,
        easing: Easing.inOut(Easing.cubic),
      })
    );

    animationValues.translateY.value = withDelay(
      delay + 100 + ANIMATION_DURATION + PAUSE_DURATION,
      withTiming(0, {
        duration: ANIMATION_DURATION,
        easing: Easing.inOut(Easing.cubic),
      })
    );

    animationValues.scale.value = withDelay(
      delay + 100 + ANIMATION_DURATION + PAUSE_DURATION,
      withTiming(1, {
        duration: ANIMATION_DURATION,
        easing: Easing.inOut(Easing.cubic),
      })
    );

    // Mark brick as visible after animation completes
    setTimeout(() => {
      runOnJS(setBrickVisible)(brick.id);
    }, delay + 100 + ANIMATION_DURATION + PAUSE_DURATION + ANIMATION_DURATION);
  };

  // Memoize the animated styles for each brick
  const animatedStyles = useMemo(() => {
    const styles = {};

    if (brickData.length > 0) {
      brickData.forEach((row) => {
        row.forEach((brick) => {
          styles[brick.id] = useAnimatedStyle(() => {
            const animationValues = brickAnimationValues.current[brick.id];
            return {
              opacity: animationValues.opacity.value,
              transform: [
                { translateX: animationValues.translateX.value },
                { translateY: animationValues.translateY.value },
                { scale: animationValues.scale.value },
              ],
            };
          });
        });
      });
    }

    return styles;
  }, [brickData]);

  // Function to render the bricks
  const renderBricks = () => {
    return brickData.map((row, rowIndex) => {
      const isEvenRow = rowIndex % 2 === 0;

      return (
        <View
          key={`row-${rowIndex}`}
          style={[styles.row, { height: brickHeight }]}
        >
          {row.map((brick) => {
            // Get animated style for this brick
            const animatedStyle = animatedStyles[brick.id];

            return (
              <Animated.View key={brick.id} style={animatedStyle}>
                <WallBrick
                  brickType={brick.type}
                  isFlipped={brick.flipX}
                  style={{
                    width: brickWidth,
                    height: brickHeight,
                    filter: `sepia(${brick.sepia})`,
                  }}
                />
              </Animated.View>
            );
          })}
        </View>
      );
    });
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.section}>{renderBricks()}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backgroundColor: "#421712",
    position: "relative",
  },
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  section: {
    width: "100%",
    height: "100%",
  },
  row: {
    position: "relative",
    width: "100%",
    marginVertical: brickMargin / 2,
  },
});
