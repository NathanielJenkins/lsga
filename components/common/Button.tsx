/** @format */

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeTouchEvent,
  StyleProp,
  Image,
  Button
} from "react-native";
import {
  SofiaBoldText,
  SofiaRegularText,
  SofiaSemiBoldText
} from "../StyledText";
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
  text?: string;
  size: number;
  subText?: string;
  onPress: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void;
  style?: StyleProp<any>;
}

interface CircleIconProps {
  name: React.ComponentProps<typeof FontAwesome5>["name"];
  style?: StyleProp<any>;
  onPress: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void;
  size?: "sm" | "md";
  color?: string;
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
        <SofiaRegularText
          style={tw.style(`underline text-brand`, {
            textDecorationLine: "underline"
          })}>
          {props.title}
        </SofiaRegularText>
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
  const { name, color, text, size, onPress, style, subText } = props;

  return (
    <View style={tw.style("flex", style)}>
      <Ripple onPress={onPress}>
        <View
          style={tw.style(
            "flex flex-col justify-center items-center p-1 rounded"
          )}>
          <FontAwesome5 size={size} style={{}} name={name} color={color} />

          {text && (
            <SofiaRegularText style={tw.style("text-gray-500 mt-1")}>
              {text}
            </SofiaRegularText>
          )}
        </View>
      </Ripple>
    </View>
  );
}

export function CircleIconButton(props: CircleIconProps) {
  const { name, onPress, style, size } = props;
  const color = props.color || "white";
  return (
    <View
      style={tw.style(
        `flex rounded-full  border-${color}`,
        size === "sm" ? "border" : "border-4",
        style
      )}>
      <Ripple
        onPress={onPress}
        rippleContainerBorderRadius={9999}
        rippleColor={color}>
        <View
          style={tw.style(
            "flex flex-col justify-center items-center",
            size === "sm" ? "w-8 h-8" : "w-24 h-24"
          )}>
          <FontAwesome5
            style={tw.style("opacity-100")}
            name={name}
            color={color}
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

export function RoundedOutlineButton(props: ButtonProps) {
  const { onPress, style } = props;

  return (
    <Ripple onPress={onPress} rippleContainerBorderRadius={9999}>
      <View style={tw.style(style)}>
        <View style={tw.style("flex rounded-full border border-gray-500 p-3")}>
          <SofiaSemiBoldText style={tw.style(`text-gray-500`)}>
            {props.title}
          </SofiaSemiBoldText>
        </View>
      </View>
    </Ripple>
  );
}

const styles = StyleSheet.create({
  base: tw`rounded p-4 flex rounded text-center items-center `,
  primary: tw.style(` bg-brand `),
  secondary: tw.style(`border-brand border-2 bg-white text-brand`),
  image: tw`rounded items-center flex shadow p-2 bg-white `
});
