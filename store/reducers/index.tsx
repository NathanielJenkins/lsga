/** @format */

import { combineReducers } from "redux";
import { gardenReducer } from "./garden.reducer";
import { veggieReducer } from "./veggie.reducer";
export const rootReducer = combineReducers({
  gardens: gardenReducer,
  veggies: veggieReducer
});

export type RootState = ReturnType<typeof rootReducer>;
