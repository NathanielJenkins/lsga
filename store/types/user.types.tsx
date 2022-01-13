/** @format */

import UserProperties, { FrostDateParsed } from "../../models/UserProperties";

export const UPDATE_FROST_DATE = "UPDATE_FROST_DATE";
export const UPDATE_USER_PROPERTIES = "UPDATE_USER_PROPERTIES";
export const CLEAR_USER = "CLEAR_USER";

interface UpdateFrostAction {
  type: typeof UPDATE_FROST_DATE;
  payload: { springFrostDate: FrostDateParsed; fallFrostDate: FrostDateParsed };
}

interface UpdateUserPropertiesAction {
  type: typeof UPDATE_USER_PROPERTIES;
  payload: UserProperties;
}

interface ClearUser {
  type: typeof CLEAR_USER;
  payload: undefined;
}

export type UserActionTypes =
  | UpdateFrostAction
  | UpdateUserPropertiesAction
  | ClearUser;
