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
  Alert
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { storage } from "../../firebase/firebaseTooling";
import Veggie, { VeggieState } from "../../models/Veggie";
import {
  RootState,
  updateFrostDatesByLngLat,
  updateFrostDatesFromDate
} from "../../store";
import { tw } from "../Themed";
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
import { IconText, PrimaryButton, SecondaryButton } from "../common/Button";
import { useNavigation } from "@react-navigation/native";
import { chunk } from "lodash";
import { FontAwesome } from "@expo/vector-icons";
import Ripple from "react-native-material-ripple";
import { Info } from "../common/Display";
import * as Location from "expo-location";
import DateTimePicker from "@react-native-community/datetimepicker";
import { setFrostDateFromLngLat } from "../../models/UserProperties";
import UserGarden from "../../models/UserGardens";
import { deleteGarden } from "../../store";
export function NoGardensPrompt() {
  const navigation = useNavigation();
  return (
    <MainPageSlot>
      <View style={tw.style("bg-transparent justify-center items-center")}>
        <View style={tw`flex justify-center items-center`}>
          <Image
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
}
export function GardenVeggieReceiver(props: GardenVeggieReceiverProps) {
  const { width, i, veggieState } = props;
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [squareSize, setSquareSize] = useState<number>(0);
  const [workingGrid, setWorkingGrid] = props.workingGridState;
  const maxSize = 250;

  return (
    <DraxView
      style={tw.style("flex-1 border-gray-300 bg-transparent border-r", {
        height: squareSize,
        "border-r-0 ": (i + 1) % width === 0,
        "bg-gray-100": isDraggingOver,
        "bg-green-100": veggieState === VeggieState.Compatible,
        "bg-red-100": veggieState === VeggieState.Incompatible
      })}
      key={i}
      onReceiveDragEnter={() => setIsDraggingOver(true)}
      onReceiveDragExit={e => setIsDraggingOver(false)}
      onReceiveDragDrop={({
        dragged: {
          payload: { veggie }
        }
      }) => {
        const workingGridCopy = [...workingGrid];
        workingGridCopy[i] = veggie;
        setWorkingGrid(workingGridCopy);
        setIsDraggingOver(false);
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
            size={squareSize}
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
}
export function GardenGrid(props: GardenGridProps) {
  const { activeGarden } = useSelector((state: RootState) => state.gardens);
  const { veggies } = useSelector((state: RootState) => state.veggies);
  const height = activeGarden?.garden.height || 0;
  const width = activeGarden?.garden.width || 0;
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
    <View style={tw.style("flex items-center justify-center")}>
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
          <Image
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
          <View style={tw.style("flex")}>
            <Picker
              selectedValue={activeGarden.id}
              onValueChange={handleUpdateActiveGarden}>
              {gardens.map((g, i) => (
                <Picker.Item key={i} label={g.name} value={g.id} />
              ))}
            </Picker>
          </View>
        </View>
      )}
    </View>
  );
}

interface DropSectionProps {
  isDraggingPallet: boolean;
  isDraggingGrid: boolean;
  onVeggieInfoSelection: (veggie: Veggie) => void;
  onVeggieDeleteSelection: (index: number) => void;
}
export function DropSection(props: DropSectionProps) {
  const { isDraggingGrid, isDraggingPallet } = props;
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const navigation = useNavigation();
  return (
    <View style={tw.style("mt-2 flex  flex justify-center ")}>
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
      ) : (
        <View style={tw.style("border border-transparent py-2")}>
          <SofiaRegularText>Select Veggies</SofiaRegularText>
        </View>
      )}
    </View>
  );
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
      <Image
        source={{ uri: props.veggie?.downloadUrl }}
        style={tw.style(`resize-contain h-14 w-14 mr-4`)}
      />
      <SofiaBoldText style={tw.style("text-2xl text-gray-500 text-center")}>
        {props.veggie?.displayName}
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

export function ListGardens() {
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
      {gardens.map(g => (
        <View
          key={g.id}
          style={tw.style("flex flex-1 flex-row items-center justify-between")}>
          <SofiaRegularText>{g.name}</SofiaRegularText>
          <IconText
            name="trash"
            color="grey"
            size={20}
            onPress={() => handleDelete(g)}
          />
        </View>
      ))}
    </Info>
  );
}

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
