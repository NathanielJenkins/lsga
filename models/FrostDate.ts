/** @format */

import { firestore } from "../firebase/firebaseTooling";
import { distanceBetween, geohashQueryBounds } from "geofire-common";
import { sortBy } from "lodash";
import moment from "moment";
export default interface FrostDate {
  name: string;
  lng: number;
  lat: number;
  title: string;
  lastFrostDateMonth: number;
  lastFrostDateDay: number;
  firstFrostDateMonth: number;
  firstFrostDateDay: number;
  geohash: string;
}

const ref = firestore.collection("frost_dates");

export const getClosestFrostDate = async (lon: number, lat: number) => {
  const center = [lat, lon];
  const radiusInM = 50 * 1000;

  // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
  // a separate query for each pair. There can be up to 9 pairs of bounds
  // depending on overlap, but in most cases there are 4.
  const bounds = geohashQueryBounds(center, radiusInM);
  const promises = [];
  for (const b of bounds) {
    const q = ref.orderBy("geohash").startAt(b[0]).endAt(b[1]);

    promises.push(q.get());
  }

  // Collect all the query results together into a single list
  return Promise.all(promises)
    .then(snapshots => {
      const matchingDocs = [];

      for (const snap of snapshots) {
        for (const doc of snap.docs) {
          const lat = doc.get("lat");
          const lng = doc.get("lng");

          // We have to filter out a few false positives due to GeoHash
          // accuracy, but most will match
          const distanceInKm = distanceBetween([lat, lng], center);
          const distanceInM = distanceInKm * 1000;
          if (distanceInM <= radiusInM) matchingDocs.push({ doc, distanceInM });
        }
      }

      return matchingDocs;
    })
    .then(matchingDocs => {
      // sort the matching docs by distance between
      matchingDocs = sortBy(matchingDocs, "distanceInM");

      // grab the closest
      const doc = matchingDocs[0]?.doc.data();

      return doc as FrostDate;
    });
};

export const getDateFromFrostDate = (frostDate: FrostDate) => {
  const springFrostDate = new Date();
  const fallFrostDate = new Date();

  springFrostDate.setMonth(frostDate.lastFrostDateMonth - 1);
  springFrostDate.setDate(frostDate.lastFrostDateDay);
  fallFrostDate.setMonth(frostDate.firstFrostDateMonth - 1);
  fallFrostDate.setDate(frostDate.firstFrostDateDay);

  return { springFrostDate, fallFrostDate };
};
