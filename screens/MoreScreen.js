import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { ComingSoon } from "../components/ComingSoon";
import { useNavigation, useRoute } from "@react-navigation/native";
import { HeaderText, Footer } from "components";
import { getThemeColors } from "styles/theme";
import { getMorePageById } from "utils/configUtils";

// Import all possible icon assets explicitly to avoid dynamic require error
import connectIcon from "../assets/connect.png";
import eyeIcon from "../assets/eye.png";
import flameIcon from "../assets/flame.png";
import bellIcon from "../assets/bell.png";
import megaphoneIcon from "../assets/megaphone.png";
import giveIcon from "../assets/give.png";

// Map of icon names to their imported assets
const iconMap = {
  connect: connectIcon,
  eye: eyeIcon,
  flame: flameIcon,
  bell: bellIcon,
  megaphone: megaphoneIcon,
  give: giveIcon,
};

export const MoreScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const colors = getThemeColors();
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get pageId from route params or use direct pageData if provided
  const pageId = route.params?.pageId;
  const directPageData = route.params?.pageData;

  useEffect(() => {
    if (pageId) {
      // If only pageId is provided, fetch the page data
      loadPageData(pageId);
    } else {
      // No pageId or pageData provided
      setError("No page information provided");
      setIsLoading(false);
    }
  }, [pageId, directPageData]);

  const loadPageData = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getMorePageById(id);
      setPageData(data);
    } catch (error) {
      console.error("Error loading page data:", error);
      setError("Failed to load page content");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    navigation.navigate("Home");
  };

  // Get the appropriate icon
  const getPageIcon = () => {
    if (!pageData || !pageData.iconName) {
      return connectIcon; // default icon
    }

    return iconMap[pageData.iconName] || connectIcon;
  };

  // Custom header with logo
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <ImageBackground
          source={require("assets/brickSeamless.png")}
          style={styles.headerBackground}
          imageStyle={styles.headerBackgroundImage}
          resizeMode="repeat"
        >
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.logoContainer}
          >
            <Image
              source={require("../assets/TheWall.png")}
              style={styles.mastheadImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </ImageBackground>
      </View>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
        <Footer />
      </View>
    );
  }

  // Show error or "coming soon" if no page data is available
  if (error || !pageData || !pageData.embedUrl) {
    return (
      <ComingSoon
        title={pageData?.title || "PAGE UNAVAILABLE"}
        description={error || "This content is not currently available."}
        imageSrc={getPageIcon()}
        onGoBack={() => navigation.navigate("Home")}
      />
    );
  }

  // For web platform, use iframe
  if (Platform.OS === "web") {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <iframe
          src={pageData.embedUrl}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          title={pageData.title}
        />
        <Footer />
      </View>
    );
  }

  // For native platforms, import WebView dynamically to avoid errors on web
  try {
    const { WebView } = require("react-native-webview");
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <WebView
          source={{ uri: pageData.embedUrl }}
          style={styles.webview}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
        <Footer />
      </View>
    );
  } catch (error) {
    // Fallback for platforms where WebView is not supported
    return (
      <ComingSoon
        title={pageData.title}
        description={
          pageData.description ||
          "This content is currently only available on web."
        }
        imageSrc={getPageIcon()}
        onGoBack={() => navigation.navigate("Home")}
      />
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  webview: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    width: "100%",
    paddingTop: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    height: 60, // Total header height
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  headerBackground: {
    width: "100%",
    height: 200, // Background image is 200px tall (same as footer)
    justifyContent: "center",
    alignItems: "center",
  },
  headerBackgroundImage: {
    width: "100%",
    height: 200, // Ensure background image is 200px tall
  },
  logoContainer: {
    width: "100%",
    alignItems: "center",
  },
  mastheadImage: {
    width: "100%",
    maxWidth: 250,
    height: 40,
  },
});
