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

import { tw } from "../Themed";

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

const styles = StyleSheet.create({
  base: tw`rounded p-4 flex rounded text-center items-center `,
  primary: tw.style(`bg-brand `),
  secondary: tw`bg-gray-200`,
  image: tw`rounded items-center flex shadow p-2 bg-white `
});
