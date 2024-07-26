import { useRef } from "react";
import { Stack } from "expo-router";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack/lib/typescript/src/types";
import { Text, Pressable } from "react-native";
import { button } from "../styles/styles";

const pageStacks = {
  "play": ["play"],
  "scores": ["scores"]
}
export default function RootLayout() {
  const navRef = useRef<any>(null);
  const buttonStyle = button(0.8);

  const backButton = (
    <Pressable 
      onPress={() => navRef?.current?.navigation?.navigate("index")}
      style={{...buttonStyle.container, width: "auto", marginTop: 0}}>
        <Text style={buttonStyle.text}>Back</Text>
    </Pressable>
  )

  const nextButton = (
    <Pressable 
      onPress={() => navRef?.current?.navigation?.navigate("index")}
      style={{...buttonStyle.container, width: "auto", marginTop: 0}}>
        <Text style={buttonStyle.text}>Next</Text>
    </Pressable>
  )
  
  return (
    <Stack screenOptions={(navigation: any) => {
      navRef.current = navigation;
    }}>
      <Stack.Screen name="index" options={{
        headerShown: false
      }} />
      <Stack.Screen name="play" options={{
        title: "",
        headerLeft: () => backButton,
        headerRight: () => nextButton
      }} />
    </Stack>
  );
}
