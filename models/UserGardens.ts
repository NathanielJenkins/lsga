/** @format */

import Garden from "./Garden";
import { auth, firestore, storage } from "../firebase/firebaseTooling";
import Documents from "./Documents";
import Veggie, {
  getPlantingRangeFromUserFrostDates,
  PlantingType
} from "./Veggie";
import { useDispatch } from "react-redux";
import { setLoading, store } from "../store";
import Task, { TaskDate } from "./Task";
import { Photo, profileId } from "./Photo";
import { uniqueId, cloneDeep } from "lodash";
import { CameraCapturedPicture } from "expo-camera";
import uuid from "react-native-uuid";
import { GridType } from ".";
import { FrostDateParsed } from "./UserProperties";
import moment from "moment";
const ref = firestore.collection(Documents.UserGardens);

export interface PlantingDate {
  veggieName: string;
  first: string;
  last: string;
  datePlanted?: Date | string;
  plantingType?: PlantingType;
}

export default interface UserGarden {
  [properties.userId]?: string;
  [properties.url]?: string;
  [properties.uri]?: string;

  [properties._name]?: string;
  [properties.description]?: string;
  [properties.garden]?: Garden;
  [properties.grid]?: Array<string>;
  [properties.veggieSteps]: {
    [veggieName: string]: Array<TaskDate>;
  };
  [properties.gallery]: Array<Photo>;
  [properties.id]: string;

  [GridType.spring]: Array<string>;
  [GridType.summer]: Array<string>;
  [GridType.autumnWinter]: Array<string>;

  [properties.plantingDates]?: Array<PlantingDate>;

  [properties.springPlantingDates]?: Array<PlantingDate>;
  [properties.summerPlantingDates]?: Array<PlantingDate>;
  [properties.autumnWinterPlantingDates]?: Array<PlantingDate>;

  [properties.autumnWinterVeggieSteps]: {
    [veggieName: string]: Array<TaskDate>;
  };
  [properties.springVeggieSteps]: {
    [veggieName: string]: Array<TaskDate>;
  };
  [properties.summerVeggieSteps]: {
    [veggieName: string]: Array<TaskDate>;
  };
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
  public static readonly veggieGrid = "veggieGrid";
  public static readonly veggieSteps: "veggieSteps";
  public static readonly datePlanted: "datePlanted";
  public static readonly gallery: "gallery";
  public static readonly isPack: "isPack";
  public static readonly pack: "pack";

  public static readonly summerPlantingDates: "summerPlantingDates";
  public static readonly springPlantingDates: "springPlantingDates";
  public static readonly autumnWinterPlantingDates: "autumnWinterPlantingDates";

  public static readonly summerVeggieSteps: "summerVeggieSteps";
  public static readonly springVeggieSteps: "springVeggieSteps";
  public static readonly autumnWinterVeggieSteps: "autumnWinterVeggieSteps";

  public static readonly summerVeggiePlantingTypes: "summerVeggiePlantingTypes";
  public static readonly springVeggiePlantingTypes: "springVeggiePlantingTypes";
  public static readonly autumnWinterVeggiePlantingTypes: "autumnWinterVeggiePlantingTypes";

  public static readonly plantingDates: "plantingDates";
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
  userGarden.springVeggieSteps = {};
  userGarden.summerVeggieSteps = {};
  userGarden.autumnWinterVeggieSteps = {};

  const emptyArray = [
    ...Array(userGarden.garden.height * userGarden.garden.width).keys()
  ].map(() => null);

  userGarden.grid = [...emptyArray];
  userGarden.gridSummer = [...emptyArray];
  userGarden.gridAutumnWinter = [...emptyArray];
  userGarden.gridSpring = [...emptyArray];

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

export function setPlantingDates(userGarden: UserGarden) {
  const state = store.getState();
  const { veggies } = state.veggies;
  const { springFrostDate, fallFrostDate } = state.user;

  const veggieNames = [...new Set(userGarden.grid)];
  const summerVeggiesNames = [...new Set(userGarden.gridSummer)];
  const springVeggiesNames = [...new Set(userGarden.gridSpring)];
  const autumnVeggiesNames = [...new Set(userGarden.gridAutumnWinter)];

  userGarden.plantingDates = addPlantingDates(veggieNames, veggies, springFrostDate, fallFrostDate, userGarden.plantingDates); //prettier-ignore
  userGarden.summerPlantingDates = addPlantingDates(summerVeggiesNames, veggies, springFrostDate, fallFrostDate, userGarden.summerPlantingDates); //prettier-ignore
  userGarden.autumnWinterPlantingDates = addPlantingDates(autumnVeggiesNames, veggies, springFrostDate, fallFrostDate, userGarden.autumnWinterPlantingDates); //prettier-ignore
  userGarden.springPlantingDates = addPlantingDates(springVeggiesNames, veggies, springFrostDate, fallFrostDate, userGarden.springPlantingDates); //prettier-ignore
}

export function setVeggiePlantingDate(
  userGarden: UserGarden,
  plantingType: PlantingType,
  activeGrid: GridType,
  veggie: Veggie
) {
  const plantingDates = getPlantingDatesFromGridType(activeGrid, userGarden);
  const plantingDateIndex = plantingDates?.findIndex(
    p => p.veggieName === veggie.name
  );
  if (plantingDateIndex === -1) return;

  const newPlantingDate = { ...plantingDates[plantingDateIndex] };
  newPlantingDate.datePlanted = moment().toISOString();
  newPlantingDate.plantingType = plantingType;
  plantingDates[plantingDateIndex] = newPlantingDate;

  return plantingDates;
}

function addPlantingDates(
  veggieNames: string[],
  veggies: { [name: string]: Veggie },
  springFrostDate: FrostDateParsed,
  fallFrostDate: FrostDateParsed,
  plantingDates: Array<PlantingDate> = []
) {
  const pd = [...plantingDates];

  veggieNames.forEach((veggieName, index) => {
    const veggie = veggies[veggieName];
    const oldPlantingDateIndex = pd?.findIndex(
      p => p.veggieName === veggieName
    );
    const newPlantingDate = getPlantingRangeFromUserFrostDates(
      veggie,
      springFrostDate,
      fallFrostDate
    );

    if (oldPlantingDateIndex !== -1) {
      const oldPlantingDate = pd[oldPlantingDateIndex];
      newPlantingDate.plantingType = oldPlantingDate.plantingType;
      newPlantingDate.datePlanted = oldPlantingDate.datePlanted;
      pd[index] = newPlantingDate;
    } else {
      pd.push(newPlantingDate);
    }
  });
  return pd;
}

export function getUniqueVeggieIdsFromGrid(
  userGarden: UserGarden,
  activeGridType: GridType
) {
  const grid = getGridFromGridType(activeGridType, userGarden);

  const veggieIds = [...new Set(grid)] || [];
  return veggieIds;
}

export function getGridFromGridType(
  gridType: GridType,
  userGarden: UserGarden
) {
  if (gridType === GridType.spring) return userGarden?.gridSpring || [];
  if (gridType === GridType.summer) return userGarden?.gridSummer || [];
  if (gridType === GridType.autumnWinter)
    return userGarden?.gridAutumnWinter || [];

  return [];
}

export function getStepsFromGridType(
  gridType: GridType,
  userGarden: UserGarden
) {
  if (gridType === GridType.spring) return userGarden?.springVeggieSteps || {};
  if (gridType === GridType.summer) return userGarden?.summerVeggieSteps || {};
  if (gridType === GridType.autumnWinter)
    return userGarden?.autumnWinterVeggieSteps || {};

  return {};
}

export function getPlantingDatesFromGridType(
  gridType: GridType,
  userGarden: UserGarden
) {
  if (gridType === GridType.spring)
    return userGarden?.springPlantingDates || [];
  if (gridType === GridType.summer)
    return userGarden?.summerPlantingDates || [];
  if (gridType === GridType.autumnWinter)
    return userGarden?.autumnWinterPlantingDates || [];

  return [];
}
