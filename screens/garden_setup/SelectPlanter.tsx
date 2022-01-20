/** @format */

import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/reducers";
import Garden, { getAllGardens } from "../../models/Garden";
import UserGarden from "../../models/UserGardens";
import { CardSlot } from "../slots/CardSlot";
import { updateGardens } from "../../store/actions/garden.actions";
import { tw } from "../../components/Themed";
import { PrimaryButton, ThumbnailCard } from "../../components/common/Button";
import Swiper from "react-native-swiper";
interface SelectPlanterProps {
  newGardenState: [
    UserGarden,
    React.Dispatch<React.SetStateAction<UserGarden>>
  ];
  swiper: React.MutableRefObject<Swiper>;
}

export function SelectPlanter(selectPlanterProps: SelectPlanterProps) {
  const [newGarden, setNewGarden] = selectPlanterProps.newGardenState;
  const [activeGarden, setActiveGarden] = useState<Garden>();
  const gardens = useSelector((state: RootState) => state.gardens.gardenTypes);
  const swiper = selectPlanterProps.swiper;

  React.useEffect(() => {
    if (!activeGarden) return;
    const ng = { ...newGarden };
    ng.garden = activeGarden;
    setNewGarden(ng);
  }, [activeGarden]);

  return (
    <CardSlot
      title={"Select your Planter"}
      subtitle={"What type of planter would you like to use ?"}>
      <View style={tw.style("flex")}>
        <View style={tw.style(" mt-4")}>
          {gardens.map(g => (
            <ThumbnailCard
              title={g.displayName}
              img={g.img}
              style={tw.style("mb-2")}
              key={g.id}
              active={activeGarden?.id === g.id}
              onPress={() => setActiveGarden(g)}
            />
          ))}
          <View style={tw`mt-4`}>
            <PrimaryButton
              title="Continue"
              onPress={() => swiper.current.scrollBy(1)}
              style={tw` `}
            />
          </View>
        </View>
      </View>
    </CardSlot>
  );
}

const styles = StyleSheet.create({});
