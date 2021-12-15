/** @format */

import * as React from "react";
import { StyleSheet, View } from "react-native";
import { PrimaryButton } from "../../components/common/Button";
import Veggies from "../../assets/data/Veggies.json";
import Gardens from "../../assets/data/Gardens.json";

import { firestore, storage } from "../../firebase/firebaseTooling";
import Veggie from "../../models/Veggie";
import Documents from "../../models/Documents";
import { randomRgb } from "../../utils/Date";
export default function Admin() {
  const veggieRef = firestore.collection(Documents.Veggies);
  const handleImportVeggies = () => {
    Veggies.forEach(async v => {
      const url = await storage
        .ref(v.url) //name in storage in firebase console
        .getDownloadURL();

      const veg = { ...v } as unknown as Veggie;
      veg.color = randomRgb().toString();
      veg.downloadUrl = url;

      veggieRef.doc(veg.name).set(veg);
    });
  };

  const handleImportGardens = () => {
    const gardenRef = firestore.collection(Documents.Gardens);
    Gardens.forEach(v => gardenRef.doc(v.name).set(v));
  };

  return (
    <View style={styles.container}>
      <PrimaryButton title="Add Veggies" onPress={handleImportVeggies} />
      <PrimaryButton title="Add Gardens" onPress={handleImportGardens} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%"
  }
});
