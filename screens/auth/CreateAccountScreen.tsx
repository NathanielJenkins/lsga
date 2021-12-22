/** @format */

import React, { useState } from "react";
import { StyleSheet, Text, View, KeyboardAvoidingView } from "react-native";
import { EntrySlot } from "../slots/EntrySlot";
import { Input } from "../../components/common/Input";
import Spinner from "../../components/common/Spinner";
import { SofiaRegularText } from "../../components/StyledText";
import {
  PrimaryButton,
  ImageButton,
  TextButton
} from "../../components/common/Button";
import { tw } from "../../components/Themed";
import { RootStackScreenProps } from "../../types";
import { auth } from "../../firebase/firebaseTooling";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setLoading } from "../../store";

export function CreateAccountScreen({
  navigation
}: RootStackScreenProps<"CreateAccount">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const { loading } = useSelector((state: RootState) => state.common);
  const dispatch = useDispatch();
  const handleUserSignUp = async () => {
    // check that the password and password confirm are the same
    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    dispatch(setLoading(true));
    try {
      await auth.createUserWithEmailAndPassword(email, password);
    } catch (error: any) {
      setError(error.message);
    }
    dispatch(setLoading(true));
  };

  return !loading ? (
    <EntrySlot>
      <View style={tw`flex`}>
        <SofiaRegularText style={tw`text-gray-500 mb-4`}>
          Create an Account
        </SofiaRegularText>

        <Input
          style={tw`mb-4`}
          value={email}
          handleOnChangeText={setEmail}
          placeholder="email"
          autoCapitalize="none"
          autoCorrect={false}
          autoCompleteType="email"
        />
        <Input
          style={tw`mb-4`}
          value={password}
          handleOnChangeText={setPassword}
          placeholder="password"
          autoCapitalize="none"
          secureTextEntry={true}
        />
        <Input
          style={tw`mb-4`}
          value={passwordConfirm}
          handleOnChangeText={setPasswordConfirm}
          placeholder="repeat password"
          autoCapitalize="none"
          secureTextEntry={true}
        />

        <PrimaryButton title="Create Account" onPress={handleUserSignUp} />
        <SofiaRegularText
          style={tw`text-red-500 justify-center text-center mt-2`}>
          {error}
        </SofiaRegularText>
        <View
          style={tw`border border-2 flex-1 border-gray-300 rounded mt-4`}></View>
        <View style={tw.style("mt-auto items-center")}>
          <View style={tw`text-gray-500 my-4 flex flex-row`}>
            <SofiaRegularText style={tw`text-gray-500 `}>
              Already have an account?{" "}
            </SofiaRegularText>
            <TextButton
              title="Log in"
              onPress={() => navigation.navigate("Login")}
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
