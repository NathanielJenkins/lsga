/** @format */

import UserProperties from "../../models/UserProperties";
import {
  UserActionTypes,
  UPDATE_FROST_DATE,
  UPDATE_USER_PROPERTIES
} from "../types";

const initialState: UserProperties = {
  springFrostDate: undefined,
  fallFrostDate: undefined
};

export function userReducer(
  state: UserProperties = initialState,
  action: UserActionTypes
): UserProperties {
  switch (action.type) {
    case UPDATE_FROST_DATE: {
      return {
        ...state,
        springFrostDate: action.payload.springFrostDate,
        fallFrostDate: action.payload.fallFrostDate
      };
    }

    case UPDATE_USER_PROPERTIES: {
      return {
        ...action.payload
      };
    }

    default:
      return state;
  }
}
