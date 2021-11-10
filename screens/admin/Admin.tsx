/** @format */

import * as React from "react";
import { StyleSheet, View } from "react-native";
import { PrimaryButton } from "../../components/common/Button";
import Veggies from "../../assets/data/Veggies.json";
import { firestore } from "../../firebase/firebaseTooling";
import Veggie from "../../models/Veggie";
import Documents from "../../models/Documents";
export default function Admin() {
  const veggieRef = firestore.collection(Documents.Veggies);
  const handleImportVeggies = () => {
    Veggies.forEach(v => veggieRef.doc(v.name).set(v));
  };

  const handleImportGardens = () => {};

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
