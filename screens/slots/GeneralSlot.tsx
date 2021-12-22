/** @format */

import React from "react";
import { StyleSheet } from "react-native";
import { View } from "../../components/Themed";

import tw from "tailwind-react-native-classnames";

interface SlotProps {
  children: React.ReactNode;
}

export function GeneralSlot(props: SlotProps) {
  return (
    <View style={tw`px-4 pt-8 flex flex-col flex-1 bg-gray-50`}>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({});
