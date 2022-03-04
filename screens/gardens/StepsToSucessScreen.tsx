/** @format */

import React, { Children } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StyleProp,
  FlatList
} from "react-native";
import CachedImage from "react-native-expo-cached-image";

import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { CircleIconButton } from "../../components/common";
import { SofiaBoldText, SofiaRegularText } from "../../components/StyledText";
import { tw } from "../../components/Themed";
import { RootState } from "../../store";
import { RootStackScreenProps } from "../../types";
import { GeneralSlot } from "../slots/GeneralSlot";
import { PrimaryButton } from "../../components/common/Button";
import { StepsToSuccess } from "../../components";

export default function StepsToSuccessScreen({
  navigation,
  route
}: RootStackScreenProps<"StepsToSuccess">) {
  const { veggie } = route.params;
  if (!veggie)
    return (
      <GeneralSlot>
        <View
          style={tw.style(
            "flex flex-row w-full items-center justify-end pb-2 border-b border-gray-300"
          )}>
          <CircleIconButton
            name={"times"}
            size={"sm"}
            color={"black"}
            onPress={() => navigation.pop()}
          />
        </View>
        <View style={tw.style("flex flex-1 justify-center items-center")}>
          <SofiaRegularText>Veggie Not Added Yet</SofiaRegularText>
        </View>
      </GeneralSlot>
    );

  const { veggies } = useSelector((state: RootState) => state.veggies);

  return (
    <GeneralSlot>
      <View
        style={tw.style(
          "flex flex-row w-full items-center justify-end pb-2 border-b border-gray-300"
        )}>
        <CircleIconButton
          name={"times"}
          size={"sm"}
          color={"black"}
          onPress={() => navigation.pop()}
        />
      </View>
      <ScrollView>
        <View style={tw.style("flex justify-center items-center mt-4")}>
          <CachedImage
            source={{ uri: veggie.downloadUrl }}
            style={tw.style(`resize-contain h-24 w-24`)}
          />
          <SofiaBoldText style={tw.style("text-gray-500 text-3xl mt-1")}>
            {veggie.displayName}
          </SofiaBoldText>
          <View style={tw.style("border-b border-gray-300 flex w-64 my-2 ")} />
          <View style={tw`mb-4 w-64`}>
            <PrimaryButton title="Start Seeding!" onPress={() => {}} />
          </View>
        </View>
        <StepsToSuccess
          directSeedSteps={veggie.directSeedSteps}
          indoorsSeedSteps={veggie.indoorsSeedSteps}
        />
      </ScrollView>
    </GeneralSlot>
  );
}

const styles = StyleSheet.create({});
