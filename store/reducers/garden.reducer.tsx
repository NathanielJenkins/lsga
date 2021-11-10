/** @format */

import UserGarden from "../../models/UserGardens";
import {
  UPDATE_GARDENS,
  UPDATE_ACTIVE_GARDEN,
  NEW_GARDEN,
  GardenActionTypes
} from "../types";
interface GardenState {
  gardens: UserGarden[];
  activeGarden: UserGarden;
}

const initialState: GardenState = {
  gardens: [],
  activeGarden: undefined
};

export function gardenReducer(
  state: GardenState = initialState,
  action: GardenActionTypes
): GardenState {
  console.log(action);

  switch (action.type) {
    case UPDATE_GARDENS: {
      return {
        ...state,
        gardens: [...action.payload]
      };
    }
    case UPDATE_ACTIVE_GARDEN: {
      return {
        ...state,
        activeGarden: { ...action.payload }
      };
    }
    case NEW_GARDEN: {
      return {
        ...state,
        gardens: [...state.gardens, { ...action.payload }]
      };
    }

    default:
      return state;
  }
}
