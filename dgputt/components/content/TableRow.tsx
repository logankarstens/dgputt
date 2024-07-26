import { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import Checkbox from "../UI/checkbox";
//import styles from "../../styles/styles";

const bonusScores = [
  [2, 2, 5],
  [2, 3, 10],
  [3, 4, 15],
  [5, 6, 20],
  [8, 10, 25]
];

export default function TableRow(props: { rowNum: number, onScoreChange: Function }) {
  const [makeCount, setMakeCount] = useState(0);
  const [bonuses, setBonuses] = useState([false, false, false])

  const rowScore = useMemo(() => {
    let result: number = 0;
    if (props.rowNum == 4)
      result += (makeCount*2);
    else
      result += makeCount;
    
    bonuses.forEach((bonus, index) => {
      if (bonus) result += bonusScores[props.rowNum][index];
    });
    props.onScoreChange(result);
    return result;
  }, [makeCount, bonuses]);

  function subtractMakeCount() {
    setMakeCount(prevCount => Math.max(prevCount - 1, 0));
  }

  function addMakeCount() {
    setMakeCount(prevCount => Math.min(prevCount + 1, 5));
  }

  function toggleBonus(bonusIndex: number) {
    setBonuses(oldBonuses => {
      let newBonuses = oldBonuses.slice();
      newBonuses[bonusIndex] = !newBonuses[bonusIndex]
      return newBonuses;
    });
  }

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
          <Text>{(props.rowNum+2)*5}'</Text>
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
            <Text>First in +{bonusScores[props.rowNum][0]}</Text>
            <Checkbox size={15} onCheck={() => toggleBonus(0)}></Checkbox>
          </View>
          <View style={{height: "50%", display: "flex", flexDirection: "row", gap: 5, alignItems: "center", justifyContent: "space-between"}}>
            <Text>Last in +{bonusScores[props.rowNum][1]}</Text>
            <Checkbox size={15} onCheck={() => toggleBonus(1)}></Checkbox>
          </View>   
        </View>
        <View style={{paddingHorizontal: 15, display: "flex", flexShrink: 1, justifyContent: "center", gap: 5}}>
            <Text>All made</Text>
            <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
            <Text>+{bonusScores[props.rowNum][2]}</Text>
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