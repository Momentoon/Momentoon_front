import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React, { useState } from "react";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { Provider } from "react-redux";
import { createStore } from "redux";

let defaultStoreValue = {
  currentUser: "default",
};

function storeChanger(inputValue = defaultStoreValue, action: any) {
  if (action.type === "change") {
    let copy = inputValue;

    switch (action.payload.variableType) {
      case "currentUser":
        copy.currentUser = action.payload.changeData;
        break;
    }
    return copy;
  } else {
    return inputValue;
  }
}

let store = createStore(storeChanger);

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </Provider>
    );
  }
}
