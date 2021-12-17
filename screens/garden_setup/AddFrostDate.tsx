/** @format */

import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import UserGarden from "../../models/UserGardens";
import { CardSlot } from "../slots/CardSlot";
import { addNewGarden } from "../../store/actions/garden.actions";
import { tw } from "../../components/Themed";
import { PrimaryButton, ThumbnailCard } from "../../components/common/Button";
import Swiper from "react-native-swiper";
import { Input } from "../../components/common/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { SofiaSemiBoldText } from "../../components/StyledText";
import { AddFrostDateComponent } from "../../components/garden/GardenItems";

interface Props {
  swiper: React.MutableRefObject<Swiper>;
}

export function AddFrostDate(props: Props) {
  const swiper = props.swiper;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <CardSlot
      title={"Add a frost date"}
      subtitle={
        "Frost dates are used to determine when to plant and harvest veggies."
      }>
      <AddFrostDateComponent />
    </CardSlot>
  );
}

const styles = StyleSheet.create({});
