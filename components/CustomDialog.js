"use client";

import { Modal, TouchableWithoutFeedback } from "react-native";
import { Dialog, Portal, Text, Button } from "react-native-paper";
import { getThemeColors } from "styles/theme";

export const CustomDialog = ({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "contained",
  cancelVariant = "outlined",
  isDestructive = false,
}) => {
  const colors = getThemeColors();

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text>{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          {onCancel && (
            <Button
              mode={cancelVariant}
              onPress={onCancel}
              style={{ marginRight: 8 }}
            >
              {cancelText}
            </Button>
          )}
          {onConfirm && (
            <Button
              mode={confirmVariant}
              onPress={onConfirm}
              textColor={isDestructive ? colors.error : undefined}
            >
              {confirmText}
            </Button>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
