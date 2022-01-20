/** @format */

import { firestore, storage } from "../firebase/firebaseTooling";
import Documents from "./Documents";

export interface GardenPack {
  name: string;
  downloadUrl?: string;
  url: string;

  displayName: string;
  description: string;
  spring: Array<string>;
  summer: Array<string>;
  autumnWinter: Array<string>;
}

export default GardenPack;

const ref = firestore.collection(Documents.GardenPacks);

export const getAllGardenPacks = async () => {
  const snapshot = await ref.get();
  const gardenPacks: Array<GardenPack> = new Array();
  for (let doc of snapshot.docs) {
    const gardenPack = { ...(doc.data() as GardenPack) };

    if (!gardenPack.downloadUrl) {
      const url = await storage
        .ref(gardenPack.url) //name in storage in firebase console
        .getDownloadURL();
      gardenPack.downloadUrl = url;
    }
    gardenPacks.push(gardenPack);
  }

  return gardenPacks;
};
