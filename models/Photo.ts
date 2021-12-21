/** @format */

import { storage } from "../firebase/firebaseTooling";
import * as Sharing from "expo-sharing"; // Import the library
import * as FileSystem from "expo-file-system";
export interface Photo {
  id: string;
  url: string;
  uri: string;
  dateAdded: string | Date;
  title: string;
  description: string;
}

export const profileId = "profileId";

export const shareImage = async (photo: Photo) => {
  const downloadPath = `${FileSystem.cacheDirectory}${photo.id}${".jpg"}`;

  const { uri: localUrl } = await FileSystem.downloadAsync(
    photo.uri,
    downloadPath
  );
  await Sharing.shareAsync(localUrl);
};
