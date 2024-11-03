import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
        headerShown: false,
        title: "Home"
      }} />
      <Stack.Screen name="play" options={{title: "New Game"}} />
      <Stack.Screen name="scores" options={{title: "High Scores"}} />
    </Stack>
  );
}
