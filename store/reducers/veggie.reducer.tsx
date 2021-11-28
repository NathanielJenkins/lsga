/** @format */

import Veggie from "../../models/Veggie";
import { UPDATE_VEGGIES, VeggieActionTypes } from "../types";
interface VeggieState {
  veggies: { [name: string]: Veggie };
}

const initialState: VeggieState = {
  veggies: {}
};

export function veggieReducer(
  state: VeggieState = initialState,
  action: VeggieActionTypes
): VeggieState {
  switch (action.type) {
    case UPDATE_VEGGIES: {
      return {
        ...state,
        veggies: { ...state.veggies, ...action.payload }
      };
    }

    default:
      return state;
  }
}
