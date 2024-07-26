import { Pressable, Text, View, StyleSheet } from "react-native";
import { title, button } from "../styles/styles";
import { useNavigation } from "expo-router";
import * as SecureStore from 'expo-secure-store';

async function setValue(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

async function getValue(key: string) {
  return await SecureStore.getItemAsync(key);
}

export default function Index() {
  const navigation = useNavigation();
  const buttonStyle = button();
  async function test() {
    console.log(await getValue("test") || "NO VALUE");
  }
  
  function play() {
    navigation.navigate("play");
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={title}>Perfect Putt 360</Text>
      <View style={{width: "100%", paddingHorizontal: 100}}>
        <Pressable onPress={play} style={buttonStyle.container}>
            <Text style={buttonStyle.text}>PLAY</Text>
        </Pressable>
        <Pressable style={buttonStyle.container}>
            <Text style={buttonStyle.text}>MATTY</Text>
        </Pressable>
        <Pressable onPress={test} style={buttonStyle.container}>
            <Text style={buttonStyle.text}>SCORES</Text>
        </Pressable>
      </View>    
    </View>
  );
}