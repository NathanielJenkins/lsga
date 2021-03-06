/** @format */

import { Camera, CameraCapturedPicture } from "expo-camera";
import { RootStackScreenProps } from "../../types";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions, Platform } from "react-native";
import { tw } from "../../components/Themed";
import { CircleIconButton } from "../../components/common/Button";
import { storage, auth } from "../../firebase/firebaseTooling";
export function CameraPreview({
  navigation,
  route
}: RootStackScreenProps<"CameraPreview">) {
  const { photoCallback } = route.params;

  const [hasCameraPermission, setHasCameraPermission] =
    useState<boolean>(false);
  const [camera, setCamera] = useState<Camera>();

  // Screen Ratio and image padding
  const [imagePadding, setImagePadding] = useState(0);
  const [ratio, setRatio] = useState("4:3"); // default is 4:3
  const { height, width } = Dimensions.get("window");
  const screenRatio = height / width;
  const [isRatioSet, setIsRatioSet] = useState(false);

  // on screen  load, ask for permission to use the camera
  useEffect(() => {
    async function getCameraStatus() {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status == "granted");
    }
    getCameraStatus();
  }, []);

  const handleTakePhoto = async () => {
    const photo = await camera.takePictureAsync();
    photoCallback && photoCallback(photo);
  };

  // set the camera ratio and padding.
  // this code assumes a portrait mode screen
  const prepareRatio = async () => {
    let desiredRatio = "4:3"; // Start with the system default
    // This issue only affects Android
    if (Platform.OS === "android") {
      const ratios = await camera.getSupportedRatiosAsync();

      // Calculate the width/height of each of the supported camera ratios
      // These width/height are measured in landscape mode
      // find the ratio that is closest to the screen ratio without going over
      let distances = {} as any;
      let realRatios = {} as any;
      let minDistance = null;
      for (const ratio of ratios) {
        const parts = ratio.split(":");
        const realRatio = parseInt(parts[0]) / parseInt(parts[1]);
        realRatios[ratio] = realRatio;
        // ratio can't be taller than screen, so we don't want an abs()
        const distance = screenRatio - realRatio;
        distances[ratio] = realRatio;
        if (minDistance == null) {
          minDistance = ratio;
        } else {
          if (distance >= 0 && distance < distances[minDistance]) {
            minDistance = ratio;
          }
        }
      }
      // set the best match
      desiredRatio = minDistance;
      //  calculate the difference between the camera width and the screen height
      const remainder = Math.floor(
        (height - realRatios[desiredRatio] * width) / 2
      );
      // set the preview padding and preview ratio
      setImagePadding(remainder);
      setRatio(desiredRatio);
      // Set a flag so we don't do this
      // calculation each time the screen refreshes
      setIsRatioSet(true);
    }
  };

  // the camera must be loaded in order to access the supported ratios
  const setCameraReady = async () => {
    if (!isRatioSet) {
      await prepareRatio();
    }
  };

  if (hasCameraPermission === null) {
    return (
      <View style={styles.information}>
        <Text>Waiting for camera permissions</Text>
      </View>
    );
  } else if (hasCameraPermission === false) {
    return (
      <View style={styles.information}>
        <Text>No access to camera</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {/* 
      We created a Camera height by adding margins to the top and bottom, 
      but we could set the width/height instead 
      since we know the screen dimensions
      */}
        <Camera
          autoFocus={true}
          style={[
            styles.cameraPreview,
            { marginTop: imagePadding, marginBottom: imagePadding }
          ]}
          onCameraReady={setCameraReady}
          ratio={ratio}
          ref={ref => {
            setCamera(ref);
          }}></Camera>
        <View
          style={tw.style(
            "absolute flex flex-1 flex-row w-full items-center justify-center bottom-10"
          )}>
          <CircleIconButton name={"camera-retro"} onPress={handleTakePhoto} />
        </View>
        <View
          style={tw.style(
            "absolute flex flex-1 flex-row w-full items-center left-5 top-5"
          )}>
          <CircleIconButton
            name={"times"}
            size={"sm"}
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  information: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center"
  },
  cameraPreview: {
    flex: 1
  }
});
