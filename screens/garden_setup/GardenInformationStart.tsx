/** @format */

import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { tw } from "../../components/Themed";
import UserGarden from "../../models/UserGardens";
import { CardSlot } from "../slots/CardSlot";
import brand_sample from "../../assets/images/brand_sample.jpg";
import { PrimaryButton } from "../../components/common/Button";
import Swiper from "react-native-swiper";
import CachedImage from "react-native-expo-cached-image";

interface GardenInformationStartProps {
  newGardenState: [
    UserGarden,
    React.Dispatch<React.SetStateAction<UserGarden>>
  ];
  hasImageState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  swiper: React.MutableRefObject<Swiper>;
}

export function GardenInformationStart(
  gardenInformationStartProps: GardenInformationStartProps
) {
  const [newGarden, setNewGarden] = gardenInformationStartProps.newGardenState;
  const [hasImage, setHasImage] = gardenInformationStartProps.hasImageState;
  const swiper = gardenInformationStartProps.swiper;

  return (
    <View style={tw.style("flex flex-1")}>
      <CardSlot
        title={"Garden Information"}
        subtitle="In order to recommend the best veggies, please answer the following questions about your garden">
        <View style={tw`flex justify-center items-center`}>
          <View
            style={tw`w-full h-64 flex justify-center items-center mt-4 mb-6 shadow-brand`}>
            <CachedImage
              source={
                hasImage
                  ? {
                      uri: newGarden.url
                    }
                  : brand_sample
              }
              style={tw`w-full h-full rounded-lg `}
            />
          </View>
          <View style={tw`flex flex-row `}>
            <View style={tw`flex-1 mr-2`}>
              <PrimaryButton
                title="Let's Go!"
                style={tw` `}
                onPress={() => swiper.current.scrollBy(1)}
              />
            </View>
          </View>
        </View>
      </CardSlot>
    </View>
  );
}

const styles = StyleSheet.create({});
