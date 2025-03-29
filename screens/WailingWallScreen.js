"use client";

import { useState, useEffect, useContext, useRef, Image } from "react";
import {
  StyleSheet,
  useColorScheme,
  Animated,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { View } from "../components/View";
import { Ionicons } from "@expo/vector-icons";
import { AuthenticatedUserContext } from "../providers";
import { CustomButton } from "../components/CustomButton";
import { BodyText } from "../components/Typography";
import { ScreenHeader } from "../components/ScreenHeader";
import { getThemeColors, spacing } from "../styles/theme";
import { getAllSouls } from "../utils/firebaseUtils";
import { DatabaseErrorScreen } from "../components/DatabaseErrorScreen";
import { FormContainer } from "../components/FormContainer";

export const WailingWallScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  const [souls, setSouls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchSouls();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchSouls = async () => {
    try {
      setLoading(true);
      setError(null);
      const soulsList = await getAllSouls();
      setSouls(soulsList);
    } catch (error) {
      console.error("Error fetching souls:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSoul = () => {
    navigation.navigate("App", { screen: "MyWall" });
    // We'll handle this in the Profile screen now
  };

  const renderSoulItem = ({ item, index }) => {
    // Calculate animation values for each item
    const position = Animated.subtract(index * 150, scrollY);
    const isDisappearing = position.interpolate({
      inputRange: [0, 50],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    const isAppearing = position.interpolate({
      inputRange: [100, 150],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });
    const scale = Animated.add(isDisappearing, isAppearing).interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
    });
    const opacity = Animated.add(isDisappearing, isAppearing).interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    });

    return (
      <Animated.View
        style={[
          styles.soulItem,
          {
            backgroundColor: colors.card,
            transform: [{ scale }],
            opacity,
          },
          isLargeScreen && styles.soulItemLarge,
        ]}
      >
        <BodyText style={styles.soulName}>{item.name}</BodyText>
        <View style={styles.soulDivider} />
        <BodyText style={styles.soulContact}>
          {item.email || item.phone || "No contact info"}
        </BodyText>
      </Animated.View>
    );
  };

  // If there's an error, show the database error screen
  if (error) {
    return (
      <DatabaseErrorScreen
        onRetry={fetchSouls}
        error={error}
        navigation={navigation}
      />
    );
  }

  // Create the profile button for the right side of the header
  const profileButton = (
    <TouchableOpacity
      style={[styles.profileButton, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate("App", { screen: "Profile" })}
    >
      <Ionicons name="person-outline" size={24} color={colors.text} />
    </TouchableOpacity>
  );

  return (
    <FormContainer style={{ backgroundColor: colors.background }}>
      <ScreenHeader
        title="Wailing Wall"
        showBackButton={true}
        rightContent={profileButton}
        style={styles.header}
        onBackPress={() => {
          navigation.navigate("Home");
        }}
      />

      <Animated.View
        style={[
          styles.wallContainer,
          { opacity: fadeAnim },
          isLargeScreen && styles.wallContainerLarge,
        ]}
      >
        <View style={[styles.wallBackground, { backgroundColor: colors.card }]}>
          <Animated.FlatList
            data={souls}
            renderItem={renderSoulItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.soulsList}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <BodyText style={{ color: colors.textSecondary }}>
                  {loading
                    ? "Loading souls..."
                    : "No souls added yet. Be the first to add a name to the wall."}
                </BodyText>
              </View>
            )}
          />
        </View>
      </Animated.View>

      {user && (
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Add to Wall"
            onPress={handleAddSoul}
            variant="primary"
            size="large"
            style={styles.addButton}
          />
        </View>
      )}
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.md,
  },
  profileButton: {
    padding: spacing.sm,
    borderRadius: 50,
  },
  svgOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1, // Ensure it stays behind other content
    opacity: 0.2, // Adjust opacity for a subtle effect
  },
  wallContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  wallContainerLarge: {
    maxWidth: 768,
    marginHorizontal: "auto",
  },
  wallBackground: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  soulsList: {
    padding: spacing.md,
  },
  soulItem: {
    padding: spacing.md,
    borderRadius: 10,
    marginBottom: spacing.md,
  },
  soulItemLarge: {
    padding: spacing.lg,
  },
  soulName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  soulDivider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: spacing.sm,
  },
  soulContact: {
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    padding: spacing.md,
  },
  addButton: {
    borderRadius: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.md,
  },
});
