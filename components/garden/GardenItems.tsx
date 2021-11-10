/** @format */

import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { storage } from "../../firebase/firebaseTooling";
import Veggie from "../../models/Veggie";
import { RootState } from "../../store";
import { tw } from "../Themed";
import { Picker } from "@react-native-picker/picker";
import { updateActiveGarden } from "../../store/actions/garden.actions";
import { SofiaSemiBoldText } from "../StyledText";

export function GardenGrid() {
  return (
    <View>
      <Text></Text>
    </View>
  );
}

interface VeggieItemProps {
  veggie: Veggie;
}
export function VeggieItem(props: VeggieItemProps) {
  const [imageUrl, setImageUrl] = React.useState(undefined);
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
  return (
    <View>
      <Text>Veggie Item</Text>
      <Image
        source={{ uri: imageUrl }}
        style={tw`h-16 w-16 resize-contain mr-2`}
      />
    </View>
  );
}

interface GardenSelectorProps {}
export function GardenSelector(props: GardenSelectorProps) {
  const { gardens, activeGarden } = useSelector(
    (state: RootState) => state.gardens
  );
  const dispatch = useDispatch();

  const handleUpdateActiveGarden = (gardenName: string) => {
    const garden = gardens.find(g => g.name === gardenName);
    dispatch(updateActiveGarden(garden));
  };

  return (
    <React.Fragment>
      {gardens?.length > 1 ? (
        <View style={tw.style("flex flex-1 flex-col")}>
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
      ) : (
        <View>
          <SofiaSemiBoldText style={tw.style("text-2xl text-gray-500")}>
            {activeGarden?.name}
          </SofiaSemiBoldText>
        </View>
      )}
    </React.Fragment>
  );
}

const styles = StyleSheet.create({});
