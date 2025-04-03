"use client";

import { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  useColorScheme,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  View as RNView,
} from "react-native";
import { View } from "../View";
import { Ionicons } from "@expo/vector-icons";
import { AuthenticatedUserContext } from "../../providers";
import { CustomButton } from "../CustomButton";
import { BodyText, SubtitleText } from "../Typography";
import { CustomDialog } from "../CustomDialog";
import { getThemeColors, spacing } from "../../styles/theme";
import {
  getUserSouls,
  deleteSoul,
  countUserSouls,
} from "../../utils/firebaseUtils";
import { DatabaseErrorScreen } from "../DatabaseErrorScreen";

export const SoulsList = ({ navigation, onAddPress, onEditPress }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  const [souls, setSouls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soulCount, setSoulCount] = useState(0);
  const [error, setError] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedSoul, setSelectedSoul] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserSouls();
    }
  }, [user]);

  const fetchUserSouls = async () => {
    try {
      setLoading(true);
      setError(null);
      const soulsList = await getUserSouls(user.uid);
      setSouls(soulsList);

      // Get count for display
      const count = await countUserSouls(user.uid);
      setSoulCount(count);
    } catch (error) {
      console.error("Error fetching user souls:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSoul = (soul) => {
    if (onEditPress) {
      onEditPress(soul);
    }
  };

  const handleDeleteSoul = (soul) => {
    setSelectedSoul(soul);
    setDialogVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedSoul) return;

    try {
      await deleteSoul(selectedSoul.id);
      // Update local state
      setSouls(souls.filter((soul) => soul.id !== selectedSoul.id));
      setSoulCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error deleting soul:", error);
    } finally {
      setDialogVisible(false);
      setSelectedSoul(null);
    }
  };

  const renderSoulItem = ({ item }) => {
    return (
      <View
        style={[
          styles.soulItem,
          { backgroundColor: colors.card },
          isLargeScreen && styles.soulItemLarge,
        ]}
      >
        <View style={styles.soulInfo}>
          <BodyText style={styles.soulName}>{item.name}</BodyText>
          <BodyText style={styles.soulContact}>
            {item.email || item.phone || "No contact info"}
          </BodyText>
        </View>

        <View style={styles.soulActions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: colors.primary + "20" },
            ]}
            onPress={() => handleEditSoul(item)}
          >
            <Ionicons name="pencil" size={20} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: colors.error + "20" },
            ]}
            onPress={() => handleDeleteSoul(item)}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
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
    <RNView style={styles.container}>
      <RNView style={styles.limitInfo}>
        <SubtitleText>
          {user?.isAdmin
            ? "Admin: Unlimited submissions"
            : `${soulCount}/7 submissions used`}
        </SubtitleText>
      </RNView>

      {loading ? (
        <RNView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </RNView>
      ) : (
        <FlatList
          data={souls}
          renderItem={renderSoulItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.soulsList,
            souls.length === 0 && styles.emptyList,
          ]}
          ListEmptyComponent={() => (
            <RNView style={styles.emptyContainer}>
              <BodyText style={{ color: colors.textSecondary }}>
                You haven't added any souls to the Wailing Wall yet.
              </BodyText>
            </RNView>
          )}
        />
      )}

      {soulCount < 7 || user?.isAdmin ? (
        <RNView style={styles.buttonContainer}>
          <CustomButton
            title="Add New Soul"
            onPress={onAddPress}
            variant="primary"
            size="large"
            style={styles.addButton}
          />
        </RNView>
      ) : null}

      <CustomDialog
        visible={dialogVisible}
        title="Delete Soul"
        message={`Are you sure you want to remove ${
          selectedSoul?.name || "this soul"
        } from the Wailing Wall?`}
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => {
          setDialogVisible(false);
          setSelectedSoul(null);
        }}
        onConfirm={confirmDelete}
        isDestructive={true}
      />
    </RNView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  limitInfo: {
    marginBottom: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  soulsList: {
    paddingBottom: spacing.lg,
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
  },
  soulItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  soulItemLarge: {
    padding: spacing.lg,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  soulInfo: {
    flex: 1,
  },
  soulName: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: spacing.xs,
  },
  soulContact: {
    fontSize: 14,
    opacity: 0.7,
  },
  soulActions: {
    flexDirection: "row",
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.sm,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    marginTop: "auto",
    paddingTop: spacing.md,
  },
  addButton: {
    borderRadius: 12,
  },
});
