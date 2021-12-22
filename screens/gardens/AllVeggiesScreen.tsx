/** @format */

import * as React from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { RoundedOutlineButton } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { VeggieSearchItem } from "../../components/garden/GardenItems";
import { SofiaBoldText } from "../../components/StyledText";
import { RootState } from "../../store";
import { RootTabScreenProps } from "../../types";
import { GeneralSlot } from "../slots";
export function AllVeggiesScreen({
  navigation
}: RootTabScreenProps<"AllVeggiesScreen">) {
  const { veggies } = useSelector((state: RootState) => state.veggies);

  const [searchString, setSearchString] = React.useState("");
  const [filteredVeggies, setFilteredVeggie] = React.useState([]);
  React.useEffect(() => {
    const veggiesCopy = [...Object.values(veggies)];
    const newFilteredVeggies = !searchString
      ? veggiesCopy
      : veggiesCopy.filter(v => {
          const searchTerms = v.displayName.split(" ");
          for (let term of searchTerms)
            if (term.startsWith(searchString)) return true;

          return false;
        });
    setFilteredVeggie(newFilteredVeggies);
  }, [searchString, veggies]);

  return (
    <GeneralSlot>
      <ScrollView>
        <SofiaBoldText style={tw.style("text-2xl text-gray-500 mb-2")}>
          All Veggies
        </SofiaBoldText>
        <Input
          placeholder="Search"
          style={tw.style("mb-4")}
          handleOnChangeText={setSearchString}
        />
        {filteredVeggies.map(v => (
          <VeggieSearchItem
            key={v.name}
            veggie={v}
            style={tw.style("my-1 mx-2")}
          />
        ))}
      </ScrollView>
    </GeneralSlot>
  );
}
