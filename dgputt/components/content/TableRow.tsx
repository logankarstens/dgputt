import { useContext, useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import GameContext from "@/app/context/gameContext";
import Checkbox from "../UI/checkbox";
import { RowData } from "@/app/models/Game"
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

  function adjustMakeCount(adjustment: number) {
    setMakeCount((prevCount: number) => {
      let newCount = prevCount + adjustment, newBonuses = bonuses.slice();

      newCount = Math.max(newCount, 0);
      newCount = Math.min(newCount, config.numPutts);

      let rowData: RowData = { makeCount: newCount, bonuses: newBonuses };
      validateRowData("makeCount", rowData)
      propagateChanges(rowData);

      return newCount;
    });    
  }

  function assignMakeCount(newCountString: string) {
    let newCount: number = parseInt(newCountString) ?? 0;
    if (isNaN(newCount)) newCount = 0;

    setMakeCount(() => {
      let newBonuses = bonuses.slice();

      newCount = Math.max(newCount, 0);
      newCount = Math.min(newCount, config.numPutts);

      let rowData: RowData = { makeCount: newCount, bonuses: newBonuses };
      validateRowData("makeCount", rowData)
      propagateChanges(rowData);

      return newCount;
    });
  }

  function setBonus(bonusIndex: number, bonus: boolean) {
    setBonuses((oldBonuses: Array<boolean>) => {
      let newCount = makeCount, newBonuses = oldBonuses.slice();
      newBonuses[bonusIndex] = bonus;

      let rowData: RowData = { makeCount: newCount, bonuses: newBonuses };
      validateRowData("bonus" + bonusIndex.toString(), rowData)
      propagateChanges(rowData);

      return newBonuses;
    });
  }

  function validateRowData(changeType: string, row: RowData) {
    if (row == null) return;
    const firstLastTotal = 
      (row.bonuses[0] ? 1 : 0) +
      (row.bonuses[1] ? 1 : 0);

    switch (changeType) {
      case "bonus0":
      case "bonus1":
        if ((changeType == "bonus0" && !row.bonuses[0])
        || (changeType == "bonus1" && !row.bonuses[1])) {
          row.bonuses[2] = false;
          row.makeCount = Math.min(row.makeCount, config.numPutts - (2 - firstLastTotal));
        } else {
          row.makeCount = Math.max(row.makeCount, firstLastTotal);
        }
        break;
      case "bonus2":
        if (row.bonuses[2]) {
          row.makeCount = config.numPutts;
          row.bonuses[0] = true;
          row.bonuses[1] = true;
        } else {
          if (row.bonuses[0] && row.bonuses[1]) row.bonuses[1] = false;
          row.makeCount = Math.min(row.makeCount, config.numPutts - 1);
        }
        break;
      case "makeCount":
        row.bonuses[2] = false;
        if (row.makeCount == 0)
          row.bonuses = [false, false, false];
        else if (row.makeCount == config.numPutts)
          row.bonuses = [true, true, true];
        else if (row.makeCount == 1 && firstLastTotal == 2)
          row.bonuses[1] = false; 
        else if (row.makeCount == config.numPutts - 1 && firstLastTotal == 0)
          row.bonuses[0] = true;
        break;
    }
  }

  function propagateChanges(rowData: RowData) {
    ctx.updateGame(props.rowIndex, rowData);
  }

  useEffect(() => {
    const rowData = ctx.gameData[ctx.roundIndex][props.rowIndex];
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
      <View>
        {props.rowIndex == config.numRows - 1 && (
          <View style={{backgroundColor: "black"}}>
              <Text style={{color: "white", textAlign: "center"}}>{(props.rowIndex+2)*5}' PTS x2</Text>
            </View>
        )}
        <View style={{flex: 1, flexDirection: "row"}}>
          <Pressable 
            onPress={() => adjustMakeCount(-1)}
            style={{width: 14, backgroundColor: "red", alignItems: "center", justifyContent: "center" }}>
            <Text style={{fontSize: 20, color: "white"}}>-</Text>
          </Pressable>
          
          <View>
            {props.rowIndex < config.numRows - 1 && (
              <View>
                <Text>{(props.rowIndex+2)*5}'</Text>
              </View>
            )}
            
            <View style={{width: 50, display: "flex", alignItems: "center", justifyContent: "center", marginTop: props.rowIndex == config.numRows - 1 ? 6 : 0}}>
              {/*<Text style={{fontSize: 24, marginTop: 4}}>{makeCount}</Text>*/}
              <TextInput
                style={{fontSize: 24, marginTop: 4}}
                keyboardType="numeric"
                maxLength={2}
                value={makeCount.toString()}
                onChangeText={assignMakeCount}
              />
            </View>
          </View>
          <Pressable 
            onPress={() => adjustMakeCount(1)}
            style={{width: 14, backgroundColor: "red", alignItems: "center", justifyContent: "center" }}>
            <Text style={{fontSize: 20, color: "white"}}>+</Text>
          </Pressable>
        </View>
      </View>
      
      <View style={{flex: 1, flexDirection: "row"}}>
        <View style={{paddingHorizontal: 15, width: 125}}>
          <View style={{height: "50%", display: "flex", flexDirection: "row", gap: 5, alignItems: "center", justifyContent: "space-between"}}>
            <Text>First in +{config.bonusScores[props.rowIndex][0]}</Text>
            <Checkbox size={15} checked={bonuses[0]} onCheck={(bonus: boolean) => setBonus(0, bonus)}></Checkbox>
          </View>
          <View style={{height: "50%", display: "flex", flexDirection: "row", gap: 5, alignItems: "center", justifyContent: "space-between"}}>
            <Text>Last in +{config.bonusScores[props.rowIndex][1]}</Text>
            <Checkbox size={15} checked={bonuses[1]} onCheck={(bonus: boolean) => setBonus(1, bonus)}></Checkbox>
          </View>   
        </View>
        <View style={{paddingHorizontal: 15, display: "flex", flexShrink: 1, justifyContent: "center", gap: 5}}>
            <Text>All made</Text>
            <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
            <Text>+{config.bonusScores[props.rowIndex][2]}</Text>
            <Checkbox size={15} checked={bonuses[2]} onCheck={(bonus: boolean) => setBonus(2, bonus)}></Checkbox>
            </View>
          </View>
        <View style={{backgroundColor: "red", width: 64, display: "flex", alignItems: "center", justifyContent: "center"}}>
          <Text style={{fontSize: 24}}>{rowScore}</Text>
        </View>
      </View>
    </View>
  )
}