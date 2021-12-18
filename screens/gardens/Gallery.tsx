/** @format */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { GeneralSlot } from "..";
import { SofiaBoldText, SofiaSemiBoldText } from "../../components/StyledText";
import { tw } from "../../components/Themed";
import { RootState } from "../../store";
import { RootTabScreenProps } from "../../types";
import { DetailedGalleryCard, TimelineGallery } from "../../components/gallery";
import { NoGardensPrompt } from "../../components/garden/GardenItems";
export function Gallery({ navigation }: RootTabScreenProps<"Gallery">) {
  const { activeGarden } = useSelector((state: RootState) => state.gardens);

  if (!activeGarden) return <NoGardensPrompt />;
  return (
    <GeneralSlot>
      <SofiaBoldText style={tw.style("text-2xl text-gray-500")}>
        {activeGarden?.name}
      </SofiaBoldText>
      <View>
        {activeGarden.gallery?.map(g => (
          <View style={tw.style("flex flex-row")} key={g.id}>
            <View style={tw.style("flex-1")}>
              <TimelineGallery />
            </View>
            <View style={tw.style("flex ")}>
              <DetailedGalleryCard photo={g} />
            </View>
          </View>
        ))}
      </View>
    </GeneralSlot>
  );
}

const styles = StyleSheet.create({});
