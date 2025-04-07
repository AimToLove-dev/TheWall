"use client";

import { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Surface } from "react-native-paper";
import {
  HeaderText,
  SubtitleText,
  BodyText,
  ErrorText,
  CustomButton,
  FormContainer,
} from "components";
import { AuthenticatedUserContext } from "providers";
import { getThemeColors, spacing, shadows, borderRadius } from "styles/theme";
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

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchTestimonies();
  }, []);

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
    navigation.goBack();
  };

  const handleApprove = async (testimony) => {
    await updateTestimonyStatus(testimony.id, "approved");
  };

  const handleReject = async (testimony) => {
    await updateTestimonyStatus(testimony.id, "rejected");
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

  const renderItem = ({ item }) => {
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

        <View style={styles.actionButtons}>
          {isProcessing ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleReject(item)}
              >
                <Ionicons name="close-circle" size={20} color="#D32F2F" />
                <BodyText style={styles.rejectButtonText}>Reject</BodyText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={() => handleApprove(item)}
              >
                <Ionicons name="checkmark-circle" size={20} color="#388E3C" />
                <BodyText style={styles.approveButtonText}>Approve</BodyText>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Surface>
    );
  };

  return (
    <FormContainer style={{ backgroundColor: colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.card }]}
          onPress={handleBackPress}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <HeaderText style={styles.title}>Testimony Admin</HeaderText>
          <SubtitleText style={styles.subtitle}>
            Manage pending testimonies
          </SubtitleText>
        </View>
      </View>

      {error && <ErrorText style={styles.errorText}>{error}</ErrorText>}

      {loading && testimonies.length === 0 ? (
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
          renderItem={renderItem}
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
    borderRadius: 20,
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
    borderRadius: borderRadius.md,
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  approveButton: {
    borderLeftWidth: 1,
    borderLeftColor: "rgba(0,0,0,0.1)",
  },
  approveButtonText: {
    color: "#388E3C",
    marginLeft: spacing.xs,
    fontWeight: "bold",
  },
  rejectButtonText: {
    color: "#D32F2F",
    marginLeft: spacing.xs,
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
});
