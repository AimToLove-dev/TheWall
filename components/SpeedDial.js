"use client";

import { View } from "react-native";
import { FAB, useTheme, Text } from "react-native-paper";
import { useState } from "react";

export const SpeedDial = ({ options, onSelect, initialSelected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState(
    initialSelected || options[0]
  );

  const handleSpeedSelect = (option) => {
    setSelectedSpeed(option);
    setIsOpen(false);
    onSelect && onSelect(option);
  };

  const actions = options.map((option) => ({
    icon: option.icon,
    label: option.label,
    onPress: () => handleSpeedSelect(option),
  }));

  return (
    <FAB.Group
      open={isOpen}
      visible
      icon={selectedSpeed.icon}
      actions={actions}
      onStateChange={({ open }) => setIsOpen(open)}
      onPress={() => setIsOpen(!isOpen)}
    />
  );
};
