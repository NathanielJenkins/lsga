/** @format */

import { GardenPack } from "../../models";

export const UPDATE_PACKS = "UPDATE_PACKS";

interface UpdatePacksAction {
  type: typeof UPDATE_PACKS;
  payload: Array<GardenPack>;
}

export type PacksActionTypes = UpdatePacksAction;
