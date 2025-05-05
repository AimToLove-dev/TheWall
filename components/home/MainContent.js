import React, { useState, useEffect } from "react";
import { StyleSheet, Image, Text, View, Dimensions } from "react-native";
import { HeaderText, BodyText, WobblingBell } from "components";
import { fontSizes } from "styles/theme";
import { useNavigation } from "@react-navigation/native";
import { PageLinkBlock } from "./PageLinkBlock";
import { getAllMorePages } from "utils/configUtils";

export const MainContent = ({
  navigateToWailingWall,
  navigateToTestimonyWall,
}) => {
  const navigation = useNavigation();
  const [morePages, setMorePages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load the configured more pages on component mount
  useEffect(() => {
    loadMorePages();
  }, []);

  const loadMorePages = async () => {
    try {
      const pages = await getAllMorePages();
      setMorePages(pages);
    } catch (error) {
      console.error("Error loading more pages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToResources = () => {
    navigation.navigate("Resources");
  };

  // Navigate to a specific More page with its ID
  const navigateToMorePage = (pageId) => {
    navigation.navigate("More", { pageId });
  };

  // Get icon based on name
  const getIconByName = (iconName) => {
    return iconMap[iconName] || connectIcon;
  };

  // Dynamically render more page links
  const renderMorePageBlocks = () => {
    // Create chunks of 2 pages each
    const chunkedPages = [];
    for (let i = 0; i < morePages.length; i += 2) {
      chunkedPages.push(morePages.slice(i, i + 2));
    }

    // Return the dynamically configured blocks in rows of 2
    return chunkedPages.map((row, rowIndex) => (
      <View
        key={`row-${rowIndex}`}
        style={[
          styles.wallDescriptionsContainer,
          rowIndex > 0 ? { marginTop: 20 } : {},
        ]}
      >
        {row.map((page, index) => (
          <PageLinkBlock
            key={page.id}
            title={page.title.toUpperCase()}
            onPress={() => navigateToMorePage(page.id, page)}
            imageSrc={page.iconName}
            description={page.description || ""}
            style={{
              hidden: page.id === "empty" ? true : false,
              marginRight: index === 0 && row.length > 1 ? 10 : 0,
              marginLeft: index === 1 ? 10 : 0,
              flex: 1,
            }}
            accessibilityLabel={`Go to ${page.title}`}
            accessibilityHint={`Navigate to the ${page.title} page`}
            iconInButton={true}
          />
        ))}
        {/* If the row has only one element, add an empty view to maintain layout */}
        {row.length === 1 && <View style={{ flex: 1, marginLeft: 10 }} />}
      </View>
    ));
  };

  return (
    <View
      style={{
        marginHorizontal: "auto",
        width: "100%",
      }}
      accessibilityRole="main"
      accessible={true}
      accessibilityLabel="The Wall - A Holy Revolution for the LGBTQ+ Community"
    >
      {/* Header Image - Main Page Title (H1 equivalent) */}
      <View style={styles.headerImageContainer} accessibilityRole="header">
        <Image
          source={require("assets/header.png")}
          style={styles.headerImage}
          resizeMode="contain"
          accessible={true}
          accessibilityLabel="The Wall - Homepage Header"
        />
        <View style={styles.screenReaderOnly}>
          <Text accessibilityRole="heading" accessibilityLevel={1}>
            The Wall - A Holy Revolution
          </Text>
        </View>
      </View>

      {/* Introduction Section */}
      <View
        style={styles.introductionSection}
        accessibilityRole="region"
        accessible={true}
        accessibilityLabel="Our Mission Walls"
      >
        <View style={styles.screenReaderOnly}>
          <Text accessibilityRole="heading" accessibilityLevel={2}>
            Our Mission Walls
          </Text>
        </View>

        {/* Two wall descriptions */}
        <View style={styles.wallDescriptionsContainer}>
          {/* Wailing Wall description */}
          <PageLinkBlock
            title="Wailing Wall"
            onPress={navigateToWailingWall}
            imageSrc={require("assets/megaphone.png")}
            description="Submit names of loved ones in the LGBTQ+ community so we can intercede for them together in love and hope."
            style={{ marginRight: 10 }}
            startingDelay={0}
            accessibilityLabel="Go to Wailing Wall"
            accessibilityHint="Navigate to the Wailing Wall page"
          />

          {/* Testimony Wall description */}
          <PageLinkBlock
            title="Testimony Wall"
            onPress={navigateToTestimonyWall}
            imageSrc={require("assets/bell.png")}
            description="Share testimonies that reveal the real and tangible transformation brought by God's love."
            style={{ marginLeft: 10 }}
            startingDelay={1500}
            accessibilityLabel="Go to Testimony Wall"
            accessibilityHint="Navigate to the Testimony Wall page"
          />
        </View>
      </View>

      {/* Vision and Mission Section */}
      <View
        style={styles.contentContainer}
        accessibilityRole="region"
        accessible={true}
        accessibilityLabel="Our Vision and Mission"
      >
        <View style={styles.screenReaderOnly}>
          <Text accessibilityRole="heading" accessibilityLevel={2}>
            Our Vision and Mission
          </Text>
        </View>

        {/* 2 images side by side */}
        <View style={styles.imagesContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={require("assets/before.png")}
              style={[
                styles.columnImage,
                { filter: "grayscale(100%)", scale: "none" },
              ]}
              resizeMode="cover"
              accessible={true}
              accessibilityLabel="Before transformation image"
            />
            <Text style={styles.imageCaptionText}>MONET BEFORE CHRIST</Text>
          </View>
          <View style={styles.imageWrapper}>
            <Image
              source={require("assets/after.png")}
              style={[styles.columnImage, { scale: "none" }]}
              resizeMode="cover"
              accessible={true}
              accessibilityLabel="After transformation image"
            />
            <Text style={styles.imageCaptionText}>MONET AFTER ADOPTION</Text>
          </View>
        </View>

        {/* Title - Replaced text with image */}
        <View
          style={styles.p2pImageContainer}
          accessibilityRole="heading"
          accessibilityLevel={3}
        >
          <Image
            source={require("assets/p2p.png")}
            style={styles.p2pImage}
            resizeMode="contain"
            accessible={true}
            accessibilityLabel="Pain to Purpose"
          />
        </View>

        <BodyText style={styles.paragraph}>
          The Wall is a platform dedicated to sharing the transformative power
          of Jesus within the LGBTQ+ community. Through initiatives like the
          Wailing Wall and Testimony Wall, we aim to spark change as we pray
          corporately, share stories of spiritual renewal, and provide resources
          to support churches evangelists, and individuals.
        </BodyText>
        <BodyText style={styles.paragraph}>
          Partner with us in building a movement where everyone is welcomed,
          valued, and supported in discovering the love and truth of Christ.
        </BodyText>
      </View>

      {/* Dynamic "More" pages*/}
      <View
        style={{ marginTop: 40 }}
        accessibilityRole="navigation"
        accessible={true}
        accessibilityLabel="Quick Navigation"
      >
        {/* Dynamic More Pages */}
        {renderMorePageBlocks()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenReaderOnly: {
    position: "absolute",
    width: 1,
    height: 1,
    overflow: "hidden",
  },
  contentContainer: {
    width: "100%",
    marginVertical: 20,
  },
  imagesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    width: "100%",
  },
  imageWrapper: {
    flex: 1,
    aspectRatio: 1, // This ensures a square shape
    marginHorizontal: 5,
    overflow: "hidden", // This ensures the image doesn't overflow the wrapper
    alignItems: "center", // Center the caption text
  },
  columnImage: {
    width: "100%",
    height: "100%",
  },
  imageCaptionText: {
    textAlign: "center",
    fontSize: 12,
    color: "white",
    margin: 2,
    marginTop: -36,
    width: "97%",
    padding: 10,
    backgroundColor: "black",
    borderRadius: 8,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    fontFamily: "XTypewriter-Bold",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: fontSizes.medium,
    marginVertical: 10,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#000",
    marginVertical: 20,
  },
  paragraph: {
    marginTop: 10,
    textAlign: "justify",
    hyphens: "auto",
    color: "black",
  },
  verticalDivider: {
    width: 2,
    height: "100%",
    backgroundColor: "#000",
    marginHorizontal: 10,
    opacity: 0.7,
  },
  logoWithIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  sideIconContainer: {
    flex: 1,
    alignItems: "center",

    paddingVertical: 10,
  },
  sideIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  iconTitle: {
    fontSize: fontSizes.small,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "XTypewriter-Regular",
    letterSpacing: -0.5, // Condensed text spacing
  },
  iconSubtitle: {
    fontSize: fontSizes.xsmall || 12,
    fontWeight: "bold",
    textAlign: "justify", // Justified text alignment
    fontFamily: "XTypewriter-Bold",
    hyphens: "auto",
  },
  headerImageContainer: {
    width: "100%",
    marginBottom: 20,
  },
  headerImage: {
    width: "100%",
    height: "100%",
    aspectRatio: 16 / 9,
  },
  introductionSection: {
    marginVertical: 20,
  },
  wallDescriptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  wallDescriptionHeader: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 10,
  },
  wallIcon: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  wallTitleContainer: {
    flex: 1,
    width: "100%",
  },
  wallButton: {
    width: "100%",
    marginVertical: 5,
    minHeight: 44, // Ensure minimum height for the button
    justifyContent: "center",
  },
  wallTitle: {
    fontWeight: "bold",
    fontSize: "1em",
    textAlign: "left",
  },
  wallDescription: {
    fontSize: fontSizes.small,
    textAlign: "justify",
    fontFamily: "XTypewriter-Bold",
    hyphens: "auto",
    color: "black",
  },
  wallDescriptionDivider: {
    width: 1,
    backgroundColor: "#000",
    marginHorizontal: 10,
    opacity: 0.3,
    height: "75%",
    marginTop: "auto",
  },
  visitLink: {
    fontWeight: "bold",
    color: "#3e477d",
    textDecorationLine: "underline",
  },
  p2pImageContainer: {
    width: "100%",
    marginVertical: 0,
  },
  p2pImage: {
    width: "100%",
    height: "100%",
    aspectRatio: 7.5, // Adjust this based on actual image aspect ratio
  },
  sectionHeaderContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: fontSizes.medium,
    fontWeight: "bold",
    textAlign: "center",
  },
  actionButton: {
    width: "100%",
    marginVertical: 5,
    minHeight: 36, // Smaller than the wall buttons
    justifyContent: "center",
  },
});
