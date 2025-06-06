import React from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  HeaderText,
  SubtitleText,
  BodyText,
} from "@components/common/Typography";
import { CustomButton } from "components";
import { spacing } from "styles/theme";
import { Video } from "expo-av"; // Import Video component for playing videos
import { createDisplayName } from "@utils/index";

export const ReadTestimony = ({
  testimony,
  colors,
  onEdit,
  isPublished,
  isAdmin,
}) => {
  // Generate display name using utility function if not already present
  const displayName =
    testimony.displayName ||
    createDisplayName(testimony.firstName, testimony.lastName) ||
    "Anonymous";

  // Check if the testimony is archived (already approved)
  const isArchived = testimony.isArchived === true;

  // Helper function to render a checkbox item
  const renderCheckboxItem = (question, answer) => {
    // Three possible states: "Yes", "No", or undefined/null (not set)
    const isNotSet = !answer || answer === "NotSet";
    const isYes = answer === "Yes";
    const isNo = answer === "No";

    return (
      <View style={styles.checkboxItem}>
        <BodyText style={styles.checkboxQuestion}>{question}</BodyText>
        <View style={styles.checkboxOptions}>
          <View style={styles.optionContainer}>
            <View
              style={[
                styles.checkbox,
                isYes && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
              ]}
            >
              {isYes && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
            </View>
            <BodyText style={styles.optionLabel}>Yes</BodyText>
          </View>

          <View style={styles.optionContainer}>
            <View
              style={[
                styles.checkbox,
                isNo && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
              ]}
            >
              {isNo && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
            </View>
            <BodyText style={styles.optionLabel}>No</BodyText>
          </View>

          {isNotSet && (
            <BodyText style={styles.notSetLabel}>(Not answered)</BodyText>
          )}
        </View>
      </View>
    );
  };

  // Helper function to render a radio option item with multiple choices
  const renderRadioItem = (question, answer, options) => {
    const isNotSet = !answer || answer === "NotSet";

    return (
      <View style={styles.checkboxItem}>
        <BodyText style={styles.checkboxQuestion}>{question}</BodyText>
        <View style={styles.radioOptions}>
          {isNotSet ? (
            <BodyText style={styles.notSetLabel}>(Not answered)</BodyText>
          ) : (
            <BodyText style={styles.selectedAnswer}>{answer}</BodyText>
          )}
        </View>
      </View>
    );
  };

  // Helper function to render a profile item
  const renderProfileItem = (label, value) => {
    return (
      <View style={styles.profileItem}>
        <BodyText style={styles.profileLabel}>{label}:</BodyText>
        <BodyText style={value ? styles.profileValue : styles.notAnsweredValue}>
          {value || "Not Answered"}
        </BodyText>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <HeaderText>{testimony.title || "My Testimony"}</HeaderText>
          <BodyText style={styles.authorText}>By {displayName}</BodyText>
        </View>

        {isPublished && (
          <View
            style={[styles.publishedBadge, { backgroundColor: colors.success }]}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={16}
              color="#FFFFFF"
            />
            <BodyText style={styles.publishedText}>Published</BodyText>
          </View>
        )}

        {isArchived && (
          <View
            style={[styles.publishedBadge, { backgroundColor: colors.warning }]}
          >
            <Ionicons name="archive" size={16} color="#FFFFFF" />
            <BodyText style={styles.publishedText}>Archived</BodyText>
          </View>
        )}
      </View>

      {/* Profile section - Always displayed */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <BodyText style={styles.testimonySectionTitle}>
          Personal Information
        </BodyText>

        <View style={styles.profileContainer}>
          {/* Name */}
          <View style={styles.profileRow}>
            {renderProfileItem("First Name", testimony.firstName)}
            {renderProfileItem("Last Name", testimony.lastName)}
          </View>

          {/* Location and salvation year */}
          <View style={styles.profileRow}>
            {renderProfileItem("City", testimony.city)}
            {renderProfileItem("State", testimony.state)}
            {renderProfileItem("Salvation Year", testimony.salvationYear)}
          </View>

          {/* Contact information */}
          <View style={styles.profileRow}>
            {renderProfileItem("Email", testimony.email)}
            {renderProfileItem("Phone Number", testimony.phoneNumber)}
          </View>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <BodyText style={styles.testimonySectionTitle}>
          Testimony Content
        </BodyText>
        <BodyText style={styles.testimonyContent}>
          {testimony.testimony}
        </BodyText>
      </View>

      {/* Faith questions section */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <BodyText style={styles.testimonySectionTitle}>
          Faith Questions
        </BodyText>

        {renderCheckboxItem(
          "Do you believe that Jesus is the Son of God?",
          testimony.believeJesusSonOfGod
        )}

        {renderCheckboxItem(
          "Do you believe that Jesus was crucified on the cross and rose from the dead?",
          testimony.believeJesusResurrection
        )}

        {renderCheckboxItem(
          "Have you repented from your sins? (sin referring to actions, thoughts, or behaviors that go against God's will and commands)",
          testimony.repentedFromSins
        )}

        {renderCheckboxItem(
          "Do you confess Jesus as your Lord and Savior?",
          testimony.confessJesusLord
        )}

        {renderCheckboxItem(
          "Do you consider yourself born again?",
          testimony.bornAgain
        )}

        {renderCheckboxItem(
          "Do you consider yourself as baptized with the Holy Spirit?",
          testimony.baptizedHolySpirit
        )}
      </View>

      {/* Sexuality questions section */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <BodyText style={styles.testimonySectionTitle}>
          Sexuality Questions
        </BodyText>

        {renderRadioItem(
          "Do you claim to still struggle with same-sex attraction?",
          testimony.struggleSameSexAttraction,
          [
            "Yes, but I pick up my cross and I deny myself from acting on same-sex attraction.",
            "Yes, and I still have relationships (emotionally and/or physically) with the same sex.",
            "No, I do not struggle with same-sex attraction.",
            "I'm not sure.",
          ]
        )}

        {renderCheckboxItem(
          "Do you identify as part of the LGBTQ+ community?",
          testimony.identifyAsLGBTQ
        )}

        {renderCheckboxItem(
          "Do you vow purity and holiness over your body?",
          testimony.vowPurity
        )}

        {renderCheckboxItem(
          "Do you have any emotionally dependent relationships with the same sex?",
          testimony.emotionallyDependentSameSex
        )}

        {renderCheckboxItem(
          "Have you been delivered and/or healed from homosexuality?",
          testimony.healedFromHomosexuality
        )}

        {renderCheckboxItem(
          "Have you repented and renounced homosexuality?",
          testimony.repentedHomosexuality
        )}
      </View>

      {/* Images section - Check for both URL formats to ensure backwards compatibility */}
      {(testimony.beforeImage || testimony.afterImage) && (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <BodyText style={styles.testimonySectionTitle}>Images</BodyText>
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

      {/* Video section - Check for both video and videoUrl to ensure backwards compatibility */}
      {(testimony.video || testimony.videoUrl) && (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <BodyText style={styles.testimonySectionTitle}>Video</BodyText>
          <View style={styles.videoContainer}>
            {testimony.video || testimony.videoUrl ? (
              <Video
                source={{ uri: testimony.video || testimony.videoUrl }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="contain"
                shouldPlay={false}
                isLooping={false}
                useNativeControls
                style={styles.video}
                videoStyle={{
                  height: "100%",
                  width: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <View style={styles.videoPlaceholder}>
                <Ionicons name="videocam" size={24} color={colors.primary} />
                <BodyText style={styles.videoText}>Video Uploaded</BodyText>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Only show edit button if onEdit function is provided */}
      {onEdit && (
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
  publishedBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
  },
  publishedText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: spacing.xs / 2,
  },
  card: {
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
  profileContainer: {
    marginBottom: spacing.sm,
  },
  profileRow: {
    marginBottom: spacing.md,
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  profileLabel: {
    fontWeight: "500",
    marginRight: spacing.xs,
    width: 120, // Fixed width for alignment
  },
  profileValue: {
    flex: 1,
  },
  notAnsweredValue: {
    flex: 1,
    fontStyle: "italic",
    color: "#888888",
  },
  salvationYear: {
    fontStyle: "italic",
    color: "#4CAF50",
  },
  contactInfo: {
    marginLeft: spacing.xs,
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
    width: "100%",
    overflow: "hidden",
    borderRadius: 8,
  },
  video: {
    width: "100%",
    height: 200,
  },
  videoPlaceholder: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  videoText: {
    marginLeft: spacing.sm,
  },
  editButton: {
    marginTop: spacing.md,
  },
  checkboxItem: {
    marginBottom: spacing.md,
  },
  checkboxQuestion: {
    marginBottom: spacing.xs,
  },
  checkboxOptions: {
    flexDirection: "row",
    marginTop: spacing.xs / 2,
    alignItems: "center",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: spacing.md,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#AAAAAA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.xs / 2,
  },
  optionLabel: {
    fontSize: 14,
  },
  notSetLabel: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#888888",
    marginLeft: spacing.xs,
  },
  selectedAnswer: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4CAF50",
    marginTop: spacing.xs,
  },
  radioOptions: {
    marginTop: spacing.xs,
  },
  authorText: {
    fontSize: 14,
    color: "#888888",
    marginTop: spacing.xs,
  },
});
