/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 * @format
 */

import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigation
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, Pressable, View } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import HomeScreen from "../screens/HomeScreen";
import GardenScreen from "../screens/gardens/GardenScreen";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";

import EntrySlot from "../screens/slots/EntrySlot";
import CreateAccountScreen from "../screens/auth/CreateAccountScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";
import { auth } from "../firebase/firebaseTooling";
import { brandColor, tw } from "../components/Themed";
import SetupGarden from "../screens/garden_setup/SetupGarden";
import ConfirmLocation from "../screens/garden_setup/ConfirmLocation";
import CameraPreview from "../screens/util/CameraPreview";
import Admin from "../screens/admin/Admin";
import Veggie from "../screens/gardens/VeggieScreen";
import { useDispatch } from "react-redux";
import { updateGardens, updateVeggies } from "../store";
import AllVeggiesScreen from "../screens/gardens/AllVeggiesScreen";
import GardenInfoScreen from "../screens/gardens/GardenInfoScreen";
import ArCamera from "../screens/garden_setup/ArCamera";
export default function Navigation({
  colorScheme
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer linking={LinkingConfiguration} theme={DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();
function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="CreateAccount"
        component={CreateAccountScreen}
        options={{ headerShown: false, animation: "none" }}
      />

      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Screen
        name="SetupGarden"
        component={SetupGarden}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConfirmLocation"
        component={ConfirmLocation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CameraPreview"
        component={CameraPreview}
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="Veggie"
        component={Veggie}
        options={{ headerShown: false, animation: "fade" }}
      />
      <Stack.Screen
        name="GardenScreen"
        component={GardenScreen}
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="GardenInfoScreen"
        component={GardenInfoScreen}
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="Admin"
        component={Admin}
        options={{ headerShown: false, animation: "none" }}
      />

      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();
function BottomTabNavigator() {
  const navigation = useNavigation<any>();

  const colorScheme = useColorScheme();
  const handleSignOut = () => {
    auth.signOut().then(() => navigation.replace("Login"));
  };
  return (
    <BottomTab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint
      }}>
      <BottomTab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={({ navigation }: RootTabScreenProps<"HomeScreen">) => ({
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerShown: false,
          tabBarActiveTintColor: brandColor
        })}
      />
      <BottomTab.Screen
        name="AllVeggiesScreen"
        component={AllVeggiesScreen}
        options={{
          title: "Veggies",
          tabBarIcon: ({ color }) => <TabBarIcon name="leaf" color={color} />,
          headerShown: false,
          tabBarActiveTintColor: brandColor
        }}
      />
      <BottomTab.Screen
        name="GardenInfoScreen"
        component={ArCamera}
        options={{
          title: "Setting",
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
          headerShown: false,
          tabBarActiveTintColor: brandColor
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return (
    <View style={tw.style("")}>
      <FontAwesome size={25} {...props} />
    </View>
  );
}
