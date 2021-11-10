/** @format */

import * as React from "react";
import { StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { DraxProvider, DraxView } from "react-native-drax";

import { Text, tw, View } from "../components/Themed";
import {
  VeggieItem,
  GardenSelector,
  GardenGrid,
  NoGardensPrompt
} from "../components/garden/GardenItems";

import { useSelector } from "react-redux";
import { RootState } from "../store";
export default function GardenScreen() {
  const { veggies } = useSelector((state: RootState) => state.veggies);
  const { activeGarden } = useSelector((state: RootState) => state.gardens);
  const veggieGrid = useSelector(
    (state: RootState) => state.gardens.activeGarden.grid
  );
  const [workingGrid, setWorkingGrid] = React.useState(veggieGrid);

  if (!activeGarden) return <NoGardensPrompt />;
  return (
    <View style={tw.style("bg-white flex flex-1 p-4 pt-8")}>
      <DraxProvider>
        <GardenSelector />

        <View style={tw.style("flex my-2")}>
          <GardenGrid
            style={tw.style("mt-2")}
            workingGridState={[workingGrid, setWorkingGrid]}
          />
        </View>
        <View style={tw.style("flex-1 justify-end")}>
          <SafeAreaView>
            <ScrollView horizontal={true} style={tw.style("mb-2")}>
              <View style={tw.style("flex")}>
                <View style={tw.style("flex flex-row")}>
                  {veggies.map(v => (
                    <VeggieItem
                      key={v.name}
                      draggable={true}
                      veggie={v}
                      style={tw.style("m-2")}
                    />
                  ))}
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </DraxProvider>
    </View>
  );
}
