import * as React from "react";
import { StyleSheet } from "react-native";
import { PrimaryButton } from "../components/common/Button";
import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { getGardenByName } from "../models/Garden";
import { RootState } from "../store/reducers";
import { useSelector, useDispatch } from "react-redux";
import { updateGardens } from "../store/actions/garden.actions";
export default function HomeScreen({
  navigation,
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
    <View>
      <Text style={styles.title}>No Gardens Yet :(</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
