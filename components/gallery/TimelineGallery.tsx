/** @format */

import React from "react";
import { StyleSheet, View } from "react-native";
import { Svg, Line, Text } from "react-native-svg";
import { tw } from "../Themed";
import { Month } from "../../models/Veggie";
export interface TimelineGalleryProps {
  isFirst: boolean;
  isLast: boolean;
  date: string;
}

export function TimelineGallery(props: TimelineGalleryProps) {
  const { isFirst, isLast, date } = props;

  const processedDate = date ? new Date(date) : undefined;

  const dateString = processedDate
    ? processedDate.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "2-digit"
      })
    : "";
  return (
    <Svg style={tw.style()}>
      {!isFirst && (
        <Line x1="20" y1="0" x2="20" y2="60" stroke="gray" strokeWidth="2" />
      )}
      <Text
        fill="gray"
        stroke="transparent"
        fontSize="14"
        x="15"
        y="90"
        textAnchor="start">
        {dateString}
      </Text>
      <Line x1="20" y1="100" x2="90" y2="100" stroke="gray" strokeWidth="2" />
      {!isLast && (
        <Line x1="20" y1="100" x2="20" y2="400" stroke="gray" strokeWidth="2" />
      )}
    </Svg>
  );
}

const styles = StyleSheet.create({});
