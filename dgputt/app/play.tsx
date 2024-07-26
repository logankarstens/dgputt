import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import TableRow from "@/components/content/TableRow";
import { title } from "../styles/styles";
import * as SecureStore from 'expo-secure-store';

async function setValue(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

async function getValue(key: string) {
  return await SecureStore.getItemAsync(key);
}

export default function Index() {
  const [rowScores, setRowScores] = useState(new Array(5).fill(0));
  
  function setRowScore(rowIndex: number, score: number) {
    setRowScores(oldRowScores => {
      const newRowScores = oldRowScores.slice();
      newRowScores[rowIndex] = score;
      return newRowScores;
    });
  }

  async function test() {
    console.log(await getValue("test") || "NO VALUE");
  }

  const totalScore = useMemo(() => {
    return rowScores.reduce((a, b) => a + b, 0)
  }, [rowScores]);
  
  const rows = [];
  for (let i = 0; i < 5; i++) {
    rows.push(<TableRow key={i} rowNum={i} onScoreChange={(score: number) => setRowScore(i, score)}/>);
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center"
      }}
    >
      <Text style={title}>Play Putt 360</Text>
      <View style={{width: "100%", padding: 20}}>
      {rows}
      <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
        <View style={{marginLeft: "auto", backgroundColor: "red", width: 64, height: 70, display: "flex", alignItems: "center", justifyContent: "center"}}>
          <Text style={{fontSize: 24}}>{totalScore}</Text>
        </View>
      </View>
      </View>
      
    </View>
  );
}
