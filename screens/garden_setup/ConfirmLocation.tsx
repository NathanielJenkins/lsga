import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RootStackScreenProps } from "types";

export default function ConfirmLocation({
  navigation,
}: RootStackScreenProps<"ConfirmLocation">) {
  return (
    <View>
      <Text>Select Location</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
