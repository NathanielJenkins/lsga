/** @format */

export const FETCH_REQUEST = "FETCH_REQUEST";
export const FETCH_FAILURE = "FETCH_FAILURE";
export const SET_LOADING = "SET_LOADING";

interface FetchRequestAction {
  type: typeof FETCH_REQUEST;
}

interface FetchFailureAction {
  type: typeof FETCH_FAILURE;
  payload: any;
}

interface SetLoading {
  type: typeof SET_LOADING;
  payload: boolean;
}

export type CommonActionTypes =
  | FetchRequestAction
  | FetchFailureAction
  | SetLoading;
