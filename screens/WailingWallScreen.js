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
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { BottomSheet, VerticalMarquee } from "components";
import { AddSoulForm, BackButton } from "components";
import { getAllSouls } from "../utils/soulsUtils";

// Names component to display in a newspaper-like format
const NewspaperColumn = ({ souls }) => {
  const { width } = useWindowDimensions();

  // Calculate column width based on screen size
  const getColumnWidth = () => {
    if (width < 600) {
      // Extra small/small screens (mobile) - 1/2 screen width
      return "50%";
    } else if (width < 960) {
      // Medium screens (tablets) - 1/3 screen width
      return "33%";
    } else {
      // Large screens (desktop) - 1/4 screen width
      return "25%";
    }
  };

  // Lorem ipsum paragraphs
  const loremIpsum = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.",
    "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
    "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.",
    "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
    ,
  ];

  // Create paragraphs with soul names injected
  const createNewspaperContent = () => {
    if (!souls || souls.length === 0) {
      return <Text style={styles.newspaperText}>{loremIpsum.join(" ")}</Text>;
    }

    // Create one long paragraph from all lorem ipsum text
    const longParagraph = loremIpsum.join(" ");
    const words = longParagraph.split(" ");
    const wordGroups = [];

    // Calculate interval to space out names evenly
    const interval = Math.floor(words.length / (souls.length + 1));

    // Insert names between words at calculated intervals
    let currentSoulIndex = 0;
    for (let i = 0; i < words.length; i++) {
      if (i > 0 && i % interval === 0 && currentSoulIndex < souls.length) {
        // Add a soul name
        wordGroups.push(
          <Text key={`soul-${currentSoulIndex}`} style={styles.soulNameInText}>
            {souls[currentSoulIndex].name}
          </Text>
        );
        currentSoulIndex++;
      }

      // Add the current word
      wordGroups.push(
        <Text key={`word-${i}`} style={styles.newspaperText}>
          {i > 0 ? " " : ""}
          {words[i]}
        </Text>
      );
    }

    return <Text style={styles.paragraphContainer}>{wordGroups}</Text>;
  };

  return (
    <View style={[styles.newspaperContainer, { width: getColumnWidth() }]}>
      {createNewspaperContent()}
    </View>
  );
};

export const WailingWallScreen = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const navigation = useNavigation();

  // Add state for souls with proper loading
  const [souls, setSouls] = useState([]);

  // Load real souls from database
  useEffect(() => {
    const fetchSouls = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get all souls
        const loadedSouls = await getAllSouls();

        // Filter only public souls
        const publicSouls = loadedSouls.filter(
          (soul) => soul.isPublic !== false
        );
        setSouls(publicSouls);
      } catch (err) {
        console.error("Error loading souls:", err);
        setError("Failed to load souls. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSouls();
  }, []);

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
    setIsPaused((prev) => !prev);
  }, []);

  // Toggle bottom sheet function
  const toggleBottomSheet = useCallback(() => {
    setBottomSheetVisible((prev) => !prev);
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/paper.jpg")}
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
                duration={50000}
                isPaused={isPaused}
              >
                <View style={styles.columnContainer}>
                  <NewspaperColumn souls={souls} />
                </View>
              </VerticalMarquee>
            </Pressable>
          )}
        </View>
      </ImageBackground>
      {/* Back Button */}
      <BackButton customOnPress={() => navigation.navigate("Home")} />
      {/* Plus Button */}
      <TouchableOpacity
        style={styles.plusButton}
        onPress={toggleBottomSheet}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
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
  },
  newspaperText: {
    fontSize: 16,
    fontFamily: "serif",
    color: "rgba(0, 0, 0, 0.2)", // Much more transparent for lorem ipsum text
    lineHeight: 24,
    textAlign: "justify",
  },
  paragraphContainer: {
    marginBottom: 12,
    textAlign: "justify",
  },
  soulNameInText: {
    fontSize: 18,
    fontFamily: "serif",
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 1)", // Fully opaque for soul names
    paddingHorizontal: 4,
  },
  columnContainer: {
    width: "100%",
    alignItems: "center", // Center the column in the available space
    justifyContent: "center",
  },
});
