/** @format */

import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Image, View, Text } from "react-native";
import { RootStackScreenProps } from "../../types";
import { tw, brandColor } from "../../components/Themed";
import brand_sample from "../../assets/images/brand_sample.jpg";
import {
  SecondaryButton,
  PrimaryButton,
  IconText
} from "../../components/common/Button";
import { Camera } from "expo-camera";
import UserGarden from "../../models/UserGardens";
import Swiper from "react-native-swiper";
import brand_logo from "../../assets/images/brand_logo.png";
import {
  AddFrostDate,
  NameGarden,
  SelectPlanter,
  GardenInformationStart,
  SelectLocation
} from ".";
import { SofiaBoldText } from "../../components/StyledText";

SelectPlanter;
export function SetupGarden({
  navigation
}: RootStackScreenProps<"SetupGarden">) {
  const [newGarden, setNewGarden] = useState<UserGarden>(undefined);
  const [hasImage, setHasImage] = useState<boolean>(false);
  const swiper = useRef(null);
  return (
    <View style={tw.style("flex flex-1 bg-white")}>
      <View style={tw`w-full flex justify-center items-center mt-6 mb-2 `}>
        <Image source={brand_logo} style={tw``} />
      </View>

      <Swiper activeDotColor={brandColor} loop={false} ref={swiper}>
        <SelectLocation
          newGardenState={[newGarden, setNewGarden]}
          hasImageState={[hasImage, setHasImage]}
        />

        <GardenInformationStart
          newGardenState={[newGarden, setNewGarden]}
          hasImageState={[hasImage, setHasImage]}
          swiper={swiper}
        />
        <SelectPlanter
          newGardenState={[newGarden, setNewGarden]}
          swiper={swiper}
        />
        <AddFrostDate swiper={swiper} />

        <NameGarden
          newGardenState={[newGarden, setNewGarden]}
          swiper={swiper}
        />
      </Swiper>
      <SofiaBoldText
        onPress={() => navigation.pop()}
        style={tw.style("text-center underline text-brand mb-3")}>
        Exit Without Saving
      </SofiaBoldText>
    </View>
  );
}

const styles = StyleSheet.create({});
