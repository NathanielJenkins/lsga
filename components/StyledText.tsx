/** @format */

import * as React from "react";

import { TextProps } from "./Themed";
import { Text } from "react-native";

export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: "spaceMono" }]} />;
}

export function SofiaRegularText(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "SofiaRegular" }]} />
  );
}

export function SofiaSemiMediumText(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "SofiaMedium" }]} />
  );
}

export function SofiaSemiBoldText(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "SofiaSemiBold" }]} />
  );
}

export function SofiaBoldText(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "sofia-bold" }]} />
  );
}
