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

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { SofiaBoldText, SofiaRegularText } from "../../components/StyledText";
import { RootTabScreenProps } from "../../types";
import Veggie, { VeggieState } from "../../models/Veggie";
import { IconText } from "../../components/common/Button";
import { updateActiveUserGarden } from "../../store/actions/garden.actions";
export default function GardenScreen({
  navigation,
  route
}: RootTabScreenProps<"GardenScreen">) {
  const dispatch = useDispatch();

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

  React.useEffect(() => {
    setWorkingGrid(veggieGrid);
    setStateGrid(veggieGrid.map(() => VeggieState.None));
  }, [activeGarden]);

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

    const checkSquare = (
      index: number,
      veggie: Veggie,
      stateGrid: Array<VeggieState>
    ) => {
      if (index < 0 || index >= workingGrid.length)
        stateGrid[index] = VeggieState.None;
      else if (workingGrid[index]) stateGrid[index] = VeggieState.None;
      else if (veggie.exclusions.includes(veggieDragging.name))
        stateGrid[index] = VeggieState.Incompatible;
      else if (veggie.companions.includes(veggieDragging.name))
        stateGrid[index] = VeggieState.Compatible;
      else stateGrid[index] = VeggieState.None;
    };

    for (let i = 0; i < workingGrid.length; i++) {
      const veggie = workingGrid[i];
      if (!veggie) continue;
      const left =
        Math.floor((i - 1) / width) !== Math.floor(i / width) ? -1 : i - 1;
      const right =
        Math.floor((i + 1) / width) !== Math.floor(i / width) ? -1 : i + 1;
      const top = i - width;
      const bottom = i + width;

      const checks = [left, right, top, bottom];
      checks.map(i => checkSquare(i, veggie, stateGridCopy));

      setStateGrid(stateGridCopy);
    }
  }, [veggieDragging]);

  const handleSaveGarden = () => {
    const userGarden = { ...activeGarden };
    userGarden.grid = workingGrid.map(w => w?.name || null);
    dispatch(updateActiveUserGarden(userGarden));
  };

  if (!activeGarden) return <NoGardensPrompt />;
  return (
    <View style={tw.style("bg-white  flex flex-1  pt-8")}>
      <View style={tw.style("flex flex-row justify-between items-center px-2")}>
        <SofiaBoldText style={tw.style("text-gray-500 text-2xl")}>
          {activeGarden.name}
        </SofiaBoldText>

        <IconText
          size={25}
          name="save"
          text="Save"
          color="grey"
          style={tw`mr-2`}
          onPress={handleSaveGarden}
        />
      </View>

      <DraxProvider>
        <View style={tw.style("flex px-4")}>
          <GardenGrid
            draggable={true}
            style={tw.style("mt-2")}
            veggieGrid={workingGrid}
            setVeggieGrid={setWorkingGrid}
            stateGrid={stateGrid}
            onDragStart={() => setIsDraggingGrid(true)}
            onDragEnd={() => setIsDraggingGrid(false)}
          />
          <DropSection
            isDraggingPallet={isDraggingPallet}
            isDraggingGrid={isDraggingGrid}
            onVeggieDeleteSelection={index => {
              const workingGridCopy = [...workingGrid];
              workingGridCopy[index] = null;
              setWorkingGrid(workingGridCopy);
            }}
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
                keyExtractor={d => `--${d.name}`}
                renderItem={({ item, index }) => (
                  <VeggieItem
                    index={index}
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
