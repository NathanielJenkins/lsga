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
import { updateGardens } from "../store/actions/garden.actions";
import no_gardens from "../assets/images/no_gardens.png";
import { tw } from "../components/Themed";
import { SofiaRegularText } from "../components/StyledText";
import MainPageSlot from "./slots/MainPageSlot";
PrimaryButton;
export default function HomeScreen({
  navigation
}: RootTabScreenProps<"HomeScreen">) {
  const handleButtonPress = async () => {
    console.log(await getGardenByName("garden1"));
  };
  const dispatch = useDispatch();
  // get all the users gardens
  // const [gardens, setGardens] = useState(aw)
  const { gardens } = useSelector((state: RootState) => state.gardens);
  React.useEffect(() => {
    dispatch(updateGardens());
  }, []);
  return gardens?.length ? (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <PrimaryButton title="XXX" onPress={handleButtonPress} />
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  ) : (
    <MainPageSlot>
      <View style={tw.style("bg-transparent", styles.container)}>
        <View style={tw``}>
          <Image
            source={no_gardens}
            style={tw.style(`w-64 h-64`, { resizeMode: "contain" })}
          />
        </View>
        <SofiaRegularText style={tw.style(`text-xl mb-2`)}>
          No Gardens... yet
        </SofiaRegularText>
        <SecondaryButton title="Add a New Garden" onPress={handleButtonPress} />
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
