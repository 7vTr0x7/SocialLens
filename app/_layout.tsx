import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { tokenCache } from "@/cache";
import { ClerkProvider } from "@clerk/clerk-expo";
import initialLayout from "../components/InitialLayout";
import InitialLayout from "../components/InitialLayout";
import { StatusBar } from "expo-status-bar";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
          <StatusBar style="light" backgroundColor="#000" />

          <InitialLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}

export default RootLayout;
``;
