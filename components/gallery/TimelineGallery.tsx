/** @format */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Svg, Line } from "react-native-svg";
import { tw } from "../Themed";

export interface TimelineGalleryProps {}

export function TimelineGallery() {
  return (
    <Svg style={tw.style()}>
      <Line x1="20" y1="100" x2="100" y2="100" stroke="gray" strokeWidth="2" />
      <Line x1="20" y1="100" x2="20" y2="500" stroke="gray" strokeWidth="2" />
    </Svg>
  );
}

const styles = StyleSheet.create({});
