/** @format */

import * as React from "react";
import { StyleSheet, ScrollView, SafeAreaView, FlatList } from "react-native";
import { DraxProvider, DraxView, DraxScrollView } from "react-native-drax";

import { Text, tw, View } from "../../components/Themed";
import {
  VeggieItem,
  GardenSelector,
  GardenGrid,
  NoGardensPrompt
} from "../../components/garden/GardenItems";

import { useSelector } from "react-redux";
import { RootState } from "../../store";
export default function GardenScreen() {
  const { veggies } = useSelector((state: RootState) => state.veggies);
  const { activeGarden } = useSelector((state: RootState) => state.gardens);
  const veggieGrid = useSelector((state: RootState) =>
    state.gardens.activeGarden.grid.map(veggieName =>
      veggies.find(veg => veg.name === veggieName)
    )
  );
  const [workingGrid, setWorkingGrid] = React.useState(veggieGrid);

  if (!activeGarden) return <NoGardensPrompt />;
  return (
    <View style={tw.style("bg-white flex flex-1 p-4 pt-8")}>
      <DraxProvider>
        <GardenSelector />

        <View style={tw.style("flex ")}>
          <GardenGrid
            style={tw.style("mt-2")}
            workingGridState={[workingGrid, setWorkingGrid]}
          />
        </View>
        <SafeAreaView style={tw.style("flex-1 mt-2")}>
          <DraxScrollView horizontal={true} style={tw.style("h-full ")}>
            <FlatList
              data={veggies}
              style={tw.style("flex mb-auto")}
              numColumns={Math.floor(veggies.length / 2) + 1}
              renderItem={({ item }) => (
                <VeggieItem
                  key={item.name}
                  draggable={true}
                  veggie={item}
                  style={tw.style("m-1")}
                />
              )}
            />
          </DraxScrollView>
        </SafeAreaView>
      </DraxProvider>
    </View>
  );
}
