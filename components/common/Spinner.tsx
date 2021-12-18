/** @format */

import React from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { tw } from "../../components/Themed";

export default function Spinner() {
  return (
    <View style={tw`absolute top-0 h-full w-full  justify-center `}>
      <ActivityIndicator size={100} color="rgb(103,146,54)"></ActivityIndicator>
    </View>
  );
}

const styles = StyleSheet.create({});
