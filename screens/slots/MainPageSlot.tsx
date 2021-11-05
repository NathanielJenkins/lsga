/** @format */

import React from "react";
import { StyleSheet } from "react-native";
import { View } from "../../components/Themed";

import { SofiaBoldText, SofiaSemiBoldText } from "../../components/StyledText";
import tw from "tailwind-react-native-classnames";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FontAwesome } from "@expo/vector-icons";
import { IconText } from "../../components/common/Button";
interface SlotProps {
  children: React.ReactNode;
}

export default function MainPageSlot(props: SlotProps) {
  return (
    <View style={tw`p-4 pt-5 flex flex-col flex-1`}>
      <View style={tw`flex content-end items-end`}>
        <View style={tw`flex flex-row content-end items-end`}>
          <IconText
            size={25}
            name="plus-square"
            text="Add Garden"
            color="grey"
            style={tw`mr-2`}
          />
          <IconText size={25} name="user" text="Profile" color="grey" />
        </View>
      </View>

      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({});
