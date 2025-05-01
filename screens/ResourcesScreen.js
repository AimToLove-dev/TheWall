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
import { ComingSoon } from "../components/ComingSoon";
import { useNavigation } from "@react-navigation/native";
import { fetchResourcesFromGoogleScript } from "../utils/resourceUtils";
import { getThemeColors } from "../styles/theme";

const theme = getThemeColors();

export const ResourcesScreen = () => {
  const navigation = useNavigation();
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

  const handleOpenResource = (url) => {
    Linking.openURL(url).catch((err) => {
      console.error("Failed to open URL:", err);
      setError("Could not open this resource. The link might be invalid.");
    });
  };

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
        <ActivityIndicator size="large" color={theme.colors.primary} />
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
      <Text style={styles.header}>Resources</Text>
      <Text style={styles.subheader}>Available materials and documents</Text>

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

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
        accessible={true}
        accessibilityLabel="Return to home"
      >
        <Text style={styles.backButtonText}>Return to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background || "#fff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: theme.colors.background || "#fff",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "XTypewriter-Bold",
    color: theme.colors.text,
    textAlign: "center",
  },
  subheader: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: theme.colors.textSecondary || "#666",
  },
  listContainer: {
    paddingBottom: 20,
  },
  resourceItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border || "#e0e0e0",
    alignItems: "center",
    backgroundColor: theme.colors.cardBackground || "#f9f9f9",
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
    color: theme.colors.text,
    marginBottom: 5,
  },
  resourceDate: {
    fontSize: 12,
    color: theme.colors.textSecondary || "#666",
  },
  loadingText: {
    marginTop: 10,
    color: theme.colors.textSecondary || "#666",
  },
  errorText: {
    color: theme.colors.error || "red",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.textSecondary || "#666",
    marginTop: 30,
  },
  retryButton: {
    padding: 10,
    backgroundColor: theme.colors.primary || "#3e477d",
    borderRadius: 5,
    marginTop: 15,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: theme.colors.primary || "#3e477d",
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
