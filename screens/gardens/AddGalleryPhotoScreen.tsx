/** @format */

import {
  Camera,
  CameraCapturedPicture,
  CameraPictureOptions
} from "expo-camera";
import { uniqueId } from "lodash";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch, useSelector } from "react-redux";
import { GeneralSlot } from "..";
import { Input, PrimaryButton, SecondaryButton } from "../../components/common";
import { SofiaBoldText } from "../../components/StyledText";
import { tw } from "../../components/Themed";
import { Photo } from "../../models/Photo";
import { addGalleryPhoto } from "../../models/UserGardens";
import CachedImage from "react-native-expo-cached-image";

import {
  RootState,
  updateActiveGarden,
  updateActiveUserGarden
} from "../../store";
import Spinner from "../../components/common/Spinner";
import { RootStackScreenProps, RootTabScreenProps } from "../../types";
export function AddGalleryPhotoScreen({
  navigation,
  route
}: RootStackScreenProps<"AddGalleryPhotoScreen">) {
  const { photo } = route.params;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { activeGarden } = useSelector((state: RootState) => state.gardens);
  const { loading } = useSelector((state: RootState) => state.common);
  const [isLoadingGalleryPhoto, setIsLoadingGalleryPhoto] = useState(false);

  const dispatch = useDispatch();

  const handleSavePhoto = async () => {
    const photoData: Photo = {
      id: undefined,
      url: undefined,
      uri: undefined,
      dateAdded: undefined,
      title: title,
      description: description
    };

    // this function adds the url and uri
    setIsLoadingGalleryPhoto(true);
    await addGalleryPhoto(photo, activeGarden, photoData);
    setIsLoadingGalleryPhoto(false);

    dispatch(updateActiveUserGarden(activeGarden));

    navigation.pop();
    navigation.pop();
  };

  if (loading || isLoadingGalleryPhoto) return <Spinner />;

  return (
    <KeyboardAwareScrollView extraHeight={20} style={tw.style("bg-white")}>
      <GeneralSlot>
        <SofiaBoldText style={tw.style("text-2xl text-gray-500 mb-4")}>
          Add Photo
        </SofiaBoldText>

        <View style={tw.style(" flex ")}>
          <CachedImage
            source={{ uri: photo.uri }}
            style={tw.style(`rounded-lg h-96 w-full mb-2`)}
          />
          <Input
            style={tw`mb-2`}
            value={title}
            handleOnChangeText={setTitle}
            placeholder="Title"
          />
          <Input
            style={tw`mb-2`}
            value={description}
            handleOnChangeText={setDescription}
            placeholder="Description"
            numberOfLines={5}
          />
          <View style={tw.style("flex flex-row")}>
            <View style={tw.style("flex-1 mr-1")}>
              <SecondaryButton
                title="Retake"
                onPress={() =>
                  navigation.navigate("CameraPreview", {
                    photoCallback: (photo: CameraCapturedPicture) =>
                      navigation.push("AddGalleryPhotoScreen", {
                        photo
                      })
                  })
                }
              />
            </View>
            <View style={tw.style("flex-1 ml-1")}>
              <PrimaryButton title="Save" onPress={() => handleSavePhoto()} />
            </View>
          </View>
        </View>
        <SofiaBoldText
          onPress={() => navigation.pop()}
          style={tw.style("text-center underline text-brand mt-5")}>
          Exit Without Saving
        </SofiaBoldText>
      </GeneralSlot>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({});
