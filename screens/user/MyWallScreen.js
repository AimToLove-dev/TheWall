"use client";

import { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearTransition, FadeOut } from "react-native-reanimated";
import { Animated } from "react-native";

import { AuthenticatedUserContext } from "providers";
import { getUserSouls, deleteSoul, getTestimonyById } from "utils";
import {
  View,
  FormContainer,
  DatabaseErrorScreen,
  SubtitleText,
  BodyText,
  HeaderText,
  BottomSheet,
} from "components";
import { AddSoulForm } from "components/souls"; // Import the AddSoulForm
import { EditSoulForm } from "components/souls/EditSoulForm"; // Import the EditSoulForm

import { Ionicons } from "@expo/vector-icons";
import { getThemeColors, spacing } from "styles/theme";

export const MyWallScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);

  const [souls, setSouls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Bottom sheet state
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [soulToEdit, setSoulToEdit] = useState(null);

  // Count for non-linked souls (toward max limit)
  const [unlinkedSoulCount, setUnlinkedSoulCount] = useState(0);

  // Toggle bottom sheet visibility for adding a new soul
  const toggleAddBottomSheet = () => {
    setSoulToEdit(null);
    setIsBottomSheetVisible(!isBottomSheetVisible);
  };

  // Open bottom sheet for editing a soul
  const openEditSoulBottomSheet = (soul) => {
    setSoulToEdit(soul);
    setIsBottomSheetVisible(true);
  };

  // Close bottom sheet
  const closeBottomSheet = () => {
    setIsBottomSheetVisible(false);
  };

  // Handle successful soul addition
  const handleSoulAdded = (newSoul) => {
    setSouls([...souls, newSoul]);
    closeBottomSheet();
  };

  // Handle successful soul edit
  const handleSoulEdited = (updatedSoul) => {
    setSouls(souls.map((s) => (s.id === updatedSoul.id ? updatedSoul : s)));
    closeBottomSheet();
  };

  // Handle soul deletion from edit form
  const handleSoulDeleted = (soulId) => {
    setSouls(souls.filter((s) => s.id !== soulId));
    closeBottomSheet();
  };

  useEffect(() => {
    if (user) {
      fetchUserSouls();
    }
  }, [user]);

  useEffect(() => {
    // Calculate unlinked soul count whenever souls change
    const count = souls.filter((soul) => !soul.testimonyId).length;
    setUnlinkedSoulCount(count);
  }, [souls]);

  const fetchUserSouls = async () => {
    try {
      setLoading(true);
      setError(null);
      const soulsList = await getUserSouls(user.uid);
      setSouls(soulsList);
    } catch (error) {
      console.error("Error fetching user souls:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Function to navigate to a linked testimony
  const viewLinkedTestimony = async (testimonyId) => {
    try {
      // Navigate to the testimony view screen
      navigation.navigate("Testimony", {
        testimonyId: testimonyId,
        viewOnly: true,
      });
    } catch (error) {
      console.error("Error navigating to testimony:", error);
    }
  };

  // Handle badge click - either view testimony or open edit form
  const handleBadgeClick = (soul) => {
    if (soul.testimonyId) {
      // If soul has a linked testimony, navigate to view it
      viewLinkedTestimony(soul.testimonyId);
    } else {
      // If soul doesn't have a linked testimony, open edit form
      openEditSoulBottomSheet(soul);
    }
  };

  const renderSoulBadge = (soul) => {
    const isLinked = !!soul.testimonyId;

    // Different styling for linked souls
    const badgeStyle = {
      backgroundColor: isLinked
        ? colors.primary + "15" // Lighter background for linked souls
        : colors.card,
      borderColor: isLinked
        ? colors.primary // Primary color border for linked souls
        : colors.border,
    };

    // Calculate a width based on the soul name (approximately 10px per character with some padding)
    const nameWidth = soul.name.length * 10 + 50; // 50px for padding and icons
    const minBadgeWidth = Math.max(120, nameWidth);

    return (
      <Animated.View key={soul.id} layout={LinearTransition} exiting={FadeOut}>
        <TouchableOpacity
          style={[
            styles.soulBadge,
            badgeStyle,
            // Preserve width based on text content
            {
              width: minBadgeWidth,
              minWidth: minBadgeWidth,
            },
            // Special style for linked souls
            isLinked && styles.linkedSoulBadge,
          ]}
          onPress={() => handleBadgeClick(soul)}
        >
          <View style={styles.badgeContent}>
            <BodyText
              style={[styles.soulName, isLinked && { color: colors.surface }]}
            >
              {soul.name}
            </BodyText>

            {isLinked && (
              <Ionicons
                name="heart"
                size={16}
                color={colors.surface}
                style={styles.testimonyIcon}
              />
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderAddBadge = () => {
    // Regular add badge button
    return (
      <TouchableOpacity
        style={[
          styles.soulBadge,
          styles.addBadge,
          { borderColor: colors.primary },
        ]}
        onPress={toggleAddBottomSheet}
      >
        <Ionicons name="add" size={20} color={colors.primary} />
        <BodyText style={[styles.soulName, { color: colors.primary }]}>
          Add Soul
        </BodyText>
      </TouchableOpacity>
    );
  };

  // If there's an error, show the database error screen
  if (error) {
    return (
      <DatabaseErrorScreen
        onRetry={fetchUserSouls}
        error={error}
        navigation={navigation}
      />
    );
  }

  return (
    <FormContainer style={{ backgroundColor: colors.background }}>
      <View style={styles.content}>
        {/* Wall header */}
        <View style={styles.titleContainer}>
          <HeaderText style={styles.title}>My Wall</HeaderText>
          <SubtitleText style={styles.subtitle}>
            Manage your loved ones
          </SubtitleText>
        </View>

        <View style={styles.infoContainer}>
          <BodyText style={[styles.infoText, { color: colors.textSecondary }]}>
            Tap on a soul badge to view or edit.
          </BodyText>
        </View>

        <ScrollView>
          <View style={styles.badgesContainer}>
            {souls.map(renderSoulBadge)}
            {renderAddBadge()}
          </View>
        </ScrollView>

        {/* Bottom Sheet with AddSoulForm or EditSoulForm */}
        <BottomSheet
          isVisible={isBottomSheetVisible}
          onClose={closeBottomSheet}
        >
          <View style={styles.bottomSheetContent}>
            {!soulToEdit ? (
              <AddSoulForm
                onSuccess={handleSoulAdded}
                onCancel={closeBottomSheet}
              />
            ) : (
              <EditSoulForm
                soul={soulToEdit}
                onSuccess={handleSoulEdited}
                onCancel={closeBottomSheet}
                onDelete={handleSoulDeleted}
              />
            )}
          </View>
        </BottomSheet>
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  infoContainer: {
    marginBottom: spacing.md,
  },
  infoText: {
    marginTop: spacing.xs,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: spacing.md,
  },
  soulBadge: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.sm,
    borderWidth: 1,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    minWidth: 100,
  },
  addBadge: {
    borderStyle: "dashed",
    backgroundColor: "transparent",
  },
  soulName: {
    fontSize: 14,
    marginHorizontal: spacing.xs,
  },
  linkedSoulBadge: {
    borderStyle: "solid",
  },
  badgeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  testimonyIcon: {
    marginLeft: spacing.xs,
  },
  titleContainer: {
    marginLeft: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
  },
  bottomSheetContent: {
    padding: spacing.md,
  },
});
