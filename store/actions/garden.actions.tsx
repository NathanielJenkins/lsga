/** @format */

import { ActionCreator, Dispatch } from "redux";
import { request, failure, setLoading } from "./common.actions";
import {
  UPDATE_GARDENS,
  GardenActionTypes,
  NEW_GARDEN,
  UPDATE_ACTIVE_GARDEN,
  DELETE_GARDEN,
  UPDATE_GARDEN_TYPES,
  UPDATE_ACTIVE_GRID
} from "../types";
import UserGarden, {
  getUserGardens,
  deleteUserGarden,
  updateUserGarden,
  addUserGarden
} from "../../models/UserGardens";
import { useSelector } from "react-redux";
import { RootState } from "..";
import { loadingAction } from ".";
import { firestore } from "../../firebase/firebaseTooling";
import Documents from "../../models/Documents";
import { getAllGardens } from "../../models/Garden";
import { GridType } from "../../models";
const updateStoredGardensSuccess: ActionCreator<GardenActionTypes> = (
  gardens: UserGarden[]
) => {
  return { type: UPDATE_GARDENS, payload: gardens };
};

export function updateGardens() {
  return (dispatch: Dispatch, getState: () => RootState) => {
    // async action: uses Redux-Thunk middleware to return a function instead of an action creator

    dispatch(loadingAction(true));
    dispatch(request());

    return getUserGardens().then(
      response => {
        dispatch(updateStoredGardensSuccess(response));
        const { activeGarden } = getState().gardens;

        if (!activeGarden && response.length)
          dispatch(updateActiveGardenSuccess(response[0]));

        dispatch(loadingAction(false));
      },
      error => {
        dispatch(loadingAction(false));
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
    dispatch(loadingAction(true));
    dispatch(request());

    return addUserGarden(garden).then(
      response => {
        dispatch(addNewGardenSuccess(response));
        dispatch(updateActiveGardenSuccess(response));
        dispatch(loadingAction(false));
      },
      error => {
        console.error(error);
        dispatch(failure("Server error."));
        dispatch(loadingAction(false));
      }
    );
  };
}

export function deleteGarden(garden: UserGarden) {
  // check if an of the fields of the user garden are null

  return (dispatch: Dispatch, getState: () => RootState) => {
    // async action: uses Redux-Thunk middleware to return a function instead of an action creator
    dispatch(request());

    return deleteUserGarden(garden).then(
      response => {
        dispatch({ type: DELETE_GARDEN, payload: garden });
        const { activeGarden, gardens } = getState().gardens;
        if (activeGarden?.id === garden.id) {
          const garden = gardens?.length ? gardens[0] : null;
          dispatch(updateActiveGardenSuccess(garden));
        }
      },
      error => {
        console.error(error);
        dispatch(failure("Server error."));
      }
    );
  };
}

export function updateActiveUserGarden(
  garden: UserGarden,
  updateActive = true
) {
  return (dispatch: Dispatch, getState: () => RootState) => {
    // async action: uses Redux-Thunk middleware to return a function instead of an action creator
    dispatch(loadingAction(true));
    dispatch(request());

    return updateUserGarden(garden).then(
      response => {
        const gardens = [...getState().gardens.gardens];
        const oldGardenIndex = gardens?.findIndex(g => g.id === garden.id);

        if (oldGardenIndex !== -1) gardens[oldGardenIndex] = garden;

        dispatch(updateStoredGardensSuccess(gardens));
        updateActive && dispatch(updateActiveGardenSuccess(response));

        dispatch(loadingAction(false));
      },
      error => {
        dispatch(loadingAction(false));
        dispatch(failure("Server error."));
      }
    );
  };
}

export function updateGardenTypes() {
  return (dispatch: Dispatch) => {
    // async action: uses Redux-Thunk middleware to return a function instead of an action creator

    dispatch(request());

    return getAllGardens().then(
      response => {
        dispatch({ type: UPDATE_GARDEN_TYPES, payload: response });
      },
      error => {
        dispatch(failure("Server error."));
      }
    );
  };
}

export function updateActiveGrid(activeGrid: GridType) {
  return (dispatch: Dispatch) => {
    dispatch({ type: UPDATE_ACTIVE_GRID, payload: activeGrid });
  };
}
