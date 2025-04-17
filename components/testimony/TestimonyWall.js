import React, { useState, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { SubtitleText, BodyText } from "components/Typography";
import { spacing, getThemeColors } from "styles/theme";
import TestimonyCard from "./TestimonyCard";

export const TestimonyWall = ({ testimonies: initialTestimonies = [] }) => {
  const colors = getThemeColors();

  const [testimonies, setTestimonies] = useState(initialTestimonies);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  // Reset when screen comes back into focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        // Clean up when screen is unfocused
      };
    }, [])
  );

  // Load more testimonies
  const _loadMoreContentAsync = async () => {
    if (!loading && testimonies.length >= 10) {
      setLoading(true);

      // Simulate loading more testimonies
      // In a real app, you would fetch the next page of testimonies here
      setTimeout(() => {
        // In a real app, you would append the next page of testimonies
        setPage((prevPage) => prevPage + 1);

        // Check if we can load more after this
        if (page >= 5) {
          // Example limit
          setCanLoadMore(false);
        }

        setLoading(false);
      }, 1000);
    }
  };

  const navigateToReadTestimony = (testimony) => {
    // TODO: Implement navigation to read testimony details
    //navigation.navigate("ReadTestimony", { testimony });
  };

  const styles = StyleSheet.create({
    mastheadImage: {
      height: 80,
      width: "100%",
      alignSelf: "center",
      maxWidth: 800,
      marginVertical: spacing.md,
      marginHorizontal: "auto",
    },
    container: {
      flex: 1,
      justifyContent: "center",
    },
    listContent: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.lg,
    },
    loaderContainer: {
      width: "100%",
      height: 80,
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.md,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.xl,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.primary,
      textAlign: "center",
      marginBottom: spacing.md,
    },
    emptySubtext: {
      fontSize: 16,
      color: colors.primary,
      textAlign: "center",
    },
    cardContainer: {
      width: "100%",
      marginBottom: spacing.lg,
    },
    backgroundImage: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
  });

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.cardContainer}>
        <TestimonyCard
          item={item}
          index={index}
          onPress={navigateToReadTestimony}
        />
      </View>
    );
  };

  const renderFooter = () => {
    if (!loading) return null;

    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  };

  // Handle empty state
  if (!testimonies || testimonies.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No testimonies available.</Text>
        <Text style={styles.emptySubtext}>
          Check back later for inspiring stories.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("assets/TheWall.png")}
        style={styles.mastheadImage}
        resizeMode="contain"
      />
      <FlatList
        ref={flatListRef}
        data={testimonies}
        renderItem={renderItem}
        keyExtractor={(item, index) => `testimony-${item.id || index}`}
        contentContainerStyle={styles.listContent}
        onEndReached={_loadMoreContentAsync}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        style={{ maxWidth: 800, alignSelf: "center", width: "100%" }}
      />
    </View>
  );
};
