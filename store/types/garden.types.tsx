/** @format */

import UserGarden from "../../models/UserGardens";

export const UPDATE_GARDENS = "UPDATE_GARDENS";

interface UpdateGardenAction {
  type: typeof UPDATE_GARDENS;
  payload: UserGarden[];
}

export const UPDATE_ACTIVE_GARDEN = "UPDATE_ACTIVE_GARDEN";
interface UpdateActiveGardenAction {
  type: typeof UPDATE_ACTIVE_GARDEN;
  payload: UserGarden;
}

export const NEW_GARDEN = "NEW_GARDEN";

interface NewGardenAction {
  type: typeof NEW_GARDEN;
  payload: UserGarden;
}

export type GardenActionTypes =
  | UpdateGardenAction
  | NewGardenAction
  | UpdateActiveGardenAction;
