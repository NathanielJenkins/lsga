/** @format */

import React, { useRef, useState } from "react";
import {
  Image,
  PanResponder,
  StyleProp,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { storage } from "../../firebase/firebaseTooling";
import Veggie, { VeggieState } from "../../models/Veggie";
import { RootState } from "../../store";
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
import MainPageSlot from "../../screens/slots/MainPageSlot";
import { SofiaRegularText } from "../../components/StyledText";
import no_gardens from "../../assets/images/no_gardens.png";
import { PrimaryButton, SecondaryButton } from "../common/Button";
import { useNavigation } from "@react-navigation/native";
import { chunk } from "lodash";
import { FontAwesome } from "@expo/vector-icons";

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
  style: StyleProp<any>;
  workingGridState: [
    Array<Veggie>,
    React.Dispatch<React.SetStateAction<Array<Veggie>>>
  ];
  onDragStart?: (data: DraxDragEventData) => void;
  onDragEnd?: (data: DraxDragEndEventData) => DraxProtocolDragEndResponse;
  stateGrid: Array<VeggieState>;
}
export function GardenGrid(props: GardenGridProps) {
  const { activeGarden } = useSelector((state: RootState) => state.gardens);

  const height = activeGarden?.garden.height || 0;
  const width = activeGarden?.garden.width || 0;

  const widthGrid: Array<JSX.Element> = [];
  for (let i = 0; i < width * height; i++) {
    widthGrid.push(
      <GardenVeggieReceiver
        width={width}
        i={i}
        key={i}
        workingGridState={props.workingGridState}
        veggieState={props.stateGrid[i]}
        onDragStart={props.onDragStart}
        onDragEnd={props.onDragEnd}
      />
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
    <View style={tw.style(" flex items-center justify-center")}>
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
  index: number;
  onDragStart?: (data: DraxDragEventData) => void;
  onDragEnd?: (data: DraxDragEndEventData) => DraxProtocolDragEndResponse;
}
export function VeggieItem(props: VeggieItemProps) {
  if (!props.veggie) return <View />;

  const [isDragging, setIsDragging] = React.useState(false);
  let size = props.size || 90;

  const VeggieBase = (
    <View
      style={tw.style(
        "flex justify-between py-2 items-center rounded",
        props.style,
        { "shadow-brand": !props.noShadow },
        { height: size - 5, width: size - 5 }
      )}>
      <Image
        source={{ uri: props.veggie.downloadUrl }}
        style={tw.style(`resize-contain`, {
          height: size - 45,
          width: size - 45
        })}
      />
      <SofiaSemiMediumText style={tw.style("text-center")}>
        {props.veggie.displayName}
      </SofiaSemiMediumText>
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

interface GardenSelectorProps {}
export function GardenSelector(props: GardenSelectorProps) {
  const { gardens, activeGarden } = useSelector(
    (state: RootState) => state.gardens
  );
  const dispatch = useDispatch();

  const handleUpdateActiveGarden = (gardenName: string) => {
    const garden = gardens.find(g => g?.name === gardenName);
    dispatch(updateActiveGarden(garden));
  };

  return (
    <React.Fragment>
      {gardens.length === 1 ? (
        <View>
          <SofiaSemiBoldText style={tw.style("text-2xl text-gray-500")}>
            {activeGarden?.name}
          </SofiaSemiBoldText>
        </View>
      ) : (
        <View style={tw.style("flex flex-col")}>
          <View style={tw.style("flex mb-4")}>
            <Picker
              selectedValue={activeGarden.name}
              onValueChange={handleUpdateActiveGarden}>
              {gardens.map((g, i) => (
                <Picker.Item key={i} label={g.name} value={g.name} />
              ))}
            </Picker>
          </View>
        </View>
      )}
    </React.Fragment>
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

const styles = StyleSheet.create({});
