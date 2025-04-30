"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  Pressable,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { BottomSheet, VerticalMarquee, WallButtons } from "components";
import { AddSoulForm } from "components";
import { getAllSouls } from "utils";

// Names component to display in a credits-style format
const NewspaperColumn = ({ souls }) => {
  const { width } = useWindowDimensions();

  // Create content with soul names in two columns, credits style
  const createNewspaperContent = () => {
    if (!souls || souls.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.noSoulsText}>Add names to the wall...</Text>
        </View>
      );
    }

    // Divide souls into left and right columns
    const leftColumnSouls = [];
    const rightColumnSouls = [];

    souls.forEach((soul, index) => {
      if (index % 2 === 0) {
        leftColumnSouls.push(soul);
      } else {
        rightColumnSouls.push(soul);
      }
    });

    return (
      <View style={styles.creditsContainer}>
        {/* Left column - right aligned */}
        <View style={styles.creditsColumn}>
          {leftColumnSouls.map((soul, index) => {
            const hasTestimony =
              soul.testimonyId !== null && soul.testimonyId !== undefined;

            return (
              <Text
                key={`left-${index}`}
                style={[
                  styles.leftColumnName,
                  hasTestimony && styles.soulNameWithTestimony,
                ]}
              >
                {soul.name}
              </Text>
            );
          })}
        </View>

        {/* Right column - left aligned */}
        <View style={styles.creditsColumn}>
          {rightColumnSouls.map((soul, index) => {
            const hasTestimony =
              soul.testimonyId !== null && soul.testimonyId !== undefined;

            return (
              <Text
                key={`right-${index}`}
                style={[
                  styles.rightColumnName,
                  hasTestimony && styles.soulNameWithTestimony,
                ]}
              >
                {soul.name}
              </Text>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.newspaperContainer, { width: "min(90vw,  400px)" }]}>
      <ImageBackground
        source={require("../assets/isaiah.png")}
        style={styles.backgroundImage}
        resizeMode="repeat"
      >
        {createNewspaperContent()}
      </ImageBackground>
    </View>
  );
};

export const WailingWallScreen = () => {
  const [scrollSpeed, setScrollSpeed] = useState(30); // Default speed of 30px/s
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [animationKey, setAnimationKey] = useState(0); // Key to force WallButtons to remount
  const navigation = useNavigation();

  // Add state for souls with proper loading
  const [souls, setSouls] = useState([]);

  // Fisher-Yates shuffle algorithm to randomize soul names
  const shuffleArray = (array) => {
    // Create a copy of the array to avoid mutating the original
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled;
  };

  // Load real souls from database
  useEffect(() => {
    const fetchSouls = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get all souls
        const loadedSouls = await getAllSouls();

        setSouls(shuffleArray(loadedSouls));
      } catch (err) {
        console.error("Error loading souls:", err);
        setError("Failed to load souls. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSouls();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchSouls = async () => {
        try {
          setIsLoading(true);
          setError(null);

          // Get all souls
          const loadedSouls = await getAllSouls();

          setSouls(shuffleArray(loadedSouls));
        } catch (err) {
          console.error("Error loading souls:", err);
          setError("Failed to load souls. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchSouls();
    }, [])
  );

  const handleSoulAdded = (newSoul) => {
    // Add the new soul to the list
    if (newSoul && newSoul.id) {
      // Add the new soul at the beginning for visibility
      setSouls((prevSouls) => [newSoul, ...prevSouls]);
    }

    // Close the bottom sheet after adding
    setBottomSheetVisible(false);
  };

  const handleTogglePause = useCallback(() => {
    setScrollSpeed((prevSpeed) => (prevSpeed === 0 ? 30 : 0)); // Toggle between 0 and 30
    setAnimationKey((prevKey) => prevKey + 1); // Increment animation key to restart animation
  }, []);

  // Toggle bottom sheet function
  const toggleBottomSheet = useCallback(() => {
    setBottomSheetVisible((prev) => !prev);
  }, []);

  // Calculate the actual content height in pixels
  const calculateContentHeight = (soulCount) => {
    const ROW_HEIGHT = 30; // Height per row in pixels
    const MARGIN = 4;
    // Calculate how many rows we need (half the total souls since we have 2 columns)
    const rowsNeeded = Math.ceil(soulCount / 2);

    // Calculate total height needed in pixels
    // Add some padding for better appearance
    return rowsNeeded * (ROW_HEIGHT + MARGIN);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/brickSeamless.png")}
        style={styles.backgroundImage}
        resizeMode="repeat"
      >
        <View style={styles.contentContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <Pressable
              onPress={handleTogglePause}
              style={styles.pressableContainer}
            >
              <VerticalMarquee
                style={styles.marqueeContainer}
                speed={scrollSpeed} // Speed in pixels per second instead of duration
                contentHeight={calculateContentHeight(souls.length)}
              >
                <View style={styles.columnContainer}>
                  <NewspaperColumn souls={souls} />
                </View>
              </VerticalMarquee>
            </Pressable>
          )}
        </View>
      </ImageBackground>
      {/* Wall Buttons - Both Back and Plus buttons */}
      <WallButtons
        key={animationKey} // Use animation key to force remount
        onPlusPress={toggleBottomSheet}
        backNavigateTo="Home"
        fadeAnimation={true}
      />
      {/* Bottom Sheet - rendered outside the ImageBackground for proper layering */}
      <BottomSheet isVisible={isBottomSheetVisible} onClose={toggleBottomSheet}>
        <View style={styles.bottomSheetContent}>
          <AddSoulForm
            onSuccess={handleSoulAdded}
            onCancel={toggleBottomSheet}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  marqueeContainer: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },
  namesContainer: {
    paddingVertical: 0,
  },
  nameItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  nameText: {
    fontSize: 24,
    color: "#333",
    textAlign: "center",
    fontFamily: "serif", // To match the newspaper style
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#333",
    textAlign: "center",
    fontSize: 18,
  },
  pressableContainer: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },
  plusButton: {
    position: "absolute",
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2e2e2e",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    flex: 1,
    zIndex: 0,
  },
  newspaperContainer: {
    height: "100%",
    overflow: "hidden",
    alignSelf: "center", // Center the column horizontally
    boxShadow: "rgba(6, 24, 44, 0.8) 0px 0 6px -1px",
  },
  creditsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  creditsColumn: {
    flex: 1,
    justifyContent: "flex-start",
  },
  leftColumnName: {
    textAlign: "right",
    fontSize: 18,
    fontFamily: "XTypewriter-Regular",
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 1)", // Fully opaque for soul names
    paddingRight: 12,
    height: 30, // Fixed row height
    lineHeight: 30, // Aligns text vertically in the center
    marginVertical: 2, // Small spacing between names
  },
  rightColumnName: {
    textAlign: "left",
    fontSize: 18,
    fontFamily: "XTypewriter-Regular",
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 1)", // Fully opaque for soul names
    paddingLeft: 12,
    height: 30, // Fixed row height
    lineHeight: 30, // Aligns text vertically in the center
    marginVertical: 2, // Small spacing between names
  },
  soulNameWithTestimony: {
    color: "red", // Render names with testimony IDs in red
  },
  noSoulsText: {
    fontSize: 18,
    fontFamily: "XTypewriter-Regular",
    fontStyle: "italic",
    color: "rgba(0, 0, 0, 0.5)", // Semi-transparent for no souls message
  },
  separator: {
    fontSize: 18,
    fontFamily: "XTypewriter-Regular",
    color: "rgba(0, 0, 0, 0.7)", // Slightly transparent for separator
  },
  columnContainer: {
    width: "100%",
    alignItems: "center", // Center the column in the available space
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 100,
  },
});
