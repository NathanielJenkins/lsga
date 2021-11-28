/** @format */

import UserProperties, { FrostDateParsed } from "../../models/UserProperties";

export const UPDATE_FROST_DATE = "UPDATE_FROST_DATE";
export const UPDATE_USER_PROPERTIES = "UPDATE_USER_PROPERTIES";

interface UpdateFrostAction {
  type: typeof UPDATE_FROST_DATE;
  payload: { springFrostDate: FrostDateParsed; fallFrostDate: FrostDateParsed };
}

interface UpdateUserPropertiesAction {
  type: typeof UPDATE_USER_PROPERTIES;
  payload: UserProperties;
}

export type UserActionTypes = UpdateFrostAction | UpdateUserPropertiesAction;
