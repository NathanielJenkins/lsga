/** @format */

import { auth } from "./../firebase/firebaseTooling";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export const useUser = () => {
  const navigation = useNavigation();

  const us = useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        // perform a request to grab and set all the user information on the state
        navigation.reset({
          index: 0,
          routes: [{ name: "Root" }]
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "CreateAccount" }]
        });
      }
    });

    return us;
  }, []);
};
