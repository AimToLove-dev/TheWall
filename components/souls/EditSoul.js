"use client";

import { useState } from "react";
import { View } from "react-native";
import {
  Surface,
  Text,
  TextInput,
  Button,
  useTheme,
  Chip,
} from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { createDisplayName } from "@utils/index";

const editSoulValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
});

export const EditSoul = ({ soul, onSave, onCancel, style }) => {
  const theme = useTheme();

  // Check if this soul has a linked testimony
  const hasLinkedTestimony = soul && soul.testimonyId;

  const handleSubmit = (values) => {
    if (hasLinkedTestimony) return;

    // Generate the display name using the utility function
    const displayName = createDisplayName(values.firstName, values.lastName);

    onSave &&
      onSave({
        ...soul,
        ...values,
        name: displayName,
      });
  };

  return (
    <Surface
      mode="elevated"
      elevation={1}
      style={[
        {
          padding: 16,
        },
        style,
      ]}
    >
      <Text variant="titleMedium" style={{ marginBottom: 16 }}>
        {hasLinkedTestimony ? "View Soul" : "Edit Soul"}
      </Text>

      {hasLinkedTestimony && (
        <View style={{ marginBottom: 16 }}>
          <Chip
            icon="lock"
            mode="outlined"
            style={{ backgroundColor: theme.colors.surfaceVariant }}
          >
            This soul has a linked testimony and cannot be modified
          </Chip>
        </View>
      )}

      <Formik
        initialValues={{
          firstName: soul?.firstName || "",
          lastName: soul?.lastName || "",
          city: soul?.city || "",
          state: soul?.state || "",
        }}
        validationSchema={editSoulValidationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
              <View style={{ flex: 1 }}>
                <TextInput
                  label="First Name"
                  value={values.firstName}
                  onChangeText={handleChange("firstName")}
                  onBlur={handleBlur("firstName")}
                  error={touched.firstName && errors.firstName}
                  mode="outlined"
                  disabled={hasLinkedTestimony}
                />
                {touched.firstName && errors.firstName && (
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.error }}
                  >
                    {errors.firstName}
                  </Text>
                )}
              </View>

              <View style={{ flex: 1 }}>
                <TextInput
                  label="Last Name"
                  value={values.lastName}
                  onChangeText={handleChange("lastName")}
                  onBlur={handleBlur("lastName")}
                  error={touched.lastName && errors.lastName}
                  mode="outlined"
                  disabled={hasLinkedTestimony}
                />
                {touched.lastName && errors.lastName && (
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.error }}
                  >
                    {errors.lastName}
                  </Text>
                )}
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
              <TextInput
                label="City"
                value={values.city}
                onChangeText={handleChange("city")}
                onBlur={handleBlur("city")}
                mode="outlined"
                disabled={hasLinkedTestimony}
                style={{ flex: 1 }}
              />

              <TextInput
                label="State Code"
                value={values.state}
                onChangeText={handleChange("state")}
                onBlur={handleBlur("state")}
                mode="outlined"
                disabled={hasLinkedTestimony}
                style={{ flex: 1 }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <Button
                mode="outlined"
                onPress={onCancel}
                style={{ marginRight: 8 }}
              >
                {hasLinkedTestimony ? "Close" : "Cancel"}
              </Button>
              {!hasLinkedTestimony && (
                <Button mode="contained" onPress={handleSubmit}>
                  Save
                </Button>
              )}
            </View>
          </View>
        )}
      </Formik>
    </Surface>
  );
};
