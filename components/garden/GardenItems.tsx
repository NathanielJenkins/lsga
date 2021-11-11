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
import Veggie from "../../models/Veggie";
import { RootState } from "../../store";
import { tw } from "../Themed";
import { Picker } from "@react-native-picker/picker";
import { updateActiveGarden } from "../../store/actions/garden.actions";
import { SofiaSemiBoldText, SofiaSemiMediumText } from "../StyledText";
import { DraxProvider, DraxView } from "react-native-drax";
import MainPageSlot from "../../screens/slots/MainPageSlot";
import { SofiaRegularText } from "../../components/StyledText";
import no_gardens from "../../assets/images/no_gardens.png";
import { SecondaryButton } from "../common/Button";
import { useNavigation } from "@react-navigation/native";
import { chunk } from "lodash";

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

interface GardenGridProps {
  style: StyleProp<any>;
  workingGridState: [
    Array<Veggie>,
    React.Dispatch<React.SetStateAction<Array<Veggie>>>
  ];
}
export function GardenGrid(props: GardenGridProps) {
  const { activeGarden } = useSelector((state: RootState) => state.gardens);
  const [workingGrid, setWorkingGrid] = props.workingGridState;

  const height = activeGarden?.garden.height || 0;
  const width = activeGarden?.garden.width || 0;
  const [squareSize, setSquareSize] = useState<number>(0);

  const widthGrid: Array<JSX.Element> = [];
  const maxSize = 250;
  for (let i = 0; i < width * height; i++) {
    widthGrid.push(
      <DraxView
        style={tw.style("flex-1 border-gray-300 border-r", {
          height: squareSize,
          "border-r-0 ": (i + 1) % width === 0
        })}
        key={i}
        onReceiveDragDrop={({
          dragged: {
            payload: { veggie }
          }
        }) => {
          const workingGridCopy = [...workingGrid];
          workingGridCopy[i] = veggie;
          setWorkingGrid(workingGridCopy);
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
              draggable={false}
              veggie={workingGrid[i]}
              noShadow
              size={squareSize}
            />
          )}
        </View>
      </DraxView>
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
            maxWidth: maxSize
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
}
export function VeggieItem(props: VeggieItemProps) {
  const [imageUrl, setImageUrl] = React.useState(undefined);
  const veggieRef = useRef();
  let size = props.size || 90;
  React.useEffect(() => {
    if (!props.veggie?.url) return;
    storage
      .ref(props.veggie.url) //name in storage in firebase console
      .getDownloadURL()
      .then((url: string) => {
        setImageUrl(url);
      })
      .catch((e: Error) => console.log("Errors while downloading => ", e));
  }, []);

  const VeggieBase = (
    <View
      style={tw.style(
        "flex justify-between py-2 items-center ",
        props.style,
        { "shadow-brand": !props.noShadow },
        { height: size, width: size }
      )}>
      <Image
        source={{ uri: imageUrl }}
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
          payload={{
            veggie: props.veggie
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

const styles = StyleSheet.create({});
