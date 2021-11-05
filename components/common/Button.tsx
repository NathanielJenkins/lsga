/** @format */

import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeTouchEvent,
  StyleProp,
  Image
} from "react-native";
import { SofiaRegularText } from "../StyledText";
import Ripple from "react-native-material-ripple";

import { Text, tw } from "../Themed";
import { FontAwesome5 } from "@expo/vector-icons";

interface ButtonProps {
  onPress: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void;
  title: string;
  style?: StyleProp<any>;
}

interface ImageProps {
  onPress: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void;
  image: "google";
  style?: StyleProp<any>;
}

interface IconProps {
  name: React.ComponentProps<typeof FontAwesome5>["name"];
  color: string;
  text: string;
  size: number;
  onPress: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void;
  style?: StyleProp<any>;
}

export function PrimaryButton(props: ButtonProps) {
  const { onPress, style } = props;

  return (
    <Ripple onPress={onPress}>
      <View style={tw.style(style)}>
        <View style={[styles.base, styles.primary]}>
          <SofiaRegularText style={tw`text-white`}>
            {props.title}
          </SofiaRegularText>
        </View>
      </View>
    </Ripple>
  );
}

export function SecondaryButton(props: ButtonProps) {
  const { onPress, style } = props;

  return (
    <Ripple onPress={onPress}>
      <View style={tw.style(style)}>
        <View style={[styles.base, styles.secondary]}>
          <SofiaRegularText style={tw.style(`text-brand`)}>
            {props.title}
          </SofiaRegularText>
        </View>
      </View>
    </Ripple>
  );
}

export function TextButton(props: ButtonProps) {
  const { onPress, style } = props;

  return (
    <View style={tw.style(style)}>
      <TouchableOpacity onPress={onPress}>
        <SofiaRegularText style={tw`underline`}>{props.title}</SofiaRegularText>
      </TouchableOpacity>
    </View>
  );
}

export function ImageButton(props: ImageProps) {
  const imageSource = {
    google: require("../../assets/images/google_social.png")
  };

  const { style, onPress } = props;

  return (
    <Ripple onPress={onPress} style={tw.style(`h-16 w-16 `)}>
      <View style={[styles.image]}>
        <Image source={imageSource[props.image]} style={tw`h-full w-full `} />
      </View>
    </Ripple>
  );
}

export function IconText(props: IconProps) {
  const { name, color, text, size, onPress, style } = props;

  return (
    <View style={tw.style("flex", style)}>
      <Ripple onPress={onPress}>
        <View
          style={tw.style(
            "flex flex-col justify-center items-center  p-1 rounded"
          )}>
          <FontAwesome5 size={size} style={{}} name={name} color={color} />

          <SofiaRegularText style={tw.style("text-gray-500")}>
            {text}
          </SofiaRegularText>
        </View>
      </Ripple>
    </View>
  );
}
const styles = StyleSheet.create({
  base: tw`rounded p-4 flex rounded text-center items-center `,
  primary: tw.style(`bg-brand `),
  secondary: tw.style(`border-brand border-2 `),
  image: tw`rounded items-center flex shadow p-2 bg-white `
});
