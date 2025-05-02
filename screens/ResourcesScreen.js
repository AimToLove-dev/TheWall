import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
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

  const handleOpenResource = (url) => {
    Linking.openURL(url).catch((err) => {
      console.error("Failed to open URL:", err);
      setError("Could not open this resource. The link might be invalid.");
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background || "#fff",
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: colors.background || "#fff",
    },
    listContainer: {
      paddingBottom: 20,
    },
    resourceItem: {
      flexDirection: "row",
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border || "#e0e0e0",
      alignItems: "center",
      backgroundColor: colors.cardBackground || "#f9f9f9",
      borderRadius: 8,
      marginBottom: 10,
    },
    resourceIcon: {
      fontSize: 24,
      marginRight: 15,
    },
    resourceDetails: {
      flex: 1,
    },
    resourceName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 5,
    },
    resourceDate: {
      fontSize: 12,
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
    // Define icon based on mime type
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

    return (
      <TouchableOpacity
        style={styles.resourceItem}
        onPress={() => handleOpenResource(item.url)}
        accessible={true}
        accessibilityLabel={`Open ${item.name}`}
        accessibilityHint={`Opens ${item.name} in your browser`}
      >
        <Text style={styles.resourceIcon}>{getFileIcon(item.mimeType)}</Text>
        <View style={styles.resourceDetails}>
          <Text style={styles.resourceName}>{item.name}</Text>
          <Text style={styles.resourceDate}>
            Last updated: {new Date(item.lastUpdated).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading resources...</Text>
      </View>
    );
  }

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

  // If resources are available, show the resource list
  return (
    <View style={styles.container}>
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
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No resources currently available.
            </Text>
          }
        />
      </ScrollableScreenView>
    </View>
  );
};
