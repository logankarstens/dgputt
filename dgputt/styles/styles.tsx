import { StyleSheet } from "react-native";

export const title = {
    fontSize: 48,
    marginBottom: 20
}

export const button = (scale: number = 1) => StyleSheet.create({
    container: {
      backgroundColor: '#FF4444',
      width: '100%',
      paddingVertical: scale * 10,
      paddingHorizontal: scale * 20,
      marginTop: scale * 20,
      alignItems: 'center',
      borderRadius: 5
    },
    disabled: {
      backgroundColor: '#888',
      color: '#ccc'
    },
    text: {
      color: '#fff',
      fontSize: scale * 18,
      textAlign: 'center',
      fontWeight: 'bold'
    }
  });