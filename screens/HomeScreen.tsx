/** @format */

import * as React from "react";
import { StyleSheet, Image } from "react-native";
import { PrimaryButton, SecondaryButton } from "../components/common/Button";
import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { getGardenByName } from "../models/Garden";
import { RootState } from "../store/reducers";
import { useSelector, useDispatch } from "react-redux";
import {
  updateGardens,
  updateActiveGarden
} from "../store/actions/garden.actions";
import no_gardens from "../assets/images/no_gardens.png";
import { tw } from "../components/Themed";
import {
  SofiaBoldText,
  SofiaRegularText,
  SofiaSemiBoldText
} from "../components/StyledText";
import MainPageSlot from "./slots/MainPageSlot";
import { Picker } from "@react-native-picker/picker";
import { storage } from "../firebase/firebaseTooling";
PrimaryButton;
export default function HomeScreen({
  navigation
}: RootTabScreenProps<"HomeScreen">) {
  const [imageUrl, setImageUrl] = React.useState(undefined);
  const { gardens, activeGarden } = useSelector(
    (state: RootState) => state.gardens
  );

  React.useEffect(() => {
    if (!activeGarden?.url) return;
    console.log(activeGarden);
    storage
      .ref(activeGarden.url) //name in storage in firebase console
      .getDownloadURL()
      .then((url: string) => {
        setImageUrl(url);
      })
      .catch((e: Error) => console.log("Errors while downloading => ", e));
  }, [activeGarden]);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(updateGardens());
  }, []);

  const handleUpdateActiveGarden = (gardenName: string) => {
    const garden = gardens.find(g => g.name === gardenName);
    dispatch(updateActiveGarden(garden));
  };

  return gardens?.length && activeGarden ? (
    <MainPageSlot>
      {gardens.length === 1 ? (
        <View>
          <SofiaSemiBoldText style={tw.style("text-2xl text-gray-500")}>
            {activeGarden?.name}
          </SofiaSemiBoldText>
        </View>
      ) : (
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
      )}
      <View
        style={tw`w-full h-64 flex justify-center items-center shadow-brand`}>
        <Image
          style={tw.style("h-64 w-full rounded-md")}
          source={{ uri: imageUrl }}></Image>
      </View>
    </MainPageSlot>
  ) : (
    <MainPageSlot>
      <View style={tw.style("bg-transparent", styles.container)}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%"
  }
});
