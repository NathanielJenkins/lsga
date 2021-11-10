/** @format */

import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/reducers";
import Garden, { getAllGardens } from "../../models/Garden";
import UserGarden, { setUserGarden } from "../../models/UserGardens";
import CardSlot from "../slots/CardSlot";
import { addNewGarden } from "../../store/actions/garden.actions";
import { tw } from "../../components/Themed";
import { PrimaryButton, ThumbnailCard } from "../../components/common/Button";
import Swiper from "react-native-swiper";
import { Input } from "../../components/common/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";

interface Props {
  newGardenState: [
    UserGarden,
    React.Dispatch<React.SetStateAction<UserGarden>>
  ];
  swiper: React.MutableRefObject<Swiper>;
}

export default function NameGarden(props: Props) {
  const [newGarden, setNewGarden] = props.newGardenState;

  const [name, setName] = useState<string>("My Garden");
  const [description, setDescription] = useState<string>("");

  const swiper = props.swiper;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleConfirm = async () => {
    dispatch(addNewGarden(newGarden));
    navigation.navigate("Root");
  };

  React.useEffect(() => {
    const ng = { ...newGarden };
    ng.name = name;
    ng.description = description;
    setNewGarden(ng);
  }, [name, description]);

  return (
    <CardSlot
      title={"Name your Garden"}
      subtitle={"Add information to keep track of your garden"}>
      <KeyboardAwareScrollView extraHeight={20}>
        <View style={tw.style("flex my-2")}>
          <Input
            placeholder="name"
            style={tw.style("mt-2")}
            handleOnChangeText={n => setName(n)}
          />
          <Input
            placeholder="description"
            handleOnChangeText={n => setDescription(n)}
            numberOfLines={8}
            style={tw.style("flex mt-2 ")}
          />
          <PrimaryButton
            title="All Done!"
            onPress={handleConfirm}
            style={tw`mt-2`}
          />
        </View>
      </KeyboardAwareScrollView>
    </CardSlot>
  );
}

const styles = StyleSheet.create({});
