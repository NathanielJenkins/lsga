/** @format */

import * as React from "react";

import { TextProps } from "./Themed";
import { Text } from "react-native";

export function MonoText(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "space-mono" }]} />
  );
}

export function SofiaRegularText(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "sofia-regular" }]} />
  );
}

export function SofiaSemiMediumText(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "sofia-medium" }]} />
  );
}

export function SofiaSemiBoldText(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "sofia-semibold" }]} />
  );
}

export function SofiaBoldText(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "sofia-bold" }]} />
  );
}
