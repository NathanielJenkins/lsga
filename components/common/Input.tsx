import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  StyleProp,
  TextStyle
} from "react-native";
import tw from "tailwind-react-native-classnames";

interface InputProps {
  handleOnChangeText: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  placeholder: string;
  secureTextEntry?: boolean;
  style?: StyleProp<any>;
}

export function Input(props: InputProps) {
  const { style, ...rest } = props;

  return (
    <View>
      <TextInput
        style={tw.style(
          `rounded border border-gray-500 p-3`,
          {
            fontFamily: "sofia-regular"
          },
          style
        )}
        onChangeText={props.handleOnChangeText}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
