import React from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HeaderText, SubtitleText, BodyText } from "components/Typography";
import { CustomButton } from "components";
import { spacing } from "styles/theme";

export const ReadTestimony = ({ testimony, colors, onEdit, status }) => {
  const renderStatusBadge = () => {
    let color;
    let text;
    let icon;

    switch (status) {
      case "approved":
        color = colors.success;
        text = "Published";
        icon = "checkmark-circle-outline";
        break;
      case "review":
        color = colors.warning;
        text = "In Review";
        icon = "time-outline";
        break;
      case "pending":
        color = colors.warning;
        text = "Pending Review";
        icon = "time-outline";
        break;
      case "rejected":
        color = colors.error;
        text = "Needs Updates";
        icon = "alert-circle-outline";
        break;
      case "unlinked":
        color = colors.primary;
        text = "Incomplete";
        icon = "link-outline";
        break;
      default:
        color = colors.text;
        text = "Draft";
        icon = "document-outline";
    }

    return (
      <View style={[styles.statusBadge, { backgroundColor: color }]}>
        <Ionicons name={icon} size={16} color="#FFFFFF" />
        <BodyText style={styles.statusText}>{text}</BodyText>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <HeaderText>My Testimony</HeaderText>
        <View style={styles.statusContainer}>{renderStatusBadge()}</View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <BodyText style={styles.testimonySectionTitle}>
          Testimony Content
        </BodyText>
        <BodyText style={styles.testimonyContent}>
          {testimony.testimony}
        </BodyText>
      </View>

      {(testimony.beforeImage || testimony.afterImage) && (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <BodyText style={styles.testimonySectionTitle}>Media</BodyText>
          <View style={styles.imagesRow}>
            {testimony.beforeImage && (
              <View style={styles.imageContainer}>
                <SubtitleText style={styles.imageLabel}>Before</SubtitleText>
                <Image
                  source={{ uri: testimony.beforeImage }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            )}
            {testimony.afterImage && (
              <View style={styles.imageContainer}>
                <SubtitleText style={styles.imageLabel}>After</SubtitleText>
                <Image
                  source={{ uri: testimony.afterImage }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            )}
          </View>
        </View>
      )}

      {testimony.videoUrl && (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <BodyText style={styles.testimonySectionTitle}>Video</BodyText>
          <View style={styles.videoContainer}>
            <Ionicons name="videocam" size={24} color={colors.primary} />
            <BodyText style={styles.videoText}>Video Uploaded</BodyText>
          </View>
        </View>
      )}

      {status !== "approved" && status !== "review" && (
        <CustomButton
          title="Edit Testimony"
          variant="primary"
          onPress={onEdit}
          style={styles.editButton}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 20,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: spacing.xs / 2,
  },
  card: {
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  testimonySectionTitle: {
    fontWeight: "bold",
    marginBottom: spacing.sm,
  },
  testimonyContent: {
    lineHeight: 22,
  },
  imagesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageContainer: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  imageLabel: {
    fontSize: 14,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
  },
  videoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 8,
  },
  videoText: {
    marginLeft: spacing.sm,
  },
  editButton: {
    marginTop: spacing.md,
  },
});
