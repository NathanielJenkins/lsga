/** @format */

import Garden from "../../models/Garden";
import UserGarden from "../../models/UserGardens";

export const UPDATE_GARDEN_TYPES = "UPDATE_GARDEN_TYPES";

interface UpdateGardenTypesAction {
  type: typeof UPDATE_GARDEN_TYPES;
  payload: Garden[];
}

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

export const DELETE_GARDEN = "DELETE_GARDEN";
interface DeleteGardenAction {
  type: typeof DELETE_GARDEN;
  payload: UserGarden;
}
export type GardenActionTypes =
  | UpdateGardenAction
  | NewGardenAction
  | UpdateActiveGardenAction
  | DeleteGardenAction
  | UpdateGardenTypesAction;
