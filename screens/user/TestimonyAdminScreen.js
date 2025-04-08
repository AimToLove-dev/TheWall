"use client";

import { useState, useEffect, useContext, useCallback } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Surface } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import {
  HeaderText,
  SubtitleText,
  BodyText,
  ErrorText,
  CustomButton,
  FormContainer,
  ReadTestimony,
} from "components";
import { AuthenticatedUserContext } from "providers";
import { getThemeColors, spacing, shadows } from "styles/theme";
import { queryDocuments, updateDocument } from "utils/firebaseUtils";

export const TestimonyAdminScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);

  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [processing, setProcessing] = useState({});
  const [reviewingTestimony, setReviewingTestimony] = useState(null);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchTestimonies();
  }, []);

  // Handle Android back button when reviewing a testimony
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (reviewingTestimony) {
          // Revert to pending status and return to list
          handleCancelReview();
          return true; // Prevent default behavior
        }
        return false; // Let default behavior happen (navigate back)
      };

      // Add back button handler for Android
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        // Clean up event listener
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [reviewingTestimony])
  );

  // Cleanup function - ensure we reset any testimony in review state when navigating away
  useEffect(() => {
    // This will run when the component unmounts
    return () => {
      if (reviewingTestimony) {
        // Reset testimony status to pending if it's in review state
        resetTestimonyToPending(reviewingTestimony.id);
      }
    };
  }, [reviewingTestimony]);

  const resetTestimonyToPending = async (testimonyId) => {
    try {
      await updateDocument("testimonies", testimonyId, {
        status: "pending",
      });
      console.log(`Testimony ${testimonyId} reset to pending status`);
    } catch (err) {
      console.error(`Error resetting testimony ${testimonyId}:`, err);
    }
  };

  const fetchTestimonies = async (page = 1) => {
    if (page === 1) {
      setLoading(true);
    }

    try {
      setError(null);

      // Query testimonies with status "pending"
      const queryResults = await queryDocuments(
        "testimonies",
        [["status", "==", "pending"]],
        [["submittedAt", "asc"]], // Oldest first
        ITEMS_PER_PAGE
      );

      if (page === 1) {
        setTestimonies(queryResults);
      } else {
        setTestimonies((prev) => [...prev, ...queryResults]);
      }

      // Check if there are more pages
      setHasMorePages(queryResults.length === ITEMS_PER_PAGE);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching testimonies:", err);
      setError("Failed to load testimonies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreTestimonies = () => {
    if (!loading && hasMorePages) {
      fetchTestimonies(currentPage + 1);
    }
  };

  const handleBackPress = () => {
    if (reviewingTestimony) {
      // Return to the testimony list view and reset status to pending
      handleCancelReview();
    } else {
      navigation.goBack();
    }
  };

  // New function to handle canceling review
  const handleCancelReview = async () => {
    if (!reviewingTestimony) return;

    setProcessing((prev) => ({ ...prev, [reviewingTestimony.id]: true }));

    try {
      // Reset testimony status back to pending
      await updateDocument("testimonies", reviewingTestimony.id, {
        status: "pending",
      });

      // Update local state to reflect this change
      setTestimonies((prev) =>
        prev.map((t) =>
          t.id === reviewingTestimony.id ? { ...t, status: "pending" } : t
        )
      );

      // Exit review mode
      setReviewingTestimony(null);
    } catch (err) {
      console.error(`Error resetting testimony ${reviewingTestimony.id}:`, err);
      setError(`Failed to reset testimony status. Please try again.`);
    } finally {
      setProcessing((prev) => ({ ...prev, [reviewingTestimony.id]: false }));
    }
  };

  const handleReview = async (testimony) => {
    setProcessing((prev) => ({ ...prev, [testimony.id]: true }));

    try {
      // Update status to "review"
      await updateDocument("testimonies", testimony.id, {
        status: "review",
      });

      // Set the current testimony being reviewed with updated status
      setReviewingTestimony({
        ...testimony,
        status: "review",
      });
    } catch (err) {
      console.error(`Error updating testimony ${testimony.id}:`, err);
      setError(`Failed to update testimony status. Please try again.`);
    } finally {
      setProcessing((prev) => ({ ...prev, [testimony.id]: false }));
    }
  };

  const handleApprove = async (testimony) => {
    await updateTestimonyStatus(testimony.id, "approved");
    // Return to list view after approval
    setReviewingTestimony(null);
  };

  const handleReject = async (testimony) => {
    await updateTestimonyStatus(testimony.id, "rejected");
    // Return to list view after rejection
    setReviewingTestimony(null);
  };

  const updateTestimonyStatus = async (testimonyId, status) => {
    setProcessing((prev) => ({ ...prev, [testimonyId]: true }));

    try {
      await updateDocument("testimonies", testimonyId, {
        status,
        reviewedAt: new Date().toISOString(),
        reviewedBy: user.uid,
      });

      // Remove the testimony from the list
      setTestimonies((prev) => prev.filter((t) => t.id !== testimonyId));
    } catch (err) {
      console.error(`Error updating testimony ${testimonyId}:`, err);
      setError(`Failed to update testimony. Please try again.`);
    } finally {
      setProcessing((prev) => ({ ...prev, [testimonyId]: false }));
    }
  };

  const renderTestimonyCard = ({ item }) => {
    const isProcessing = processing[item.id];

    return (
      <Surface
        style={[styles.testimonyCard, { backgroundColor: colors.surface }]}
        elevation={1}
      >
        <View style={styles.testimonyHeader}>
          <View>
            <BodyText style={styles.nameText}>
              {item.displayName || "Anonymous"}
            </BodyText>
            <BodyText style={styles.dateText}>
              Submitted: {new Date(item.submittedAt).toLocaleDateString()}
            </BodyText>
          </View>
        </View>

        <View style={styles.testimonyContent}>
          <BodyText numberOfLines={3} style={styles.testimonyText}>
            {item.testimony}
          </BodyText>
        </View>

        <View style={styles.mediaIndicators}>
          {item.beforeImage && (
            <View style={styles.mediaIndicator}>
              <Ionicons name="image-outline" size={16} color={colors.primary} />
              <BodyText style={styles.mediaText}>Before</BodyText>
            </View>
          )}

          {item.afterImage && (
            <View style={styles.mediaIndicator}>
              <Ionicons name="image-outline" size={16} color={colors.primary} />
              <BodyText style={styles.mediaText}>After</BodyText>
            </View>
          )}

          {item.video && (
            <View style={styles.mediaIndicator}>
              <Ionicons
                name="videocam-outline"
                size={16}
                color={colors.primary}
              />
              <BodyText style={styles.mediaText}>Video</BodyText>
            </View>
          )}
        </View>

        <View style={styles.reviewButtonContainer}>
          <CustomButton
            title="Review"
            variant="primary"
            onPress={() => handleReview(item)}
            loading={isProcessing}
            disabled={isProcessing}
            style={styles.reviewButton}
          />
        </View>
      </Surface>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: colors.card }]}
        onPress={handleBackPress}
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <HeaderText style={styles.title}>
          {reviewingTestimony ? "Review Testimony" : "Testimony Admin"}
        </HeaderText>
        <SubtitleText style={styles.subtitle}>
          {reviewingTestimony
            ? "Review and make a decision"
            : "Manage pending testimonies"}
        </SubtitleText>
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.md,
      ...shadows.small,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: 22,
    },
    subtitle: {
      opacity: 0.7,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      marginTop: spacing.md,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.xl,
    },
    emptyText: {
      marginTop: spacing.md,
      textAlign: "center",
    },
    errorText: {
      textAlign: "center",
      margin: spacing.md,
    },
    listContainer: {
      padding: spacing.lg,
    },
    testimonyCard: {
      padding: spacing.md,
      marginBottom: spacing.md,
      ...shadows.small,
    },
    testimonyHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.xs,
    },
    nameText: {
      fontWeight: "bold",
    },
    dateText: {
      fontSize: 12,
      opacity: 0.7,
    },
    testimonyContent: {
      marginVertical: spacing.sm,
    },
    testimonyText: {
      lineHeight: 20,
    },
    mediaIndicators: {
      flexDirection: "row",
      marginBottom: spacing.sm,
    },
    mediaIndicator: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: spacing.md,
    },
    mediaText: {
      fontSize: 12,
      marginLeft: 4,
    },
    actionButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderTopWidth: 1,
      borderTopColor: "rgba(0,0,0,0.1)",
      paddingTop: spacing.sm,
      marginTop: spacing.xs,
    },
    actionButton: {
      flex: 1,
      minHeight: 48,
      marginHorizontal: 0,
      ...shadows.small,
    },
    approveButton: {
      backgroundColor: "#4CAF50",
    },
    approveButtonText: {
      color: "#FFFFFF",
      fontWeight: "bold",
    },
    rejectButtonText: {
      color: "#D32F2F",
      fontWeight: "bold",
    },
    loadingMoreContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: spacing.md,
    },
    loadingMoreText: {
      marginLeft: spacing.sm,
    },
    reviewContainer: {
      flex: 1,
      paddingBottom: spacing.lg,
    },
    actionButtonsContainer: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.borderColor,
    },
    rejectButton: {
      borderColor: "#D32F2F",
      borderWidth: 1,
    },
    reviewButtonContainer: {
      backgroundColor: colors.surface,
      paddingTop: spacing.sm,
      marginTop: spacing.xs,
      borderTopWidth: 1,
      borderTopColor: colors.borderColor,
    },
    reviewButton: {
      width: "100%",
    },
    buttonsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      gap: spacing.sm,
    },
    cancelButtonText: {
      color: "#666666",
      fontWeight: "500",
    },
  });

  return (
    <FormContainer style={{ backgroundColor: colors.background }}>
      {renderHeader()}

      {error && <ErrorText style={styles.errorText}>{error}</ErrorText>}

      {reviewingTestimony ? (
        // Show ReadTestimony component with approval/reject buttons
        <View style={styles.reviewContainer}>
          <ReadTestimony
            testimony={reviewingTestimony}
            colors={colors}
            status={reviewingTestimony.status}
          />

          <View style={styles.actionButtonsContainer}>
            {processing[reviewingTestimony.id] ? (
              <ActivityIndicator color={colors.primary} size="large" />
            ) : (
              <View style={styles.buttonsRow}>
                <CustomButton
                  title="Cancel"
                  variant="outline"
                  leftIcon={
                    <Ionicons name="arrow-back" size={20} color="#666666" />
                  }
                  onPress={handleCancelReview}
                  style={styles.actionButton}
                  textStyle={styles.cancelButtonText}
                />

                <CustomButton
                  title="Reject"
                  variant="outline"
                  leftIcon={
                    <Ionicons name="close-circle" size={20} color="#D32F2F" />
                  }
                  textStyle={styles.rejectButtonText}
                  onPress={() => handleReject(reviewingTestimony)}
                  style={[styles.actionButton, styles.rejectButton]}
                />

                <CustomButton
                  title="Approve"
                  variant="primary"
                  leftIcon={
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#FFFFFF"
                    />
                  }
                  onPress={() => handleApprove(reviewingTestimony)}
                  style={[styles.actionButton, styles.approveButton]}
                  textStyle={styles.approveButtonText}
                />
              </View>
            )}
          </View>
        </View>
      ) : loading && testimonies.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <BodyText style={styles.loadingText}>Loading testimonies...</BodyText>
        </View>
      ) : testimonies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="checkmark-circle-outline"
            size={48}
            color={colors.primary}
          />
          <BodyText style={styles.emptyText}>
            There are no pending testimonies to review
          </BodyText>
        </View>
      ) : (
        <FlatList
          data={testimonies}
          renderItem={renderTestimonyCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          onEndReached={loadMoreTestimonies}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            hasMorePages && (
              <View style={styles.loadingMoreContainer}>
                <ActivityIndicator color={colors.primary} />
                <BodyText style={styles.loadingMoreText}>
                  Loading more...
                </BodyText>
              </View>
            )
          }
        />
      )}
    </FormContainer>
  );
};
