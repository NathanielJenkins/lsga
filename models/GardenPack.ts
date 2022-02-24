/** @format */

import { firestore, storage } from "../firebase/firebaseTooling";
import Documents from "./Documents";

export class GridType {
  public static readonly summer = "gridSummer";
  public static readonly spring = "gridSpring";
  public static readonly autumnWinter = "gridAutumnWinter";
}

export interface GardenPack {
  name: string;
  downloadUrl?: string;
  url: string;

  displayName: string;
  description: string;
  spring: Array<string>;
  summer: Array<string>;
  autumnWinter: Array<string>;
  grid: {
    [id: string]: {
      [GridType.spring]: Array<string>;
      [GridType.summer]: Array<string>;
      [GridType.autumnWinter]: Array<string>;
    };
  };
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

export const getGardenPackById = (
  packs: Array<GardenPack>,
  packId: string,
  gardenId: string,
  gridType: GridType
) => {
  // find the pack that matches the matches the pack id
  const pack = packs.find(p => p.name === packId);
  if (!pack) return null;

  //find the garden id in this pack;
  const gardenGrids = pack.grid[gardenId] as any;
  if (!gardenGrids) return null;

  //find the pack
  return gardenGrids[gridType as any] as Array<string>;
};
