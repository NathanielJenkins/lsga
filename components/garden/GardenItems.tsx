/** @format */

import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  PanResponder,
  StyleProp,
  StyleSheet,
  Text,
  View,
  Alert,
  Modal
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { storage } from "../../firebase/firebaseTooling";
import Veggie, { VeggieState } from "../../models/Veggie";
import {
  RootState,
  updateFrostDatesByLngLat,
  updateFrostDatesFromDate,
  updateActiveUserGarden
} from "../../store";
import { brandColor, tw } from "../Themed";
import { Picker } from "@react-native-picker/picker";
import { updateActiveGarden } from "../../store/actions/garden.actions";
import {
  SofiaBoldText,
  SofiaSemiBoldText,
  SofiaSemiMediumText
} from "../StyledText";
import {
  DraxDragEndEventData,
  DraxDragEventData,
  DraxProtocolDragEndResponse,
  DraxProvider,
  DraxView
} from "react-native-drax";
import { MainPageSlot } from "../../screens/slots/MainPageSlot";
import { SofiaRegularText } from "../../components/StyledText";
import no_gardens from "../../assets/images/no_gardens.png";
import {
  IconText,
  PrimaryButton,
  SecondaryButton,
  CircleIconButton
} from "../common/Button";
import { useNavigation } from "@react-navigation/native";
import { chunk } from "lodash";
import { FontAwesome } from "@expo/vector-icons";
import Ripple from "react-native-material-ripple";
import { Info } from "../common/Display";
import * as Location from "expo-location";
import DateTimePicker from "@react-native-community/datetimepicker";
import UserGarden, { setGardenProfile } from "../../models/UserGardens";
import { deleteGarden } from "../../store";
import { CameraCapturedPicture } from "expo-camera";
import { Input } from "../common";
import { GeneralSlot } from "../../screens";
import DropDownPicker, { ValueType } from "react-native-dropdown-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { GardenPack, GridType } from "../../models";
import Hr from "../common/Hr";
import Garden from "../../models/Garden";
import Swiper from "react-native-swiper";
import CachedImage from "react-native-expo-cached-image";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getClosestFrostDate } from "../../models/FrostDate";

interface GridSwapperProps {
  style?: StyleProp<any>;
  selectedGrid: GridType;
  setActiveGridType: React.Dispatch<React.SetStateAction<GridType>>;
}

export function GridSwapper(props: GridSwapperProps) {
  interface IconSelectionProps {
    icon: any;
    isSelected?: boolean;
    title: string;
    setActiveGridType: React.Dispatch<React.SetStateAction<GridType>>;
    selectedGrid: GridType;
  }

  const IconSelection = (props: IconSelectionProps) => {
    return (
      <TouchableOpacity
        onPress={() => props.setActiveGridType(props.selectedGrid)}
        style={tw.style(
          "shadow-brand m-2 w-16 h-16 items-center justify-center flex ",
          {
            "border-brand border-2": props.isSelected
          }
        )}>
        <FontAwesome
          name={props.icon}
          size={20}
          style={tw.style({ "text-brand": props.isSelected })}
        />
        <SofiaRegularText
          style={tw.style("mt-1", { "text-brand": props.isSelected })}>
          {props.title}
        </SofiaRegularText>
      </TouchableOpacity>
    );
  };

  return (
    <View style={tw.style(props.style, "flex  flex-row")}>
      <IconSelection
        icon="cloud"
        title="Spring"
        isSelected={props.selectedGrid === GridType.spring}
        setActiveGridType={props.setActiveGridType}
        selectedGrid={GridType.spring}
      />
      <IconSelection
        icon="sun-o"
        title="Summer"
        isSelected={props.selectedGrid === GridType.summer}
        setActiveGridType={props.setActiveGridType}
        selectedGrid={GridType.summer}
      />

      <IconSelection
        icon="snowflake-o"
        title="Autumn"
        isSelected={props.selectedGrid === GridType.autumnWinter}
        setActiveGridType={props.setActiveGridType}
        selectedGrid={GridType.autumnWinter}
      />
    </View>
  );
}

export function NoGardensPrompt() {
  const navigation = useNavigation();
  return (
    <MainPageSlot>
      <View style={tw.style("bg-transparent justify-center items-center")}>
        <View style={tw`flex justify-center items-center`}>
          <CachedImage
            source={no_gardens}
            style={tw.style(`w-64 h-64`, { resizeMode: "contain" })}
          />
        </View>
        <SofiaRegularText style={tw.style(`text-xl mb-2`)}>
          No Gardens... yet
        </SofiaRegularText>
        <SecondaryButton
          title="Add a New Garden"
          onPress={() => navigation.navigate("SetupGarden")}
        />
      </View>
    </MainPageSlot>
  );
}

interface GardenVeggieInfoReceiverProps {}

interface GardenVeggieReceiverProps {
  width: number;
  i: number;
  workingGridState: [
    Array<Veggie>,
    React.Dispatch<React.SetStateAction<Array<Veggie>>>
  ];
  onDragStart?: (data: DraxDragEventData) => void;
  onDragEnd?: (data: DraxDragEndEventData) => DraxProtocolDragEndResponse;
  veggieState: VeggieState;
  handleSetPack: (pack: GardenPack) => void;
}
export function GardenVeggieReceiver(props: GardenVeggieReceiverProps) {
  const { width, i, veggieState } = props;
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [squareSize, setSquareSize] = useState<number>(0);
  const [workingGrid, setWorkingGrid] = props.workingGridState;
  const maxSize = 250;

  const handleAlter = (pack: GardenPack) => {
    const alertMsg: [string, string, any] = [
      `Confirm Pack Selection"`,
      `This will reset all of your selections with the predefined pack`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => props.handleSetPack(pack)
        }
      ]
    ];
    Alert.alert(...alertMsg);
  };

  return (
    <DraxView
      style={tw.style("flex-1 border-gray-300 bg-transparent border-r", {
        height: squareSize,
        "border-r-0 ": (i + 1) % width === 0,
        "bg-green-100": veggieState === VeggieState.Compatible,
        "bg-red-100": veggieState === VeggieState.Incompatible,
        "bg-gray-100": isDraggingOver
      })}
      key={Math.random() + i}
      onReceiveDragEnter={() => setIsDraggingOver(true)}
      onReceiveDragExit={e => setIsDraggingOver(false)}
      onReceiveDragDrop={({
        dragged: {
          payload: { veggie, pack }
        }
      }) => {
        setIsDraggingOver(false);
        if (pack) {
          handleAlter(pack);
        } else {
          const workingGridCopy = [...workingGrid];
          workingGridCopy[i] = veggie;
          setWorkingGrid(workingGridCopy);
        }
      }}>
      <View
        style={tw.style("flex justify-center items-center mt-1")}
        onLayout={event => {
          if (squareSize) return;

          let w = event.nativeEvent.layout.width;
          w = w > maxSize ? maxSize : w;
          setSquareSize(event.nativeEvent.layout.width);
        }}>
        {workingGrid[i] && (
          <VeggieItem
            index={i}
            draggable={true}
            veggie={workingGrid[i]}
            noShadow
            size={100}
            onDragStart={props.onDragStart}
            onDragEnd={props.onDragEnd}
          />
        )}
      </View>
    </DraxView>
  );
}

interface GardenGridProps {
  style?: StyleProp<any>;
  veggieGrid: Array<Veggie>;
  setVeggieGrid?: React.Dispatch<React.SetStateAction<Array<Veggie>>>;
  onDragStart?: (data: DraxDragEventData) => void;
  onDragEnd?: (data: DraxDragEndEventData) => DraxProtocolDragEndResponse;
  stateGrid?: Array<VeggieState>;
  draggable?: boolean;
  isPackSelection?: boolean;
  garden: Garden;
  handleSetPack?: (pack: GardenPack) => void;
}
export function GardenGrid(props: GardenGridProps) {
  const { garden } = props;
  const { veggies } = useSelector((state: RootState) => state.veggies);
  const height = garden.height || 0;
  const width = garden.width || 0;
  const draggable = props.draggable !== undefined ? props.draggable : false;
  const widthGrid: Array<JSX.Element> = [];
  for (let i = 0; i < width * height; i++) {
    widthGrid.push(
      draggable ? (
        <GardenVeggieReceiver
          width={width}
          i={i}
          key={i}
          workingGridState={[props.veggieGrid, props.setVeggieGrid]}
          veggieState={props.stateGrid[i]}
          onDragStart={props.onDragStart}
          onDragEnd={props.onDragEnd}
          handleSetPack={props.handleSetPack}
        />
      ) : (
        <View
          key={i}
          style={tw.style("border-r border-gray-300", {
            "border-r-0 ": (i + 1) % width === 0
          })}>
          <VeggieItem
            index={i}
            draggable={false}
            veggie={props.veggieGrid[i]}
            noShadow={true}
            size={80}
          />
        </View>
      )
    );
  }

  const gridChunk = chunk(widthGrid, width);
  const grid = gridChunk.map((g, i) => (
    <View
      key={i}
      style={tw.style("flex-row border-gray-300 border-b", {
        "border-b-0 ": (i + 1) % height === 0
      })}>
      {g}
    </View>
  ));

  return (
    <View style={tw.style("flex items-center justify-center relative")}>
      <View
        style={tw.style(
          "shadow-brand flex items-center justify-center",
          props.style,
          {
            maxWidth: 250
          }
        )}>
        {grid}
      </View>
    </View>
  );
}

interface VeggieItemProps {
  veggie: Veggie;
  draggable?: boolean;
  noShadow?: boolean;
  style?: StyleProp<any>;
  size?: number;
  index?: number;
  onDragStart?: (data: DraxDragEventData) => void;
  onDragEnd?: (data: DraxDragEndEventData) => DraxProtocolDragEndResponse;
}
export function VeggieItem(props: VeggieItemProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  let size = props.size || 90;

  const VeggieBase = (
    <View
      style={tw.style(
        "flex justify-between py-2 items-center rounded",
        props.style,
        { "shadow-brand": !props?.noShadow },
        { height: size - 5, width: size - 5 }
      )}>
      {props.veggie && (
        <View style={tw.style("flex justify-between items-center")}>
          <CachedImage
            source={{ uri: props.veggie?.downloadUrl }}
            style={tw.style(`resize-contain`, {
              height: size - 45,
              width: size - 45
            })}
          />
          <SofiaSemiMediumText style={tw.style("text-center text-xs")}>
            {props.veggie?.displayName}
          </SofiaSemiMediumText>
        </View>
      )}
    </View>
  );
  return (
    <React.Fragment>
      {props.draggable ? (
        <DraxView
          animateSnapback={false}
          snapbackDelay={0}
          onDragStart={e => {
            props.onDragStart && props.onDragStart(e);
            setIsDragging(true);
          }}
          onDragEnd={e => {
            props.onDragEnd && props.onDragEnd(e);
            setIsDragging(false);
          }}
          onDragDrop={e => props.onDragEnd && props.onDragEnd(undefined)}
          payload={{
            veggie: props.veggie,
            index: props.index
          }}>
          {VeggieBase}
        </DraxView>
      ) : (
        <View>{VeggieBase}</View>
      )}
    </React.Fragment>
  );
}

interface GardenSelectorProps {
  style?: StyleProp<any>;
}
export function GardenSelector(props: GardenSelectorProps) {
  const { gardens, activeGarden } = useSelector(
    (state: RootState) => state.gardens
  );
  const dispatch = useDispatch();

  const handleUpdateActiveGarden = (gardenName: string) => {
    const garden = gardens.find(g => g?.id === gardenName);
    dispatch(updateActiveGarden(garden));
  };

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(activeGarden.id as ValueType);
  const [items, setItems] = useState(
    gardens.map(g => {
      return { label: g.name, value: g.id };
    })
  );

  useEffect(() => {
    setItems(
      gardens.map(g => {
        return { label: g.name, value: g.id };
      })
    );
  }, [gardens]);

  return (
    <View style={tw.style(props.style)}>
      {gardens.length === 1 ? (
        <View>
          <SofiaSemiBoldText style={tw.style("text-2xl text-gray-500")}>
            {activeGarden?.name}
          </SofiaSemiBoldText>
        </View>
      ) : (
        <View style={tw.style("flex flex-col ")}>
          <SofiaSemiBoldText style={tw.style("text-2xl text-gray-500")}>
            My Gardens
          </SofiaSemiBoldText>
          <View style={tw.style("flex z-10 mt-2")}>
            <DropDownPicker
              listMode="MODAL"
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              onChangeValue={(v: ValueType) =>
                handleUpdateActiveGarden(v as string)
              }
            />
          </View>
        </View>
      )}
    </View>
  );
}

interface DropSectionProps {
  isDraggingPallet: boolean;
  isDraggingGrid: boolean;
  isDraggingPack: boolean;
  currentWorkingGrid: GridType;
  gridOrder: Array<GridType>;
  setCurrentWorkingGrid: React.Dispatch<React.SetStateAction<string>>;
  onVeggieInfoSelection: (veggie: Veggie) => void;
  onPackInfoSelection: (pack: GardenPack) => void;
  onVeggieDeleteSelection: (index: number) => void;
}
export function DropSection(props: DropSectionProps) {
  const { isDraggingGrid, isDraggingPallet, isDraggingPack } = props;
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const getDisplayTest = () => {
    if (props.currentWorkingGrid === GridType.autumnWinter)
      return "Autumn and Winter";
    if (props.currentWorkingGrid === GridType.spring) return "Spring";
    if (props.currentWorkingGrid === GridType.summer) return "Summer";
    return "";
  };
  const handleClick = (index: number) => {
    // get the current value at the index
    const currentIndex = props.gridOrder.findIndex(
      x => x === props.currentWorkingGrid
    );
    let newIndex = currentIndex + index;
    if (newIndex > props.gridOrder.length - 1) newIndex = 0;
    if (newIndex < 0) newIndex = props.gridOrder.length - 1;

    props.setCurrentWorkingGrid(props.gridOrder[newIndex] as any);
  };

  return (
    <View style={tw.style("mt-2 flex w-full justify-center  h-10")}>
      {isDraggingGrid ? (
        <DraxView
          onReceiveDragDrop={({
            dragged: {
              payload: { veggie, index }
            }
          }) => {
            props.onVeggieDeleteSelection(index);
            setIsDraggingOver(false);
          }}
          onReceiveDragEnter={() => setIsDraggingOver(true)}
          onReceiveDragExit={() => setIsDraggingOver(false)}
          style={tw.style("bg-red-100 border-red-200 border p-2 rounded-md", {
            "bg-red-500 text-white": isDraggingOver
          })}>
          <SofiaBoldText
            style={tw.style("text-center text-red-400", {
              "text-white": isDraggingOver
            })}>
            <FontAwesome name="trash" size={20} /> Delete
          </SofiaBoldText>
        </DraxView>
      ) : isDraggingPallet ? (
        <DraxView
          onReceiveDragDrop={({
            dragged: {
              payload: { veggie }
            }
          }) => {
            props.onVeggieInfoSelection(veggie);
            setIsDraggingOver(false);
          }}
          onReceiveDragEnter={() => setIsDraggingOver(true)}
          onReceiveDragExit={() => setIsDraggingOver(false)}
          style={tw.style("bg-blue-100 border-blue-200 border p-2 rounded-md", {
            "bg-blue-500 text-white": isDraggingOver
          })}>
          <SofiaBoldText
            style={tw.style("text-center text-blue-400", {
              "text-white": isDraggingOver
            })}>
            <FontAwesome name="leaf" size={20} /> Veggie Info
          </SofiaBoldText>
        </DraxView>
      ) : isDraggingPack ? (
        <DraxView
          onReceiveDragDrop={({
            dragged: {
              payload: { pack }
            }
          }) => {
            props.onPackInfoSelection(pack);
            setIsDraggingOver(false);
          }}
          onReceiveDragEnter={() => setIsDraggingOver(true)}
          onReceiveDragExit={() => setIsDraggingOver(false)}
          style={tw.style(
            "bg-green-100 border-green-200 border p-2 rounded-md",
            {
              "bg-green-500 text-white": isDraggingOver
            }
          )}>
          <SofiaBoldText
            style={tw.style("text-center text-green-400", {
              "text-white": isDraggingOver
            })}>
            <FontAwesome name="leaf" size={20} /> Pack Info
          </SofiaBoldText>
        </DraxView>
      ) : (
        <View style={tw.style("flex flex-row justify-between items-center")}>
          <IconText
            size={25}
            name="chevron-left"
            color="grey"
            style={tw`mr-2`}
            onPress={() => handleClick(-1)}
          />
          <SofiaBoldText style={tw.style("text-lg text-gray-500")}>
            {getDisplayTest()}
          </SofiaBoldText>

          <IconText
            size={25}
            name="chevron-right"
            color="grey"
            style={tw`mr-2`}
            onPress={() => handleClick(1)}
          />
        </View>
      )}
    </View>
  );
}

interface PackDropSectionProps {
  isDraggingPallet: boolean;
  isDraggingGrid: boolean;
  onVeggieInfoSelection: (veggie: Veggie) => void;
  onVeggieDeleteSelection: (index: number) => void;
}
export function GardenPackDropSection(props: PackDropSectionProps) {
  return <View style={tw.style("border border-transparent py-2")}></View>;
}

interface VeggieSearchItemProps {
  veggie: Veggie;
  style?: StyleProp<any>;
}
export function VeggieSearchItem(props: VeggieSearchItemProps) {
  const navigation = useNavigation();

  return (
    <Ripple
      onPress={() => navigation.navigate("Veggie", { veggie: props.veggie })}
      style={tw.style(
        "flex flex-row items-center shadow-brand p-2",
        props.style
      )}>
      <CachedImage
        source={{ uri: props.veggie?.downloadUrl }}
        style={tw.style(`resize-contain h-14 w-14 mr-4`)}
      />
      <SofiaBoldText style={tw.style("text-2xl text-gray-500 text-center")}>
        {props.veggie?.displayName}
      </SofiaBoldText>
    </Ripple>
  );
}

interface PackDragItemProps {
  gardenPack: GardenPack;
  style?: StyleProp<any>;
  onDragStart?: (data: DraxDragEventData) => void;
  onDragEnd?: (data: DraxDragEndEventData) => DraxProtocolDragEndResponse;
}

export function PackDragItem(props: PackDragItemProps) {
  return (
    <DraxView
      animateSnapback={false}
      snapbackDelay={0}
      onDragStart={props.onDragStart}
      onDragEnd={props.onDragEnd}
      onDragDrop={e => props.onDragEnd && props.onDragEnd(undefined)}
      payload={{
        pack: props.gardenPack
      }}
      style={tw.style("shadow-brand m-2 p-2 flex flex-col items-center w-32")}>
      <CachedImage
        source={{ uri: props.gardenPack?.downloadUrl }}
        style={tw.style(`h-32 w-full rounded`)}
      />
      <SofiaRegularText style={tw.style(" text-center mt-2 ")}>
        {props.gardenPack?.displayName}
      </SofiaRegularText>
    </DraxView>
  );
}

interface PackSearchItemProps {
  gardenPack: GardenPack;
  style?: StyleProp<any>;
}
export function PackSearchItem(props: PackSearchItemProps) {
  const navigation = useNavigation();
  const { veggies } = useSelector((state: RootState) => state.veggies);

  const allVeggies = [
    ...new Set([
      ...(props.gardenPack?.spring || []),
      ...(props.gardenPack?.autumnWinter || []),
      ...(props.gardenPack?.summer || [])
    ])
  ];

  return (
    <Ripple
      onPress={() => navigation.navigate("Pack", { pack: props.gardenPack })}
      style={tw.style(
        "flex items-center justify-center shadow-brand p-4",
        props.style
      )}>
      <CachedImage
        source={{ uri: props.gardenPack?.downloadUrl }}
        style={tw.style(` h-64 w-full rounded`)}
      />
      <SofiaBoldText
        style={tw.style("mt-4 text-2xl text-gray-500 text-center")}>
        {props.gardenPack?.displayName}
      </SofiaBoldText>

      <Hr />

      <SofiaRegularText style={tw.style("text-center text-gray-500")}>
        {allVeggies.map(
          vn => (veggies[vn] && veggies[vn].displayName + ", ") || vn + ", "
        )}
      </SofiaRegularText>
    </Ripple>
  );
}

interface GardenPackSearchItemProps {
  gardenPack: GardenPack;
  style?: StyleProp<any>;
}
export function GardenPackSearchItem(props: GardenPackSearchItemProps) {
  const navigation = useNavigation();

  return (
    <Ripple
      style={tw.style(
        "flex flex-row items-center shadow-brand p-2",
        props.style
      )}>
      <CachedImage
        source={{ uri: props.gardenPack?.downloadUrl }}
        style={tw.style(`resize-contain h-14 w-14 mr-4`)}
      />
      <SofiaBoldText style={tw.style("text-2xl text-gray-500 text-center")}>
        {props.gardenPack?.displayName}
      </SofiaBoldText>
    </Ripple>
  );
}

interface TextPillProps {
  text: string;
  style?: StyleProp<any>;
}
export function TextPill(props: TextPillProps) {
  return (
    <View
      style={tw.style(
        props.style,
        "border border-gray-500 p-2 rounded-md flex items-center justify-center"
      )}>
      <SofiaRegularText style={tw.style("text-gray-500")}>
        {props.text}
      </SofiaRegularText>
    </View>
  );
}

export interface ListGardenProps {
  setActiveModalGarden: React.Dispatch<React.SetStateAction<UserGarden>>;
}
export function ListGardens(props: ListGardenProps) {
  const { setActiveModalGarden } = props;
  const { gardens } = useSelector((state: RootState) => state.gardens);
  const dispatch = useDispatch();

  const handleDelete = (garden: UserGarden) => {
    const alertMsg: [string, string, any] = [
      `Confirm Delete "${garden.name}"`,
      `Are you sure you want to delete "${garden.name}", this will delete all data associated with this garden.`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => dispatch(deleteGarden(garden))
        }
      ]
    ];
    Alert.alert(...alertMsg);
  };

  return (
    <Info title="My Gardens">
      {gardens?.length !== 0 ? (
        gardens.map(g => (
          <View
            key={g.id}
            style={tw.style(
              "flex flex-1 flex-row items-center justify-between"
            )}>
            <SofiaRegularText>{g.name}</SofiaRegularText>
            <View style={tw.style("flex flex-row")}>
              <IconText
                name="info"
                color="grey"
                size={20}
                onPress={() => setActiveModalGarden(g)}
                style={tw.style("mr-2")}
              />
              <IconText
                name="trash"
                color="grey"
                size={20}
                onPress={() => handleDelete(g)}
              />
            </View>
          </View>
        ))
      ) : (
        <SofiaRegularText>No Gardens</SofiaRegularText>
      )}
    </Info>
  );
}

export interface GardenModalProps {
  garden: UserGarden;
  setActiveModalGarden: React.Dispatch<React.SetStateAction<UserGarden>>;
}
export const GardenModal = (props: GardenModalProps) => {
  const { setActiveModalGarden, garden } = props;
  const [title, setTitle] = useState(garden.name);
  const [description, setDescription] = useState(garden.description);
  const gardenCopy = { ...garden };

  const dispatch = useDispatch();
  const handleUpdateGarden = () => {
    gardenCopy.name = title;
    gardenCopy.description = description;

    dispatch(updateActiveUserGarden(gardenCopy, false));
    setActiveModalGarden(undefined);
  };

  const navigation = useNavigation();

  return (
    <View>
      <View
        style={tw.style(
          "flex flex-row w-full items-center justify-end pb-2 border-b border-gray-300"
        )}>
        <CircleIconButton
          name={"times"}
          size={"sm"}
          color={"black"}
          onPress={() => setActiveModalGarden(undefined)}
        />
      </View>
      <KeyboardAwareScrollView extraHeight={20} style={tw.style("bg-white")}>
        <GeneralSlot>
          <SofiaBoldText style={tw.style("text-2xl text-gray-500 mb-4")}>
            Edit Garden
          </SofiaBoldText>

          <View style={tw.style(" flex ")}>
            <CachedImage
              source={{ uri: garden.uri }}
              style={tw.style(`rounded-lg h-96 w-full mb-2`)}
            />

            <View style={tw.style("flex flex-row mb-2")}>
              <View style={tw.style("flex-1 mr-1")}>
                <SecondaryButton
                  title="Photos"
                  onPress={() => {
                    navigation.navigate("CameraPreview", {
                      photoCallback: (photo: CameraCapturedPicture) => {
                        setGardenProfile(gardenCopy);
                        handleUpdateGarden();
                      }
                    });
                  }}
                />
              </View>

              <View style={tw.style("flex-1")}>
                <SecondaryButton title="Camera" onPress={() => {}} />
              </View>
            </View>
            <Input
              style={tw`mb-2`}
              value={title}
              handleOnChangeText={setTitle}
              placeholder="Name"
            />
            <Input
              style={tw`mb-2`}
              value={description}
              handleOnChangeText={setDescription}
              placeholder="Description"
              numberOfLines={5}
            />
            <View style={tw.style("flex flex-row")}>
              <View style={tw.style("flex-1")}>
                <PrimaryButton
                  title="Save"
                  onPress={() => handleUpdateGarden()}
                />
              </View>
            </View>
          </View>
          <SofiaBoldText
            onPress={() => setActiveModalGarden(undefined)}
            style={tw.style("text-center underline text-brand mt-5")}>
            Exit Without Saving
          </SofiaBoldText>
        </GeneralSlot>
      </KeyboardAwareScrollView>
    </View>
  );
};

export function AddFrostDateComponent() {
  const { springFrostDate, fallFrostDate } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    if (springFrostDate && fallFrostDate) setIsLoading(false);
  }, [springFrostDate, fallFrostDate]);

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [settingDateType, setSettingDateType] = useState<"spring" | "fall">();

  const handleAskForLocation = async () => {
    setIsLoading(true);

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        const { coords } = await Location.getCurrentPositionAsync({});
        dispatch(updateFrostDatesByLngLat(coords.longitude, coords.latitude));
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleSetDate = (event: Event, date: Date) => {
    setOpen(false);

    if (event.type === "dismissed") return;
    dispatch(updateFrostDatesFromDate(date, settingDateType));
  };

  return (
    <React.Fragment>
      <Info title={"Frost Date"}>
        {isLoading ? (
          <View style={tw.style("flex flex-1 justify-center mb-2 ")}>
            <ActivityIndicator color="#0000ff" />
          </View>
        ) : springFrostDate && fallFrostDate ? (
          <View>
            <View
              style={tw.style("flex flex-row justify-between items-center")}>
              <View style={tw.style("flex flex-row")}>
                <SofiaBoldText>Fall Frost Date: </SofiaBoldText>
                <SofiaRegularText>
                  {fallFrostDate.month} {fallFrostDate.day}
                </SofiaRegularText>
              </View>
              <SofiaBoldText
                onPress={() => {
                  setSettingDateType("fall");
                  setOpen(true);
                }}
                style={tw.style("text-brand underline")}>
                Edit
              </SofiaBoldText>
            </View>

            <View
              style={tw.style("flex flex-row justify-between items-center")}>
              <View style={tw.style("flex flex-row")}>
                <SofiaBoldText>Spring Frost Date: </SofiaBoldText>
                <SofiaRegularText>
                  {springFrostDate.month} {springFrostDate.day}
                </SofiaRegularText>
              </View>
              <SofiaBoldText
                onPress={() => {
                  setSettingDateType("spring");
                  setOpen(true);
                }}
                style={tw.style("text-brand underline")}>
                Edit
              </SofiaBoldText>
            </View>
          </View>
        ) : (
          <View>
            <SofiaRegularText style={tw.style("text-gray-500 mb-2")}>
              No Frost Date Set
            </SofiaRegularText>
          </View>
        )}
        <View style={tw.style("mt-2")}>
          <SecondaryButton
            title="Set Frost Date"
            onPress={() => handleAskForLocation()}
          />
        </View>

        {open && (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date()}
            is24Hour={true}
            display="default"
            onChange={handleSetDate as any}
          />
        )}
      </Info>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({});
