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
  CustomInput,
  FormContainer,
  ReadTestimony,
  EditTestimony,
} from "components";
import { AuthenticatedUserContext } from "providers";
import { getThemeColors, spacing, shadows } from "styles/theme";
import {
  queryDocuments,
  updateDocument,
  addDocument,
  deleteDocument,
  getDocumentById,
} from "utils/firebaseUtils";
import { addSoul } from "utils";

export const TestimonyReviewScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = getThemeColors(isDark);

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [processing, setProcessing] = useState({});
  const [reviewingSubmission, setReviewingSubmission] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Handle Android back button when reviewing a testimony
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (reviewingSubmission) {
          // Return to list view
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
    }, [reviewingSubmission])
  );

  // Cleanup function when navigating away
  useEffect(() => {
    return () => {
      setReviewingSubmission(null);
    };
  }, []);

  const fetchSubmissions = async (page = 1) => {
    if (page === 1) {
      setLoading(true);
    }

    try {
      setError(null);

      // Query testimonySubmissions collection
      const queryResults = await queryDocuments(
        "testimonySubmissions",
        [], // No status filter needed as we're using a separate collection
        [["submittedAt", "asc"]], // Oldest first
        ITEMS_PER_PAGE
      );

      if (page === 1) {
        setSubmissions(queryResults);
      } else {
        setSubmissions((prev) => [...prev, ...queryResults]);
      }

      // Check if there are more pages
      setHasMorePages(queryResults.length === ITEMS_PER_PAGE);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching testimony submissions:", err);
      setError("Failed to load testimony submissions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreSubmissions = () => {
    if (!loading && hasMorePages) {
      fetchSubmissions(currentPage + 1);
    }
  };

  const handleBackPress = () => {
    if (reviewingSubmission) {
      // Return to the testimony list view
      handleCancelReview();
    } else {
      navigation.goBack();
    }
  };

  const handleCancelReview = () => {
    setReviewingSubmission(null);
    setIsEditing(false);
  };

  const handleReview = (submission) => {
    setReviewingSubmission(submission);
  };

  const handleApprove = async (submission) => {
    setProcessing((prev) => ({ ...prev, [submission.id]: true }));

    try {
      // Validate submission title
      if (
        !submission.title?.trim() ||
        submission.title.trim() === "My Testimony"
      ) {
        throw new Error("Custom Testimony title is required");
      }

      // PRIVATE: Add to testimoniesArchive collection (full data)
      const testimonyArchiveId = await addDocument("testimonyArchive", {
        ...submission,
        reviewedAt: new Date().toISOString(),
        reviewedBy: user.uid,
      });

      // PUBLIC: Add to testimonies collection with only the specified fields
      const testimonyId = await addDocument("testimonies", {
        id: submission.id,
        title: submission.title,
        testimony: submission.testimony,
        beforeImage: submission.beforeImage || null,
        afterImage: submission.afterImage || null,
        video: submission.video || null,
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt || new Date().toISOString(), // Ensure updatedAt is always defined
        approvedAt: new Date().toISOString(),
        soulId: null, // Will be updated after soul creation
        userId: submission.userId || null,
        displayName: submission.displayName || "Anonymous",
        reviewedAt: new Date().toISOString(),
        reviewedBy: user.uid,
      });

      // Create a soul with the testimony ID
      const soulData = {
        name: submission.displayName || "Anonymous",
        userId: submission.userId || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        testimonyId: testimonyId,
      };

      // Add the soul to the wall
      await addSoul(soulData);

      // Remove from testimonySubmissions collection
      await deleteDocument("testimonySubmissions", submission.id);

      // Update local state
      setSubmissions((prev) => prev.filter((s) => s.id !== submission.id));
      setReviewingSubmission(null);
    } catch (err) {
      console.error(`Error approving submission ${submission.id}:`, err);
      setError(
        err.message || "Failed to approve submission. Please try again."
      );
    } finally {
      setProcessing((prev) => ({ ...prev, [submission.id]: false }));
    }
  };

  const handleReject = async (submission) => {
    setProcessing((prev) => ({ ...prev, [submission.id]: true }));

    try {
      // Remove from testimonySubmissions collection
      await deleteDocument("testimonySubmissions", submission.id);

      // Update local state
      setSubmissions((prev) => prev.filter((s) => s.id !== submission.id));
      setReviewingSubmission(null);
    } catch (err) {
      console.error(`Error rejecting submission ${submission.id}:`, err);
      setError("Failed to reject submission. Please try again.");
    } finally {
      setProcessing((prev) => ({ ...prev, [submission.id]: false }));
    }
  };

  const handleEditTestimony = () => {
    setIsEditing(true);
  };

  const handleSaveEdits = async (values) => {
    setProcessing((prev) => ({ ...prev, [reviewingSubmission.id]: true }));

    try {
      // Update the testimony submission with the edited values
      await updateDocument("testimonySubmissions", reviewingSubmission.id, {
        ...reviewingSubmission,
        ...values,
        updatedAt: new Date().toISOString(),
        reviewedBy: user.uid,
      });

      // Refresh the updated testimony
      const updatedSubmission = await getDocumentById(
        "testimonySubmissions",
        reviewingSubmission.id
      );
      setReviewingSubmission(updatedSubmission);

      // Return to review mode
      setIsEditing(false);
    } catch (err) {
      console.error(
        `Error updating submission ${reviewingSubmission.id}:`,
        err
      );
      setError("Failed to save changes. Please try again.");
    } finally {
      setProcessing((prev) => ({ ...prev, [reviewingSubmission.id]: false }));
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const renderSubmissionCard = ({ item }) => {
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
          {reviewingSubmission
            ? isEditing
              ? "Edit Submission"
              : "Review Submission"
            : "Testimony Review"}
        </HeaderText>
        <SubtitleText style={styles.subtitle}>
          {reviewingSubmission
            ? isEditing
              ? "Edit and save changes"
              : "Review and make a decision"
            : "Manage pending submissions"}
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
      marginRight: spacing.md,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
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
    titleInputContainer: {
      margin: spacing.md,
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
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    createButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
      marginRight: spacing.md,
    },
  });

  return (
    <FormContainer style={{ backgroundColor: colors.background }}>
      <View style={styles.content}>
        {/* Header with back button */}
        <View style={styles.headerRow}>
          {renderHeader()}

          {/* Edit button for testimony */}
          {reviewingSubmission && (
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.primary }]}
              onPress={handleEditTestimony}
            >
              <Ionicons name="pencil" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        {reviewingSubmission ? (
          isEditing ? (
            // Show EditTestimony component with save/cancel buttons
            <View style={styles.reviewContainer}>
              <EditTestimony
                initialTestimony={reviewingSubmission}
                onSubmit={handleSaveEdits}
                onCancel={handleCancelEdit}
                isEdit={true}
                isAdmin={true}
              />
            </View>
          ) : (
            // Show ReadTestimony component with approval/reject buttons
            <View style={styles.reviewContainer}>
              <ReadTestimony
                testimony={reviewingSubmission}
                colors={colors}
                status="review"
                isAdmin={true}
              />

              <View style={styles.actionButtonsContainer}>
                {processing[reviewingSubmission.id] ? (
                  <ActivityIndicator color={colors.primary} size="large" />
                ) : (
                  <>
                    {error && (
                      <ErrorText style={styles.errorText}>{error}</ErrorText>
                    )}
                    <View style={styles.buttonsRow}>
                      <CustomButton
                        title="Cancel"
                        variant="outline"
                        leftIcon={
                          <Ionicons
                            name="arrow-back"
                            size={20}
                            color="#666666"
                          />
                        }
                        onPress={handleCancelReview}
                        style={styles.actionButton}
                        textStyle={styles.cancelButtonText}
                      />

                      <CustomButton
                        title="Reject"
                        variant="outline"
                        leftIcon={
                          <Ionicons
                            name="close-circle"
                            size={20}
                            color="#D32F2F"
                          />
                        }
                        textStyle={styles.rejectButtonText}
                        onPress={() => handleReject(reviewingSubmission)}
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
                        onPress={() => handleApprove(reviewingSubmission)}
                        style={[styles.actionButton, styles.approveButton]}
                        textStyle={styles.approveButtonText}
                      />
                    </View>
                  </>
                )}
              </View>
            </View>
          )
        ) : loading && submissions.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <BodyText style={styles.loadingText}>
              Loading submissions...
            </BodyText>
          </View>
        ) : submissions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="checkmark-circle-outline"
              size={48}
              color={colors.primary}
            />
            <BodyText style={styles.emptyText}>
              There are no pending submissions to review
            </BodyText>
          </View>
        ) : (
          <FlatList
            data={submissions}
            renderItem={renderSubmissionCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            onEndReached={loadMoreSubmissions}
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
      </View>
    </FormContainer>
  );
};
