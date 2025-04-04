import React, { forwardRef } from "react";
import { View as RNView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * A custom View component that optionally applies safe area insets
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isSafe - Whether to use SafeAreaView
 * @param {React.ReactNode} props.children - Child components
 * @param {Object} props.style - Additional styles
 * @returns {React.ReactElement} View component
 */
export const View = forwardRef(({ isSafe, children, style, ...props }, ref) => {
  if (isSafe) {
    return (
      <SafeAreaView style={[ style]} {...props}>
        {children}
      </SafeAreaView>
    );
  }

  return (
    <RNView ref={ref} style={[style]} {...props}>
      {children}
    </RNView>
  );
});

