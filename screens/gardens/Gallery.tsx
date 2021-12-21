/** @format */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { GeneralSlot } from "..";
import {
  SofiaBoldText,
  SofiaRegularText,
  SofiaSemiBoldText
} from "../../components/StyledText";
import { tw } from "../../components/Themed";
import { RootState } from "../../store";
import { RootTabScreenProps } from "../../types";
import { DetailedGalleryCard, TimelineGallery } from "../../components/gallery";
import { NoGardensPrompt } from "../../components/garden/GardenItems";
import { CircleIconButton } from "../../components/common/Button";
import { CameraCapturedPicture } from "expo-camera";
import { ScrollView } from "react-native-gesture-handler";
import { Spinner } from "../../components/common";
export function Gallery({ navigation }: RootTabScreenProps<"Gallery">) {
  const { activeGarden } = useSelector((state: RootState) => state.gardens);
  const { loading } = useSelector((state: RootState) => state.common);
  if (!activeGarden) return <NoGardensPrompt />;

  if (loading) return <Spinner />;
  return (
    <React.Fragment>
      <ScrollView style={tw.style("bg-white ")}>
        <GeneralSlot>
          <SofiaBoldText style={tw.style("text-2xl text-gray-500")}>
            {activeGarden?.name}
          </SofiaBoldText>
          <View>
            {activeGarden.gallery?.map((g, index) => (
              <View
                style={tw.style(
                  "flex flex-row items-center justify-center items-center h-96"
                )}
                key={`${g.id}-${index}`}>
                <View style={tw.style("", { width: 115 })}>
                  <TimelineGallery
                    isFirst={index === 0}
                    isLast={index === activeGarden.gallery.length - 1}
                    date={g.dateAdded as string}
                  />
                </View>
                <DetailedGalleryCard photo={g} userGarden={activeGarden} />
              </View>
            ))}
          </View>
          <View style={tw.style("h-28")}></View>
        </GeneralSlot>
      </ScrollView>
      <View
        style={tw.style(
          "absolute bottom-5 flex items-center justify-center w-full "
        )}>
        <CircleIconButton
          style={tw.style("shadow-brand")}
          name={"camera-retro"}
          size={"md"}
          onPress={() =>
            navigation.push("CameraPreview", {
              photoCallback: (photo: CameraCapturedPicture) => {
                navigation.push("AddGalleryPhotoScreen", {
                  photo
                });
              }
            })
          }
          color={"gray"}
        />
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({});
