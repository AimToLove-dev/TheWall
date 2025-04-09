"use client";

import { FlatList } from "react-native";
import { Surface, List, IconButton, Text, Chip } from "react-native-paper";
import { View } from "components/View";
import { useState, useEffect, useContext } from "react";
import { AuthenticatedUserContext } from "providers";
import {
  getUserSouls,
  deleteSoul as deleteSoulFirebase,
  countUserSouls,
} from "utils/soulsUtils";
import { DatabaseErrorScreen } from "components/error/DatabaseErrorScreen";
import { CustomDialog } from "components";
import { getThemeColors } from "styles/theme";

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
  const colors = getThemeColors();

  const [souls, setSouls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soulCount, setSoulCount] = useState(0);
  const [error, setError] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedSoul, setSelectedSoul] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

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
      const count = soulsList.length;
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
    // Reset any previous error messages
    setErrorMessage("");

    // Check if the soul has a linked testimony
    if (soul.testimonyId) {
      setErrorMessage(
        "This soul has a linked testimony and cannot be deleted."
      );
      return;
    }

    setSelectedSoul(soul);
    setDialogVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedSoul) return;

    try {
      await deleteSoulFirebase(selectedSoul.id);
      // Update local state
      setSouls(souls.filter((soul) => soul.id !== selectedSoul.id));
      setSoulCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error deleting soul:", error);
      setErrorMessage(
        error.message || "Failed to delete soul. Please try again."
      );
    } finally {
      setDialogVisible(false);
      setSelectedSoul(null);
    }
  };

  const renderSoul = ({ item }) => {
    const isSelected = selectedSouls.includes(item.id);
    const isPrivate = item.visibility === "private";
    const hasLinkedTestimony = !!item.testimonyId;

    return (
      <List.Item
        title={
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>{item.name}</Text>
            {hasLinkedTestimony && (
              <Chip
                icon="link"
                compact
                variant="outlined"
                style={{
                  marginLeft: 8,
                  backgroundColor: colors.surfaceVariant,
                }}
              >
                Linked
              </Chip>
            )}
          </View>
        }
        description={`Added on ${new Date(
          item.createdAt
        ).toLocaleDateString()}`}
        left={(props) =>
          selectable ? (
            <IconButton
              {...props}
              icon={isSelected ? "checkbox-marked" : "checkbox-blank-outline"}
              onPress={() => onSelect && onSelect(item)}
              disabled={hasLinkedTestimony && !isSelected}
            />
          ) : (
            <List.Icon
              {...props}
              icon={hasLinkedTestimony ? "link" : isPrivate ? "lock" : "earth"}
              color={hasLinkedTestimony ? colors.primary : undefined}
            />
          )
        }
        right={(props) =>
          !selectable && (
            <View style={{ flexDirection: "row" }}>
              {!hasLinkedTestimony && (
                <IconButton
                  icon={isPrivate ? "eye-off" : "eye"}
                  onPress={() => onVisibilityToggle && onVisibilityToggle(item)}
                />
              )}
              <IconButton icon="pencil" onPress={() => handleEditSoul(item)} />
              <IconButton
                icon="delete"
                onPress={() => handleDeleteSoul(item)}
                disabled={hasLinkedTestimony}
                color={hasLinkedTestimony ? colors.outline : undefined}
              />
            </View>
          )
        }
        style={{
          backgroundColor: colors.surface,
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
        backgroundColor: colors.background,
        padding: 16,
      }}
    >
      {errorMessage ? (
        <Chip
          icon="alert-circle"
          mode="flat"
          style={{
            backgroundColor: colors.errorContainer,
            marginBottom: 16,
          }}
        >
          {errorMessage}
        </Chip>
      ) : null}

      {souls.length === 0 ? (
        <Text
          variant="bodyLarge"
          style={{
            textAlign: "center",
            color: colors.onSurfaceVariant,
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

      <CustomDialog
        visible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        title="Delete Soul"
        content="Are you sure you want to delete this soul? This action cannot be undone."
        actions={[
          {
            label: "Cancel",
            onPress: () => setDialogVisible(false),
          },
          {
            label: "Delete",
            onPress: confirmDelete,
          },
        ]}
      />
    </Surface>
  );
};
