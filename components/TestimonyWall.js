"use client";

import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { Keyframe, Easing } from "react-native-reanimated";
import { WallBrick } from "./WallBrick";

const Sections = Object.freeze({
  A: "A",
  B: "B",
});

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

//size
const brickMargin = 8;
const baseBrickWidth = 200; // Base width of each brick without margin
const baseBrickHeight = 200;
const fullBrickWidth = baseBrickWidth + brickMargin; // Width of each brick
const fullBrickHeight = baseBrickHeight + brickMargin;
//fit
const bricksThatFitPerRow = Math.ceil(SCREEN_WIDTH / fullBrickWidth); // Number of bricks that can cover one row
const bricksThatFitPerColumn = Math.ceil(SCREEN_HEIGHT / fullBrickHeight);

//adjust brick
const brickWidth = SCREEN_WIDTH / bricksThatFitPerRow - brickMargin; // Width of each brick
const brickHeight = SCREEN_HEIGHT / bricksThatFitPerColumn - brickMargin; // Height of each brick, can be adjusted as needed
const rowCount = bricksThatFitPerColumn;

const rowWidth = bricksThatFitPerRow * brickWidth; // Total width of each row of bricks
const startPosition = SCREEN_WIDTH + brickWidth + brickMargin; // Start position for the animation, off-screen to the right
const bricksPerRow = bricksThatFitPerRow + 1; // Total bricks per row including the offset for the animation

export const TestimonyWall = ({ testimonies }) => {
  // State to store the brick data
  const [brickData, setBrickData] = useState([]);

  // Generate brick data once when the component mounts
  useEffect(() => {
    const generateInitialBrickData = () => {
      return Array(rowCount)
        .fill(0)
        .map((_, rowIndex) =>
          Array(bricksPerRow + 1) // Ensure enough bricks to cover the screen
            .fill(0)
            .map((_, brickIndex) => ({
              type: Math.floor(Math.random() * 6), // Random brick type
              sepia: Math.random() * 0.5, // Random sepia value between 0 and 0.5
              flipX: Math.random() < 0.5, // Randomly flip the brick on the X-axis
              startAnimate: false,
              isAnimateAllowed:
                rowIndex % 2 === 0 &&
                (brickIndex === 0 || brickIndex === bricksPerRow - 1)
                  ? false
                  : true,
            }))
        );
    };

    setBrickData(generateInitialBrickData());
    animateBrick();
  }, [rowCount]);

  // Function to generate bricks using the stored brick data
  const generateBricks = () => {
    return brickData.map((row, rowIndex) => {
      const isEvenRow = rowIndex % 2 === 0;
      return (
        <View
          key={`row-${rowIndex}`}
          style={[
            styles.row,
            { marginLeft: isEvenRow ? -brickWidth / 2 : 0 }, // Offset for brick pattern
          ]}
        >
          {row.map((brick, brickIndex) => (
            <Animated.View
              key={`animated-brick-${rowIndex}-${brickIndex}`}
              // Apply animation only if brick.animate is true
              animate={false}
              entering={
                brick.isAnimateAllowed &&
                brick.startAnimate &&
                enteringAnimation
              }
            >
              <WallBrick
                brickType={brick.type}
                isFlipped={brick.flipX}
                style={{
                  width: brickWidth,
                  height: brickHeight,
                  filter: `sepia(${brick.sepia})`, // Use the stored sepia value
                }}
              />
            </Animated.View>
          ))}
        </View>
      );
    });
  };

  const animateBrick = () => {
    console.log(brickData);
  };

  const enteringAnimation = new Keyframe({
    0: {
      opacity: 1,
      transform: [
        { translateY: 50 },
        { rotate: "820deg" },
        { skewX: "0deg" },
        { scale: 0 },
      ],
    },
    50: {
      opacity: 0.5,
      transform: [
        { translateY: 25 },
        { rotate: "-180deg" },
        { skewX: "30deg" },
        { scale: 0.5 },
      ],
      easing: Easing.out(Easing.quad),
    },
    100: {
      opacity: 1,
      transform: [
        { translateY: 0 },
        { rotate: "0deg" },
        { skewX: "0deg" },
        { scale: 1 },
      ],
    },
  }).duration(1000);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container]}>
        {/* Section A */}
        <View style={styles.section}>{generateBricks()}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#421712",
    position: "relative", // To position the sections side by side
  },
  container: {
    flexDirection: "row",
    width: SCREEN_WIDTH, // Two sections side by side
    height: "100%",
  },
  section: {
    width: rowWidth,
    height: "100%",
  },
  row: {
    flexDirection: "row",
    height: brickHeight,
    marginVertical: brickMargin / 2,
  },
});
