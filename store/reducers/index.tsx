/** @format */

import { combineReducers } from "redux";
import { gardenReducer } from "./garden.reducer";
import { veggieReducer } from "./veggie.reducer";
import { userReducer } from "./user.reducer";

export const rootReducer = combineReducers({
  gardens: gardenReducer,
  veggies: veggieReducer,
  user: userReducer
});

export type RootState = ReturnType<typeof rootReducer>;
