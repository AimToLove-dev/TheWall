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
    "The Spirit of the Sovereign Lord is on me, because the Lord has anointed me to proclaim good news to the poor. He has sent me to bind up the brokenhearted, to proclaim freedom for the captives and release from darkness for the prisoners, to proclaim the year of the Lord's favor and the day of vengeance of our God, to comfort all who mourn, and provide for those who grieve in Zion— to bestow on them a crown of beauty instead of ashes, the oil of joy instead of mourning, and a garment of praise instead of a spirit of despair. They will be called oaks of righteousness, a planting of the Lord for the display of his splendor.",

    "They will rebuild the ancient ruins and restore the places long devastated; they will renew the ruined cities that have been devastated for generations. Strangers will shepherd your flocks; foreigners will work your fields and vineyards. And you will be called priests of the Lord, you will be named ministers of our God. You will feed on the wealth of nations, and in their riches you will boast.",

    "Instead of your shame you will receive a double portion, and instead of disgrace you will rejoice in your inheritance. And so you will inherit a double portion in your land, and everlasting joy will be yours. For I, the Lord, love justice; I hate robbery and wrongdoing. In my faithfulness I will reward my people and make an everlasting covenant with them.",

    "Their descendants will be known among the nations and their offspring among the peoples. All who see them will acknowledge that they are a people the Lord has blessed. I delight greatly in the Lord; my soul rejoices in my God. For he has clothed me with garments of salvation and arrayed me in a robe of his righteousness, as a bridegroom adorns his head like a priest, and as a bride adorns herself with her jewels.",

    "For as the soil makes the sprout come up and a garden causes seeds to grow, so the Sovereign Lord will make righteousness and praise spring up before all nations.",
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
        const soul = souls[currentSoulIndex];
        // Check if the soul has a testimony ID and render it in red if it does
        const hasTestimony =
          soul.testimonyId !== null && soul.testimonyId !== undefined;

        wordGroups.push(
          <Text
            key={`soul-${currentSoulIndex}`}
            style={[
              styles.soulNameInText,
              hasTestimony && styles.soulNameWithTestimony,
            ]}
          >
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
      <ImageBackground
        source={require("../assets/paper.jpg")}
        style={styles.backgroundImage}
        resizeMode="repeat"
      >
        {createNewspaperContent()}
      </ImageBackground>
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

        setSouls(loadedSouls);
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

          setSouls(loadedSouls);
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
    setIsPaused((prev) => !prev);
  }, []);

  // Toggle bottom sheet function
  const toggleBottomSheet = useCallback(() => {
    setBottomSheetVisible((prev) => !prev);
  }, []);

  const calculateContentHeightMultiplier = (soulCount) => {
    return Math.max(1, soulCount / 10);
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
                duration={50000}
                isPaused={isPaused}
                contentHeightMultiplier={calculateContentHeightMultiplier(
                  souls.length
                )}
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
  newspaperText: {
    fontSize: 16,
    fontFamily: "XTypewriter-Regular",
    color: "rgba(0, 0, 0, 0.2)", // Much more transparent for lorem ipsum text
    lineHeight: 24,
    textAlign: "justify",
  },
  paragraphContainer: {
    padding: "1em",
    textAlign: "justify",
    boxShadow: "rgba(6, 24, 44, 0.8) 0px -10px 4px 0px inset",
  },
  soulNameInText: {
    fontSize: 18,
    fontFamily: "XTypewriter-Regular",
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 1)", // Fully opaque for soul names
    paddingHorizontal: 4,
  },
  soulNameWithTestimony: {
    color: "red", // Render names with testimony IDs in red
  },
  columnContainer: {
    width: "100%",
    alignItems: "center", // Center the column in the available space
    justifyContent: "center",
  },
});
