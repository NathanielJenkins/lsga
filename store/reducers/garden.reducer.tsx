import UserGarden from "models/UserGardens";
import { UPDATE_GARDENS, PostInterface, GardenActionTypes } from "../types";
interface GardenState {
  gardens: UserGarden[];
}

const initialState: GardenState = {
  gardens: [],
};

export function gardenReducer(
  state: GardenState = initialState,
  action: GardenActionTypes
): GardenState {
  switch (action.type) {
    case UPDATE_GARDENS: {
      return {
        ...state,
        gardens: action.payload,
      };
    }

    default:
      return state;
  }
}
