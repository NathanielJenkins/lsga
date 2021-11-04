import Garden from "./Garden";
import { auth, firestore } from "../firebase/firebaseTooling";
import Documents from "./Documents";

const ref = firestore.collection(Documents.UserGardens);

export default interface UserGarden {
  [properties.userId]: string;
  [properties.garden]: Garden;
}

class properties {
  public static readonly userId = "userId";
  public static readonly garden = "garden";
}

export const setUserGarden = async (userGarden: UserGarden) => {
  const res = await ref.doc().set(userGarden);
};

export const getUserGardens = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId) return [];

  const snapshot = await ref.where(properties.userId, "==", userId).get();

  const gardens: Array<UserGarden> = new Array();
  snapshot.forEach(doc => gardens.push(doc.data() as UserGarden));
  return gardens;
};
