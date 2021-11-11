/** @format */

import Veggie from "../../models/Veggie";

export const UPDATE_VEGGIES = "UPDATE_VEGGIES";

interface UpdateVeggiesAction {
  type: typeof UPDATE_VEGGIES;
  payload: { [name: string]: Veggie };
}

export type VeggieActionTypes = UpdateVeggiesAction;
