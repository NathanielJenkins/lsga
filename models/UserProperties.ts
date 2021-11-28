/** @format */

import { parseInt } from "lodash";
import { Month } from "./Veggie";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateFrostDates } from "../store/actions/user.actions";
import { auth, firestore } from "../firebase/firebaseTooling";
import { store } from "../store";
import Documents from "./Documents";

const ref = firestore.collection("user_properties");

export default interface UserProperties {
  [properties.springFrostDate]: FrostDateParsed;
  [properties.fallFrostDate]: FrostDateParsed;
}

class properties {
  public static readonly springFrostDate = "springFrostDate";
  public static readonly fallFrostDate = "fallFrostDate";
}

/** @format */

export interface Station {
  id: string;
  name: string;
  lat: string;
  lon: string;
  distance: string;
}

export interface FrostDateRaw {
  season_id: string;
  temperature_threshold: string;
  prob_90: string;
  prob_80: string;
  prob_70: string;
  prob_60: string;
  prob_50: string;
  prob_40: string;
  prob_30: string;
  prob_20: string;
  prob_10: string;
}

export const Spring = "1";
export const Fall = "2";

export class FrostDateParsed {
  public day: number;
  public month: Month;

  constructor(frostDateRaw: FrostDateRaw) {
    //take the 90th percentile
    const f = frostDateRaw.prob_90;
    const monthNumber = parseInt(f.slice(0, 2));
    const dayNumber = parseInt(f.slice(2, 4));
    const orderOfMonths = [
      Month.January,
      Month.February,
      Month.March,
      Month.April,
      Month.May,
      Month.June,
      Month.July,
      Month.August,
      Month.September,
      Month.October,
      Month.November,
      Month.December
    ];

    this.day = dayNumber;
    this.month = orderOfMonths[monthNumber];
  }
}

export const setUserProperties = async () => {
  const userId = auth.currentUser.uid;
  const doc = await ref.doc(userId).get();

  if (doc.exists) return doc.data();
  else return null;
};

const frostAx = axios.create({
  baseURL: "https://api.farmsense.net/v1/frostdates"
});
export const setFrostDate = async (lat: number, lon: number) => {
  const locationParams = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString()
  });

  const stationResponse = await frostAx.get("stations", {
    params: locationParams
  });
  if (stationResponse.status !== 200) return;

  const station: Station = stationResponse.data[0];

  // using the station id perform another request for the frost dates;
  const springFrostParams = new URLSearchParams({
    station: station.id,
    season: Spring
  });
  const fallFrostParams = new URLSearchParams({
    station: station.id,
    season: Fall
  });
  const [springFrostResponse, fallFrostResponse] = await Promise.all([
    frostAx.get("probabilities", { params: springFrostParams }),
    frostAx.get("probabilities", { params: fallFrostParams })
  ]);

  if (springFrostResponse.status !== 200 || fallFrostResponse.status !== 200)
    return;

  const springFrostDate = new FrostDateParsed(springFrostResponse.data[0]);
  const fallFrostDate = new FrostDateParsed(fallFrostResponse.data[0]);

  // update the user properties object
  const userId = auth.currentUser.uid;
  const userProperties = { ...store.getState().user };

  userProperties.fallFrostDate = { ...fallFrostDate };
  userProperties.springFrostDate = { ...springFrostDate };
  ref.doc(userId).set(userProperties);

  return {
    springFrostDate,
    fallFrostDate
  };
};
