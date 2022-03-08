/** @format */

import { firestore, storage } from "../firebase/firebaseTooling";
import { store } from "../store";
import Documents from "./Documents";
import Task from "./Task";
import { FrostDateParsed } from "./UserProperties";
import { PlantingDate } from "./UserGardens";
import moment from "moment";
export class Season {
  public static readonly Spring = "Spring";
  public static readonly Summer = "Summer";
  public static readonly Winter = "Winter";
  public static readonly Autumn = "Autumn";
}

export class Month {
  public static readonly January = "January";
  public static readonly February = "February";
  public static readonly March = "March";
  public static readonly April = "April";
  public static readonly May = "May";
  public static readonly June = "June";
  public static readonly July = "July";
  public static readonly August = "August";
  public static readonly September = "September";
  public static readonly October = "October";
  public static readonly November = "November";
  public static readonly December = "December";
}

export default interface Veggie {
  name: string;
  url: string;
  downloadUrl?: string;
  color: string;

  displayName: string;
  seasons: Array<Season>;
  directSeed: Array<Month>;
  startIndoors: Array<Month>;
  transplantOutdoors: Array<Month>;
  seedingNotes: string;
  earliestPlantingFromLastFrostDate: number;
  latestPlantingFromFirstFrostDate: number;
  spacingPerSquareFoot: number;
  sunlight: [number, number];
  companions: Array<string>;
  exclusions: Array<string>;
  whenToHarvest: Array<Month>;
  daysToMaturity: [number, number];
  howToHarvest: string;
  whatCropsToPlantAfter: Array<string>;
  stepsToSuccess: Array<Task>;
  [properties.directSeedSteps]: Array<Task>;
  [properties.indoorsSeedSteps]: Array<Task>;
}

class properties {
  public static readonly directSeedSteps = "directSeedSteps";
  public static readonly indoorsSeedSteps = "indoorsSeedSteps";
}

const ref = firestore.collection(Documents.Veggies);

export const getAllVeggies = async () => {
  const snapshot = await ref.get();

  const veggies: { [name: string]: Veggie } = {};
  for (let doc of snapshot.docs) {
    const veggie = { ...(doc.data() as Veggie) };

    if (!veggie.downloadUrl) {
      const url = await storage
        .ref(veggie.url) //name in storage in firebase console
        .getDownloadURL();

      veggie.downloadUrl = url;
    }
    veggies[veggie.name] = veggie;
  }
  return veggies;
};

export const getPlantingRangeFromUserFrostDates = (
  veggie: Veggie,
  springFrostDate: FrostDateParsed,
  fallFrostDate: FrostDateParsed
): PlantingDate => {
  try {
    // get the frost dates from the user
    const {
      latestPlantingFromFirstFrostDate,
      earliestPlantingFromLastFrostDate
    } = veggie;

    if (
      !latestPlantingFromFirstFrostDate ||
      !earliestPlantingFromLastFrostDate ||
      !springFrostDate ||
      !fallFrostDate
    )
      return { veggieName: null, first: null, last: null };

    const f = moment(springFrostDate.date).add(latestPlantingFromFirstFrostDate, 'd'); //prettier-ignore
    const l = moment(fallFrostDate.date).subtract(earliestPlantingFromLastFrostDate, 'd'); //prettier-ignore

    return {
      veggieName: veggie.name,
      first: f.toISOString(),
      last: l.toISOString()
    };
  } catch (error) {
    console.error(error);
    return { veggieName: null, first: null, last: null };
  }
};

export const getStepsToSuccessByPlantingType = (
  veggie: Veggie,
  plantingType: PlantingType
) => {
  switch (plantingType) {
    case properties.directSeedSteps:
      return veggie[properties.directSeedSteps];

    case properties.indoorsSeedSteps:
      return veggie[properties.indoorsSeedSteps];

    default:
      return [];
  }
};

export class PlantingType {
  public static readonly [properties.directSeedSteps] =
    properties.directSeedSteps;
  public static readonly [properties.indoorsSeedSteps] =
    properties.indoorsSeedSteps;
}

export class VeggieState {
  public static readonly Compatible = "Compatible";
  public static readonly Incompatible = "Incompatible";
  public static readonly Pending = "Pending";

  public static readonly None = "None";
}
