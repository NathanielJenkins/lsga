/** @format */

import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "./store/index";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import tw from "tailwind-react-native-classnames";
// import { initializedFirebaseApp } from "./firebaseTooling";

export default function App() {
  // initializedFirebaseApp();
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Provider store={store}>
          <Navigation colorScheme={colorScheme} />
          <StatusBar
            style={"dark"}
            backgroundColor="white"
            translucent={false}
          />
        </Provider>
      </SafeAreaProvider>
    );
  }
}
