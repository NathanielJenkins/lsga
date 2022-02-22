/** @format */

import * as React from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { RoundedOutlineButton } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import {
  PackSearchItem,
  VeggieSearchItem
} from "../../components/garden/GardenItems";
import { SofiaBoldText } from "../../components/StyledText";
import { tw } from "../../components/Themed";
import { RootState } from "../../store";
import { RootTabScreenProps } from "../../types";
import { GeneralSlot } from "../slots";

class SubPage {
  public static readonly VEGGIES = "VEGGIES";
  public static readonly PACKS = "PACKS";
}

export function AllVeggiesScreen({
  navigation
}: RootTabScreenProps<"AllVeggiesScreen">) {
  const { veggies } = useSelector((state: RootState) => state.veggies);
  const { packs } = useSelector((state: RootState) => state.packs);

  const [currentPage, setCurrentPage] = React.useState(SubPage.VEGGIES);
  const [veggieSearchString, setVeggieSearchString] = React.useState("");
  const [packSearchString, setPackSearchString] = React.useState("");

  const [filteredVeggies, setFilteredVeggie] = React.useState([]);
  const [filteredPacks, setFilteredPacks] = React.useState([]);

  React.useEffect(() => {
    const veggiesCopy = [...Object.values(veggies)];
    const newFilteredVeggies = !veggieSearchString
      ? veggiesCopy
      : veggiesCopy.filter(v => {
          const searchTerms = v.displayName.split(" ");
          for (let term of searchTerms)
            if (term.startsWith(veggieSearchString)) return true;

          return false;
        });
    setFilteredVeggie(newFilteredVeggies);
  }, [veggieSearchString, veggies]);

  React.useEffect(() => {
    const packsCopy = packs === undefined ? [] : [...packs];

    const newFilteredPacks = !packSearchString
      ? packsCopy
      : packsCopy.filter(p => {
          const searchTerms = p?.displayName.split(" ");
          for (let term of searchTerms)
            if (
              term
                .toLocaleLowerCase()
                .startsWith(packSearchString.toLocaleLowerCase())
            )
              return true;

          // search by veggie included in pack
          const veggies = [
            ...(p?.spring || []),
            ...(p?.summer || []),
            ...(p?.autumnWinter || [])
          ];

          for (let term of veggies)
            if (
              term
                .toLocaleLowerCase()
                .startsWith(packSearchString.toLocaleLowerCase())
            )
              return true;

          return false;
        });
    setFilteredPacks(newFilteredPacks);
  }, [packSearchString, packs]);

  const handleSetSearchString = (s: string) => {
    if (currentPage === SubPage.VEGGIES) setVeggieSearchString(s);
    else setPackSearchString(s);
  };

  return (
    <GeneralSlot>
      <ScrollView>
        <View style={tw.style("flex flex-row items-center  mb-2")}>
          <SofiaBoldText
            style={tw.style("text-2xl text-gray-400", {
              "text-brand": currentPage === SubPage.VEGGIES
            })}
            onPress={() => setCurrentPage(SubPage.VEGGIES)}>
            Veggies
          </SofiaBoldText>
          <SofiaBoldText style={tw.style("text-2xl text-gray-400 mx-2")}>
            |
          </SofiaBoldText>
          <SofiaBoldText
            style={tw.style("text-2xl text-gray-400 ", {
              "text-brand": currentPage === SubPage.PACKS
            })}
            onPress={() => setCurrentPage(SubPage.PACKS)}>
            Garden Packs
          </SofiaBoldText>
        </View>
        <Input
          placeholder="Search"
          style={tw.style("mb-4")}
          handleOnChangeText={handleSetSearchString}
        />
        {currentPage === SubPage.VEGGIES
          ? filteredVeggies.map(v => (
              <VeggieSearchItem
                key={v.name}
                veggie={v}
                style={tw.style("my-1 mx-2")}
              />
            ))
          : filteredPacks.map(v => (
              <PackSearchItem
                key={v.name}
                gardenPack={v}
                style={tw.style("my-1 mx-2")}
              />
            ))}
      </ScrollView>
    </GeneralSlot>
  );
}
