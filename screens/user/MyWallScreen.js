"use client";

import { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { View } from "../../components/View";
import { auth } from "config";
import { AuthenticatedUserContext } from "../../providers";
import { CustomButton } from "../../components/CustomButton";
import { SubtitleText, BodyText } from "../../components/Typography";
import { ScreenHeader } from "../../components/ScreenHeader";
import { getThemeColors, spacing } from "../../styles/theme";
import { FormContainer } from "../../components/FormContainer";
import { Ionicons } from "@expo/vector-icons";
import {
  getUserSouls,
  updateSoul,
  deleteSoul,
  canAddMoreSouls,
} from "../../utils/firebaseUtils";
import { CustomDialog } from "../../components/CustomDialog";
import { DatabaseErrorScreen } from "../../components/DatabaseErrorScreen";
import { AddSoul } from "../../components/souls/AddSoul";

export const MyWallScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  const [souls, setSouls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSouls, setSelectedSouls] = useState([]);
  const [showAddSoul, setShowAddSoul] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);
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

  const handleBackPress = () => {
    navigation.navigate("Dashboard");
  };

  const handleAddSoulSuccess = (newSoul) => {
    setSouls([...souls, newSoul]);
    setShowAddSoul(false);
    checkCanAddMore();
  };

  const toggleSoulSelection = (soul) => {
    if (selectedSouls.some((s) => s.id === soul.id)) {
      setSelectedSouls(selectedSouls.filter((s) => s.id !== soul.id));
    } else {
      setSelectedSouls([...selectedSouls, soul]);
    }
  };

  const handleMakePublic = () => {
    if (selectedSouls.length === 0) return;
    setDialogAction("public");
    setDialogVisible(true);
  };

  const handleMakePrivate = () => {
    if (selectedSouls.length === 0) return;
    setDialogAction("private");
    setDialogVisible(true);
  };

  const handleDelete = () => {
    if (selectedSouls.length === 0) return;
    setDialogAction("delete");
    setDialogVisible(true);
  };

  const confirmAction = async () => {
    try {
      if (dialogAction === "delete") {
        // Delete selected souls
        for (const soul of selectedSouls) {
          await deleteSoul(soul.id);
        }
        setSouls(
          souls.filter((soul) => !selectedSouls.some((s) => s.id === soul.id))
        );
      } else {
        // Update visibility
        const isPublic = dialogAction === "public";
        for (const soul of selectedSouls) {
          await updateSoul(soul.id, { isPublic });

          // Update local state
          setSouls(
            souls.map((s) => {
              if (s.id === soul.id) {
                return { ...s, isPublic };
              }
              return s;
            })
          );
        }
      }

      // Reset selection
      setSelectedSouls([]);
      checkCanAddMore();
    } catch (error) {
      console.error(`Error performing ${dialogAction} action:`, error);
    } finally {
      setDialogVisible(false);
    }
  };

  const renderSoulBadge = (soul, index) => {
    const isSelected = selectedSouls.some((s) => s.id === soul.id);
    const badgeStyle = {
      backgroundColor: isSelected ? colors.primary + "30" : colors.card,
      borderColor: isSelected ? colors.primary : colors.border,
    };

    return (
      <TouchableOpacity
        key={soul.id}
        style={[styles.soulBadge, badgeStyle]}
        onPress={() => toggleSoulSelection(soul)}
      >
        {isSelected && (
          <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
            <Ionicons name="checkmark" size={12} color="#FFFFFF" />
          </View>
        )}
        <BodyText style={styles.soulName}>{soul.name}</BodyText>
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: soul.isPublic
                ? colors.success
                : colors.textTertiary,
            },
          ]}
        />
      </TouchableOpacity>
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
        onPress={() => setShowAddSoul(true)}
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

  // If showing add soul form
  if (showAddSoul) {
    return (
      <AddSoul
        onSuccess={handleAddSoulSuccess}
        onCancel={() => setShowAddSoul(false)}
      />
    );
  }

  const getDialogMessage = () => {
    const count = selectedSouls.length;
    const names = selectedSouls.map((s) => s.name).join(", ");

    switch (dialogAction) {
      case "public":
        return `Make ${
          count > 1 ? `these ${count} souls` : names
        } public on the wailing wall?`;
      case "private":
        return `Make ${count > 1 ? `these ${count} souls` : names} private?`;
      case "delete":
        return `Are you sure you want to remove ${
          count > 1 ? `these ${count} souls` : names
        } from your wall?`;
      default:
        return "";
    }
  };

  return (
    <FormContainer style={{ backgroundColor: colors.background }}>
      <ScreenHeader
        title="My Wall"
        onBackPress={handleBackPress}
        style={styles.header}
      />

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

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.badgesContainer}
        >
          {souls.map(renderSoulBadge)}
          {renderAddBadge()}
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

      <CustomDialog
        visible={dialogVisible}
        title={
          dialogAction === "delete"
            ? "Delete Soul"
            : dialogAction === "public"
            ? "Make Public"
            : "Make Private"
        }
        message={getDialogMessage()}
        confirmText={dialogAction === "delete" ? "Delete" : "Confirm"}
        cancelText="Cancel"
        onCancel={() => setDialogVisible(false)}
        onConfirm={confirmAction}
        isDestructive={dialogAction === "delete"}
      />
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  infoContainer: {
    marginBottom: spacing.md,
  },
  infoText: {
    marginTop: spacing.xs,
  },
  scrollContainer: {
    flex: 1,
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
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: spacing.xs,
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
