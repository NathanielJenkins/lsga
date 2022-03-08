/** @format */

import { parseInt } from "lodash";
import { Month } from "./Veggie";
import axios from "axios";
import { useDispatch } from "react-redux";
import { auth, firestore } from "../firebase/firebaseTooling";
import { store } from "../store";
import Documents from "./Documents";
import { deleteAllUserGardens } from "./UserGardens";
import { useNavigation } from "@react-navigation/native";
import geofire from "geofire-common";
import { getClosestFrostDate, getDateFromFrostDate } from "./FrostDate";

const ref = firestore.collection("user_properties");

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
export default interface UserProperties {
  [properties.springFrostDate]: FrostDateParsed;
  [properties.fallFrostDate]: FrostDateParsed;
}

class properties {
  public static readonly springFrostDate = "springFrostDate";
  public static readonly fallFrostDate = "fallFrostDate";
}

/** @format */

export class FrostDateParsed {
  public day: number;
  public month: Month;
  public date: string;

  constructor(date: Date) {
    this.day = date.getDate();
    this.month = monthNames[date.getMonth()];
    this.date = date.toISOString();
  }
}

export const setUserProperties = async () => {
  const userId = auth.currentUser.uid;
  const doc = await ref.doc(userId).get();
  if (doc.exists) return doc.data();
  else return null;
};

export const setFrostDateFromLngLat = async (lon: number, lat: number) => {
  const frostDate = await getClosestFrostDate(lon, lat);

  if (!frostDate)
    return {
      springFrostDate: null,
      fallFrostDate: null
    };

  const dates = getDateFromFrostDate(frostDate);
  const springFrostDate = new FrostDateParsed(dates.springFrostDate);
  const fallFrostDate = new FrostDateParsed(dates.fallFrostDate);

  updateFirebaseFrostDates(springFrostDate, fallFrostDate);

  return {
    springFrostDate,
    fallFrostDate
  };
};

export const setFrostDateFromDate = async (
  springDate: Date,
  fallDate: Date
) => {
  const springFrostDate = new FrostDateParsed(springDate);
  const fallFrostDate = new FrostDateParsed(fallDate);

  updateFirebaseFrostDates(springFrostDate, fallFrostDate);
};

export const updateFirebaseFrostDates = (
  springFrostDate: FrostDateParsed,
  fallFrostDate: FrostDateParsed
) => {
  // update the user properties object
  const userId = auth.currentUser.uid;
  const userProperties = { ...store.getState().user };

  userProperties.fallFrostDate = { ...fallFrostDate };
  userProperties.springFrostDate = { ...springFrostDate };
  ref.doc(userId).set(userProperties);

  return { springFrostDate, fallFrostDate };
};

export const deleteAccount = async () => {
  // delete all the images associated with the user
  await deleteAllUserGardens();

  auth.currentUser.delete();
  auth.signOut();
};
