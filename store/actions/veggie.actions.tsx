/** @format */

import { ActionCreator, Dispatch } from "redux";
import { request, failure } from "./common.actions";
import { UPDATE_VEGGIES, VeggieActionTypes } from "../types";
import UserGarden from "../../models/UserGardens";
import { useSelector } from "react-redux";
import { RootState } from "..";
import Veggie, { getAllVeggies } from "../../models/Veggie";

export function updateVeggies() {
  return (dispatch: Dispatch) => {
    // async action: uses Redux-Thunk middleware to return a function instead of an action creator
    dispatch(request());

    return getAllVeggies().then(
      response => {
        dispatch({ type: UPDATE_VEGGIES, payload: response });
      },
      error => {
        dispatch(failure("Server error."));
      }
    );
  };
}
