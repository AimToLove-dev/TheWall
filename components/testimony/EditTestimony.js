import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { CustomButton } from "components";
import { TextAreaInput, MediaUpload, VideoUpload } from "components/inputs";
import {
  HeaderText,
  SubtitleText,
  BodyText,
  ErrorText,
} from "components/Typography";
import { spacing } from "styles/theme";

// Validation schema for the testimony form
const testimonyValidationSchema = Yup.object().shape({
  testimony: Yup.string()
    .required("Testimony is required")
    .min(50, "Testimony must be at least 50 characters")
    .max(2000, "Testimony must be less than 2000 characters"),
});

export const EditTestimony = ({
  initialTestimony,
  initialBeforeImage,
  initialAfterImage,
  initialVideo,
  onSubmit,
  onCancel,
  loading,
  errorState,
  isEdit = true, // Set to false for creating a new testimony
}) => {
  const [beforeImage, setBeforeImage] = useState(initialBeforeImage || null);
  const [afterImage, setAfterImage] = useState(initialAfterImage || null);
  const [video, setVideo] = useState(initialVideo || null);

  const handleSubmit = (values) => {
    onSubmit({
      ...values,
      beforeImage,
      afterImage,
      video,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <HeaderText style={styles.headerText}>
        {isEdit ? "Edit Testimony" : "Create Testimony"}
      </HeaderText>
      <SubtitleText style={styles.subHeaderText}>
        {isEdit
          ? "Make changes to your testimony below"
          : "Share your story and inspire others with your journey"}
      </SubtitleText>

      <Formik
        initialValues={{ testimony: initialTestimony?.testimony || "" }}
        validationSchema={testimonyValidationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          touched,
          errors,
          handleChange,
          handleSubmit,
          handleBlur,
        }) => (
          <View style={styles.formContainer}>
            <TextAreaInput
              label="Your Testimony"
              placeholder="Share your story here (minimum 50 characters)"
              value={values.testimony}
              onChangeText={handleChange("testimony")}
              onBlur={handleBlur("testimony")}
              error={errors.testimony}
              touched={touched.testimony}
              numberOfLines={8}
              maxLength={2000}
            />

            <View style={styles.mediaSection}>
              <BodyText style={styles.mediaSectionTitle}>
                Add Media (Optional)
              </BodyText>

              <View style={styles.imageRow}>
                <MediaUpload
                  label="Before Image"
                  imageUri={beforeImage}
                  onImageSelected={setBeforeImage}
                  style={styles.imageUpload}
                  placeholder="Before"
                />

                <MediaUpload
                  label="After Image"
                  imageUri={afterImage}
                  onImageSelected={setAfterImage}
                  style={styles.imageUpload}
                  placeholder="After"
                />
              </View>

              <VideoUpload
                label="Your Story Video"
                videoUri={video}
                onVideoSelected={setVideo}
                placeholder="Share a short video of your story"
                maxDuration={120} // 2 minutes
              />
            </View>

            {errorState ? <ErrorText>{errorState}</ErrorText> : null}

            <View style={styles.actionsContainer}>
              <CustomButton
                title="Cancel"
                variant="outline"
                onPress={onCancel}
                style={styles.actionButton}
              />
              <CustomButton
                title={isEdit ? "Save Changes" : "Submit"}
                variant="primary"
                onPress={handleSubmit}
                loading={loading}
                style={styles.actionButton}
              />
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  headerText: {
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  subHeaderText: {
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  formContainer: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  mediaSection: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  mediaSectionTitle: {
    fontWeight: "bold",
    marginBottom: spacing.md,
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  imageUpload: {
    flex: 1,
    marginRight: spacing.md,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
});
