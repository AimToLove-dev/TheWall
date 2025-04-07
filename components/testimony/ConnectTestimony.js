import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CustomButton } from "components";
import { BodyText, ErrorText } from "components/Typography";
import { spacing } from "styles/theme";

export const ConnectTestimony = ({
  matchingSouls,
  onSubmit,
  onBack,
  loading,
  errorState,
  colors,
}) => {
  const [selectedSoulId, setSelectedSoulId] = useState(null);

  const handleSubmit = () => {
    onSubmit(selectedSoulId);
  };

  const handleSelectSoul = (soul) => {
    // Don't allow selection of souls that already have a linked testimony
    if (soul.testimonyId) {
      return;
    }
    setSelectedSoulId(soul.id);
  };

  return (
    <View style={styles.claimsContainer}>
      {matchingSouls.length > 0 ? (
        <View>
          <BodyText style={styles.claimsInstructions}>
            We found the following matching names on The Wall. Please select
            your entry:
          </BodyText>

          <View style={styles.soulsList}>
            {matchingSouls.map((soul) => {
              const hasLinkedTestimony = !!soul.testimonyId;
              return (
                <TouchableOpacity
                  key={soul.id}
                  style={[
                    styles.soulItem,
                    selectedSoulId === soul.id && styles.selectedSoul,
                    hasLinkedTestimony && styles.linkedSoul,
                  ]}
                  onPress={() => handleSelectSoul(soul)}
                  disabled={hasLinkedTestimony}
                >
                  <View style={styles.soulInfo}>
                    <BodyText style={styles.soulName}>{soul.name}</BodyText>
                    <BodyText style={styles.soulSubmitter}>
                      Added by: {soul.email || "Anonymous"}
                    </BodyText>
                    {hasLinkedTestimony && (
                      <BodyText style={styles.linkedText}>
                        Already linked to a testimony
                      </BodyText>
                    )}
                  </View>
                  {hasLinkedTestimony ? (
                    <Ionicons name="link" size={24} color={colors.disabled} />
                  ) : (
                    <Ionicons
                      name={
                        selectedSoulId === soul.id
                          ? "radio-button-on"
                          : "radio-button-off"
                      }
                      size={24}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : (
        <View style={styles.noMatchContainer}>
          <BodyText>
            No matching names found on The Wall. A new entry will be created for
            you.
          </BodyText>
        </View>
      )}

      {errorState !== "" && <ErrorText>{errorState}</ErrorText>}

      <View style={styles.actionsContainer}>
        <CustomButton
          title="Back"
          variant="outline"
          onPress={onBack}
          style={styles.actionButton}
        />
        <CustomButton
          title={
            matchingSouls.length > 0
              ? "Connect to Selected"
              : "Create New Entry"
          }
          variant="primary"
          onPress={handleSubmit}
          loading={loading}
          disabled={(matchingSouls.length > 0 && !selectedSoulId) || loading}
          style={styles.actionButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  claimsContainer: {
    padding: spacing.lg,
  },
  claimsInstructions: {
    marginBottom: spacing.md,
  },
  soulsList: {
    marginBottom: spacing.lg,
  },
  soulItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginBottom: spacing.sm,
  },
  selectedSoul: {
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  linkedSoul: {
    opacity: 0.6,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  soulInfo: {
    flex: 1,
  },
  soulName: {
    fontWeight: "bold",
  },
  soulSubmitter: {
    fontSize: 12,
    color: "rgba(0,0,0,0.6)",
  },
  linkedText: {
    fontSize: 12,
    color: "rgba(200,0,0,0.8)",
    marginTop: 4,
    fontStyle: "italic",
  },
  noMatchContainer: {
    marginBottom: spacing.lg,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
});
