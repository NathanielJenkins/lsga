/** @format */

import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, View, Share } from "react-native";
import { useDispatch } from "react-redux";
import { storage } from "../../firebase/firebaseTooling";
import { Photo, profileId, shareImage } from "../../models/Photo";
import UserGarden, { deleteGalleryPhoto } from "../../models/UserGardens";
import { setLoading, updateActiveUserGarden } from "../../store";
import { IconText } from "../common/Button";
import { SofiaBoldText, SofiaRegularText } from "../StyledText";
import { tw } from "../Themed";

export interface DetailedGalleryCardProps {
  photo: Photo;
  userGarden: UserGarden;
}

export function DetailedGalleryCard(props: DetailedGalleryCardProps) {
  const { photo, userGarden } = props;
  const cannotDeleteMsg: [string, string, any] = [
    `Cannot Delete`,
    `You may not delete the garden profile photo, in order to delete you must delete the entire garden`,
    [
      {
        text: "OK"
      }
    ]
  ];

  const dispatch = useDispatch();
  const handleDelete = async () => {
    const alertMsg: [string, string, any] = [
      `Confirm Delete`,
      `Are you sure you want to delete this photo ?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            await deleteGalleryPhoto(photo, userGarden);
            dispatch(updateActiveUserGarden(userGarden));
          }
        }
      ]
    ];

    if (photo.id === profileId) Alert.alert(...cannotDeleteMsg);
    else Alert.alert(...alertMsg);
  };

  const handleShare = async () => {
    await shareImage(photo);
  };

  if (!photo) return <View></View>;
  return (
    <View style={tw.style("flex shadow-brand m-1")}>
      <View
        style={tw.style("flex flex-row justify-end items-center pt-2 pr-1 ")}>
        <IconText
          size={25}
          name="share-alt"
          color="grey"
          onPress={() => handleShare()}
          style={tw.style("mr-2")}
        />
        <IconText
          size={30}
          name="times-circle"
          color="grey"
          onPress={() => handleDelete()}
        />
      </View>

      <View style={tw.style("rounded flex m-2")}>
        <Image
          key={props.photo.id}
          source={{ uri: photo.uri }}
          style={tw.style(`rounded-lg h-64 w-full w-52 `)}
        />
        <View style={tw.style("flex w-52")}>
          <SofiaBoldText
            style={tw.style("text-gray-500 mt-2", { fontSize: 14 })}>
            {photo.title}
          </SofiaBoldText>
          <SofiaRegularText style={tw.style("text-black text-xs mt-0.5")}>
            {photo.description}
          </SofiaRegularText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
