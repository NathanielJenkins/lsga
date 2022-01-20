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
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { CircleIconButton } from "../../components/common";
import {
  GardenGrid,
  TextPill,
  VeggieItem
} from "../../components/garden/GardenItems";
import { SofiaBoldText, SofiaRegularText } from "../../components/StyledText";
import { brandColor, tw } from "../../components/Themed";
import { RootState } from "../../store";
import { RootStackScreenProps } from "../../types";
import { GeneralSlot } from "../slots/GeneralSlot";
import { IconText } from "../../components/common/Button";
import Ripple from "react-native-material-ripple";
import { Info } from "../../components/common/Display";
import FastImage from "react-native-fast-image";
import Swiper from "react-native-swiper";
import Garden from "../../models/Garden";
import Veggie from "../../models/Veggie";
import { useNavigation } from "@react-navigation/native";

interface GardenInfoProps {
  garden: Garden;
  title: string;
  veggieGrid: Array<Veggie>;
}

const GardenInfo = (props: GardenInfoProps) => {
  const navigation = useNavigation();

  return (
    <View style={tw.style("shadow-brand p-4 m-2")}>
      <SofiaRegularText
        style={tw.style("text-center text-2xl text-gray-500 mb-4")}>
        {props.title}
      </SofiaRegularText>

      <GardenGrid
        draggable={false}
        garden={props.garden}
        veggieGrid={props.veggieGrid}
      />

      <SofiaRegularText style={tw.style("text-brand mt-4 text-lg")}>
        Veggies
      </SofiaRegularText>

      <FlatList
        style={tw.style("m-1")}
        numColumns={3}
        data={props.veggieGrid}
        keyExtractor={(v, i) => `companion-${v}-${i}`}
        renderItem={({ item, index }) => (
          <Ripple
            onPress={() => navigation.navigate("Veggie", { veggie: item })}>
            <VeggieItem
              index={index}
              style={tw.style("m-2")}
              veggie={item}
              draggable={false}
            />
          </Ripple>
        )}
      />
    </View>
  );
};

export function PackScreen({
  navigation,
  route
}: RootStackScreenProps<"Pack">) {
  const { pack } = route.params;
  const { veggies } = useSelector((state: RootState) => state.veggies);
  const { gardenTypes } = useSelector((state: RootState) => state.gardens);

  const DEFAULT_TEMP = "low_rider";
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
        <View style={tw.style("flex justify-center items-center ")}>
          <Image
            source={{ uri: pack.downloadUrl }}
            style={tw.style(`h-64 w-full max-w-2xl rounded`)}
          />
          <SofiaBoldText style={tw.style("text-gray-500 text-3xl mt-3")}>
            {pack.displayName}
          </SofiaBoldText>
          <View style={tw.style("border-b border-gray-300 flex w-64 my-2 ")} />
          <Info title={"Description"} text={pack.description} />
        </View>

        <Swiper
          activeDotColor={brandColor}
          loop={false}
          style={tw.style("h-96 mt-2")}>
          <View>
            <GardenInfo
              garden={gardenTypes.find(gt => gt.id === DEFAULT_TEMP)}
              veggieGrid={pack.grid[DEFAULT_TEMP].spring.map(vn => veggies[vn])}
              title="Spring"
            />
          </View>
          <View>
            <GardenInfo
              garden={gardenTypes.find(gt => gt.id === DEFAULT_TEMP)}
              veggieGrid={pack.grid[DEFAULT_TEMP].summer.map(vn => veggies[vn])}
              title="Summer"
            />
          </View>
          <View>
            <GardenInfo
              garden={gardenTypes.find(gt => gt.id === DEFAULT_TEMP)}
              veggieGrid={pack.grid[DEFAULT_TEMP].autumnWinter.map(
                vn => veggies[vn]
              )}
              title="Autumn"
            />
          </View>
        </Swiper>
        <View style={tw.style("my-3")}></View>
      </ScrollView>
    </GeneralSlot>
  );
}

const styles = StyleSheet.create({});
