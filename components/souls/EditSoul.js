"use client";

import { View } from "react-native";
import { Surface, Text, TextInput, Button, useTheme } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";

const editSoulValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
});

export const EditSoul = ({ soul, onSave, onCancel, style }) => {
  const theme = useTheme();

  const handleSubmit = (values) => {
    onSave && onSave({ ...soul, ...values });
  };

  return (
    <Surface
      mode="elevated"
      elevation={1}
      style={[
        {
          padding: 16,
          borderRadius: 8,
        },
        style,
      ]}
    >
      <Text variant="titleMedium" style={{ marginBottom: 16 }}>
        Edit Soul
      </Text>

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
                Cancel
              </Button>
              <Button mode="contained" onPress={handleSubmit}>
                Save
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </Surface>
  );
};
