"use client";

import { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  ScrollView,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Modal,
  Linking,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AuthenticatedUserContext } from "providers";
import {
  HeaderText,
  SubtitleText,
  BodyText,
  FormContainer,
  DashboardHeader,
  CustomButton,
  UrlInput,
  CustomInput,
  BottomSheet,
  MediaUpload,
} from "components";
import { PageLinkBlock } from "components/home/PageLinkBlock";
import { getThemeColors, spacing } from "styles/theme";
import {
  updateConfigSettings,
  getAllMorePages,
  createMorePage,
  updateMorePage,
  deleteMorePage,
} from "utils/configUtils";
import { Surface } from "react-native-paper";

//

// Get screen width to determine layout
const screenWidth = Dimensions.get("window").width;
const isLargeScreen = screenWidth > 900;
const numColumns = isLargeScreen ? 3 : 2;

export const ConfigurationManagerScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const colors = getThemeColors();

  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState({
    inviteFormUrl: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [updatedUrl, setUpdatedUrl] = useState("");
  const [morePages, setMorePages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMorePage, setCurrentMorePage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    embedUrl: "",
    iconName: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Load config settings and more pages when component mounts
  useEffect(() => {
    loadMorePages();
  }, []);

  const loadMorePages = async () => {
    try {
      const pages = await getAllMorePages();
      setMorePages(pages);
    } catch (error) {
      console.error("Error loading more pages:", error);
      Alert.alert("Error", "Failed to load more pages");
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const openCreateModal = () => {
    setCurrentMorePage(null);
    setFormData({
      title: "",
      description: "",
      embedUrl: "",
      iconName: "",
    });
    setFormErrors({});
    setModalVisible(true);
  };

  const openEditModal = (page) => {
    setCurrentMorePage(page);
    setFormData({
      title: page.title || "",
      description: page.description || "",
      embedUrl: page.embedUrl || "",
      iconName: page.iconName || "",
    });
    setFormErrors({});
    setModalVisible(true);
  };

  const handleFormChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors({
        ...formErrors,
        [field]: null,
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title) {
      errors.title = "Title is required";
    }

    if (!formData.embedUrl) {
      errors.embedUrl = "Embed URL is required";
    } else if (!formData.embedUrl.startsWith("http")) {
      errors.embedUrl = "Please enter a valid URL";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveMorePage = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);

      if (currentMorePage) {
        // Update existing page
        await updateMorePage(currentMorePage.id, formData);
        Alert.alert("Success", "Page updated successfully");
      } else {
        // Create new page
        await createMorePage(formData);
        Alert.alert("Success", "New page created successfully");
      }

      // Refresh the list
      await loadMorePages();
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving more page:", error);
      Alert.alert("Error", "Failed to save page");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMorePage = async (pageId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this page? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMorePage(pageId);
              await loadMorePages();
              Alert.alert("Success", "Page deleted successfully");
            } catch (error) {
              console.error("Error deleting more page:", error);
              Alert.alert("Error", "Failed to delete page");
            }
          },
        },
      ]
    );
  };

  // Add new functions to handle page reordering
  const handleMovePageUp = async (item) => {
    if (item.order <= 0) return; // Already at the top

    try {
      // Get the page above this one
      const pageAbove = morePages.find((page) => page.order === item.order - 1);
      if (!pageAbove) return;

      // Swap orders
      await updateMorePage(item.id, { order: item.order - 1 });
      await updateMorePage(pageAbove.id, { order: item.order });

      // Refresh list
      await loadMorePages();
    } catch (error) {
      console.error("Error moving page up:", error);
      Alert.alert("Error", "Failed to change page order");
    }
  };

  const handleMovePageDown = async (item) => {
    if (item.order >= morePages.length - 1) return; // Already at the bottom

    try {
      // Get the page below this one
      const pageBelow = morePages.find((page) => page.order === item.order + 1);
      if (!pageBelow) return;

      // Swap orders
      await updateMorePage(item.id, { order: item.order + 1 });
      await updateMorePage(pageBelow.id, { order: item.order });

      // Refresh list
      await loadMorePages();
    } catch (error) {
      console.error("Error moving page down:", error);
      Alert.alert("Error", "Failed to change page order");
    }
  };

  const renderMorePageItem = ({ item, index }) => {
    // Calculate margins based on index and number of columns
    const isFirstInRow = index % numColumns === 0;
    const isLastInRow = (index + 1) % numColumns === 0;
    const isAtTop = item.order === 0;
    const isAtBottom = item.order === morePages.length - 1;

    const itemStyle = {
      flex: 1,
      margin: 4,
      marginLeft: isFirstInRow ? 0 : 4,
      marginRight: isLastInRow ? 0 : 4,
      minWidth: 150,
    };

    return (
      <View style={itemStyle}>
        <Surface style={styles.pageCard} elevation={1}>
          {/* Simple overlay preview */}
          <View style={styles.previewWrapper}>
            <PageLinkBlock
              title={item.title?.toUpperCase() || "UNTITLED"}
              onPress={() => {}} // No action needed in preview
              imageSrc={item.iconName}
              description={item.description || "No description provided"}
              iconInButton={true}
              wobbleDelay={0} // Disable wobble for preview
              startingDelay={0}
            />

            {/* Action buttons overlay */}
            <View style={styles.previewOverlay}>
              <View style={styles.pageCardActions}>
                <TouchableOpacity
                  onPress={() => openEditModal(item)}
                  style={[
                    styles.iconButton,
                    { backgroundColor: colors.success, opacity: 0.9 },
                  ]}
                >
                  <Ionicons name="create-outline" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    // Open the URL in a browser
                    if (item.embedUrl) {
                      if (Platform.OS === "web") {
                        window.open(item.embedUrl, "_blank");
                      } else {
                        Linking.openURL(item.embedUrl).catch((err) =>
                          console.error("Failed to open URL:", err)
                        );
                      }
                    }
                  }}
                  style={[
                    styles.iconButton,
                    { backgroundColor: "#0075cf", opacity: 0.9 },
                  ]}
                >
                  <Ionicons name="open-outline" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteMorePage(item.id)}
                  style={[
                    styles.iconButton,
                    { backgroundColor: colors.error, opacity: 0.9 },
                  ]}
                >
                  <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Order control buttons */}
              <View style={styles.orderControls}>
                <TouchableOpacity
                  onPress={() => handleMovePageUp(item)}
                  disabled={isAtTop}
                  style={[
                    styles.orderButton,
                    {
                      backgroundColor: isAtTop
                        ? "rgba(0,0,0,0.2)"
                        : colors.primary,
                      opacity: isAtTop ? 0 : 0.9,
                    },
                  ]}
                >
                  <Ionicons name="arrow-up" size={16} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleMovePageDown(item)}
                  disabled={isAtBottom}
                  style={[
                    styles.orderButton,
                    {
                      backgroundColor: isAtBottom
                        ? "rgba(0,0,0,0.2)"
                        : colors.primary,
                      opacity: isAtBottom ? 0 : 0.9,
                    },
                  ]}
                >
                  <Ionicons name="arrow-down" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Surface>
      </View>
    );
  };

  const renderMorePagesModal = () => (
    <BottomSheet
      isVisible={modalVisible}
      onClose={() => setModalVisible(false)}
      duration={300}
    >
      <View style={[styles.bottomSheetContent]}>
        <HeaderText style={styles.modalTitle}>
          {currentMorePage ? "Edit Page" : "Add New Page"}
        </HeaderText>

        <ScrollView
          style={styles.formScrollView}
          showsVerticalScrollIndicator={false}
        >
          <CustomInput
            placeholder="Page Title"
            value={formData.title}
            onChangeText={(text) => handleFormChange("title", text)}
            error={formErrors.title}
            touched={true}
            label="Title (required)"
          />

          <CustomInput
            placeholder="Description"
            value={formData.description}
            onChangeText={(text) => handleFormChange("description", text)}
            multiline={true}
            numberOfLines={3}
            label="Description (optional)"
          />

          <CustomInput
            placeholder="https://forms.google.com/..."
            value={formData.embedUrl}
            onChangeText={(text) => handleFormChange("embedUrl", text)}
            error={formErrors.embedUrl}
            touched={true}
            label="Embed URL (required)"
            keyboardType="url"
          />

          <MediaUpload
            onImageSelect={(downloadURL) =>
              handleFormChange("iconName", downloadURL)
            }
            initialImage={formData.iconName}
            label="Icon Image (optional)"
            propertyName="morePageIcon"
            isAdmin={true}
          />

          <View style={styles.modalActions}>
            <CustomButton
              title="Cancel"
              onPress={() => setModalVisible(false)}
              variant="outline"
              style={styles.modalButton}
            />
            <CustomButton
              title={currentMorePage ? "Update" : "Create"}
              onPress={handleSaveMorePage}
              variant="primary"
              style={styles.modalButton}
              loading={isSaving}
            />
          </View>
        </ScrollView>
      </View>
    </BottomSheet>
  );

  return (
    <View>
      <View style={styles.content}>
        <DashboardHeader
          title="Manage Embed Pages"
          subtitle="Customize the home page link blocks"
          onBackPress={handleBackPress}
          showSignOut={false}
          colors={colors}
        />

        <ScrollView
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
        >
          {morePages.length > 0 ? (
            <View style={styles.gridContainer}>
              <FlatList
                data={morePages}
                renderItem={renderMorePageItem}
                keyExtractor={(item) => item.id}
                numColumns={numColumns}
                scrollEnabled={false}
                style={styles.pagesList}
                contentContainerStyle={styles.pagesGrid}
              />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <BodyText style={styles.emptyStateText}>
                No pages have been created yet. Add your first page using the
                plus button.
              </BodyText>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Floating Plus Button */}
      <TouchableOpacity
        style={styles.floatingPlusButton}
        onPress={openCreateModal}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>

      {renderMorePagesModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  formContainer: {
    marginTop: spacing.lg,
    flex: 1,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  infoCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  infoTitle: {
    marginBottom: spacing.sm,
    fontWeight: "600",
  },
  infoText: {
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  actionButton: {
    marginTop: spacing.md,
  },
  pagesList: {
    marginTop: spacing.sm,
  },
  pageCard: {
    borderRadius: 8,
    padding: 2,
    overflow: "hidden",
    marginBottom: 0,
  },
  previewWrapper: {
    position: "relative",
  },
  previewOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  pageCardActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  itemDetails: {
    padding: spacing.xs,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  itemDetailsText: {
    fontSize: 12,
    opacity: 0.8,
  },
  gridContainer: {
    marginTop: spacing.md,
  },
  previewTitle: {
    marginBottom: spacing.md,
  },
  pagesGrid: {
    padding: spacing.xs,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "90%",
    maxWidth: 500,
    maxHeight: "80%",
    borderRadius: 12,
    padding: spacing.lg,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: spacing.md,
    textAlign: "center",
  },
  formScrollView: {
    width: "100%",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  emptyState: {
    paddingVertical: spacing.xl,
    alignItems: "center",
  },
  emptyStateText: {
    textAlign: "center",
    opacity: 0.7,
  },
  orderControls: {
    position: "absolute",
    top: 8,
    right: 8,
    bottom: 8,
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 4,
  },
  orderButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  bottomSheetContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2, // Extra padding at the bottom for better usability
    maxHeight: "80%", // Limit height to 80% of screen
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  floatingPlusButton: {
    position: "fixed",
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2e2e2e",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1,
  },
});
