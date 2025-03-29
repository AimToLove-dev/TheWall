import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  useColorScheme,
  FlatList,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { View } from "../components/View";
import { Ionicons } from "@expo/vector-icons";
import { AuthenticatedUserContext } from "../providers";
import { CustomButton } from "../components/CustomButton";
import { HeaderText, BodyText, SubtitleText } from "../components/Typography";
import { getThemeColors, spacing } from "../styles/theme";
import {
  getUserSouls,
  deleteSoul,
  countUserSouls,
} from "../utils/firebaseUtils";
import { DatabaseErrorScreen } from "../components/DatabaseErrorScreen";

export const SoulSubmissionsScreen = ({ navigation }) => {
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
    navigation.navigate("EditSoul", { soul });
  };

  const handleDeleteSoul = (soulId, soulName) => {
    Alert.alert(
      "Delete Soul",
      `Are you sure you want to remove ${soulName} from the Wailing Wall?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteSoul(soulId);
              // Update local state
              setSouls(souls.filter((soul) => soul.id !== soulId));
              setSoulCount((prevCount) => prevCount - 1);
            } catch (error) {
              console.error("Error deleting soul:", error);
              Alert.alert("Error", "Failed to delete. Please try again.");
            }
          },
        },
      ]
    );
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
            onPress={() => handleDeleteSoul(item.id, item.name)}
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
    <View
      isSafe
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.backButton,
              { backgroundColor: isDark ? colors.card : "transparent" },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <HeaderText>My Submissions</HeaderText>
        </View>

        <View style={styles.limitInfo}>
          <SubtitleText>
            {user?.isAdmin
              ? "Admin: Unlimited submissions"
              : `${soulCount}/7 submissions used`}
          </SubtitleText>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
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
              <View style={styles.emptyContainer}>
                <BodyText style={{ color: colors.textSecondary }}>
                  You haven't added any souls to the Wailing Wall yet.
                </BodyText>
              </View>
            )}
          />
        )}

        {soulCount < 7 || user?.isAdmin ? (
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Add New Soul"
              onPress={() => navigation.navigate("AddSoul")}
              variant="primary"
              size="large"
              style={styles.addButton}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  limitInfo: {
    marginBottom: spacing.lg,
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
