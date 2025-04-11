import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { SubtitleText, BodyText } from "components/Typography";
import { spacing } from "styles/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.9;
const CARD_SPACING = SCREEN_WIDTH * 0.05;

export const TestimonyWall = ({ testimonies: initialTestimonies = [] }) => {
  const [testimonies, setTestimonies] = useState(initialTestimonies);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const scrollX = useSharedValue(0);

  // Reset when screen comes back into focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        // Clean up when screen is unfocused
        scrollX.value = 0;
      };
    }, [])
  );

  // Handle reaching end of carousel
  const handleEndReached = useCallback(() => {
    if (!loading && testimonies.length >= 10) {
      setLoading(true);

      // Simulate loading more testimonies
      // In a real app, you would fetch the next page of testimonies here
      setTimeout(() => {
        // Wrap around to the beginning if there are no more testimonies
        // In a real app, you would append the next page of testimonies
        setPage((prevPage) => prevPage + 1);
        setLoading(false);
      }, 1000);
    }
  }, [testimonies, loading]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onEndReached: () => {
      handleEndReached();
    },
  });

  const navigateToReadTestimony = (testimony) => {
    // Navigate to the ReadTestimony screen with the testimony data
    navigation.navigate("ReadTestimony", { testimony });
  };

  const renderCard = ({ item, index }) => {
    if (!item) return null;

    // Get the first part of testimony text (truncated for preview)
    const previewText = item.testimony
      ? item.testimony.substring(0, 150) +
        (item.testimony.length > 150 ? "..." : "")
      : "";

    // Determine which image to show (prefer afterImage, fall back to beforeImage)
    const imageUri = item.afterImage || item.beforeImage || null;

    return (
      <TouchableOpacity
        style={[styles.card, { marginLeft: index === 0 ? CARD_SPACING : 0 }]}
        onPress={() => navigateToReadTestimony(item)}
        activeOpacity={0.9}
      >
        <View style={styles.cardContent}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>No Image</Text>
            </View>
          )}

          <View style={styles.textContainer}>
            <SubtitleText style={styles.nameText}>
              {item.displayName || "Anonymous"}
            </SubtitleText>

            <BodyText style={styles.testimonyPreview}>{previewText}</BodyText>

            <Text style={styles.readMore}>Read more</Text>
          </View>
        </View>
      </TouchableOpacity>
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
      <Animated.FlatList
        data={testimonies}
        keyExtractor={(item, index) => `testimony-${item.id || index}`}
        renderItem={renderCard}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        contentContainerStyle={styles.listContent}
        onEndReachedThreshold={0.5}
        onEndReached={handleEndReached}
        ListFooterComponent={
          loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    height: "100vh",
  },
  listContent: {
    paddingRight: CARD_SPACING,
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  card: {
    width: CARD_WIDTH,
    marginRight: CARD_SPACING,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardContent: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 200,
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#e1e1e1",
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "500",
  },
  textContainer: {
    padding: spacing.md,
  },
  nameText: {
    marginBottom: spacing.sm,
    fontSize: 18,
    fontWeight: "bold",
  },
  testimonyPreview: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
  },
  readMore: {
    color: "#0066cc",
    marginTop: spacing.sm,
    fontWeight: "bold",
  },
  loaderContainer: {
    width: CARD_WIDTH * 0.5,
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
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
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: spacing.md,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
  },
});
