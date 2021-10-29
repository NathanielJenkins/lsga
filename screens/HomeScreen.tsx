import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RootStackScreenProps } from "types";

export default function HomeScreen({
  navigation
}: RootStackScreenProps<"HomePage">) {
  return (
    <View>
      <Text>Home Screen </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
