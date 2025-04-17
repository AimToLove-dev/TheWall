import React, { useState, useContext } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { CustomButton, CustomInput } from "components";
import { TextAreaInput, MediaUpload, VideoUpload } from "components/inputs";
import { AuthenticatedUserContext } from "providers";
import {
  HeaderText,
  SubtitleText,
  BodyText,
  ErrorText,
} from "components/Typography";
import { spacing } from "styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { createDisplayName } from "@utils/index";

// Validation schema for the testimony form
const testimonyValidationSchema = Yup.object().shape({
  testimony: Yup.string()
    .required("Testimony is required")
    .min(50, "Testimony must be at least 50 characters")
    .max(2000, "Testimony must be less than 2000 characters"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string()
    .required("State code is required")
    .matches(/^[A-Za-z]{2}$/, "State code is 2 letters"),
  salvationYear: Yup.number()
    .typeError("Year must be a number")
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear(), "Year cannot be in the future")
    .nullable(),
  email: Yup.string().email("Invalid email format"),
  phoneNumber: Yup.string()
    .matches(
      /^(\+\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
      "Invalid phone number format"
    )
    .nullable(),
});

export const EditTestimony = ({
  initialTestimony,
  onSubmit,
  onCancel,
  loading,
  errorState,
  isEdit = true, // Set to false for creating a new testimony
  isAdmin = false, // Whether the current user is an admin
}) => {
  const [beforeImage, setBeforeImage] = useState(
    initialTestimony?.beforeImage || null
  );
  const [afterImage, setAfterImage] = useState(
    initialTestimony?.afterImage || null
  );
  const [video, setVideo] = useState(
    initialTestimony?.video ||
      initialTestimony?.videoUrl ||
      initialTestimony?.videoUri ||
      null
  );

  // Faith-related questions states with "NotSet" as default if no value provided
  const [believeJesusSonOfGod, setBelieveJesusSonOfGod] = useState(
    initialTestimony?.believeJesusSonOfGod || "NotSet"
  );
  const [believeJesusResurrection, setBelieveJesusResurrection] = useState(
    initialTestimony?.believeJesusResurrection || "NotSet"
  );
  const [repentedFromSins, setRepentedFromSins] = useState(
    initialTestimony?.repentedFromSins || "NotSet"
  );
  const [confessJesusLord, setConfessJesusLord] = useState(
    initialTestimony?.confessJesusLord || "NotSet"
  );
  const [bornAgain, setBornAgain] = useState(
    initialTestimony?.bornAgain || "NotSet"
  );
  const [baptizedHolySpirit, setBaptizedHolySpirit] = useState(
    initialTestimony?.baptizedHolySpirit || "NotSet"
  );

  // Sexuality-related questions states
  const [struggleSameSexAttraction, setStruggleSameSexAttraction] = useState(
    initialTestimony?.struggleSameSexAttraction || "NotSet"
  );
  const [identifyAsLGBTQ, setIdentifyAsLGBTQ] = useState(
    initialTestimony?.identifyAsLGBTQ || "NotSet"
  );
  const [vowPurity, setVowPurity] = useState(
    initialTestimony?.vowPurity || "NotSet"
  );
  const [emotionallyDependentSameSex, setEmotionallyDependentSameSex] =
    useState(initialTestimony?.emotionallyDependentSameSex || "NotSet");
  const [healedFromHomosexuality, setHealedFromHomosexuality] = useState(
    initialTestimony?.healedFromHomosexuality || "NotSet"
  );
  const [repentedHomosexuality, setRepentedHomosexuality] = useState(
    initialTestimony?.repentedHomosexuality || "NotSet"
  );

  // Same-sex attraction options
  const sameSexAttractionOptions = [
    "Yes, but I pick up my cross and I deny myself from acting on same-sex attraction.",
    "Yes, and I still have relationships (emotionally and/or physically) with the same sex.",
    "No, I do not struggle with same-sex attraction.",
    "I'm not sure.",
  ];

  const handleSubmit = (values) => {
    // Generate display name using the utility function
    const displayName = createDisplayName(values.firstName, values.lastName);

    onSubmit({
      ...values,
      displayName, // Add the generated display name
      beforeImage,
      afterImage,
      video,
      // Include faith-related questions
      believeJesusSonOfGod,
      believeJesusResurrection,
      repentedFromSins,
      confessJesusLord,
      bornAgain,
      baptizedHolySpirit,
      // Include sexuality-related questions
      struggleSameSexAttraction,
      identifyAsLGBTQ,
      vowPurity,
      emotionallyDependentSameSex,
      healedFromHomosexuality,
      repentedHomosexuality,
    });
  };

  // Helper function to render a checkbox item
  const renderCheckboxItem = (question, value, setValue) => {
    return (
      <View style={styles.checkboxItem}>
        <BodyText style={styles.checkboxQuestion}>{question}</BodyText>
        <View style={styles.checkboxOptions}>
          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => setValue("Yes")}
          >
            <View
              style={[
                styles.checkbox,
                value === "Yes" && {
                  backgroundColor: "#4CAF50",
                  borderColor: "#4CAF50",
                },
              ]}
            >
              {value === "Yes" && (
                <Ionicons name="checkmark" size={12} color="#FFFFFF" />
              )}
            </View>
            <BodyText style={styles.optionLabel}>Yes</BodyText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => setValue("No")}
          >
            <View
              style={[
                styles.checkbox,
                value === "No" && {
                  backgroundColor: "#4CAF50",
                  borderColor: "#4CAF50",
                },
              ]}
            >
              {value === "No" && (
                <Ionicons name="checkmark" size={12} color="#FFFFFF" />
              )}
            </View>
            <BodyText style={styles.optionLabel}>No</BodyText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Helper function to render a radio selection with multiple options
  const renderRadioItem = (question, value, setValue, options) => {
    return (
      <View style={styles.radioItem}>
        <BodyText style={styles.checkboxQuestion}>{question}</BodyText>

        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.radioOptionContainer}
            onPress={() => setValue(option)}
          >
            <View
              style={[
                styles.radioButton,
                value === option && { borderColor: "#4CAF50", borderWidth: 2 },
              ]}
            >
              {value === option && <View style={styles.radioSelected} />}
            </View>
            <BodyText
              style={[
                styles.radioLabel,
                value === option && { fontWeight: "500", color: "#4CAF50" },
              ]}
            >
              {option}
            </BodyText>
          </TouchableOpacity>
        ))}
      </View>
    );
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
        initialValues={{
          testimony: initialTestimony?.testimony || "",
          title: initialTestimony?.title || "",
          firstName: initialTestimony?.firstName || "",
          lastName: initialTestimony?.lastName || "",
          city: initialTestimony?.city || "",
          state: initialTestimony?.state || "",
          salvationYear: initialTestimony?.salvationYear || "",
          email: initialTestimony?.email || "",
          phoneNumber: initialTestimony?.phoneNumber || "",
          beforeImage: initialTestimony?.beforeImage || null,
          afterImage: initialTestimony?.afterImage || null,
          video:
            initialTestimony?.video ||
            initialTestimony?.videoUrl ||
            initialTestimony?.videoUri ||
            null,
        }}
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
            {isAdmin && (
              <CustomInput
                label="Testimony Title"
                value={values.title}
                onChangeText={handleChange("title")}
                onBlur={handleBlur("title")}
                placeholder="Enter a title for this testimony"
                style={{ marginBottom: spacing.md }}
              />
            )}

            {/* Profile section */}
            <View style={styles.profileSection}>
              <BodyText style={styles.mediaSectionTitle}>
                Profile Information
              </BodyText>
              <BodyText style={styles.faithInstructions}>
                Please provide your personal information. This helps us verify
                and connect with you.
              </BodyText>

              {/* Name fields */}
              <View style={styles.fieldRow}>
                <View style={styles.fieldRowItem}>
                  <CustomInput
                    label="First Name"
                    value={values.firstName}
                    onChangeText={handleChange("firstName")}
                    onBlur={handleBlur("firstName")}
                    placeholder="Your first name"
                    error={touched.firstName && errors.firstName}
                    style={styles.inputField}
                  />
                </View>
                <View style={styles.fieldRowItem}>
                  <CustomInput
                    label="Last Name"
                    value={values.lastName}
                    onChangeText={handleChange("lastName")}
                    onBlur={handleBlur("lastName")}
                    placeholder="Your last name"
                    error={touched.lastName && errors.lastName}
                    style={styles.inputField}
                  />
                </View>
              </View>

              {/* Location and salvation year fields */}
              <View style={styles.fieldRow}>
                <View style={styles.fieldRowItemLarge}>
                  <CustomInput
                    label="City"
                    value={values.city}
                    onChangeText={handleChange("city")}
                    onBlur={handleBlur("city")}
                    placeholder="Your city"
                    error={touched.city && errors.city}
                    style={styles.inputField}
                  />
                </View>
                <View style={styles.fieldRowItemSmall}>
                  <CustomInput
                    label="State Code"
                    value={values.state}
                    onChangeText={(text) => {
                      // Convert to uppercase immediately
                      handleChange("state")(text.toUpperCase());
                    }}
                    onBlur={handleBlur("state")}
                    placeholder="CA"
                    error={touched.state && errors.state}
                    style={styles.inputField}
                  />
                </View>
                <View style={styles.fieldRowItemSmall}>
                  <CustomInput
                    label="Salvation Year"
                    value={values.salvationYear}
                    onChangeText={handleChange("salvationYear")}
                    onBlur={handleBlur("salvationYear")}
                    placeholder="YYYY"
                    keyboardType="numeric"
                    error={touched.salvationYear && errors.salvationYear}
                    style={styles.inputField}
                  />
                </View>
              </View>

              {/* Contact information fields */}
              <View style={styles.fieldRow}>
                <View style={styles.fieldRowItem}>
                  <CustomInput
                    label="Email"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    placeholder="Your email address"
                    keyboardType="email-address"
                    error={touched.email && errors.email}
                    style={styles.inputField}
                  />
                </View>
                <View style={styles.fieldRowItem}>
                  <CustomInput
                    label="Phone Number (Optional)"
                    value={values.phoneNumber}
                    onChangeText={handleChange("phoneNumber")}
                    onBlur={handleBlur("phoneNumber")}
                    placeholder="Your phone number"
                    keyboardType="phone-pad"
                    error={touched.phoneNumber && errors.phoneNumber}
                    style={styles.inputField}
                  />
                </View>
              </View>
            </View>

            {/* Faith questions section */}
            <View style={styles.faithSection}>
              <BodyText style={styles.mediaSectionTitle}>
                Faith Questions
              </BodyText>
              <BodyText style={styles.faithInstructions}>
                Please answer the following questions about your faith. You may
                leave questions unanswered if you prefer.
              </BodyText>

              {renderCheckboxItem(
                "Do you believe that Jesus is the Son of God?",
                believeJesusSonOfGod,
                setBelieveJesusSonOfGod
              )}

              {renderCheckboxItem(
                "Do you believe that Jesus was crucified on the cross and rose from the dead?",
                believeJesusResurrection,
                setBelieveJesusResurrection
              )}

              {renderCheckboxItem(
                "Have you repented from your sins? (sin referring to actions, thoughts, or behaviors that go against God's will and commands)",
                repentedFromSins,
                setRepentedFromSins
              )}

              {renderCheckboxItem(
                "Do you confess Jesus as your Lord and Savior?",
                confessJesusLord,
                setConfessJesusLord
              )}

              {renderCheckboxItem(
                "Do you consider yourself born again?",
                bornAgain,
                setBornAgain
              )}

              {renderCheckboxItem(
                "Do you consider yourself as baptized with the Holy Spirit?",
                baptizedHolySpirit,
                setBaptizedHolySpirit
              )}
            </View>

            {/* Sexuality questions section */}
            <View style={styles.sexualitySection}>
              <BodyText style={styles.mediaSectionTitle}>
                Sexuality Questions
              </BodyText>
              <BodyText style={styles.faithInstructions}>
                These questions help us understand your journey. You may leave
                questions unanswered if you prefer.
              </BodyText>

              {renderRadioItem(
                "Do you claim to still struggle with same-sex attraction?",
                struggleSameSexAttraction,
                setStruggleSameSexAttraction,
                sameSexAttractionOptions
              )}

              {renderCheckboxItem(
                "Do you identify as part of the LGBTQ+ community?",
                identifyAsLGBTQ,
                setIdentifyAsLGBTQ
              )}

              {renderCheckboxItem(
                "Do you vow purity and holiness over your body?",
                vowPurity,
                setVowPurity
              )}

              {renderCheckboxItem(
                "Do you have any emotionally dependent relationships with the same sex?",
                emotionallyDependentSameSex,
                setEmotionallyDependentSameSex
              )}

              {renderCheckboxItem(
                "Have you been delivered and/or healed from homosexuality?",
                healedFromHomosexuality,
                setHealedFromHomosexuality
              )}

              {renderCheckboxItem(
                "Have you repented and renounced homosexuality?",
                repentedHomosexuality,
                setRepentedHomosexuality
              )}
            </View>

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
                  initialImage={beforeImage}
                  onImageSelect={setBeforeImage}
                  style={styles.imageUpload}
                />

                <MediaUpload
                  label="After Image"
                  initialImage={afterImage}
                  onImageSelect={setAfterImage}
                  style={styles.imageUpload}
                />
              </View>

              <VideoUpload
                label="Your Story Video"
                initialVideo={video}
                onVideoSelect={setVideo}
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
  faithSection: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  faithInstructions: {
    marginBottom: spacing.md,
    fontStyle: "italic",
    fontSize: 14,
    opacity: 0.7,
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
  checkboxItem: {
    marginBottom: spacing.md,
  },
  checkboxQuestion: {
    marginBottom: spacing.xs,
  },
  checkboxOptions: {
    flexDirection: "row",
    marginTop: spacing.xs / 2,
    flexWrap: "wrap",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: spacing.md,
    marginBottom: spacing.xs,
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
  clearOption: {
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
  clearLabel: {
    fontSize: 14,
    color: "#888888",
  },
  sexualitySection: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  radioItem: {
    marginBottom: spacing.lg,
  },
  radioOptionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#AAAAAA",
    marginRight: spacing.sm,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    width: 10,
    height: 10,
    backgroundColor: "#4CAF50",
  },
  radioLabel: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  clearRadioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  profileSection: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    flexWrap: "wrap",
  },
  fieldRowItem: {
    flex: 1,
    marginRight: spacing.sm,
    minWidth: 150,
  },
  fieldRowItemLarge: {
    flex: 2,
    marginRight: spacing.sm,
    minWidth: 150,
  },
  fieldRowItemSmall: {
    flex: 1,
    marginRight: spacing.sm,
    minWidth: 90,
  },
  inputField: {
    height: 56, // Consistent height for all input fields
    maxHeight: 56,
  },
});
