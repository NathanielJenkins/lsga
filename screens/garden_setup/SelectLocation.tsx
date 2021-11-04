import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RootStackScreenProps } from "types";

export default function SelectLocation({
  navigation,
}: RootStackScreenProps<"SelectLocation">) {
  return (
    <View>
      <Text>Select Location</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
