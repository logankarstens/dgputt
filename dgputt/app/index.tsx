import { Pressable, Text, View, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import { RootStackParamList } from "./models/RootStackParamList";
import * as SecureStore from 'expo-secure-store';
import { title, button } from "../styles/styles";

export default function Index() {
  const navigation = useNavigation<RootStackParamList>();
  const buttonStyle = button();
  async function test() {
    console.log(SecureStore.getItem("gameHistory") ?? "NO VALUE");
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