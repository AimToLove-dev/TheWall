"use client";

import { Modal, TouchableWithoutFeedback } from "react-native";
import { Dialog, Portal, Text, Button, useTheme } from "react-native-paper";

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
  const theme = useTheme();

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
              textColor={isDestructive ? theme.colors.error : undefined}
            >
              {confirmText}
            </Button>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
