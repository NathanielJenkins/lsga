/** @format */

import Garden from "./Garden";
import { auth, firestore, storage } from "../firebase/firebaseTooling";
import Documents from "./Documents";
import Veggie, { getPlantingRangeFromUserFrostDates } from "./Veggie";
import { useDispatch } from "react-redux";
import { setLoading, store } from "../store";
import Task, { TaskDate } from "./Task";
import { Photo, profileId } from "./Photo";
import { uniqueId, cloneDeep } from "lodash";
import { CameraCapturedPicture } from "expo-camera";
import uuid from "react-native-uuid";
const ref = firestore.collection(Documents.UserGardens);

export default interface UserGarden {
  [properties.userId]?: string;
  [properties.url]?: string;
  [properties.uri]?: string;

  [properties._name]?: string;
  [properties.description]?: string;
  [properties.garden]?: Garden;
  [properties.grid]?: Array<string>;
  [properties.plantingDates]?: Array<{
    veggieName: string;
    first: string;
    last: string;
    datePlanted?: Date | string;
  }>;
  [properties.veggieSteps]: {
    [veggieName: string]: Array<TaskDate>;
  };
  [properties.gallery]: Array<Photo>;
  [properties.id]: string;
}

class properties {
  public static readonly id = "id";
  public static readonly userId = "userId";
  public static readonly garden = "garden";
  public static readonly url = "url";
  public static readonly uri = "uri";
  public static readonly _name = "name";
  public static readonly description = "description";
  public static readonly grid = "grid";
  public static readonly plantingDates: "plantingDates";
  public static readonly veggieSteps: "veggieSteps";
  public static readonly datePlanted: "datePlanted";
  public static readonly gallery: "gallery";
}

export const setGardenProfile = async (userGarden: UserGarden) => {
  const blob = await (await fetch(userGarden.url)).blob();
  const newUrl = `${auth.currentUser.uid}/profile/${encodeURIComponent(
    userGarden.id
  )}`;
  await storage.ref().child(newUrl).put(blob);
  const uri = await storage.ref(newUrl).getDownloadURL();
  userGarden.uri = uri;
  userGarden.url = newUrl;
};

export const addUserGarden = async (userGarden: UserGarden) => {
  const id = new String(uuid.v4()).valueOf();

  userGarden.id = id;
  userGarden.userId = auth.currentUser?.uid;

  await setGardenProfile(userGarden);

  userGarden.veggieSteps = {};
  // userGarden.gallery =
  userGarden.grid = [
    ...Array(userGarden.garden.height * userGarden.garden.width).keys()
  ].map(() => null);

  const photo: Photo = {
    id: profileId,
    url: userGarden.url,
    dateAdded: new Date().toISOString(),
    title: "Created My Garden!",
    description: "Check out my new garden!",
    uri: userGarden.uri
  };

  userGarden.gallery = [photo];

  return updateUserGarden(userGarden);
};

export const addGalleryPhoto = async (
  photo: CameraCapturedPicture,
  userGarden: UserGarden,
  photoData: Photo
) => {
  photoData.id = new String(uuid.v4()).valueOf();

  const blob = await (await fetch(photo.uri)).blob();
  const newUrl = `${auth.currentUser.uid}/gallery/${encodeURIComponent(
    userGarden.id
  )}/${photoData.id}`;

  await storage.ref().child(newUrl).put(blob);

  photoData.dateAdded = new Date().toISOString();
  photoData.uri = await storage.ref(newUrl).getDownloadURL();
  photoData.url = newUrl;

  userGarden.gallery = [...userGarden.gallery, photoData];
};

export const deleteGalleryPhoto = async (
  photoData: Photo,
  userGarden: UserGarden
) => {
  await storage.ref(photoData.url).delete();

  userGarden.gallery = userGarden.gallery.filter(p => p.id !== photoData.id);

  photoData = undefined;
};

export const deleteUserGarden = async (userGarden: UserGarden) => {
  // delete the garden from firebase
  ref.doc(userGarden.id).delete();

  // delete all the photos that are associated with the garden
  const url = `${auth.currentUser.uid}/profile/${encodeURIComponent(
    userGarden.id
  )}`;

  await storage.ref().child(url).delete();
};

export const updateUserGarden = async (userGarden: UserGarden) => {
  await ref.doc(userGarden.id).set(userGarden);

  return userGarden;
};

export const deleteAllUserGardens = async () => {
  const gardens = await getUserGardens();
  gardens.forEach(g => deleteUserGarden(g));
};

export const getUserGardens = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) return [];

  const snapshot = await ref.where(properties.userId, "==", userId).get();

  const gardens: Array<UserGarden> = new Array();
  snapshot.forEach(doc => {
    const garden = doc.data() as UserGarden;
    // garden.plantingDates = garden.plantingDates.map(pd => {last})
    gardens.push(garden);
  });
  return gardens;
};

export function updatePlantingDates(userGarden: UserGarden) {
  const state = store.getState();
  const { veggies } = state.veggies;
  const { springFrostDate, fallFrostDate } = state.user;
  const plantingDates: Array<{
    veggieName: string;
    first: string;
    last: string;
  }> = new Array();
  const veggieNames = [...new Set(userGarden.grid)];
  veggieNames.forEach((veggieName, index) => {
    const veggie = veggies[veggieName];

    plantingDates.push(
      getPlantingRangeFromUserFrostDates(veggie, springFrostDate, fallFrostDate)
    );
  });

  userGarden.plantingDates = plantingDates;
}

export function getUniqueVeggieIdsFromGrid(userGarden: UserGarden) {
  const veggieIds = [...new Set(userGarden.grid)] || [];
  return veggieIds;
}
