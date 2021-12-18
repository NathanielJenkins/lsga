/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 *
 * @format
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Camera } from "expo-camera";
import { NativeSyntheticEvent, NativeTouchEvent } from "react-native";
import UserGarden from "./models/UserGardens";
import Veggie from "./models/Veggie";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
  Login: undefined;
  CreateAccount: undefined;
  ResetPassword: undefined;
  HomePage: undefined;
  SelectLocation: undefined;
  SetupGarden: undefined;
  ConfirmLocation: {
    newGardenState: [
      UserGarden,
      React.Dispatch<React.SetStateAction<UserGarden>>
    ];
  };
  GardenInformationStart: undefined;
  SelectPlanter: undefined;
  SunExposure: undefined;
  TypeOfSpace: undefined;
  NameGarden: undefined;
  GardenScreen: {
    garden?: UserGarden;
  };

  CameraPreview: {
    newGardenState: [
      UserGarden,
      React.Dispatch<React.SetStateAction<UserGarden>>
    ];
  };
  Veggie: {
    veggie: Veggie;
  };
  GardenInfoScreen: {};

  Admin: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
  HomeScreen: undefined;
  Gallery: undefined;
  AllVeggiesScreen: undefined;
  ScheduleScreen: undefined;
  GardenInfoScreen: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export const ActionTypes = {
  SET_USER: "SET_USER"
};
