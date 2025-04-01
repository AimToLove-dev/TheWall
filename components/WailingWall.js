"use client";

import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated, Dimensions, Easing } from "react-native";
import { WallBrick } from "./WallBrick";

const Sections = Object.freeze({
  A: "A",
  B: "B",
});

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const duration = 10000; // Duration for the entire wall animation
const brickMargin = 8;
const baseBrickWidth = 150; // Base width of each brick without margin
const fullBrickWidth = baseBrickWidth + brickMargin; // Width of each brick
const bricksPerRow = Math.ceil(SCREEN_WIDTH / fullBrickWidth); // Number of bricks that can cover one row
const brickWidth = SCREEN_WIDTH / bricksPerRow - brickMargin; // Width of each brick
const rowWidth = bricksPerRow * brickWidth; // Total width of each row of bricks
const startPosition = SCREEN_WIDTH + brickWidth + brickMargin; // Start position for the animation, off-screen to the right

export const WailingWall = ({ rowCount = 7 }) => {
  const animIN = useRef(new Animated.Value(startPosition)).current;
  const animOUT = useRef(new Animated.Value(0)).current;

  const [activeAnimationA, setActiveAnimationA] = useState(animIN);
  const [activeAnimationB, setActiveAnimationB] = useState(animOUT);

  // State to store the brick data
  const [brickData, setBrickData] = useState([]);

  // Generate brick data once when the component mounts
  useEffect(() => {
    const generateInitialBrickData = () => {
      return Array(rowCount)
        .fill(0)
        .map(() =>
          Array(bricksPerRow + 1) // Ensure enough bricks to cover the screen
            .fill(0)
            .map(() => ({
              type: Math.floor(Math.random() * 6), // Random brick type
              sepia: Math.random() * 0.5, // Random sepia value between 0 and 0.5
            }))
        );
    };

    setBrickData(generateInitialBrickData());
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
            <WallBrick
              key={`brick-${rowIndex}-${brickIndex}`}
              brickType={brick.type}
              style={{
                width: brickWidth,
                filter: `sepia(${brick.sepia})`, // Use the stored sepia value
              }}
            />
          ))}
        </View>
      );
    });
  };

  useEffect(() => {
    const AnimateIN = (section, startX, dur) => {
      animIN.setValue(startX);

      Animated.timing(animIN, {
        toValue: 0,
        duration: dur, // Duration for the entire wall animation
        easing: Easing.linear, // Linear easing for a constant speed
        useNativeDriver: true,
      }).start(() => {
        // Switch the active animation from A to B
        if (section === Sections.A) {
          setActiveAnimationA(animOUT);
          AnimateOUT(Sections.A, 0, duration);

          setActiveAnimationB(animIN);
          AnimateIN(Sections.B, startPosition, duration);
        }
      });
    };

    const AnimateOUT = (section, startX, dur) => {
      animOUT.setValue(startX);

      Animated.timing(animOUT, {
        toValue: -startPosition,
        duration: dur, // Duration for the entire wall animation
        easing: Easing.linear, // Linear easing for a constant speed
        useNativeDriver: true,
      }).start(() => {
        if (section === Sections.A) {
          setActiveAnimationA(animIN);
          AnimateIN(Sections.A, startPosition, duration);

          setActiveAnimationB(animOUT);
          AnimateOUT(Sections.B, 0, duration);
        }
      });
    };

    AnimateIN(Sections.A, startPosition, duration);
    AnimateOUT(Sections.B, 0, duration);

    return () => animIN.stop(); // Cleanup on unmount
  }, []);

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateX: activeAnimationA }],
          },
        ]}
      >
        {/* Section A */}
        <View style={styles.section}>{generateBricks()}</View>
      </Animated.View>

      <Animated.View
        style={[
          styles.container,
          {
            position: "absolute",
            transform: [{ translateX: activeAnimationB }],
          },
        ]}
      >
        {/* Section B */}
        <View style={[styles.section]}>{generateBricks()}</View>
      </Animated.View>
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
    height: 60,
    marginVertical: 2,
  },
});
