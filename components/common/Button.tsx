/** @format */

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeTouchEvent,
  StyleProp,
  Image
} from "react-native";
import { SofiaBoldText, SofiaRegularText } from "../StyledText";
import Ripple from "react-native-material-ripple";

import { Text, tw } from "../Themed";
import { FontAwesome5 } from "@expo/vector-icons";
import { storage } from "../../firebase/firebaseTooling";
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

interface CircleIconProps {
  name: React.ComponentProps<typeof FontAwesome5>["name"];
  style?: StyleProp<any>;
  onPress: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void;
  size?: "sm" | "md";
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

export function CircleIconButton(props: CircleIconProps) {
  const { name, onPress, style, size } = props;

  return (
    <View
      style={tw.style(
        "flex rounded-full  border-white",
        size === "sm" ? "border" : "border-4",
        style
      )}>
      <Ripple
        onPress={onPress}
        rippleContainerBorderRadius={9999}
        rippleColor={"white"}>
        <View
          style={tw.style(
            "flex flex-col justify-center items-center",
            size === "sm" ? "w-8 h-8" : "w-24 h-24"
          )}>
          <FontAwesome5
            style={tw.style("opacity-100")}
            name={name}
            color={"white"}
            size={size === "sm" ? 20 : 30}
          />
        </View>
      </Ripple>
    </View>
  );
}

interface ThumbnailCardProps {
  title: string;
  style?: StyleProp<any>;
  onPress: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void;
  active: boolean;
  img: string;
}

export function ThumbnailCard(props: ThumbnailCardProps) {
  const { onPress, style, active, img } = props;
  const [imageUrl, setImageUrl] = useState(undefined);
  useEffect(() => {
    storage
      .ref(`/images/${props.img}`) //name in storage in firebase console
      .getDownloadURL()
      .then(url => {
        setImageUrl(url);
      })
      .catch(() => {});
  }, []);
  return (
    <View
      style={tw.style(
        "shadow-brand",
        active ? "border border-brand" : "border border-transparent",
        style
      )}>
      <Ripple onPress={onPress} rippleContainerBorderRadius={10}>
        <View style={tw.style("flex flex-row items-center p-2")}>
          <Image
            source={{ uri: imageUrl }}
            style={tw`h-16 w-16 resize-contain mr-2`}
          />
          <SofiaBoldText
            style={tw.style(
              "text-xl",
              active ? "text-brand" : "text-gray-500"
            )}>
            {props.title}
          </SofiaBoldText>
        </View>
      </Ripple>
    </View>
  );
}

const styles = StyleSheet.create({
  base: tw`rounded p-4 flex rounded text-center items-center `,
  primary: tw.style(` bg-brand `),
  secondary: tw.style(`border-brand border-2 bg-white`),
  image: tw`rounded items-center flex shadow p-2 bg-white `
});
