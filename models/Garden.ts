/** @format */

import { firestore } from "../firebase/firebaseTooling";
import Documents from "./Documents";

const gardenRef = firestore.collection(Documents.Gardens);

class properties {
  public static readonly _displayName = "displayName";
  public static readonly _id = "id";
  public static readonly _height = "height";
  public static readonly _width = "width";
  public static readonly _img = "img";
}

export default interface Garden {
  [properties._id]: string;
  [properties._displayName]: string;
  [properties._height]: number;
  [properties._width]: number;
  [properties._img]: string;
}

export const getGardenByPropId = async (id: string) => {
  const snapshot = await gardenRef
    .where(properties._id, "==", id)
    .limit(1)
    .get();

  return snapshot.docs[0].data();
};

export const getAllGardens = async () => {
  const snapshot = await gardenRef.get();

  const gardens: Array<Garden> = new Array();
  snapshot.forEach(doc => gardens.push(doc.data() as Garden));
  return gardens;
};

export const getGardenById = async (gardenId: string) => {
  const snapshot = await gardenRef.doc(gardenId).get();

  return snapshot.data();
};
