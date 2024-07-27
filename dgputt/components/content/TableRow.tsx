import { useContext, useEffect, useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import GameContext from "@/app/context/gameContext";
import Checkbox from "../UI/checkbox";
import { rowData } from "@/app/models/rowData"
import config from "@/gameconfig.json";

export default function TableRow(props: { rowIndex: number }) {
  const ctx = useContext(GameContext);
  const [makeCount, setMakeCount] = useState(0);
  const [bonuses, setBonuses] = useState([false, false, false]);

  const rowScore = useMemo(() => {
    let total: number = props.rowIndex == (config.numRows - 1) ? (makeCount * 2) : makeCount;
    
    bonuses.forEach((bonus, index) => {
      if (bonus) total += config.bonusScores[props.rowIndex][index];
    });
    
    return total;
  }, [makeCount, bonuses]);

  function subtractMakeCount() {
    setMakeCount((prevCount: number) => {
      let newCount =  Math.max(prevCount - 1, 0);
      propagateChanges({ makeCount: newCount, bonuses });
      return newCount;
    });    
  }

  function addMakeCount() {
    setMakeCount((prevCount: number) => {
      let newCount = Math.min(prevCount + 1, 10);
      propagateChanges({ makeCount: newCount, bonuses });
      return newCount;
    });
    
  }

  function toggleBonus(bonusIndex: number) {
    setBonuses((oldBonuses: Array<boolean>) => {
      let newBonuses = oldBonuses.slice();
      newBonuses[bonusIndex] = !newBonuses[bonusIndex];
      propagateChanges({ makeCount, bonuses: newBonuses });
      return newBonuses;
    });
  }

  function propagateChanges(rowData: rowData) {
    ctx.updateGame(props.rowIndex, rowData);
  }

  useEffect(() => {
    const rowData = ctx.gameData[ctx.roundIndex][props.rowIndex]
    if (rowData != null) {
      setMakeCount(rowData.makeCount);
      setBonuses(rowData.bonuses.slice());
    } else {
      setMakeCount(0);
      setBonuses([false, false, false]);
    }
  }, [ctx.gameData[ctx.roundIndex]]);

  return (
    <View style={{display: "flex", flexDirection: "row", backgroundColor: "#ddd", height: 70, borderBottomColor: "black", borderBottomWidth: 2}}>
      <View style={{flex: 1, flexDirection: "row"}}>
        <Pressable 
          onPress={subtractMakeCount}
          style={{width: 14, backgroundColor: "red", alignItems: "center", justifyContent: "center" }}>
          <Text style={{fontSize: 20, color: "white"}}>-</Text>
        </Pressable>
        <View>
          <View>
          <Text>{(props.rowIndex+2)*5}'</Text>
          </View>
          <View style={{width: 50, display: "flex", alignItems: "center", justifyContent: "center"}}>
            <Text style={{fontSize: 24, marginTop: 4}}>{makeCount}</Text>
          </View>
        </View>
        <Pressable 
          onPress={addMakeCount}
          style={{width: 14, backgroundColor: "red", alignItems: "center", justifyContent: "center" }}>
          <Text style={{fontSize: 20, color: "white"}}>+</Text>
        </Pressable>
        <View style={{paddingHorizontal: 15, width: 125}}>
          <View style={{height: "50%", display: "flex", flexDirection: "row", gap: 5, alignItems: "center", justifyContent: "space-between"}}>
            <Text>First in +{config.bonusScores[props.rowIndex][0]}</Text>
            <Checkbox size={15} onCheck={() => toggleBonus(0)}></Checkbox>
          </View>
          <View style={{height: "50%", display: "flex", flexDirection: "row", gap: 5, alignItems: "center", justifyContent: "space-between"}}>
            <Text>Last in +{config.bonusScores[props.rowIndex][1]}</Text>
            <Checkbox size={15} onCheck={() => toggleBonus(1)}></Checkbox>
          </View>   
        </View>
        <View style={{paddingHorizontal: 15, display: "flex", flexShrink: 1, justifyContent: "center", gap: 5}}>
            <Text>All made</Text>
            <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
            <Text>+{config.bonusScores[props.rowIndex][2]}</Text>
            <Checkbox size={15} onCheck={() => toggleBonus(2)}></Checkbox>
            </View>
            
          
          </View>
        <View style={{backgroundColor: "red", width: 64, display: "flex", alignItems: "center", justifyContent: "center"}}>
          <Text style={{fontSize: 24}}>{rowScore}</Text>
        </View>
      </View>
    </View>
  )
}