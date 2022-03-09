/** @format */

import * as React from "react";
import { StyleSheet, ScrollView, SafeAreaView, FlatList } from "react-native";
import { DraxProvider, DraxView, DraxScrollView } from "react-native-drax";

import { brandColor, Text, tw, View } from "../../components/Themed";
import {
  VeggieItem,
  GardenSelector,
  GardenGrid,
  NoGardensPrompt,
  DropSection,
  GardenPackDropSection,
  GardenPackSearchItem,
  PackSearchItem,
  PackDragItem
} from "../../components/garden/GardenItems";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { SofiaBoldText, SofiaRegularText } from "../../components/StyledText";
import {
  RootStackParamList,
  RootStackScreenProps,
  RootTabScreenProps
} from "../../types";
import Veggie, { VeggieState } from "../../models/Veggie";
import { CircleIconButton, IconText } from "../../components/common/Button";
import {
  updateActiveUserGarden,
  addNewGarden
} from "../../store/actions/garden.actions";
import { setPlantingDates } from "../../models/UserGardens";
import { Spinner } from "../../components/common";
import DropDownPicker, { ValueType } from "react-native-dropdown-picker";
import Hr from "../../components/common/Hr";
import Swiper from "react-native-swiper";
import { GardenPack, getGardenPackById, GridType } from "../../models";
export default function GardenScreen({
  navigation,
  route
}: RootStackScreenProps<"GardenScreen">) {
  const activeGarden = route?.params?.garden;

  const { loading } = useSelector((state: RootState) => state.common);
  const dispatch = useDispatch();
  const { veggies } = useSelector((state: RootState) => state.veggies);
  const { packs } = useSelector((state: RootState) => state.packs);

  const veggieGrid = activeGarden?.grid?.map(veggieName => veggies[veggieName]) || []; //prettier-ignore
  const gridOrder = [GridType.summer, GridType.spring, GridType.autumnWinter];

  const [workingGrid, setWorkingGrid] = React.useState(veggieGrid);

  const getVeggieGrid = (arr: Array<string>) =>
    arr?.map(veggieName => veggies[veggieName]) || [];

  const [workingGridSummer, setWorkingGridSummer] = React.useState(getVeggieGrid(activeGarden?.gridSummer)); //prettier-ignore
  const [workingGridSpring, setWorkingGridSpring] = React.useState(getVeggieGrid(activeGarden?.gridSpring)); //prettier-ignore
  const [workingGridAutumn, setWorkingGridAutumn] = React.useState(getVeggieGrid(activeGarden?.gridAutumnWinter)); //prettier-ignore

  const [currentWorkingGrid, setCurrentWorkingGrid] = React.useState<string>(
    GridType.summer
  );

  const [stateGrid, setStateGrid] = React.useState(
    veggieGrid?.map(() => VeggieState.None)
  );

  const [isDraggingPallet, setIsDraggingPallet] = React.useState(false);
  const [veggieDragging, setVeggieDragging] = React.useState<Veggie>();
  const [isDraggingPack, setIsDraggingPack] = React.useState(false);
  const [previewPack, setPreviewPack] = React.useState<Array<Veggie>>(null);
  const [isDraggingGrid, setIsDraggingGrid] = React.useState(false);
  const [veggieOrPack, setVeggieOrPack] = React.useState("packs" as ValueType);
  const [dropdownItems, setDropdownItems] = React.useState([
    { label: "Veggies", value: "veggies" as ValueType },
    { label: "Garden Packs", value: "packs" as ValueType }
  ]);
  const [open, setOpen] = React.useState(false);

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

    // update the specific grids from the working grids
    userGarden.gridSummer = workingGridSummer?.map(w => w?.name || null);
    userGarden.gridAutumnWinter = workingGridAutumn?.map(w => w?.name || null);
    userGarden.gridSpring = workingGridSpring?.map(w => w?.name || null);

    // update the gardenPlantingDates from the grid;
    setPlantingDates(userGarden);

    dispatch(updateActiveUserGarden(userGarden));
    navigation.navigate("Root");
  };

  const handleSetPack = (pack: GardenPack) => {
    // get the garden park
    const gardenPack = pack.grid[activeGarden?.garden?.id];
    if (!gardenPack) return;

    // from the packs update the working grids
    setWorkingGridAutumn(getVeggieGrid(gardenPack.gridAutumnWinter));
    setWorkingGridSpring(getVeggieGrid(gardenPack.gridSpring));
    setWorkingGridSummer(getVeggieGrid(gardenPack.gridSummer));
  };

  const getGardenGrid = () => {
    if (isDraggingPack) {
      // get the preview from the pack
      // const pack = getGardenPackById(packs, previewPack)

      return (
        <GardenGrid
          draggable={true}
          style={tw.style("mt-2")}
          veggieGrid={previewPack}
          stateGrid={stateGrid}
          onDragStart={() => setIsDraggingGrid(true)}
          onDragEnd={() => setIsDraggingGrid(false)}
          garden={activeGarden?.garden}
          handleSetPack={handleSetPack}
        />
      );
    }
    let veggieGrid = new Array<Veggie>();
    let setVeggieGrid: React.Dispatch<React.SetStateAction<Veggie[]>>;

    if (currentWorkingGrid === GridType.autumnWinter) {
      veggieGrid = workingGridAutumn;
      setVeggieGrid = setWorkingGridAutumn;
    }

    if (currentWorkingGrid === GridType.spring) {
      veggieGrid = workingGridSpring;
      setVeggieGrid = setWorkingGridSpring;
    }

    if (currentWorkingGrid === GridType.summer) {
      veggieGrid = workingGridSummer;
      setVeggieGrid = setWorkingGridSummer;
    }

    return (
      <GardenGrid
        draggable={true}
        style={tw.style("mt-2")}
        veggieGrid={veggieGrid}
        setVeggieGrid={setVeggieGrid}
        stateGrid={stateGrid}
        onDragStart={() => setIsDraggingGrid(true)}
        onDragEnd={() => setIsDraggingGrid(false)}
        garden={activeGarden?.garden}
        handleSetPack={handleSetPack}
      />
    );
  };

  return (
    <View style={tw.style("bg-white  flex flex-1  pt-8")}>
      <View style={tw.style("")}>
        <View
          style={tw.style("flex flex-row justify-between items-center px-2")}>
          <SofiaBoldText style={tw.style("text-gray-500 text-2xl")}>
            {activeGarden.name}
          </SofiaBoldText>

          <View style={tw.style("flex flex-row")}>
            <IconText
              size={25}
              name="save"
              text="Save"
              color="grey"
              style={tw`mr-2`}
              onPress={handleSaveGarden}
            />
            <IconText
              size={25}
              name="times-circle"
              text="Close"
              color="grey"
              style={tw`mr-2`}
              onPress={() => navigation.pop()}
            />
          </View>
        </View>
      </View>
      <DraxProvider>
        <View
          style={tw.style(
            "flex px-4 w-full items-center h-3/5 items-center justify-center"
          )}>
          {getGardenGrid()}

          <DropSection
            isDraggingPallet={isDraggingPallet}
            isDraggingGrid={isDraggingGrid}
            isDraggingPack={isDraggingPack}
            currentWorkingGrid={currentWorkingGrid}
            setCurrentWorkingGrid={setCurrentWorkingGrid}
            gridOrder={gridOrder}
            onVeggieDeleteSelection={index => {
              const workingGridCopy = [...workingGrid];
              workingGridCopy[index] = null;
              setWorkingGrid(workingGridCopy);
            }}
            onVeggieInfoSelection={veggie =>
              navigation.push("Veggie", { veggie })
            }
            onPackInfoSelection={pack => navigation.push("Pack", { pack })}
          />
        </View>
        <SafeAreaView
          style={tw.style(
            "flex-1 pt-2 mt-1 border border-gray-200 bg-gray-50 h-1/4"
          )}>
          {veggieOrPack == "veggies" ? (
            <>
              {Object.values(veggies).length !== 0 && (
                <DraxScrollView horizontal={true} style={tw.style("h-full ")}>
                  <FlatList
                    data={Object.values(veggies)}
                    style={tw.style("flex mb-auto")}
                    horizontal={true}
                    // numColumns={Math.floor(Object.values(veggies).length / 2) + 1}
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
                        size={100}
                        style={tw.style("m-1")}
                      />
                    )}
                  />
                </DraxScrollView>
              )}
            </>
          ) : (
            <>
              {Object.values(packs).length !== 0 && (
                <DraxScrollView horizontal={true} style={tw.style("h-full ")}>
                  <FlatList
                    data={Object.values(packs)}
                    style={tw.style("flex mb-auto")}
                    keyExtractor={d => `--${d.name}`}
                    horizontal={true}
                    renderItem={({ item, index }) => (
                      <PackDragItem
                        key={index}
                        gardenPack={item}
                        style={tw.style("my-1 mx-2")}
                        onDragStart={() => {
                          setStateGrid(stateGrid.map(x => VeggieState.Pending));
                          setPreviewPack(
                            getVeggieGrid(
                              getGardenPackById(
                                packs,
                                item.name,
                                activeGarden?.garden?.id,
                                currentWorkingGrid
                              )
                            )
                          );
                          setIsDraggingPack(true);
                        }}
                        onDragEnd={() => {
                          setStateGrid(stateGrid.map(x => VeggieState.None));
                          setIsDraggingPack(false);
                          setPreviewPack(undefined);
                        }}
                      />
                    )}
                  />
                </DraxScrollView>
              )}
            </>
          )}
        </SafeAreaView>
      </DraxProvider>
      <View style={tw.style("m-2")}>
        <DropDownPicker
          value={veggieOrPack}
          setValue={setVeggieOrPack}
          items={dropdownItems}
          setItems={setDropdownItems}
          open={open}
          setOpen={setOpen}
          listMode="MODAL"
        />
      </View>
    </View>
  );
}
