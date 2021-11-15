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
import Veggie, { VeggieState } from "../../models/Veggie";

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
  const [stateGrid, setStateGrid] = React.useState(
    veggieGrid.map(() => VeggieState.None)
  );
  const [isDraggingPallet, setIsDraggingPallet] = React.useState(false);
  const [isDraggingGrid, setIsDraggingGrid] = React.useState(false);
  const [veggieDragging, setVeggieDragging] = React.useState<Veggie>();
  React.useEffect(() => {
    let stateGridCopy = [...stateGrid];
    if (!veggieDragging) {
      stateGridCopy = stateGridCopy.map(() => VeggieState.None);
      setStateGrid(stateGridCopy);
      return;
    }
    const { width, height } = activeGarden.garden;

    const checkSquare = (index: number): VeggieState => {
      if (index < 0 || index >= workingGrid.length) return VeggieState.None;

      // check the veggie at the spot for exclusions
      if (workingGrid[index]?.exclusions.includes(veggieDragging.name))
        return VeggieState.Incompatible;
      if (workingGrid[index]?.companions.includes(veggieDragging.name))
        return VeggieState.Compatible;
      else return VeggieState.None;
    };

    for (let i = 0; i < workingGrid.length; i++) {
      if (workingGrid[i]) stateGridCopy[i] = VeggieState.None;
      else {
        const left = i - 1;
        const right = i + 1;
        const top = i - width;
        const bottom = i + width;
        const topLeft = i - (width + 1);
        const topRight = i - (width - 1);
        const bottomLeft = i + (width + 1);
        const bottomRight = i + (width - 1);

        const checks = [
          left,
          right,
          top,
          bottom,
          topLeft,
          topRight,
          bottomLeft,
          bottomRight
        ];
        const stateArray = checks.map(i => checkSquare(i));
        if (stateArray.includes(VeggieState.Incompatible))
          stateGridCopy[i] = VeggieState.Incompatible;
        else if (stateArray.includes(VeggieState.Compatible))
          stateGridCopy[i] = VeggieState.Compatible;
        else stateGridCopy[i] = VeggieState.None;
      }

      setStateGrid(stateGridCopy);
    }
  }, [veggieDragging]);

  if (!activeGarden) return <NoGardensPrompt />;
  return (
    <View style={tw.style("bg-white  flex flex-1  pt-8")}>
      <DraxProvider>
        <View style={tw.style("flex px-4")}>
          <GardenGrid
            style={tw.style("mt-2")}
            workingGridState={[workingGrid, setWorkingGrid]}
            stateGrid={stateGrid}
            onDragStart={() => setIsDraggingGrid(true)}
            onDragEnd={() => setIsDraggingGrid(false)}
          />
          <DropSection
            isDraggingPallet={isDraggingPallet}
            isDraggingGrid={isDraggingGrid}
            onVeggieDeleteSelection={veggie => console.log(veggie)}
            onVeggieInfoSelection={veggie =>
              navigation.push("Veggie", { veggie })
            }
          />
        </View>
        <SafeAreaView
          style={tw.style("flex-1 pt-2 mt-1 border border-gray-200")}>
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
                    onDragStart={() => {
                      setIsDraggingPallet(true);
                      setVeggieDragging(item);
                    }}
                    onDragEnd={() => {
                      setIsDraggingPallet(false);
                      setVeggieDragging(undefined);
                    }}
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
