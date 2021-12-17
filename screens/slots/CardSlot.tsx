/** @format */

import React from "react";
import { StyleSheet, Image, View, StyleProp } from "react-native";
import {
  SofiaBoldText,
  SofiaSemiBoldText,
  SofiaRegularText
} from "../../components/StyledText";
import { tw } from "../../components/Themed";
interface SlotProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  style?: StyleProp<any>;
}

export function CardSlot(props: SlotProps) {
  return (
    <View
      style={tw.style(`p-4 pt-5 flex flex-col flex-1 bg-white`, props.style)}>
      <View style={tw`shadow-brand p-3`}>
        {props.title && (
          <SofiaSemiBoldText style={tw`text-2xl text-gray-500`}>
            {props.title}
          </SofiaSemiBoldText>
        )}
        {props.subtitle && (
          <SofiaRegularText style={tw`text-gray-500`}>
            {props.subtitle}
          </SofiaRegularText>
        )}

        {props.children}
        {props.footer}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
