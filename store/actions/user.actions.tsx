/** @format */

import { ActionCreator, Dispatch } from "redux";
import { request, failure } from "./common.actions";
import {
  CLEAR_USER,
  UPDATE_FROST_DATE,
  UPDATE_USER_PROPERTIES
} from "../types";

import { useSelector } from "react-redux";
import { RootState } from "..";
import {
  deleteAccount,
  FrostDateParsed,
  setFrostDateFromDate,
  setFrostDateFromLngLat,
  setUserProperties,
  updateFirebaseFrostDates
} from "../../models/UserProperties";
import { loadingAction } from ".";

export function updateFrostDatesByLngLat(lat: number, lon: number) {
  // check if an of the fields of the user garden are null
  return (dispatch: Dispatch) => {
    // async action: uses Redux-Thunk middleware to return a function instead of an action creator
    dispatch(request());

    return setFrostDateFromLngLat(lat, lon).then(
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

export function updateFrostDatesFromDate(date: Date, type: "spring" | "fall") {
  return (dispatch: Dispatch, getState: () => RootState) => {
    let springFrostDate: FrostDateParsed, fallFrostDate: FrostDateParsed;
    if (type === "spring") {
      springFrostDate = new FrostDateParsed(date);
      fallFrostDate = getState().user.fallFrostDate;
    } else {
      springFrostDate = getState().user.springFrostDate;
      fallFrostDate = new FrostDateParsed(date);
    }

    // async action: uses Redux-Thunk middleware to return a function instead of an action creator
    dispatch(request());

    updateFirebaseFrostDates(springFrostDate, fallFrostDate);

    return dispatch({
      type: UPDATE_FROST_DATE,
      payload: { springFrostDate, fallFrostDate }
    });
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

export function deleteUser() {
  // check if an of the fields of the user garden are null
  return (dispatch: Dispatch) => {
    // async action: uses Redux-Thunk middleware to return a function instead of an action creator
    dispatch(request());
    dispatch(loadingAction(true));
    return deleteAccount().then(
      response => {
        dispatch(loadingAction(false));
      },
      error => {
        dispatch(failure("Server error"));
        dispatch(loadingAction(false));
      }
    );
  };
}
