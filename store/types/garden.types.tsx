import UserGarden from "models/UserGardens";

export const UPDATE_GARDENS = "UPDATE_GARDENS";

interface UpdateGardenAction {
  type: typeof UPDATE_GARDENS;
  payload: UserGarden[];
}

export type GardenActionTypes = UpdateGardenAction;
