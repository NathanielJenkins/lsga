/** @format */

import { combineReducers } from "redux";
import { gardenReducer } from "./garden.reducer";
import { veggieReducer } from "./veggie.reducer";
import { userReducer } from "./user.reducer";
import { commonReducer } from "./common.reducer";

export const rootReducer = combineReducers({
  gardens: gardenReducer,
  veggies: veggieReducer,
  user: userReducer,
  common: commonReducer
});

export type RootState = ReturnType<typeof rootReducer>;
