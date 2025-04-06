"use client";

import { FlatList } from "react-native";
import { Surface, List, IconButton, Text, useTheme } from "react-native-paper";
import { View } from "components";
import { useState, useEffect, useContext } from "react";
import { AuthenticatedUserContext } from "../../providers";
import {
  getUserSouls,
  deleteSoul,
  countUserSouls,
} from "../../utils/firebaseUtils";
import { DatabaseErrorScreen } from "../error/DatabaseErrorScreen";

export const SoulsList = ({
  navigation,
  onAddPress,
  onEditPress,
  onVisibilityToggle,
  selectable = false,
  selectedSouls = [],
  onSelect,
}) => {
  const { user } = useContext(AuthenticatedUserContext);
  const theme = useTheme();

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

  const renderSoul = ({ item }) => {
    const isSelected = selectedSouls.includes(item.id);
    const isPrivate = item.visibility === "private";

    return (
      <List.Item
        title={item.name}
        description={`Added on ${new Date(
          item.createdAt
        ).toLocaleDateString()}`}
        left={(props) =>
          selectable ? (
            <IconButton
              {...props}
              icon={isSelected ? "checkbox-marked" : "checkbox-blank-outline"}
              onPress={() => onSelect && onSelect(item)}
            />
          ) : (
            <List.Icon {...props} icon={isPrivate ? "lock" : "earth"} />
          )
        }
        right={(props) =>
          !selectable && (
            <View style={{ flexDirection: "row" }}>
              <IconButton
                icon={isPrivate ? "eye-off" : "eye"}
                onPress={() => onVisibilityToggle && onVisibilityToggle(item)}
              />
              <IconButton icon="pencil" onPress={() => handleEditSoul(item)} />
              <IconButton
                icon="delete"
                onPress={() => handleDeleteSoul(item)}
              />
            </View>
          )
        }
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 8,
          marginBottom: 8,
        }}
      />
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
    <Surface
      mode="flat"
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 16,
      }}
    >
      {souls.length === 0 ? (
        <Text
          variant="bodyLarge"
          style={{
            textAlign: "center",
            color: theme.colors.onSurfaceVariant,
          }}
        >
          No souls added yet
        </Text>
      ) : (
        <FlatList
          data={souls}
          renderItem={renderSoul}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </Surface>
  );
};
