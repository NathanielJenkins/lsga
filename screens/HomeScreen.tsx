/** @format */

import * as React from "react";
import { StyleSheet, Image, View, Text } from "react-native";
import {
  IconText,
  PrimaryButton,
  SecondaryButton
} from "../components/common/Button";
import EditScreenInfo from "../components/EditScreenInfo";
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
import { MainPageSlot } from "./slots/MainPageSlot";
import { storage } from "../firebase/firebaseTooling";
import { updateUserProperties, updateVeggies } from "../store";
import {
  GardenGrid,
  GardenSelector,
  NoGardensPrompt
} from "../components/garden/GardenItems";
import { ProgressChartIO, Timeline } from "../components/schedule/Charts";
import { GalleryCard } from "../components/gallery";

PrimaryButton;
export function HomeScreen({ navigation }: RootTabScreenProps<"HomeScreen">) {
  const [imageUrl, setImageUrl] = React.useState(undefined);
  const { gardens, activeGarden } = useSelector(
    (state: RootState) => state.gardens
  );
  const { veggies } = useSelector((state: RootState) => state.veggies);
  const [veggieGrid, setVeggieGrid] = React.useState([]);

  React.useEffect(() => {
    if (!activeGarden?.url) return;
    storage
      .ref(activeGarden.url) //name in storage in firebase console
      .getDownloadURL()
      .then((url: string) => {
        setImageUrl(url);
      })
      .catch((e: Error) => console.error("Errors while downloading => ", e));
  }, [activeGarden]);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(updateGardens());
    dispatch(updateVeggies());
    dispatch(updateUserProperties());
  }, []);

  React.useEffect(() => {
    setVeggieGrid(activeGarden?.grid.map(g => veggies[g]) || []);
  }, [activeGarden, veggies]);

  const handleUpdateActiveGarden = (gardenName: string) => {
    const garden = gardens.find(g => g.name === gardenName);
    dispatch(updateActiveGarden(garden));
  };

  return gardens?.length && activeGarden ? (
    <MainPageSlot>
      <GardenSelector style={tw.style("m-2")} />
      <View style={tw.style("shadow-brand rounded-md m-2 flex ")}>
        <View
          style={tw`w-full flex overflow-visible justify-center items-center rounded-md relative `}>
          <Image
            style={tw.style("h-64 w-full rounded-md")}
            source={{ uri: imageUrl }}></Image>
          <View style={tw.style(" bg-transparent flex w-full -top-8")}>
            <GardenGrid draggable={false} veggieGrid={veggieGrid} />
          </View>
        </View>

        <View
          style={tw.style(
            "flex flex-row justify-between border-t border-gray-200 rounded-md"
          )}>
          <IconText
            style={tw.style("flex-1")}
            size={20}
            text="Edit Veggies"
            name="edit"
            color="gray"
            onPress={() => navigation.navigate("GardenScreen")}
          />
        </View>
      </View>
      <View>
        <Timeline />
      </View>
      <View>
        <ProgressChartIO />
      </View>
      <View>
        <GalleryCard />
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
