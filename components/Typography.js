"use client";

import {
  Text as PaperText,
  Title,
  Subheading,
  Paragraph,
  Caption,
  useTheme,
} from "react-native-paper";

export const HeaderText = ({ children, style, numberOfLines, onPress }) => (
  <Title style={style} numberOfLines={numberOfLines} onPress={onPress}>
    {children}
  </Title>
);

export const SubtitleText = ({ children, style, numberOfLines, onPress }) => (
  <Subheading style={style} numberOfLines={numberOfLines} onPress={onPress}>
    {children}
  </Subheading>
);

export const BodyText = ({ children, style, numberOfLines, onPress }) => (
  <Paragraph style={style} numberOfLines={numberOfLines} onPress={onPress}>
    {children}
  </Paragraph>
);

export const CaptionText = ({ children, style, numberOfLines, onPress }) => (
  <Caption style={style} numberOfLines={numberOfLines} onPress={onPress}>
    {children}
  </Caption>
);

export const LinkText = ({ children, style, numberOfLines, onPress }) => {
  const theme = useTheme();
  return (
    <PaperText
      style={[
        { color: theme.colors.primary, textDecorationLine: "underline" },
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
  const theme = useTheme();
  return (
    <PaperText
      style={[{ color: theme.colors.error }, style]}
      numberOfLines={numberOfLines}
      onPress={onPress}
    >
      {children}
    </PaperText>
  );
};
