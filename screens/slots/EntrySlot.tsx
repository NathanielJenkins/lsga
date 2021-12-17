/** @format */

import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView
} from "react-native";

import brand_logo from "../../assets/images/brand_logo.png";
import { SofiaBoldText, SofiaSemiBoldText } from "../../components/StyledText";
import tw from "tailwind-react-native-classnames";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface EntrySlotProps {
  children: React.ReactNode;
}

export function EntrySlot(props: EntrySlotProps) {
  return (
    <KeyboardAwareScrollView extraHeight={20} style={tw.style("bg-white")}>
      <View style={tw`m-4 flex flex-col content-between flex-1 bg-white`}>
        <View style={tw`w-full flex justify-center items-center mt-4 mb-6 `}>
          <Image source={brand_logo} style={tw``} />
        </View>
        <SofiaSemiBoldText style={tw`text-black text-3xl font-semibold `}>
          Garden Planner
        </SofiaSemiBoldText>
        {props.children}
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({});
