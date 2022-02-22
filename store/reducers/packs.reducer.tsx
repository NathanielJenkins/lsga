/** @format */

import { GardenPack } from "../../models";

import { PacksActionTypes, UPDATE_PACKS } from "../types";

interface PackState {
  packs: Array<GardenPack>;
}

const initialState: PackState = {
  packs: []
};

export function packReducer(
  state: PackState = initialState,
  action: PacksActionTypes
): PackState {
  switch (action.type) {
    case UPDATE_PACKS: {
      return {
        ...state,
        packs: action.payload
      };
    }

    default:
      return state;
  }
}
