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
import { getUserSouls, updateSoul, deleteSoul, canAddMoreSouls } from "utils";

import {
  View,
  FormContainer,
  AddSoul,
  DatabaseErrorScreen,
  SubtitleText,
  BodyText,
  CustomButton,
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

  useEffect(() => {
    if (user) {
      fetchUserSouls();
      checkCanAddMore();
    }
  }, [user]);

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

  const handleAddSoulSuccess = (newSoul) => {
    setSouls([...souls, newSoul]);
    setShowAddForm(false);
    checkCanAddMore();
  };

  const toggleSoulSelection = (soul) => {
    if (selectedSouls.some((s) => s.id === soul.id)) {
      setSelectedSouls(selectedSouls.filter((s) => s.id !== soul.id));
    } else {
      setSelectedSouls([...selectedSouls, soul]);
    }
  };

  const handleMakePublic = async () => {
    if (selectedSouls.length === 0) return;

    try {
      // Update visibility to public
      for (const soul of selectedSouls) {
        await updateSoul(soul.id, { isPublic: true });

        // Update local state
        setSouls(
          souls.map((s) => {
            if (s.id === soul.id) {
              return { ...s, isPublic: true };
            }
            return s;
          })
        );
      }

      // Reset selection
      setSelectedSouls([]);
    } catch (error) {
      console.error("Error making souls public:", error);
    }
  };

  const handleMakePrivate = async () => {
    if (selectedSouls.length === 0) return;

    try {
      // Update visibility to private
      for (const soul of selectedSouls) {
        await updateSoul(soul.id, { isPublic: false });

        // Update local state
        setSouls(
          souls.map((s) => {
            if (s.id === soul.id) {
              return { ...s, isPublic: false };
            }
            return s;
          })
        );
      }

      // Reset selection
      setSelectedSouls([]);
    } catch (error) {
      console.error("Error making souls private:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedSouls.length === 0) return;

    try {
      // Delete selected souls
      for (const soul of selectedSouls) {
        await deleteSoul(soul.id);
      }

      // Update local state
      setSouls(
        souls.filter((soul) => !selectedSouls.some((s) => s.id === soul.id))
      );

      // Reset selection
      setSelectedSouls([]);
      checkCanAddMore();
    } catch (error) {
      console.error("Error deleting souls:", error);
    }
  };

  const renderSoulBadge = (soul) => {
    const isSelected = selectedSouls.some((s) => s.id === soul.id);
    const badgeStyle = {
      backgroundColor: isSelected ? colors.primary + "30" : colors.card,
      borderColor: isSelected ? colors.primary : colors.border,
    };

    return (
      <Animated.View key={soul.id} layout={LinearTransition} exiting={FadeOut}>
        <TouchableOpacity
          style={[styles.soulBadge, badgeStyle]}
          onPress={() => toggleSoulSelection(soul)}
        >
          {isSelected && (
            <View
              style={[styles.checkmark, { backgroundColor: colors.primary }]}
            >
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
          )}
          <BodyText style={styles.soulName}>{soul.name}</BodyText>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderAddBadge = () => {
    if (!canAddMore && souls.length >= 7) return null;

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

  return (
    <FormContainer style={{ backgroundColor: colors.background }}>
      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <SubtitleText>
            {user?.isAdmin
              ? "Admin: Unlimited submissions"
              : `${souls.length}/7 submissions used`}
          </SubtitleText>
          <BodyText style={[styles.infoText, { color: colors.textSecondary }]}>
            Select one or more souls to manage their visibility or remove them
            from your wall.
          </BodyText>
        </View>

        {showAddForm && (
          <View style={styles.addFormContainer}>
            <AddSoul
              onSuccess={handleAddSoulSuccess}
              onCancel={() => setShowAddForm(false)}
            />
          </View>
        )}

        <ScrollView>
          <View style={styles.badgesContainer}>
            {souls.map(renderSoulBadge)}
            {renderAddBadge()}
          </View>
        </ScrollView>

        <View style={styles.actionBar}>
          <CustomButton
            title="Make Public"
            onPress={handleMakePublic}
            variant={selectedSouls.length > 0 ? "primary" : "outline"}
            size="medium"
            style={[
              styles.actionButton,
              { opacity: selectedSouls.length > 0 ? 1 : 0.5 },
            ]}
            disabled={selectedSouls.length === 0}
            leftIcon={
              <Ionicons
                name="globe-outline"
                size={18}
                color={selectedSouls.length > 0 ? "#FFFFFF" : colors.primary}
              />
            }
          />
          <CustomButton
            title="Make Private"
            onPress={handleMakePrivate}
            variant={selectedSouls.length > 0 ? "secondary" : "outline"}
            size="medium"
            style={[
              styles.actionButton,
              { opacity: selectedSouls.length > 0 ? 1 : 0.5 },
            ]}
            disabled={selectedSouls.length === 0}
            leftIcon={
              <Ionicons
                name="eye-off-outline"
                size={18}
                color={colors.primary}
              />
            }
          />
          <CustomButton
            title="Delete"
            onPress={handleDelete}
            variant="outline"
            size="medium"
            style={[
              styles.actionButton,
              {
                opacity: selectedSouls.length > 0 ? 1 : 0.5,
                borderColor:
                  selectedSouls.length > 0 ? colors.error : colors.border,
              },
            ]}
            textStyle={{
              color:
                selectedSouls.length > 0 ? colors.error : colors.textTertiary,
            }}
            disabled={selectedSouls.length === 0}
            leftIcon={
              <Ionicons
                name="trash-outline"
                size={18}
                color={
                  selectedSouls.length > 0 ? colors.error : colors.textTertiary
                }
              />
            }
          />
        </View>
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
    borderRadius: 12,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: spacing.md,
  },
  soulBadge: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm,
    borderRadius: 20,
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
    borderRadius: 8,
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
});
