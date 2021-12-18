/** @format */

import {
  FETCH_REQUEST,
  FETCH_FAILURE,
  CommonActionTypes,
  SET_LOADING
} from "../types";
import { ActionCreator, Dispatch } from "redux";
import { RootState } from "..";

export const request: ActionCreator<CommonActionTypes> = () => {
  return { type: FETCH_REQUEST };
};
export const failure: ActionCreator<CommonActionTypes> = (error: any) => {
  return { type: FETCH_FAILURE, payload: error };
};
export const loadingAction: ActionCreator<CommonActionTypes> = (
  loading: boolean
) => {
  return { type: SET_LOADING, payload: loading };
};

export function setLoading(loading: boolean) {
  return (dispatch: Dispatch) => {
    dispatch(loadingAction(loading));
  };
}
