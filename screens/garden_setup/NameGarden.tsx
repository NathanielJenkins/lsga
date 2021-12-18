/** @format */

import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import UserGarden from "../../models/UserGardens";
import { CardSlot } from "../slots/CardSlot";
import { addNewGarden, RootState, setLoading } from "../../store";
import { tw } from "../../components/Themed";
import { PrimaryButton, ThumbnailCard } from "../../components/common/Button";
import Swiper from "react-native-swiper";
import { Input } from "../../components/common/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import Spinner from "../../components/common/Spinner";
import { isEmpty } from "lodash";
interface Props {
  newGardenState: [
    UserGarden,
    React.Dispatch<React.SetStateAction<UserGarden>>
  ];
  swiper: React.MutableRefObject<Swiper>;
}

export function NameGarden(props: Props) {
  const [newGarden, setNewGarden] = props.newGardenState;

  const [name, setName] = useState<string>("My Garden");
  const [description, setDescription] = useState<string>("");
  const { loading } = useSelector((state: RootState) => state.common);
  const swiper = props.swiper;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleConfirm = async () => {
    if (!newGarden || !newGarden.garden || !newGarden.name) {
      Alert.alert(
        "Failed to Add Garden",
        "Make sure to enter all the information"
      );
      return;
    }
    dispatch(addNewGarden(newGarden));
  };

  React.useEffect(() => {
    const ng = { ...newGarden };
    ng.name = name;
    ng.description = description;
    setNewGarden(ng);
  }, [name, description]);

  return (
    <KeyboardAwareScrollView
      extraHeight={20}
      contentContainerStyle={{ flex: 1 }}>
      <CardSlot
        title={"Name your Garden"}
        subtitle={"Add information to keep track of your garden"}>
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
      </CardSlot>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({});
