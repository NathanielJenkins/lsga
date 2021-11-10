/** @format */

import * as React from "react";
import { StyleSheet, Image } from "react-native";
import { PrimaryButton, SecondaryButton } from "../components/common/Button";
import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { getGardenByName } from "../models/Garden";
import { RootState } from "../store/reducers";
import { useSelector, useDispatch } from "react-redux";
import {
  updateGardens,
  updateActiveGarden
} from "../store/actions/garden.actions";
import no_gardens from "../assets/images/no_gardens.png";
import { tw } from "../components/Themed";
import {
  SofiaBoldText,
  SofiaRegularText,
  SofiaSemiBoldText
} from "../components/StyledText";
import MainPageSlot from "./slots/MainPageSlot";
import { Picker } from "@react-native-picker/picker";
import { storage } from "../firebase/firebaseTooling";
import { updateVeggies } from "../store";
import {
  GardenSelector,
  NoGardensPrompt
} from "../components/garden/GardenItems";

PrimaryButton;
export default function HomeScreen({
  navigation
}: RootTabScreenProps<"HomeScreen">) {
  const [imageUrl, setImageUrl] = React.useState(undefined);
  const { gardens, activeGarden } = useSelector(
    (state: RootState) => state.gardens
  );

  React.useEffect(() => {
    if (!activeGarden?.url) return;
    storage
      .ref(activeGarden.url) //name in storage in firebase console
      .getDownloadURL()
      .then((url: string) => {
        setImageUrl(url);
      })
      .catch((e: Error) => console.log("Errors while downloading => ", e));
  }, [activeGarden]);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(updateGardens());
    dispatch(updateVeggies());
  }, []);

  const handleUpdateActiveGarden = (gardenName: string) => {
    const garden = gardens.find(g => g.name === gardenName);
    dispatch(updateActiveGarden(garden));
  };

  return gardens?.length && activeGarden ? (
    <MainPageSlot>
      <GardenSelector />
      <View
        style={tw`w-full h-64 flex justify-center items-center shadow-brand`}>
        <Image
          style={tw.style("h-64 w-full rounded-md")}
          source={{ uri: imageUrl }}></Image>
      </View>
    </MainPageSlot>
  ) : (
    <NoGardensPrompt />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%"
  }
});
