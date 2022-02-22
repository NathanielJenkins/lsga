/** @format */

import { Action, combineReducers } from "redux";
import { gardenReducer } from "./garden.reducer";
import { veggieReducer } from "./veggie.reducer";
import { userReducer } from "./user.reducer";
import { commonReducer } from "./common.reducer";
import { packReducer } from "./packs.reducer";

export const appReducer = combineReducers({
  gardens: gardenReducer,
  veggies: veggieReducer,
  user: userReducer,
  common: commonReducer,
  packs: packReducer
});

export type RootState = ReturnType<typeof appReducer>;

export const rootReducer = (state: RootState, action: Action) => {
  if (action.type === "USER_LOGOUT") {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};
