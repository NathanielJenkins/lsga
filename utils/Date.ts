/** @format */

import { brandColorRBG } from "../components/Themed";

export function addDays(date: Date, days: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function randomRgb() {
  const brandColor = brandColorRBG;

  var o = Math.round,
    r = Math.random,
    s = 230;
  return `${o(r() * s)}, ${Math.round(Math.random() * 90 + 100)}, ${o(
    r() * s
  )}`;
}
