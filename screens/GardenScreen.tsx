/** @format */

import * as React from "react";
import { StyleSheet, ScrollView, SafeAreaView } from "react-native";

import { Text, tw, View } from "../components/Themed";
import { VeggieItem } from "../components/garden/GardenItems";
import MainPageSlot from "./slots/MainPageSlot";
import { SofiaRegularText } from "../components/StyledText";
export default function GardenScreen() {
  return (
    <View style={tw.style("bg-white flex flex-1 p-4 pt-5")}>
      <View style={tw.style("flex-1")}>
        <SofiaRegularText>part 1</SofiaRegularText>
      </View>
      <View style={tw.style("flex-1")}>
        <SafeAreaView>
          <ScrollView>
            <View style={tw.style("flex")}>
              <SofiaRegularText>part 2</SofiaRegularText>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  );
}
