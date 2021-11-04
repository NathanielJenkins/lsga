import { ActionCreator, Dispatch } from "redux";
import { userGardenService } from "../../services/garden.services";
import { request, failure } from "./common.actions";
import { UPDATE_GARDENS, GardenActionTypes } from "../types";
import UserGarden from "../../models/UserGardens";

const updateStoredGardensSuccess: ActionCreator<GardenActionTypes> = (
  gardens: UserGarden[]
) => {
  return { type: UPDATE_GARDENS, payload: gardens };
};

export function updateGardens() {
  return (dispatch: Dispatch) => {
    // async action: uses Redux-Thunk middleware to return a function instead of an action creator
    dispatch(request());
    return userGardenService.updateGardens().then(
      response => {
        dispatch(updateStoredGardensSuccess(response));
      },
      error => {
        dispatch(failure("Server error."));
      }
    );
  };
}
