/** @format */

import {
  PrimaryButton,
  TextButton,
  ImageButton
} from "../../components/common/Button";
import { RootStackScreenProps } from "../../types";
import { Input } from "../../components/common/Input";
import { SofiaRegularText } from "../../components/StyledText";
import { EntrySlot } from "../slots/EntrySlot";
import Spinner from "../../components/common/Spinner";

import { StyleSheet, Text, View } from "react-native";
import { tw } from "../../components/Themed";
import React, { useEffect, useState } from "react";

import { auth } from "../../firebase/firebaseTooling";
import { useUser } from "../../hooks/useAuth";
export function LoginScreen({ navigation }: RootStackScreenProps<"Login">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useUser();

  const handleUserLogin = async () => {
    try {
      setLoading(true);
      const user = await auth.signInWithEmailAndPassword(email, password);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  return !loading ? (
    <EntrySlot>
      <View style={tw`flex`}>
        <SofiaRegularText style={tw`text-gray-500 mb-4`}>
          Login to start planning your next garden
        </SofiaRegularText>
        <Input
          style={tw`mb-4`}
          value={email}
          handleOnChangeText={setEmail}
          placeholder="email"
        />
        <Input
          style={tw`mb-4`}
          value={password}
          handleOnChangeText={setPassword}
          placeholder="password"
          secureTextEntry={true}
        />

        <PrimaryButton title="Login" onPress={handleUserLogin} />
        <SofiaRegularText
          style={tw`text-red-500 justify-center text-center mt-2`}>
          {error}
        </SofiaRegularText>
        <View
          style={tw`border border-2 flex-1 border-gray-300 rounded mt-4`}></View>
        <View style={tw.style("mt-4 items-center")}>
          <View style={tw`text-gray-500 my-4 flex flex-row `}>
            <SofiaRegularText style={tw`text-gray-500 `}>
              Don't have an account?{" "}
            </SofiaRegularText>
            <TextButton
              title="Sign up"
              onPress={() => navigation.navigate("CreateAccount")}
            />
          </View>
        </View>
        <View style={tw.style("mt-4 items-center")}>
          <View style={tw`text-gray-500 my-4 flex flex-row `}>
            <SofiaRegularText style={tw`text-gray-500 `}>
              Don't have an account?{" "}
            </SofiaRegularText>
            <TextButton
              title="Sign up"
              onPress={() => navigation.navigate("CreateAccount")}
            />
          </View>
        </View>
      </View>
    </EntrySlot>
  ) : (
    <Spinner />
  );
}

const styles = StyleSheet.create({});
