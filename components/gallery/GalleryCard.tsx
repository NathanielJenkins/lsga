/** @format */

import { useNavigation } from "@react-navigation/native";
import { isEmpty, isNil, uniqueId } from "lodash";
import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { IconText, SecondaryButton } from "../common/Button";
import { SofiaBoldText, SofiaRegularText } from "../StyledText";
import CachedImage from "react-native-expo-cached-image";

import { tw } from "../Themed";
export const GalleryCard = () => {
  const { activeGarden } = useSelector((state: RootState) => state.gardens);

  return (
    <View style={tw.style("shadow-brand m-2 ")}>
      <SofiaBoldText style={tw.style("text-lg text-gray-500 text-center mt-2")}>
        Gallery
      </SofiaBoldText>
      <View style={tw.style("my-2 flex p-4 justify-center")}>
        {!isNil(activeGarden.gallery) && !isEmpty(activeGarden.gallery) ? (
          <FlatList
            key={activeGarden.gallery.length + "0"}
            data={Object.values(activeGarden.gallery)}
            style={tw.style("flex ")}
            horizontal={true}
            keyExtractor={d => `--${d.id}`}
            renderItem={({ item, index }) => (
              <CachedImage
                source={{ uri: item.uri }}
                style={tw.style(`h-24 w-24 rounded-lg mr-2 mb-2`)}
              />
            )}
          />
        ) : (
          <View>
            <SofiaRegularText style={tw.style("text-center")}>
              No Photos yet!
            </SofiaRegularText>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
