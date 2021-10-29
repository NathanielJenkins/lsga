import { auth } from "./../firebase/firebaseTooling";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export const useUser = () => {
  const navigation = useNavigation<any>();

  const us = useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) navigation.navigate("Root");
    });

    return us;
  }, []);
};
