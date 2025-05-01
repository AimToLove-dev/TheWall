import React, { useState, useContext } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { CustomButton } from "components";
import {
  TextAreaInput,
  MediaUpload,
  VideoUpload,
  CustomInput,
  CheckboxInput,
  RadioInput,
} from "components/inputs";
import { AuthenticatedUserContext } from "providers";
import {
  HeaderText,
  SubtitleText,
  BodyText,
  ErrorText,
} from "@components/common/Typography";
import { spacing } from "styles/theme";
import { createDisplayName } from "@utils/index";

// Validation schema for the testimony form
const testimonyValidationSchema = Yup.object().shape({
  testimony: Yup.string()
    .required("required")
    .min(50, "Testimony must be at least 50 characters")
    .max(2000, "Testimony must be less than 2000 characters"),
  firstName: Yup.string().required("required"),
  lastName: Yup.string().required("required"),
  city: Yup.string().required("required"),
  state: Yup.string()
    .required("required")
    .matches(/^[A-Za-z]{2}$/, "State code is 2 letters"),
  salvationYear: Yup.number()
    .typeError("Year must be a number")
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear(), "Year cannot be in the future")
    .nullable(),
  email: Yup.string().email("Invalid email format").required("required"),
  phoneNumber: Yup.string()
    .matches(
      /^(\+\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
      "Invalid phone number format"
    )
    .nullable(),
  // Faith-related questions validation
  believeJesusSonOfGod: Yup.string().oneOf(["Yes", "No"]).required("required"),
  believeJesusResurrection: Yup.string()
    .oneOf(["Yes", "No"])
    .required("required"),
  repentedFromSins: Yup.string().oneOf(["Yes", "No"]).required("required"),
  confessJesusLord: Yup.string().oneOf(["Yes", "No"]).required("required"),
  bornAgain: Yup.string().oneOf(["Yes", "No"]).required("required"),
  baptizedHolySpirit: Yup.string().oneOf(["Yes", "No"]).required("required"),
  // Sexuality-related questions validation
  struggleSameSexAttraction: Yup.string().required("required"),
  identifyAsLGBTQ: Yup.string().oneOf(["Yes", "No"]).required("required"),
  vowPurity: Yup.string().oneOf(["Yes", "No"]).required("required"),
  emotionallyDependentSameSex: Yup.string()
    .oneOf(["Yes", "No"])
    .required("required"),
  healedFromHomosexuality: Yup.string()
    .oneOf(["Yes", "No"])
    .required("required"),
  repentedHomosexuality: Yup.string().oneOf(["Yes", "No"]).required("required"),
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

              <CheckboxInput
                label="Do you believe that Jesus is the Son of God?"
                value={believeJesusSonOfGod}
                onChange={setBelieveJesusSonOfGod}
                error={errors.believeJesusSonOfGod}
                required={true}
              />

              <CheckboxInput
                label="Do you believe that Jesus was crucified on the cross and rose from the dead?"
                value={believeJesusResurrection}
                onChange={setBelieveJesusResurrection}
                error={errors.believeJesusResurrection}
                required={true}
              />

              <CheckboxInput
                label="Have you repented from your sins? (sin referring to actions, thoughts, or behaviors that go against God's will and commands)"
                value={repentedFromSins}
                onChange={setRepentedFromSins}
                error={errors.repentedFromSins}
                required={true}
              />

              <CheckboxInput
                label="Do you confess Jesus as your Lord and Savior?"
                value={confessJesusLord}
                onChange={setConfessJesusLord}
                error={errors.confessJesusLord}
                required={true}
              />

              <CheckboxInput
                label="Do you consider yourself born again?"
                value={bornAgain}
                onChange={setBornAgain}
                error={errors.bornAgain}
                required={true}
              />

              <CheckboxInput
                label="Do you consider yourself as baptized with the Holy Spirit?"
                value={baptizedHolySpirit}
                onChange={setBaptizedHolySpirit}
                error={errors.baptizedHolySpirit}
                required={true}
              />
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

              <RadioInput
                label="Do you claim to still struggle with same-sex attraction?"
                options={sameSexAttractionOptions}
                value={struggleSameSexAttraction}
                onChange={setStruggleSameSexAttraction}
                error={errors.struggleSameSexAttraction}
                required={true}
                longOptions={true}
              />

              <CheckboxInput
                label="Do you identify as part of the LGBTQ+ community?"
                value={identifyAsLGBTQ}
                onChange={setIdentifyAsLGBTQ}
                error={errors.identifyAsLGBTQ}
                required={true}
              />

              <CheckboxInput
                label="Do you vow purity and holiness over your body?"
                value={vowPurity}
                onChange={setVowPurity}
                error={errors.vowPurity}
                required={true}
              />

              <CheckboxInput
                label="Do you have any emotionally dependent relationships with the same sex?"
                value={emotionallyDependentSameSex}
                onChange={setEmotionallyDependentSameSex}
                error={errors.emotionallyDependentSameSex}
                required={true}
              />

              <CheckboxInput
                label="Have you been delivered and/or healed from homosexuality?"
                value={healedFromHomosexuality}
                onChange={setHealedFromHomosexuality}
                error={errors.healedFromHomosexuality}
                required={true}
              />

              <CheckboxInput
                label="Have you repented and renounced homosexuality?"
                value={repentedHomosexuality}
                onChange={setRepentedHomosexuality}
                error={errors.repentedHomosexuality}
                required={true}
              />
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
                  propertyName="before"
                  isAdmin={isAdmin}
                />

                <MediaUpload
                  label="After Image"
                  initialImage={afterImage}
                  onImageSelect={setAfterImage}
                  style={styles.imageUpload}
                  propertyName="after"
                  isAdmin={isAdmin}
                />
              </View>

              <VideoUpload
                label="Your Story Video"
                initialVideo={video}
                onVideoSelect={setVideo}
                placeholder="Share a short video of your story"
                maxDuration={120} // 2 minutes
                propertyName="video"
                isAdmin={isAdmin}
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
  sexualitySection: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: "rgba(0,0,0,0.02)",
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
