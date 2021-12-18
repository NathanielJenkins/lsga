/** @format */

import { SET_LOADING, CommonActionTypes } from "../types";
interface CommonState {
  loading: boolean;
}

const initialState: CommonState = {
  loading: false
};

export function commonReducer(
  state: CommonState = initialState,
  action: CommonActionTypes
): CommonState {
  switch (action.type) {
    case SET_LOADING: {
      return {
        ...state,
        loading: action.payload
      };
    }

    default:
      return state;
  }
}
