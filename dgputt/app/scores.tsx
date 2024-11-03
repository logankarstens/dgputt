import { useEffect, useState } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import { RootStackParamList } from "./models/RootStackParamList";
import { Game, GameData } from "./models/Game"
import * as SecureStore from "expo-secure-store";
import config from "@/gameconfig.json";
import { title, button } from "../styles/styles";

export default function Scores() {
  const [gameHistory, setGameHistory] = useState<Array<Game>>([]);
  const navigation = useNavigation<RootStackParamList>();
  const buttonStyle = button();

  const fetchGameHistory = () => {
    let historyString = SecureStore.getItem("gameHistory") ?? "[]"
    let history: Array<Game> = JSON.parse(historyString);
    history.sort((a, b) => calculateGameScore(b.game) - calculateGameScore(a.game));
    setGameHistory(history);
  }

  const calculateGameScore = (gameData: GameData) => {
    let gameTotal: number = 0;
    for (let i = 0; i < config.numRounds; i++) {
      gameData[i].forEach((row, rowIndex) => {
        if (row == null) return;
        gameTotal += rowIndex == (config.numRows-1) ? (row.makeCount*2) : row.makeCount;

        row.bonuses.forEach((bonus, bonusIndex) => {
          if (bonus) gameTotal += config.bonusScores[rowIndex][bonusIndex];
        });
      });
    }

    return gameTotal;
  }

  useEffect(fetchGameHistory, []);
  return (
    <View style={{ margin: 20, marginTop: 50, alignItems: "center", borderWidth: 2}}>
      <View style={{backgroundColor: "red", width: "100%", padding: 5}}><Text style={{textAlign: "center", color: "white", fontSize: 20, fontWeight: "bold"}}>High scores</Text></View>
      {gameHistory.map((game: Game, index: number) => (
        <View key={index} style={{display: "flex", flexDirection: "row", borderTopWidth: 2}}>
          <View style={{width: "45%", padding: 10,}}><Text style={{textAlign: "left", fontSize: 16}}>{game.user}</Text></View>
          <View style={{width: "20%", padding: 10, borderLeftWidth: 2, borderRightWidth: 2}}><Text style={{textAlign: "center", fontSize: 16}}>{calculateGameScore(game.game)}</Text></View>
          <View style={{padding: 10, flexGrow: 1}}><Text style={{textAlign: "center", fontSize: 16}}>{game.date}</Text></View>
        </View>
      ))}
    </View>
  );
}