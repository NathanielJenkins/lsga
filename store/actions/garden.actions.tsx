/** @format */

import { ActionCreator, Dispatch } from "redux";
import { request, failure } from "./common.actions";
import {
  UPDATE_GARDENS,
  GardenActionTypes,
  NEW_GARDEN,
  UPDATE_ACTIVE_GARDEN
} from "../types";
import UserGarden, {
  getUserGardens,
  addUserGarden,
  updateUserGarden
} from "../../models/UserGardens";
import { useSelector } from "react-redux";
import { RootState } from "..";

const updateStoredGardensSuccess: ActionCreator<GardenActionTypes> = (
  gardens: UserGarden[]
) => {
  return { type: UPDATE_GARDENS, payload: gardens };
};

export function updateGardens() {
  return (dispatch: Dispatch, getState: () => RootState) => {
    // async action: uses Redux-Thunk middleware to return a function instead of an action creator
    dispatch(request());

    return getUserGardens().then(
      response => {
        dispatch(updateStoredGardensSuccess(response));
        const { activeGarden } = getState().gardens;

        if (!activeGarden && response.length)
          dispatch(updateActiveGardenSuccess(response[0]));
      },
      error => {
        dispatch(failure("Server error."));
      }
    );
  };
}

const updateActiveGardenSuccess: ActionCreator<GardenActionTypes> = (
  activeGarden: UserGarden
) => {
  return { type: UPDATE_ACTIVE_GARDEN, payload: activeGarden };
};

export function updateActiveGarden(activeGarden: UserGarden) {
  return (dispatch: Dispatch) => {
    dispatch(updateActiveGardenSuccess(activeGarden));
  };
}

const addNewGardenSuccess: ActionCreator<GardenActionTypes> = (
  newGarden: UserGarden
) => {
  return { type: NEW_GARDEN, payload: newGarden };
};

export function addNewGarden(garden: UserGarden) {
  // check if an of the fields of the user garden are null

  return (dispatch: Dispatch, getState: () => RootState) => {
    // async action: uses Redux-Thunk middleware to return a function instead of an action creator
    dispatch(request());

    return addUserGarden(garden).then(
      response => {
        dispatch(addNewGardenSuccess(response));
        const { activeGarden } = getState().gardens;
        if (!activeGarden && response)
          dispatch(updateActiveGardenSuccess(response));
      },
      error => {
        console.error(error);
        dispatch(failure("Server error."));
      }
    );
  };
}

export function updateActiveUserGarden(garden: UserGarden) {
  return (dispatch: Dispatch, getState: () => RootState) => {
    // async action: uses Redux-Thunk middleware to return a function instead of an action creator
    dispatch(request());

    return updateUserGarden(garden).then(
      response => {
        const gardens = [...getState().gardens.gardens];
        const oldGardenIndex = gardens?.findIndex(g => g.name === garden.name);
        gardens[oldGardenIndex] = garden;

        dispatch(updateStoredGardensSuccess(gardens));
        dispatch(updateActiveGardenSuccess(response));
      },
      error => {
        console.error(error);
        dispatch(failure("Server error."));
      }
    );
  };
}
