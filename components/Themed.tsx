/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 *
 * @format
 */

import * as React from "react";
import { Text as DefaultText, View as DefaultView } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

export const brandColor = "#679236";
export const brandColorRBG = [103, 146, 54];
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = { color: "black" };

  return <DefaultText style={[color, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = { backgroundColor: "white" };

  return <DefaultView style={[backgroundColor, style]} {...otherProps} />;
}

import styles from "../tw-rn-styles.json";
import { create } from "tailwind-react-native-classnames";
export const tw = create(styles);
