/** @format */

import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  StyleProp,
  TextStyle
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { tw, brandColor } from "../Themed";

interface InputProps {
  handleOnChangeText: (text: string) => void;
  value?: string;
  placeholder: string;
  secureTextEntry?: boolean;
  style?: StyleProp<any>;
  numberOfLines?: number;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCompleteType?: any;
  autoCorrect?: boolean;
}

export function Input(props: InputProps) {
  const { style, ...rest } = props;

  return (
    <View>
      <TextInput
        style={tw.style(
          `rounded border border-gray-500 p-3 text-gray-700`,
          {
            fontFamily: "sofia-regular"
          },
          style
        )}
        onChangeText={props.handleOnChangeText}
        placeholderTextColor={"gray"}
        {...rest}
      />
    </View>
  );
}

interface CheckboxProps {
  text: string;
  isChecked: boolean;
  onPress?: (checked: boolean) => void;
}
export function Checkbox(props: CheckboxProps) {
  return (
    <View>
      <BouncyCheckbox
        size={25}
        fillColor={brandColor}
        unfillColor="#FFFFFF"
        text={props.text}
        isChecked={props.isChecked}
        iconStyle={{ borderColor: "#679236" }}
        onPress={props.onPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
