/** @format */

import { firestore } from "../firebase/firebaseTooling";
import Documents from "./Documents";

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
  displayName: string;
  url: string;
  seasons: Array<Season>;
  directSeed: Array<Month>;
  startIndoors: Month;
  transplantOutdoors: Month;
  seedingNotes: string;
  earliestPlantingFromLastFrostDate: number;
  earliestPlaningFromFirstFrostDate: number;
  spacingPerSquareFoot: number;
  sunlight: [number, number];
  companions: Array<string>;
  exclusions: Array<string>;
  whenToHarvest: Array<Month>;
  daysToMaturity: [number, number];
  howToHarvest: string;
  whatCropsToPlantAfter: Array<string>;
}

const ref = firestore.collection(Documents.Veggies);

export const getAllVeggies = async () => {
  const snapshot = await ref.get();

  const veggies: Array<Veggie> = new Array();
  snapshot.forEach(doc => veggies.push(doc.data() as Veggie));
  return veggies;
};
