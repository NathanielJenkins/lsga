/** @format */

import { FontAwesome } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          "Space-Mono": require("../assets/fonts/SpaceMono-Regular.ttf"),
          "Sofia-Regular": require("../assets/fonts/Sofia-Pro-Regular.otf"),
          "Sofia-SemiBold": require("../assets/fonts/Sofia-Pro-Semi-Bold.otf"),
          "Sofia-Bold": require("../assets/fonts/Sofia-Pro-Bold.otf"),
          "Sofia-Medium": require("../assets/fonts/Sofia-Pro-Medium.otf")
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
