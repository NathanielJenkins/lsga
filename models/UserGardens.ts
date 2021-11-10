/** @format */

import Garden from "./Garden";
import { auth, firestore, storage } from "../firebase/firebaseTooling";
import Documents from "./Documents";
import Veggie from "./Veggie";

const ref = firestore.collection(Documents.UserGardens);

export default interface UserGarden {
  [properties.userId]?: string;
  [properties.url]?: string;
  [properties._name]?: string;
  [properties.description]?: string;
  [properties.garden]?: Garden;
  [properties.grid]?: Array<Veggie | null>;
}

class properties {
  public static readonly userId = "userId";
  public static readonly garden = "garden";
  public static readonly url = "url";
  public static readonly _name = "name";
  public static readonly description = "description";
  public static readonly grid = "grid";
}

export const addUserGarden = async (userGarden: UserGarden) => {
  const blob = await (await fetch(userGarden.url)).blob();
  const newUrl = `${auth.currentUser.uid}/${encodeURIComponent(
    userGarden.name
  )}`;

  await storage.ref().child(newUrl).put(blob);

  userGarden.userId = auth.currentUser?.uid;
  userGarden.url = newUrl;

  userGarden.grid = [
    ...Array(userGarden.garden.height * userGarden.garden.width).keys()
  ].map(() => null);
  await ref.doc().set(userGarden);
  return userGarden;
};

export const getUserGardens = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) return [];

  const snapshot = await ref.where(properties.userId, "==", userId).get();

  const gardens: Array<UserGarden> = new Array();
  snapshot.forEach(doc => gardens.push(doc.data() as UserGarden));
  return gardens;
};
