import { useContext, useEffect, useMemo } from "react";
import { GestureResponderEvent, Pressable, Text, View } from "react-native";
import { useNavigation } from "expo-router";
import { RootStackParamList } from "@/app/models/RootStackParamList"
import GameContext, { GameContextProvider } from "./context/gameContext";
import TableRow from "@/components/content/TableRow";
import config from "@/gameconfig.json";
import { button, title } from "@/styles/styles";

const navButtonStyle = button(0.8);
const buttonStyle = button();

const backButton = (callback: (event: GestureResponderEvent) => void) => (
  <Pressable 
    onPress={callback}
    style={{...navButtonStyle.container, width: "auto", marginTop: 0}}>
      <Text style={navButtonStyle.text}>Back</Text>
  </Pressable>
);

const nextButton = (callback: (event: GestureResponderEvent) => void) => (
  <Pressable 
    onPress={callback}
    style={{...navButtonStyle.container, width: "auto", marginTop: 0}}>
      <Text style={navButtonStyle.text}>Next</Text>
  </Pressable>
)

export default function PlayWrapper() {
  return (
    <GameContextProvider>
      <Play />
    </GameContextProvider>
  )
}

export function Play() {
  const ctx = useContext(GameContext);
  const navigation = useNavigation<RootStackParamList>();


  useEffect(() => {
    navigation.setOptions({
      title: `Round ${(ctx.roundIndex+1).toString()}/2`,
      headerLeft: () => backButton(() => {
        if (ctx.roundIndex == 0)
          navigation.navigate("index");
        else
          ctx.setRound((oldRound: number) => oldRound - 1);
      }),
      headerRight: () => nextButton(() => ctx.setRound((oldRound: number) => Math.min((oldRound + 1), config.numRounds-1)))
    });
  }, [ctx.roundIndex]);

  const saveGame = () => {
    if (ctx.saveGame()) {
      navigation.navigate("index");
    }
  }
  
  const calculateRoundScore = (roundIndex: number) => {
    let roundTotal: number = 0;
    ctx.gameData[ctx.roundIndex].forEach((row, rowIndex) => {
      if (row == null) return;
      roundTotal += rowIndex == (config.numRows-1) ? (row.makeCount*2) : row.makeCount;

      row.bonuses.forEach((bonus, bonusIndex) => {
        if (bonus) roundTotal += config.bonusScores[rowIndex][bonusIndex];
      });
    });

    return roundTotal;
  }
  
  const roundScore = useMemo(() => calculateRoundScore(ctx.roundIndex), [ctx.gameData[ctx.roundIndex]]);

  const totalScore = useMemo(() => {
    let total = 0;

    for (let i = 0; i < config.numRounds; i++)
      total += calculateRoundScore(i);

    return total;
  }, [ctx.gameData]);
  const rows = [];
  for (let i = 0; i < 5; i++) {
    rows.push(<TableRow key={i} rowIndex={i}/>);
  }

  return (
    <View style={{flex: 1, alignItems: "center"}}>
      <Text style={{ ...title, marginTop: 50 }}>Perfect Putt 360</Text>
      <View style={{width: "100%", padding: 20}}>
        {rows}
        <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 5}}>
          <View>
            <Pressable style={{...buttonStyle.container, width: "auto"}} onPress={ctx.clearRound}>
              <Text style={{...buttonStyle.text, maxHeight: 20}}>Clear Board</Text>
            </Pressable>
            {ctx.roundIndex == config.numRounds - 1 && (
              <Pressable style={{...buttonStyle.container, width: "auto"}} onPress={saveGame}>
                <Text style={{...buttonStyle.text, maxHeight: 20}}>Save Game</Text>
              </Pressable>
            )}
          </View>
          
          <View style={{marginLeft: "auto"}}>
            <View style={{display: "flex", flexDirection: "row", gap: 10}}>
              <Text style={{marginLeft: "auto", marginTop: 5}}>Score</Text>
              <View style={{backgroundColor: "red", width: 64, height: 70, display: "flex", alignItems: "center", justifyContent: "center"}}>
                <Text style={{fontSize: 24}}>{roundScore.toString()}</Text>
              </View>
            </View>
            {ctx.roundIndex == config.numRounds - 1 && (
              <View style={{display: "flex", flexDirection: "row", gap: 10}}>
              <Text style={{marginLeft: "auto", marginTop: 5}}>Total</Text>
              <View style={{backgroundColor: "red", width: 64, height: 70, display: "flex", alignItems: "center", justifyContent: "center"}}>
                <Text style={{fontSize: 24}}>{totalScore.toString()}</Text>
              </View>
            </View>
            )}
          </View>         
        </View>
      </View>
    </View>
  );
}