/** @format */

import * as React from "react";

import { TextProps } from "./Themed";
import { Text } from "react-native";

export function MonoText(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "Space-Mono" }]} />
  );
}

export function SofiaRegularText(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "Sofia-Regular" }]} />
  );
}

export function SofiaSemiMediumText(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "Sofia-Medium" }]} />
  );
}

export function SofiaSemiBoldText(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "Sofia-SemiBold" }]} />
  );
}

export function SofiaBoldText(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "Sofia-Bold" }]} />
  );
}
