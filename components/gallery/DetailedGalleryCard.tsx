/** @format */

import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { storage } from "../../firebase/firebaseTooling";
import { Photo } from "../../models/Photo";
import { SofiaBoldText, SofiaRegularText } from "../StyledText";
import { tw } from "../Themed";
export interface DetailedGalleryCardProps {
  photo: Photo;
}

export function DetailedGalleryCard(props: DetailedGalleryCardProps) {
  const { photo } = props;
  if (!props.photo) return <View></View>;
  return (
    <View style={tw.style("shadow-brand m-1 p-2")}>
      <View style={tw.style("rounded flex p-3")}>
        <Image
          key={props.photo.id}
          source={{ uri: photo.uri }}
          style={tw.style(`rounded-lg h-72 w-full `)}
        />
        <View style={tw.style("flex")}>
          <SofiaBoldText style={tw.style("text-gray-500 text-lg")}>
            {photo.title}
          </SofiaBoldText>
          <SofiaRegularText>{photo.description}</SofiaRegularText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
