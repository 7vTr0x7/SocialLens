import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}></Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default RootLayout;
