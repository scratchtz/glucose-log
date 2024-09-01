import { FontColor, FontWeight, TextVariant } from "@/utils/styles/theme";
import { useStyles } from "react-native-unistyles";
import { Text as NativeText, type TextProps } from "react-native";
import React from "react";

type Props = {
  variant?: TextVariant;
  weight?: FontWeight;
  color?: FontColor;
} & TextProps;

export const Text = React.memo((props: Props) => {
  const { variant = "body", color = "primary", weight, style } = props;
  const { theme } = useStyles();
  const textColor = theme.colors.text[color] || theme.colors.text.primary;
  const defaultStyle = theme.text[variant] || theme.text.body;

  return (
    <NativeText
      {...props}
      style={[
        defaultStyle,
        color && { color: textColor },
        weight && { fontFamily: `Font-${weight}` },
        style,
      ]}
    />
  );
});
