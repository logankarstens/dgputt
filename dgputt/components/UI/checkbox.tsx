import { Pressable } from "react-native";

export default function Checkbox(props: { size: number, checked: boolean, onCheck: Function}) {
  function toggleCheckbox() {
    props.onCheck(!props.checked);
  }
  
  return (
    <Pressable
      onPress={toggleCheckbox}
      style={{backgroundColor: props.checked ? "red" : "rgba(0, 0, 0, 0.5)", width: props.size, height: props.size}}>
    </Pressable>
  );
}