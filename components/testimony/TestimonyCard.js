import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Platform,
} from "react-native";
import { SubtitleText, BodyText, HeaderText } from "components/Typography";
import { spacing } from "styles/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - spacing.md * 2; // Full width with padding

export const TestimonyCard = ({ item, index, onPress }) => {
  if (!item) return null;

  const [expanded, setExpanded] = useState(false);

  // Get the testimony text
  const fullText = item.testimony || "";
  const previewText = fullText
    ? fullText.substring(0, 150) + (fullText.length > 150 ? "..." : "")
    : "";

  // Function to toggle expanded state
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <ImageBackground
      source={require("assets/paper.jpg")}
      style={styles.backgroundImage}
      resizeMode="repeat"
    >
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress(item)}
        activeOpacity={0.9}
      >
        <View style={[styles.cardContent]}>
          {/* Header with title and name */}
          <View style={styles.headerContainer}>
            <HeaderText style={styles.title}>
              {item.title || "My Testimony"}
            </HeaderText>
            <BodyText style={styles.nameText}>
              By {item.displayName || "Anonymous"}
            </BodyText>
          </View>

          {/* Images and video grid - 3 columns */}
          <View style={styles.mediaGrid}>
            {/* Before Image */}
            <View style={styles.columnContainer}>
              {item.beforeImage ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: item.beforeImage }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                  <View style={styles.imageLabel}>
                    <Text style={styles.imageLabelText}>Before</Text>
                  </View>
                </View>
              ) : (
                <View style={[styles.image, styles.placeholderContainer]}>
                  <Text style={styles.placeholderText}>Before</Text>
                </View>
              )}
            </View>

            {/* After Image */}
            <View style={styles.columnContainer}>
              {item.afterImage ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: item.afterImage }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                  <View style={styles.imageLabel}>
                    <Text style={styles.imageLabelText}>After</Text>
                  </View>
                </View>
              ) : (
                <View style={[styles.image, styles.placeholderContainer]}>
                  <Text style={styles.placeholderText}>After</Text>
                </View>
              )}
            </View>

            {/* Video thumbnail */}
            <View style={styles.columnContainer}>
              {item.video || item.videoUrl || item.videoUri ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={{
                      uri: item.video || item.videoUrl || item.videoUri,
                    }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                  <View style={styles.playButtonContainer}>
                    <View style={styles.playButton}>
                      <Text style={styles.playIcon}>▶</Text>
                    </View>
                  </View>
                  <View style={styles.imageLabel}>
                    <Text style={styles.imageLabelText}>Video</Text>
                  </View>
                </View>
              ) : (
                <View style={[styles.image, styles.placeholderContainer]}>
                  <Text style={styles.placeholderText}>Video</Text>
                </View>
              )}
            </View>
          </View>

          {/* Testimony text container - 2 columns newspaper style */}
          <View style={styles.textContainer}>
            <View
              style={[
                styles.testimonyText,
                expanded ? styles.expandedText : styles.collapsedText,
              ]}
            >
              <View style={styles.newspaperColumns}>
                <BodyText style={styles.testimonyContent}>
                  <Text style={styles.firstLetter}>
                    {previewText.charAt(0)}
                  </Text>
                  {expanded ? fullText.substring(1) : previewText.substring(1)}
                </BodyText>
              </View>

              {!expanded && <View style={styles.textGradient}></View>}
            </View>

            {/* Read more button */}
            <TouchableOpacity
              onPress={toggleExpanded}
              style={styles.readMoreButton}
            >
              <Text style={styles.readMoreText}>
                {expanded ? "Show less" : "View Full Testimony"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    overflow: "hidden",
    marginBottom: spacing.md,

    boxShadow:
      "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgb(0 0 0 / 44%) 0px 30px 60px -30px, rgb(6 24 44 / 69%) 0px 0px 0px 1px, rgb(6 24 44 / 80%) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset",

    // add box shadow
  },
  cardContent: {
    padding: spacing.md,
  },
  headerContainer: {
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#888", // Newspaper style divider
    paddingBottom: spacing.xs,
  },
  title: {
    fontFamily: "serif", // Newspaper style font
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  nameText: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#555",
  },
  mediaGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  columnContainer: {
    width: "32%", // Slightly less than 1/3 to account for margins
  },
  imageContainer: {
    position: "relative",
    aspectRatio: 1, // Square aspect ratio for consistency
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderContainer: {
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#777",
    fontSize: 14,
  },
  imageLabel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  imageLabelText: {
    color: "white",
    fontSize: 12,
  },
  playButtonContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    color: "white",
    fontSize: 20,
  },
  textContainer: {
    marginTop: spacing.xs,
  },
  testimonyText: {
    position: "relative",
  },
  newspaperColumns: {
    columnCount: 2,
    columnGap: 16,
  },
  testimonyContent: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
    textAlign: "justify",
    letterSpacing: 0.2, // Newspaper style text
  },
  firstLetter: {
    fontSize: 22,
    fontWeight: "bold",
  },
  collapsedText: {
    maxHeight: 200,
    overflow: "hidden",
  },
  expandedText: {
    maxHeight: undefined,
  },

  readMoreButton: {
    alignSelf: "flex-end",
    marginTop: spacing.xs,
  },
  readMoreText: {
    fontStyle: "italic",
    color: "#333",
    fontSize: 12,
    textDecorationLine: "underline",
  },
});

export default TestimonyCard;
