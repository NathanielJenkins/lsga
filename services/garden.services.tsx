import UserGardens, { getUserGardens } from "../models/UserGardens";

export const userGardenService = {
  updateGardens,
};

async function updateGardens(): Promise<UserGardens[]> {
  return await getUserGardens();
}
