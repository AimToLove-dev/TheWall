"use client";

import { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { LinearTransition, FadeOut } from "react-native-reanimated";
import { Animated } from "react-native";

import { AuthenticatedUserContext } from "providers";
import {
  getUserSouls,
  updateSoul,
  deleteSoul,
  canAddMoreSouls,
  addSoul,
  getTestimonyById,
} from "utils";
import {
  View,
  FormContainer,
  DatabaseErrorScreen,
  SubtitleText,
  BodyText,
  CustomButton,
  HeaderText,
} from "components";

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
  const [selectedSouls, setSelectedSouls] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [canAddMore, setCanAddMore] = useState(false);

  // Count for non-linked souls (toward max limit)
  const [unlinkedSoulCount, setUnlinkedSoulCount] = useState(0);

  // New states for the Add Soul form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addError, setAddError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserSouls();
      checkCanAddMore();
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

  const checkCanAddMore = async () => {
    try {
      const result = await canAddMoreSouls(user.uid, user.isAdmin);
      setCanAddMore(result);
    } catch (error) {
      console.error("Error checking if user can add more souls:", error);
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

  const handleAddSoulSubmit = async () => {
    if (!firstName.trim() || !lastName.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setAddError(null);

      const fullName = `${firstName.trim()} ${lastName.trim()}`;

      const soulData = {
        name: fullName,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        status: "active",
        isPublic: false,
      };

      const soulId = await addSoul(soulData);

      // Add the ID to the data and update the local state
      const newSoul = { ...soulData, id: soulId };
      setSouls([...souls, newSoul]);

      // Reset form
      setFirstName("");
      setLastName("");
      setShowAddForm(false);

      // Check if user can add more souls after this addition
      checkCanAddMore();
    } catch (error) {
      console.error("Error adding soul:", error);
      setAddError("Failed to add soul. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSoulSuccess = (newSoul) => {
    setSouls([...souls, newSoul]);
    setShowAddForm(false);
    checkCanAddMore();
  };

  const toggleSoulSelection = (soul) => {
    // Don't allow toggling for souls with linked testimonies
    if (soul.testimonyId) {
      // Instead of toggling selection, go directly to view the testimony
      viewLinkedTestimony(soul.testimonyId);
      return;
    }

    if (selectedSouls.some((s) => s.id === soul.id)) {
      setSelectedSouls(selectedSouls.filter((s) => s.id !== soul.id));
    } else {
      setSelectedSouls([...selectedSouls, soul]);
    }
  };

  const handleSingleSoulDelete = async (soul) => {
    // Don't allow deletion of souls with linked testimonies
    if (soul.testimonyId) return;

    try {
      await deleteSoul(soul.id);

      // Update local state
      setSouls(souls.filter((s) => s.id !== soul.id));

      // Remove from selected if it was selected
      setSelectedSouls(selectedSouls.filter((s) => s.id !== soul.id));
      checkCanAddMore();
    } catch (error) {
      console.error("Error deleting soul:", error);
    }
  };

  const renderSoulBadge = (soul) => {
    const isSelected = selectedSouls.some((s) => s.id === soul.id);
    const isLinked = !!soul.testimonyId;

    // Different styling for linked souls
    const badgeStyle = {
      backgroundColor: isLinked
        ? colors.primary + "15" // Lighter background for linked souls
        : isSelected
        ? colors.primary + "30"
        : colors.card,
      borderColor: isLinked
        ? colors.primary // Primary color border for linked souls
        : isSelected
        ? colors.primary
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
          onPress={() => toggleSoulSelection(soul)}
        >
          {isSelected ? (
            // Show action buttons when selected
            <View style={styles.actionIcons}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() =>
                  setSelectedSouls(
                    selectedSouls.filter((s) => s.id !== soul.id)
                  )
                }
              >
                <Ionicons name="close" size={18} color={colors.surface} />
              </TouchableOpacity>

              {/* Only show delete option for souls without linked testimonies */}
              {!isLinked && (
                <TouchableOpacity
                  style={[
                    styles.actionIconButton,
                    { backgroundColor: colors.card },
                  ]}
                  onPress={() => handleSingleSoulDelete(soul)}
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color={colors.error}
                  />
                </TouchableOpacity>
              )}

              {/* Show testimony icon for linked souls */}
              {isLinked && (
                <TouchableOpacity
                  style={[
                    styles.actionIconButton,
                    { backgroundColor: colors.card },
                  ]}
                  onPress={() => viewLinkedTestimony(soul.testimonyId)}
                >
                  <Ionicons name="heart" size={18} color={colors.surface} />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            // Show name when not selected with a heart icon for linked souls
            <View style={styles.badgeContent}>
              <BodyText
                style={[styles.soulName, isLinked && { color: colors.surface }]}
              >
                {soul.name}
              </BodyText>

              {isLinked && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    viewLinkedTestimony(soul.testimonyId);
                  }}
                >
                  <Ionicons
                    name="heart"
                    size={16}
                    color={colors.surface}
                    style={styles.testimonyIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderAddBadge = () => {
    if (!canAddMore && souls.length >= 7) return null;

    if (showAddForm) {
      // Check if both inputs have at least 3 characters
      const isFormValid =
        firstName.trim().length >= 3 && lastName.trim().length >= 3;

      // Simple single-line badge-like form
      return (
        <View
          style={[
            styles.soulBadge,
            styles.addBadge,
            {
              backgroundColor: colors.card,
              borderColor: colors.primary,
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: spacing.xs,
              paddingHorizontal: spacing.sm,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              setShowAddForm(false);
              setFirstName("");
              setLastName("");
              setAddError(null);
            }}
            style={{ marginRight: spacing.xs }}
          >
            <Ionicons name="close-circle" size={18} color={colors.error} />
          </TouchableOpacity>

          <TextInput
            style={styles.inlineBadgeInput}
            placeholder="First"
            value={firstName}
            onChangeText={setFirstName}
            autoFocus={true}
            placeholderTextColor={colors.textSecondary}
          />

          <TextInput
            style={styles.inlineBadgeInput}
            placeholder="Last"
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor={colors.textSecondary}
          />

          <TouchableOpacity
            onPress={handleAddSoulSubmit}
            disabled={!isFormValid || isSubmitting}
          >
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={isFormValid ? colors.primary : colors.disabled}
            />
          </TouchableOpacity>
        </View>
      );
    }

    // Regular add badge button
    return (
      <TouchableOpacity
        style={[
          styles.soulBadge,
          styles.addBadge,
          { borderColor: colors.primary },
        ]}
        onPress={() => setShowAddForm(true)}
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

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: colors.card }]}
        onPress={() => navigation.navigate("Dashboard")}
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <HeaderText style={styles.title}>My Wall</HeaderText>
        <SubtitleText style={styles.subtitle}>
          Manage your loved ones
        </SubtitleText>
      </View>
    </View>
  );

  return (
    <FormContainer style={{ backgroundColor: colors.background }}>
      <View style={styles.content}>
        {renderHeader()}

        <View style={styles.infoContainer}>
          <BodyText style={[styles.infoText, { color: colors.textSecondary }]}>
            Tap on a soul to see options.
          </BodyText>
        </View>

        <ScrollView>
          <View style={styles.badgesContainer}>
            {souls.map(renderSoulBadge)}
            {renderAddBadge()}
          </View>
        </ScrollView>
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
  addFormContainer: {
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: "#f5f5f5",
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
  checkmark: {
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  addSoulForm: {
    padding: spacing.md,
    backgroundColor: "#f5f5f5",
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderStyle: "dashed",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: spacing.sm,
    marginRight: spacing.sm,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: spacing.xs,
  },
  formButton: {
    marginLeft: spacing.sm,
  },
  errorText: {
    color: "red",
    marginBottom: spacing.sm,
  },
  addSoulFormBadge: {
    flexDirection: "column",
    alignItems: "stretch",
    padding: spacing.md,
    borderWidth: 1,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    minWidth: 100,
  },
  simpleInput: {
    flex: 1,
    borderWidth: 1,
    padding: spacing.sm,
    marginRight: spacing.sm,
    fontSize: 14,
  },
  badgeButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: spacing.sm,
  },
  badgeButton: {
    borderWidth: 1,
    padding: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeIconsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  inlineBadgeInput: {
    flex: 1,
    fontSize: 14,
    padding: 2,
    marginHorizontal: 4,
    minWidth: 50,
    maxWidth: 80,
  },
  actionIcons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  actionIcon: {
    marginHorizontal: spacing.xs,
  },
  actionIconButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  closeButton: {
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
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
});
