/** @format */

import Garden from "./Garden";
import { auth, firestore, storage } from "../firebase/firebaseTooling";
import Documents from "./Documents";
import Veggie, { getPlantingRangeFromUserFrostDates } from "./Veggie";
import { useDispatch } from "react-redux";
import { store } from "../store";
import Task, { TaskDate } from "./Task";

const ref = firestore.collection(Documents.UserGardens);

export default interface UserGarden {
  [properties.userId]?: string;
  [properties.url]?: string;
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
}

class properties {
  public static readonly userId = "userId";
  public static readonly garden = "garden";
  public static readonly url = "url";
  public static readonly _name = "name";
  public static readonly description = "description";
  public static readonly grid = "grid";
  public static readonly plantingDates: "plantingDates";
  public static readonly veggieSteps: "veggieSteps";
  public static readonly datePlanted: "datePlanted";
}

export const addUserGarden = async (userGarden: UserGarden) => {
  const blob = await (await fetch(userGarden.url)).blob();
  const newUrl = `${auth.currentUser.uid}/${encodeURIComponent(
    userGarden.name
  )}`;

  await storage.ref().child(newUrl).put(blob);

  userGarden.userId = auth.currentUser?.uid;
  userGarden.url = newUrl;
  userGarden.veggieSteps = {};

  userGarden.grid = [
    ...Array(userGarden.garden.height * userGarden.garden.width).keys()
  ].map(() => null);

  return updateUserGarden(userGarden);
};

export const updateUserGarden = async (userGarden: UserGarden) => {
  await ref.doc(userGarden.name).set(userGarden);

  return userGarden;
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
