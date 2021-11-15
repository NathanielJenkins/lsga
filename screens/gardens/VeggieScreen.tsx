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
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { CircleIconButton } from "../../components/common/Button";
import Hr from "../../components/common/Hr";
import { VeggieItem } from "../../components/garden/GardenItems";
import {
  SofiaBoldText,
  SofiaRegularText,
  SofiaSemiBoldText
} from "../../components/StyledText";
import { tw } from "../../components/Themed";
import { RootState } from "../../store";
import { RootStackScreenProps } from "../../types";
import GeneralSlot from "../slots/GeneralSlot";
export default function VeggieScreen({
  navigation,
  route
}: RootStackScreenProps<"Veggie">) {
  const { veggie } = route.params;
  const { veggies } = useSelector((state: RootState) => state.veggies);

  const Info = (props: {
    title: string;
    text?: string;
    style?: StyleProp<any>;
    children?: React.ReactNode;
  }) => {
    return (
      <View style={tw.style(props.style, "flex mt-4")}>
        <SofiaRegularText style={tw.style("text-brand text-lg")}>
          {props.title}
        </SofiaRegularText>
        <SofiaRegularText style={tw.style("text-gray-500")}>
          {props.text}
        </SofiaRegularText>
        {props.children && props.children}
      </View>
    );
  };

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
          <Image
            source={{ uri: veggie.downloadUrl }}
            style={tw.style(`resize-contain h-24 w-24`)}
          />
          <SofiaBoldText style={tw.style("text-gray-500 text-3xl mt-1")}>
            {veggie.displayName}
          </SofiaBoldText>
          <View style={tw.style("border-b border-gray-300 flex w-64 my-2 ")} />
        </View>
        <Info title={"Seeding Notes"} text={veggie.seedingNotes} />

        <SofiaRegularText style={tw.style("text-brand text-lg my-2")}>
          Companions
        </SofiaRegularText>
        {veggie.companions?.length ? (
          <FlatList
            style={tw.style("pb-2")}
            nestedScrollEnabled
            horizontal={true}
            data={veggie.companions}
            renderItem={({ item, index }) => (
              <VeggieItem
                index={index}
                style={tw.style("m-1")}
                veggie={veggies[item]}
                key={index}
                draggable={false}
              />
            )}
          />
        ) : (
          <SofiaRegularText style={tw.style("text-gray-500 text-sm my-2")}>
            No Companions
          </SofiaRegularText>
        )}
        <SofiaRegularText style={tw.style("text-brand text-lg my-2")}>
          Exclusions
        </SofiaRegularText>
        {veggie?.exclusions.length ? (
          <FlatList
            style={tw.style("pb-2")}
            nestedScrollEnabled
            horizontal={true}
            data={veggie.exclusions}
            renderItem={({ item, index }) => (
              <VeggieItem
                style={tw.style("m-1")}
                veggie={veggies[item]}
                key={index}
                draggable={false}
              />
            )}
          />
        ) : (
          <SofiaRegularText style={tw.style("text-gray-500 text-sm ")}>
            No Exclusions
          </SofiaRegularText>
        )}
        <Info title={"How to Harvest"} text={veggie.howToHarvest} />
      </ScrollView>
    </GeneralSlot>
  );
}

const styles = StyleSheet.create({});
