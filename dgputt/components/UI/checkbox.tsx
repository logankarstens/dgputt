import { useState } from "react";
import { Pressable } from "react-native";

export default function Checkbox(props: { size: number, onCheck: Function}) {
  const [checked, setChecked] = useState(false);
  function toggleCheckbox() {
    setChecked(c => {
      const result: boolean = !c;
      props.onCheck(result);
      return result;
    });
  }
  
  return (
    <Pressable
      onPress={toggleCheckbox}
      style={{backgroundColor: checked ? "red" : "rgba(0, 0, 0, 0.5)", width: props.size, height: props.size}}>
    </Pressable>
  );
}