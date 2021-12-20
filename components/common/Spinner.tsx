/** @format */

import React from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { tw } from "../../components/Themed";

export default function Spinner() {
  return (
    <View style={tw`absolute top-0 h-full w-full justify-center bg-white`}>
      <ActivityIndicator
        size={"large"}
        color="rgb(103,146,54)"></ActivityIndicator>
    </View>
  );
}

export { Spinner };

const styles = StyleSheet.create({});
