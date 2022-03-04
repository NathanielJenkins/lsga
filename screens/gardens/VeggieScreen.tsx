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
import { TextPill, VeggieItem } from "../../components/garden/GardenItems";
import { SofiaBoldText, SofiaRegularText } from "../../components/StyledText";
import { tw } from "../../components/Themed";
import { RootState } from "../../store";
import { RootStackScreenProps } from "../../types";
import { GeneralSlot } from "../slots/GeneralSlot";
import { IconText } from "../../components/common/Button";
import Ripple from "react-native-material-ripple";
import { Info } from "../../components/common/Display";
import FastImage from "react-native-fast-image";
import { StepsToSuccess } from "../../components";
import Hr from "../../components/common/Hr";

export default function VeggieScreen({
  navigation,
  route
}: RootStackScreenProps<"Veggie">) {
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
        </View>

        <StepsToSuccess
          directSeedSteps={veggie.directSeedSteps}
          indoorsSeedSteps={veggie.indoorsSeedSteps}
        />

        <Info title={"Seeding Notes"} text={veggie.seedingNotes} />
        {veggie.directSeed.length !== 0 && (
          <Info title={"Direct Seed"}>
            <FlatList
              style={tw.style("")}
              data={veggie.directSeed}
              keyExtractor={d => `directseed-${d}`}
              nestedScrollEnabled
              horizontal={true}
              renderItem={({ item, index }) => (
                <TextPill
                  style={tw.style("mr-2 mb-2")}
                  text={item as string}
                  key={index}
                />
              )}
            />
          </Info>
        )}

        {veggie.startIndoors.length !== 0 && (
          <Info title={"Start Indoors"}>
            <FlatList
              style={tw.style("")}
              data={veggie.startIndoors}
              keyExtractor={d => `startindoors-${d}`}
              nestedScrollEnabled
              horizontal={true}
              renderItem={({ item, index }) => (
                <TextPill
                  style={tw.style("mr-2 mb-2")}
                  text={item as string}
                  key={index}
                />
              )}
            />
          </Info>
        )}

        {veggie.transplantOutdoors.length !== 0 && (
          <Info title={"Transplant Outdoors"}>
            <FlatList
              style={tw.style("")}
              data={veggie.transplantOutdoors}
              keyExtractor={d => `transplant-${d}`}
              nestedScrollEnabled
              horizontal={true}
              renderItem={({ item, index }) => (
                <TextPill
                  style={tw.style("mr-2 mb-2")}
                  text={item as string}
                  key={index}
                />
              )}
            />
          </Info>
        )}

        <SofiaRegularText style={tw.style("text-brand text-lg my-2")}>
          Companions
        </SofiaRegularText>
        {veggie.companions?.length ? (
          <FlatList
            style={tw.style("pb-2")}
            nestedScrollEnabled
            horizontal={true}
            data={veggie.companions}
            keyExtractor={v => `companion-${v}`}
            renderItem={({ item, index }) => {
              const veggie = veggies[item];
              if (!veggie) return;

              return (
                <Ripple onPress={() => navigation.push("Veggie", { veggie })}>
                  <VeggieItem
                    index={index}
                    style={tw.style("m-1")}
                    veggie={veggies[item]}
                    draggable={false}
                  />
                </Ripple>
              );
            }}
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
            keyExtractor={v => `exclusion-${v}`}
            nestedScrollEnabled
            horizontal={true}
            data={veggie.exclusions}
            renderItem={({ item, index }) => {
              const veggie = veggies[item];
              if (!veggie) return;

              return (
                <Ripple onPress={() => navigation.push("Veggie", { veggie })}>
                  <VeggieItem
                    index={index}
                    style={tw.style("m-1")}
                    veggie={veggies[item]}
                    draggable={false}
                  />
                </Ripple>
              );
            }}
          />
        ) : (
          <SofiaRegularText style={tw.style("text-gray-500 text-sm ")}>
            No Exclusions
          </SofiaRegularText>
        )}
        <Info title={"How to Harvest"} text={veggie.howToHarvest} />

        <Info title={"Veggie Attributes"}>
          <View style={tw.style("flex flex-row justify-between my-2")}>
            <IconText
              size={25}
              name="sun"
              text={`${veggie.sunlight[0]} - ${veggie.sunlight[1]} hrs`}
              color="grey"
              style={tw`flex text-center flex-1`}
              onPress={() => {}}
            />
            <IconText
              size={25}
              name="expand-arrows-alt"
              text={`${veggie.spacingPerSquareFoot} inches`}
              color="grey"
              style={tw`flex text-center flex-1`}
              onPress={() => {}}
            />

            <IconText
              size={25}
              name="snowflake"
              text={`${veggie.earliestPlantingFromLastFrostDate} | ${veggie.earliestPlantingFromLastFrostDate} days`}
              color="grey"
              style={tw`p-1 flex text-center flex-1`}
              onPress={() => {}}
            />
          </View>
          <View style={tw.style("flex flex-row justify-center")}>
            <IconText
              size={25}
              name="leaf"
              text={`${veggie.daysToMaturity[0]} | ${veggie.daysToMaturity[1]} days`}
              color="grey"
              style={tw`p-1 flex text-center `}
              onPress={() => {}}
            />
          </View>
        </Info>
      </ScrollView>
    </GeneralSlot>
  );
}

const styles = StyleSheet.create({});
