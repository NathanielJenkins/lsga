/** @format */

import React, { Children, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StyleProp,
  FlatList,
  ActivityIndicator
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SofiaBoldText, SofiaRegularText } from "../../components/StyledText";
import { tw } from "../../components/Themed";
import { RootStackScreenProps } from "../../types";
import GeneralSlot from "../slots/GeneralSlot";
import Ripple from "react-native-material-ripple";
import { IconText, SecondaryButton } from "../../components/common/Button";
import { Info } from "../../components/common/Display";
import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { setFrostDateFromLngLat } from "../../models/UserProperties";
import AddFrostDate from "../../components/garden/GardenItems";
import AddFrostDateComponent from "../../components/garden/GardenItems";

export default function GardenInfoScreen({
  navigation,
  route
}: RootStackScreenProps<"GardenInfoScreen">) {
  return (
    <GeneralSlot>
      <View style={tw.style("flex flex-row justify-between items-center")}>
        <SofiaBoldText style={tw.style("text-gray-500 text-2xl")}>
          Settings
        </SofiaBoldText>
      </View>
      <ScrollView>
        <AddFrostDateComponent />
      </ScrollView>
    </GeneralSlot>
  );
}

const styles = StyleSheet.create({});
