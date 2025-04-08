"use client";

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

const editSoulValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
});

export const EditSoul = ({ soul, onSave, onCancel, style }) => {
  const theme = useTheme();

  // Check if this soul has a linked testimony
  const hasLinkedTestimony = soul && soul.testimonyId;

  const handleSubmit = (values) => {
    if (hasLinkedTestimony) return;
    onSave && onSave({ ...soul, ...values });
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
        initialValues={{ name: soul?.name || "" }}
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
            <TextInput
              label="Name"
              value={values.name}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              error={touched.name && errors.name}
              mode="outlined"
              style={{ marginBottom: 8 }}
              disabled={hasLinkedTestimony}
            />
            {touched.name && errors.name && (
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.error, marginBottom: 16 }}
              >
                {errors.name}
              </Text>
            )}

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
