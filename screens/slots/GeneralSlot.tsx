/** @format */

import React from "react";
import { StyleSheet } from "react-native";
import { View } from "../../components/Themed";

import tw from "tailwind-react-native-classnames";

interface SlotProps {
  children: React.ReactNode;
}

export default function GeneralSlot(props: SlotProps) {
  return (
    <View style={tw`p-4 pt-8 flex flex-col flex-1 bg-white`}>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({});
