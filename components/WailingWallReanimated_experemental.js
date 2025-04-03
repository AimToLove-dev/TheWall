"use client";

import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated, Dimensions, Easing } from "react-native";
import { WallBrick } from "./WallBrick";
import { getAllSouls } from "../utils/firebaseUtils"; // Import the Firebase utility
import {
  withTiming,
  Easing as EasingRe,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

const Sections = Object.freeze({
  A: "A",
  B: "B",
});

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

//size
const brickMargin = 8;
const baseBrickWidth = 200; // Base width of each brick without margin
const baseBrickHeight = 80;
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

export const WailingWallReanimated = ({ speed }) => {
  const duration = useRef((startPosition / speed) * 1000).current;

  const animINOffset = useSharedValue(startPosition);
  const animOUTOffset = useSharedValue(0);

  const loopCountARef = useRef(0);
  const loopCountBRef = useRef(1);

  // State to store the paginated brick data
  const [paginatedBrickData, setPaginatedBrickData] = useState([]);

  // Fetch names from Firebase and generate brick data
  useEffect(() => {
    const fetchSouls = async () => {
      try {
        const souls = await getAllSouls(); // Fetch data from Firebase
        let soulNames = souls.map((soul) => soul.name); // Extract names

        // Ensure we have enough names to fill all sections
        const totalBricksPerSection = rowCount * bricksPerRow;
        const totalSections = Math.ceil(
          soulNames.length / totalBricksPerSection
        );

        // Fill with empty names if there are not enough names
        if (soulNames.length < totalBricksPerSection * totalSections) {
          const fill = Array(
            totalBricksPerSection * totalSections - soulNames.length
          ).fill("");
          soulNames = [...soulNames, ...fill];
        }

        // Shuffle the names
        soulNames = soulNames.sort(() => Math.random() - 0.5);

        // Paginate the names into chunks
        const chunkArray = (array, chunkSize) => {
          const chunks = [];
          for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
          }
          return chunks;
        };

        const paginatedData = chunkArray(soulNames, totalBricksPerSection).map(
          (chunk) =>
            chunk.map((name) => ({
              type: Math.floor(Math.random() * 6), // Random brick type
              sepia: Math.random() * 0.5, // Random sepia value between 0 and 0.5
              flipX: Math.random() < 0.5, // Randomly flip the brick on the X-axis
              name, // Use the name from the chunk
            }))
        );

        console.log("Paginated", paginatedData);

        setPaginatedBrickData(paginatedData);
      } catch (error) {
        console.error("Error fetching souls:", error);
      }
    };

    fetchSouls();
  }, [rowCount]);

  const generateBricksBySection = (section, sectionLoopCount) => {
    // Calculate the section index based on the loop count and section offset
    const sectionIndex = sectionLoopCount % paginatedBrickData.length;

    console.log(
      section,
      " Loop:",
      sectionLoopCount,
      "Loading Page:",
      sectionIndex
    );

    // Get the brick data for the calculated section index
    const brickData = paginatedBrickData[sectionIndex] || [];

    const rows = Array(rowCount)
      .fill(0)
      .map((_, rowIndex) => {
        const isEvenRow = rowIndex % 2 === 0;
        const rowStartIndex = rowIndex * bricksPerRow;
        const rowEndIndex = rowStartIndex + bricksPerRow;

        return (
          <View
            key={`row-${rowIndex}`}
            style={[
              styles.row,
              { marginLeft: isEvenRow ? -brickWidth / 2 : 0 }, // Offset for brick pattern
            ]}
          >
            {brickData
              .slice(rowStartIndex, rowEndIndex)
              .map((brick, brickIndex) => (
                <WallBrick
                  name={brick.name} // Use the fetched name
                  key={`brick-${rowIndex}-${brickIndex}`}
                  brickType={brick.type}
                  isFlipped={brick.flipX} // Use the stored flipX value
                  style={{
                    width: brickWidth,
                    height: brickHeight,
                    filter: `sepia(${brick.sepia})`, // Use the stored sepia value
                  }}
                />
              ))}
          </View>
        );
      });

    return rows;
  };

  useEffect(() => {
    const AnimateIN = (section, startX, dur) => {
      console.log("IN-- FROM::", startX, "  TO:", 0);
      animINOffset.value = startX;
      animINOffset.value = withTiming(
        0,
        {
          duration: dur, // Duration for the entire wall animation
          easing: EasingRe.linear, // Linear easing for a constant speed
        },
        () => {
          if (section === Sections.A) {
            // Switch the active animation from A to B
            loopCountBRef.current += 1;

            AnimateOUT(Sections.A, 0, duration);

            AnimateIN(Sections.B, startPosition, duration);
          }
        }
      );
    };

    const AnimateOUT = (section, startX, dur) => {
      console.log("OUT-- FROM::", startX, "  TO:", -startPosition);
      animOUTOffset.value = startX;
      animOUTOffset.value = withTiming(
        -startPosition,
        {
          duration: dur, // Duration for the entire wall animation
          easing: EasingRe.linear, // Linear easing for a constant speed
        },
        () => {
          if (section === Sections.A) {
            loopCountARef.current += 1;

            AnimateIN(Sections.A, startPosition, duration);
            AnimateOUT(Sections.B, 0, duration);
          }
        }
      );
    };

    AnimateIN(Sections.A, startPosition, duration);
    AnimateOUT(Sections.B, 0, duration);

    return () => {
      animINOffset.stop();
      animOUTOffset.stop();
    }; // Cleanup on unmount
  }, []);

  const isA_IN = useRef(true).current;
  const wallAStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: isA_IN.current ? animINOffset.value : animOUTOffset.value,
        },
      ],
    };
  }, [isA_IN]);

  const wallBStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: isA_IN.current ? animOUTOffset.value : animINOffset.value,
        },
      ],
    };
  }, [isA_IN]);

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.container, wallAStyle]}>
        {/* Section A */}
        <View style={styles.section}>
          {generateBricksBySection(Sections.A, loopCountARef.current)}
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.container,
          wallBStyle,
          {
            position: "absolute",
          },
        ]}
      >
        {/* Section B */}
        <View style={[styles.section]}>
          {generateBricksBySection(Sections.B, loopCountBRef.current)}
        </View>
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
    height: SCREEN_HEIGHT,
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
