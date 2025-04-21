"use client";

import {
  Text as PaperText,
  Title,
  Subheading,
  Paragraph,
  Caption,
} from "react-native-paper";
import { getThemeColors, fonts } from "styles/theme";

// Base text style with XTypewriter font
const baseTextStyle = {
  fontFamily: "XTypewriter-Regular",
};

// Base heading style with XTypewriter Bold font
const baseHeadingStyle = {
  fontFamily: "XTypewriter-Bold",
};

export const HeaderText = ({ children, style, numberOfLines, onPress }) => (
  <Title
    style={[baseHeadingStyle, style]}
    numberOfLines={numberOfLines}
    onPress={onPress}
  >
    {children}
  </Title>
);

export const SubtitleText = ({ children, style, numberOfLines, onPress }) => (
  <Subheading
    style={[baseHeadingStyle, style]}
    numberOfLines={numberOfLines}
    onPress={onPress}
  >
    {children}
  </Subheading>
);

export const BodyText = ({ children, style, numberOfLines, onPress }) => (
  <Paragraph
    style={[baseTextStyle, style]}
    numberOfLines={numberOfLines}
    onPress={onPress}
  >
    {children}
  </Paragraph>
);

export const CaptionText = ({ children, style, numberOfLines, onPress }) => (
  <Caption
    style={[baseTextStyle, style]}
    numberOfLines={numberOfLines}
    onPress={onPress}
  >
    {children}
  </Caption>
);

export const LinkText = ({ children, style, numberOfLines, onPress }) => {
  const colors = getThemeColors();

  return (
    <PaperText
      style={[
        baseTextStyle,
        { color: colors.primary, textDecorationLine: "underline" },
        style,
      ]}
      numberOfLines={numberOfLines}
      onPress={onPress}
    >
      {children}
    </PaperText>
  );
};

export const ErrorText = ({ children, style, numberOfLines, onPress }) => {
  const colors = getThemeColors();

  return (
    <PaperText
      style={[baseTextStyle, { color: colors.error }, style]}
      numberOfLines={numberOfLines}
      onPress={onPress}
    >
      {children}
    </PaperText>
  );
};

// Add a default Text component that uses XTypewriter font
export const Text = ({ children, style, numberOfLines, onPress }) => (
  <PaperText
    style={[baseTextStyle, style]}
    numberOfLines={numberOfLines}
    onPress={onPress}
  >
    {children}
  </PaperText>
);
