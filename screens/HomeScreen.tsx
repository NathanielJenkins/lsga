/** @format */

import * as React from "react";
import { StyleSheet, Image, View, Text } from "react-native";
import CachedImage from "react-native-expo-cached-image";

import {
  IconText,
  PrimaryButton,
  SecondaryButton
} from "../components/common/Button";
import EditScreenInfo from "../components/EditScreenInfo";
import { RootTabScreenProps } from "../types";
import { RootState } from "../store/reducers";
import { useSelector, useDispatch } from "react-redux";
import {
  updateGardens,
  updateActiveGrid,
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
import {
  updateUserProperties,
  updateVeggies,
  updatePacks,
  updateGardenTypes
} from "../store";
import {
  GardenGrid,
  GardenSelector,
  GridSwapper,
  NoGardensPrompt
} from "../components/garden/GardenItems";
import { ProgressChartIO, Timeline } from "../components/schedule/Charts";
import { GalleryCard } from "../components/gallery";
import { Spinner } from "../components/common";
import { GridType } from "../models";
import {
  getGridFromGridType,
  getPlantingDatesFromGridType,
  PlantingDate
} from "../models/UserGardens";
PrimaryButton;
export function HomeScreen({ navigation }: RootTabScreenProps<"HomeScreen">) {
  const dispatch = useDispatch();

  const [imageUrl, setImageUrl] = React.useState(undefined);
  const setActiveGridType = (grid: GridType) => {
    dispatch(updateActiveGrid(grid));
  };

  const { gardens, activeGarden } = useSelector(
    (state: RootState) => state.gardens
  );
  const { veggies } = useSelector((state: RootState) => state.veggies);
  const { activeGrid } = useSelector((state: RootState) => state.gardens);

  const [veggieGrid, setVeggieGrid] = React.useState([]);
  const [plantingDates, setPlantingDates] = React.useState<Array<PlantingDate>>(
    []
  );
  const { loading } = useSelector((state: RootState) => state.common);
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

  React.useEffect(() => {
    dispatch(updateGardens());
    dispatch(updateVeggies());
    dispatch(updatePacks());
    dispatch(updateUserProperties());
    dispatch(updateGardenTypes());
  }, []);

  React.useEffect(() => {
    const grid = getGridFromGridType(activeGrid, activeGarden);
    const plantingDates = getPlantingDatesFromGridType(
      activeGrid,
      activeGarden
    );
    setVeggieGrid(grid.map(g => veggies[g]) || []);
    setPlantingDates(plantingDates);
  }, [activeGarden, veggies, activeGrid]);

  if (loading) return <Spinner />;
  return gardens?.length && activeGarden ? (
    <MainPageSlot>
      <GardenSelector style={tw.style("m-2 z-20 flex ", { zIndex: 1 })} />
      <View style={tw.style("shadow-brand rounded-md m-2 flex", { zIndex: 0 })}>
        <View
          style={tw`w-full flex overflow-visible justify-center items-center rounded-md relative `}>
          <CachedImage
            style={tw.style("h-64 w-full rounded-md")}
            source={{ uri: imageUrl }}
          />
          <View
            style={tw.style(
              " bg-transparent flex w-full items-center -top-8 justify-center"
            )}>
            <GardenGrid
              draggable={false}
              veggieGrid={veggieGrid}
              garden={activeGarden?.garden}
            />
            <GridSwapper
              style={tw.style("mt-4")}
              selectedGrid={activeGrid}
              setActiveGridType={setActiveGridType}
            />
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
            onPress={() =>
              navigation.navigate("GardenScreen", { garden: activeGarden })
            }
          />
        </View>
      </View>
      <View>
        <Timeline
          gardenVeggies={[...new Set(veggieGrid)]}
          plantingDates={plantingDates}
        />
      </View>
      <View>
        <ProgressChartIO activeGridType={activeGrid} />
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
