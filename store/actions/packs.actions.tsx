/** @format */

import { ActionCreator, Dispatch } from "redux";
import { request, failure } from "./common.actions";
import { UPDATE_PACKS, VeggieActionTypes } from "../types";
import { getAllGardenPacks } from "../../models";

export function updatePacks() {
  return (dispatch: Dispatch) => {
    // async action: uses Redux-Thunk middleware to return a function instead of an action creator
    dispatch(request());

    return getAllGardenPacks().then(
      response => {
        dispatch({ type: UPDATE_PACKS, payload: response });
      },
      error => {
        dispatch(failure("Server error."));
      }
    );
  };
}
