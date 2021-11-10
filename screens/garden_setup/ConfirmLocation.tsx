/** @format */

import React, { useEffect, useState } from "react";
import { StyleSheet, Image, View } from "react-native";
import CardSlot from "../../screens/slots/CardSlot";
import { RootStackScreenProps } from "../../types";
import { tw } from "../../components/Themed";
import brand_sample from "../../assets/images/brand_sample.jpg";
import { SecondaryButton } from "../../components/common/Button";
import { Camera } from "expo-camera";
import UserGarden from "../../models/UserGardens";

export default function SelectLocation({
  navigation,
  route
}: RootStackScreenProps<"ConfirmLocation">) {
  const [newGarden, setNewGarden] = route.params.newGardenState;
  console.log(newGarden);
  return (
    <CardSlot
      title="How does it look ?"
      subtitle="Is this the location you want your garden ?">
      <View style={tw`flex justify-center items-center`}>
        <View
          style={tw`w-full h-64 flex justify-center items-center mt-4 mb-6 shadow-brand`}>
          {/* <Image
            source={{
              uri: newGarden.url
            }}
            style={tw`w-full h-full rounded-lg `}
          /> */}
        </View>
        <View style={tw`flex flex-row `}>
          <View style={tw`flex-1 mr-2`}>
            <SecondaryButton
              title="Camera"
              style={tw` `}
              onPress={() =>
                navigation.push("CameraPreview", {
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
  );
}

const styles = StyleSheet.create({});
