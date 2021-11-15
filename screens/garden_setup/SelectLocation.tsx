/** @format */

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  View,
  Text,
  DeviceEventEmitter
} from "react-native";
import CardSlot from "../../screens/slots/CardSlot";
import { RootStackParamList, RootStackScreenProps } from "../../types";
import { tw, brandColor } from "../../components/Themed";
import brand_sample from "../../assets/images/brand_sample.jpg";
import { SecondaryButton, PrimaryButton } from "../../components/common/Button";
import { Camera } from "expo-camera";
import UserGarden from "../../models/UserGardens";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";

interface SelectLocationProps {
  newGardenState: [
    UserGarden,
    React.Dispatch<React.SetStateAction<UserGarden>>
  ];
  hasImageState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

export default function SelectLocation(
  SelectLocationProps: SelectLocationProps
) {
  const [newGarden, setNewGarden] = SelectLocationProps.newGardenState;
  const [hasImage, setHasImage] = SelectLocationProps.hasImageState;
  const [title, setTitle] = useState<string>("Select a Location");
  const [subtitle, setSubtitle] = useState<string>(
    "Use a picture to showcase the location of your next garden"
  );
  DeviceEventEmitter;
  const navigation = useNavigation();
  React.useEffect(() => {
    if (newGarden?.url) {
      setHasImage(true);
      setTitle("How does it look?");
      setSubtitle("Is this where you want your garden?");
    }
  });

  return (
    <View style={tw.style("flex flex-1 ")}>
      <CardSlot
        title={title}
        subtitle="Use a picture to showcase the location of your next garden">
        <View style={tw`flex justify-center items-center`}>
          <View
            style={tw`w-full h-64 flex justify-center items-center mt-4 mb-6 shadow-brand`}>
            <Image
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
              <SecondaryButton
                title="Camera"
                style={tw` `}
                onPress={() =>
                  navigation.navigate("CameraPreview", {
                    newGardenState: [newGarden, setNewGarden]
                  })
                }
              />
            </View>
            <View style={tw`flex-1 `}>
              <SecondaryButton title="Photos" style={tw` `} />
            </View>
          </View>
        </View>
      </CardSlot>
    </View>
  );
}

const styles = StyleSheet.create({});
