"use client";

import { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  useColorScheme,
  FlatList,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AuthenticatedUserContext } from "../providers";
import { CustomButton } from "../components/CustomButton";
import { HeaderText, BodyText, SubtitleText } from "../components/Typography";
import { getThemeColors } from "../styles/theme";
import {
  getUserSouls,
  deleteSoul,
  countUserSouls,
} from "../utils/firebaseUtils";

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

  useEffect(() => {
    if (user) {
      fetchUserSouls();
    }
  }, [user]);

  const fetchUserSouls = async () => {
    try {
      const soulsList = await getUserSouls(user.uid);
      setSouls(soulsList);

      // Get count for display
      const count = await countUserSouls(user.uid);
      setSoulCount(count);
    } catch (error) {
      console.error("Error fetching user souls:", error);
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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "bottom"]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.backButton,
            isDark && { backgroundColor: colors.card },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <HeaderText style={styles.title}>My Submissions</HeaderText>
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
          contentContainerStyle={styles.soulsList}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Styles remain the same
});
