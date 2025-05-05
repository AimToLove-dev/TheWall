import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Dimensions,
} from "react-native";
import { ComingSoon } from "components/ComingSoon";
import { ScrollableScreenView } from "components/views/ScrollableScreenView";
import { DashboardHeader } from "components/dashboard/DashboardHeader";
import { useNavigation } from "@react-navigation/native";
import { fetchResourcesFromGoogleScript } from "utils/resourceUtils";
import { getThemeColors } from "styles/theme";

export const ResourcesScreen = () => {
  const navigation = useNavigation();
  const colors = getThemeColors();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const windowWidth = Dimensions.get("window").width;
  // Updated column logic: 2 columns by default, 3 on large screens
  const numColumns = Platform.OS === "web" ? (windowWidth >= 1200 ? 3 : 2) : 2;

  useEffect(() => {
    const loadResources = async () => {
      try {
        setLoading(true);
        const resourceData = await fetchResourcesFromGoogleScript();
        setResources(resourceData || []);
        setError(null);
      } catch (err) {
        console.error("Error loading resources:", err);
        setError("Failed to load resources. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  const handleBackPress = () => {
    navigation.navigate("Home");
  };

  const extractGoogleDriveFileId = (url) => {
    const fileIdRegex = /[-\w]{25,}/;
    const match = url.match(fileIdRegex);
    return match ? match[0] : null;
  };

  const isGoogleDriveUrl = (url) => {
    return url && url.includes("drive.google.com");
  };

  const handleOpenResource = (url) => {
    Linking.openURL(url).catch((err) => {
      console.error("Failed to open URL:", err);
      setError("Could not open this resource. The link might be invalid.");
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background || "#fff",
    },
    contentContainer: {
      flex: 1,
      padding: 20,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: colors.background || "#fff",
    },
    gridContainer: {
      paddingBottom: 20,
    },
    resourceCard: {
      borderWidth: 1,
      borderColor: colors.border || "#e0e0e0",
      borderRadius: 8,
      overflow: "hidden",
      backgroundColor: colors.cardBackground || "#f9f9f9",
      marginBottom: 16,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      flex: 1,
      margin: 8,
    },
    resourceHeader: {
      flexDirection: "row",
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border || "#e0e0e0",
      alignItems: "center",
    },
    resourceIcon: {
      fontSize: 24,
      marginRight: 12,
    },
    resourceDetails: {
      flex: 1,
    },
    resourceName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    resourceDate: {
      fontSize: 12,
      color: colors.textSecondary || "#666",
    },
    previewContainer: {
      width: "100%",
      aspectRatio: 1 / 1,
      backgroundColor: "#f0f0f0",
    },
    previewButton: {
      backgroundColor: colors.primary || "#3e477d",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 4,
    },
    previewButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 14,
      textAlign: "center",
    },
    cardActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border || "#e0e0e0",
    },
    noPreviewText: {
      padding: 16,
      textAlign: "center",
      color: colors.textSecondary || "#666",
    },
    loadingText: {
      marginTop: 10,
      color: colors.textSecondary || "#666",
    },
    errorText: {
      color: colors.error || "red",
      textAlign: "center",
      marginBottom: 20,
    },
    emptyText: {
      textAlign: "center",
      color: colors.textSecondary || "#666",
      marginTop: 30,
    },
    retryButton: {
      padding: 10,
      backgroundColor: colors.primary || "#3e477d",
      borderRadius: 5,
      marginTop: 15,
    },
    retryButtonText: {
      color: "#fff",
      fontWeight: "bold",
    },
  });

  const renderResourceItem = ({ item }) => {
    const getFileIcon = (mimeType) => {
      if (mimeType.includes("spreadsheet")) return "📊";
      if (mimeType.includes("document")) return "📄";
      if (mimeType.includes("presentation")) return "📑";
      if (mimeType.includes("pdf")) return "📕";
      if (mimeType.includes("image")) return "🖼️";
      if (mimeType.includes("video")) return "🎥";
      if (mimeType.includes("audio")) return "🎵";
      return "📁";
    };

    const isPreviewable = isGoogleDriveUrl(item.url);
    const fileId = isPreviewable ? extractGoogleDriveFileId(item.url) : null;

    return (
      <View style={styles.resourceCard}>
        <TouchableOpacity
          style={styles.resourceHeader}
          onPress={() => handleOpenResource(item.url)}
          accessible={true}
          accessibilityLabel={`Open ${item.name} resource in browser`}
        >
          <View style={styles.resourceDetails}>
            <Text style={styles.resourceName}>{item.name}</Text>
          </View>
        </TouchableOpacity>

        <>
          {isPreviewable && fileId ? (
            <View style={styles.previewContainer}>
              {Platform.OS === "web" ? (
                <iframe
                  src={`https://drive.google.com/file/d/${fileId}/preview`}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                  }}
                  title={item.name}
                  allow="autoplay"
                />
              ) : (
                (() => {
                  try {
                    const { WebView } = require("react-native-webview");
                    return (
                      <WebView
                        source={{
                          uri: `https://drive.google.com/file/d/${fileId}/preview`,
                        }}
                        style={{ flex: 1 }}
                        startInLoadingState={true}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        renderLoading={() => (
                          <View
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <ActivityIndicator
                              size="large"
                              color={colors.primary}
                            />
                          </View>
                        )}
                      />
                    );
                  } catch (error) {
                    return (
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.noPreviewText}>
                          Preview not available on this device
                        </Text>
                      </View>
                    );
                  }
                })()
              )}
            </View>
          ) : (
            <Text style={styles.noPreviewText}>
              Preview not available for this file type
            </Text>
          )}
        </>
      </View>
    );
  };

  // If loading show loading indicator
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading resources...</Text>
      </View>
    );
  }

  // If error show error message
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.retryButtonText}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // If no resources found, show ComingSoon component
  if (!resources || resources.length === 0) {
    return (
      <ComingSoon
        title="BE LOVE"
        description="Our mission is to empower Christians to love and evangelize the LGBTQ+ community with compassion and understanding. This platform will offer resources, training, and community support."
        imageSrc={require("assets/flame.png")}
        onGoBack={() => navigation.navigate("Home")}
      />
    );
  }

  // Default view - resource grid
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <DashboardHeader
          title="Resources"
          subtitle="Available materials and documents"
          onBackPress={handleBackPress}
          colors={colors}
          showSignOut={false}
        />

        <ScrollableScreenView>
          <FlatList
            data={resources}
            renderItem={renderResourceItem}
            keyExtractor={(item) => item.name}
            contentContainerStyle={styles.gridContainer}
            key={numColumns}
            numColumns={numColumns}
            columnWrapperStyle={
              numColumns > 1 ? { justifyContent: "space-between" } : null
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No resources currently available.
              </Text>
            }
          />
        </ScrollableScreenView>
      </View>
    </View>
  );
};
