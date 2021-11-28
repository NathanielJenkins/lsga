/** @format */

import { ActionCreator, Dispatch } from "redux";
import { request, failure } from "./common.actions";
import { UPDATE_FROST_DATE, UPDATE_USER_PROPERTIES } from "../types";

import { useSelector } from "react-redux";
import { RootState } from "..";
import {
  FrostDateParsed,
  setFrostDate,
  setUserProperties
} from "../../models/UserProperties";

export function updateFrostDates(lat: number, lon: number) {
  // check if an of the fields of the user garden are null
  return (dispatch: Dispatch) => {
    // async action: uses Redux-Thunk middleware to return a function instead of an action creator
    dispatch(request());

    return setFrostDate(lat, lon).then(
      response => {
        dispatch({
          type: UPDATE_FROST_DATE,
          payload: response
        });
      },
      error => {
        dispatch(failure("Server error"));
      }
    );
  };
}

export function updateUserProperties() {
  // check if an of the fields of the user garden are null
  return (dispatch: Dispatch) => {
    // async action: uses Redux-Thunk middleware to return a function instead of an action creator
    dispatch(request());

    return setUserProperties().then(
      response => {
        dispatch({
          type: UPDATE_USER_PROPERTIES,
          payload: response
        });
      },
      error => {
        dispatch(failure("Server error"));
      }
    );
  };
}
