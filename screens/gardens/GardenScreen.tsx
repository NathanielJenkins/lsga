/** @format */

import * as React from "react";
import { StyleSheet, ScrollView, SafeAreaView, FlatList } from "react-native";
import { DraxProvider, DraxView, DraxScrollView } from "react-native-drax";

import { Text, tw, View } from "../../components/Themed";
import {
  VeggieItem,
  GardenSelector,
  GardenGrid,
  NoGardensPrompt,
  DropSection
} from "../../components/garden/GardenItems";

import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { SofiaBoldText } from "../../components/StyledText";
import { RootTabScreenProps } from "../../types";
export default function GardenScreen({
  navigation,
  route
}: RootTabScreenProps<"GardenScreen">) {
  const { veggies } = useSelector((state: RootState) => state.veggies);

  const { activeGarden } = useSelector((state: RootState) => state.gardens);
  const veggieGrid =
    useSelector((state: RootState) =>
      state.gardens?.activeGarden?.grid?.map(veggieName => veggies[veggieName])
    ) || [];
  const [workingGrid, setWorkingGrid] = React.useState(veggieGrid);
  const [isDraggingPallet, setIsDraggingPallet] = React.useState(false);
  const [isDraggingGrid, setIsDraggingGrid] = React.useState(false);

  if (!activeGarden) return <NoGardensPrompt />;
  return (
    <View style={tw.style("bg-white  flex flex-1 p-4 pt-8")}>
      <DraxProvider>
        <GardenSelector />

        <View style={tw.style("flex ")}>
          <GardenGrid
            style={tw.style("mt-2")}
            workingGridState={[workingGrid, setWorkingGrid]}
            onDragStart={() => setIsDraggingGrid(true)}
            onDragEnd={() => setIsDraggingGrid(false)}
          />
        </View>
        <DropSection
          isDraggingPallet={isDraggingPallet}
          isDraggingGrid={isDraggingGrid}
          onVeggieDeleteSelection={veggie => console.log(veggie)}
          onVeggieInfoSelection={veggie =>
            navigation.push("Veggie", { veggie })
          }
        />
        <SafeAreaView style={tw.style("flex-1 mt-2")}>
          <DraxScrollView horizontal={true} style={tw.style("h-full ")}>
            {Object.values(veggies).length !== 0 && (
              <FlatList
                data={Object.values(veggies)}
                style={tw.style("flex mb-auto")}
                numColumns={Math.floor(Object.values(veggies).length / 2) + 1}
                renderItem={({ item }) => (
                  <VeggieItem
                    key={item.name}
                    draggable={true}
                    veggie={item}
                    onDragStart={() => setIsDraggingPallet(true)}
                    onDragEnd={() => setIsDraggingPallet(false)}
                    style={tw.style("m-1")}
                  />
                )}
              />
            )}
          </DraxScrollView>
        </SafeAreaView>
      </DraxProvider>
    </View>
  );
}
