/** @format */

import { GridType } from "../../models";
import Garden from "../../models/Garden";
import UserGarden from "../../models/UserGardens";
import {
  UPDATE_GARDENS,
  UPDATE_ACTIVE_GARDEN,
  NEW_GARDEN,
  DELETE_GARDEN,
  GardenActionTypes,
  UPDATE_GARDEN_TYPES,
  UPDATE_ACTIVE_GRID
} from "../types";
interface GardenState {
  gardens: UserGarden[];
  gardenTypes: Garden[];
  activeGarden: UserGarden;
  activeGrid: GridType;
}

const initialState: GardenState = {
  gardens: [],
  gardenTypes: [],
  activeGarden: undefined,
  activeGrid: GridType.spring
};

export function gardenReducer(
  state: GardenState = initialState,
  action: GardenActionTypes
): GardenState {
  switch (action.type) {
    case UPDATE_GARDEN_TYPES: {
      return {
        ...state,
        gardenTypes: [...action.payload]
      };
    }
    case UPDATE_GARDENS: {
      return {
        ...state,
        gardens: [...action.payload]
      };
    }
    case UPDATE_ACTIVE_GARDEN: {
      return {
        ...state,
        activeGarden: action.payload ? { ...action.payload } : undefined
      };
    }
    case NEW_GARDEN: {
      return {
        ...state,
        gardens: [...state.gardens, { ...action.payload }]
      };
    }
    case DELETE_GARDEN: {
      return {
        ...state,
        gardens: state.gardens.filter(f => f.id !== action.payload.id)
      };
    }
    case UPDATE_ACTIVE_GRID: {
      return {
        ...state,
        activeGrid: action.payload
      };
    }

    default:
      return state;
  }
}
