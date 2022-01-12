/** @format */

import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { auth } from "../../firebase/firebaseTooling";
import { deleteAccount } from "../../models/UserProperties";
import { deleteUser, logoutUser } from "../../store";
import { IconText, Info } from "../common";
import { SofiaRegularText } from "../StyledText";
import { tw } from "../Themed";

export function Logout() {
  const dispatch = useDispatch();
  const alertMsg: [string, string, any] = [
    `Delete Entire Account!"`,
    `Are you sure you want to delete your account. This will delete all data / images`,
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "OK",
        onPress: () => {
          dispatch(deleteUser());
        }
      }
    ]
  ];

  const user = auth.currentUser;
  const handleDeleteAccount = () => {
    Alert.alert(...alertMsg);
  };
  return (
    <Info title="My Account">
      <View style={tw.style("flex flex-row justify-between items-center")}>
        <SofiaRegularText>{user.email}</SofiaRegularText>
        <View style={tw.style("flex flex-row")}>
          <IconText
            name="info"
            color="grey"
            size={20}
            style={tw.style("mr-1")}
          />
          <IconText
            name="trash"
            color="grey"
            size={20}
            onPress={() => handleDeleteAccount()}
          />
        </View>
      </View>
    </Info>
  );
}

const styles = StyleSheet.create({});
