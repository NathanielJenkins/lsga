/** @format */

import { isEmpty, isNil } from "lodash";
import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { SecondaryButton } from "../common/Button";
import { SofiaBoldText, SofiaRegularText } from "../StyledText";
import { tw } from "../Themed";
export const GalleryCard = () => {
  const { activeGarden } = useSelector((state: RootState) => state.gardens);

  return (
    <View
      style={tw.style(
        "shadow-brand m-2 flex p-4 justify-center items-center "
      )}>
      <SofiaBoldText style={tw.style("text-lg text-gray-500")}>
        Gallery
      </SofiaBoldText>
      <View style={tw.style("my-2")}>
        {!isNil(activeGarden.gallery) && !isEmpty(activeGarden.gallery) ? (
          activeGarden.gallery?.map(g => (
            <Image
              key={g.id}
              source={{ uri: g.url }}
              style={tw.style(`resize-contain h-24 w-24`)}
            />
          ))
        ) : (
          <View>
            <SofiaRegularText>No Photos yet!</SofiaRegularText>
          </View>
        )}
      </View>
      <View style={tw.style("w-full")}>
        <SecondaryButton title="Timeline" onPress={() => {}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
