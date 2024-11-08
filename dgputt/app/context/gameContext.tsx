import { SetStateAction, useState } from 'react';
import React from 'react';
import { RowData } from '../models/Game';
import config from "@/gameconfig.json";
import * as SecureStore from 'expo-secure-store';

let gameContextValue: GameContextValue = {
  gameData: [],
  roundIndex: 0,
  setRound: (roundIndex: SetStateAction<number>) => {},
  updateGame: (rowIndex: number, rowData: RowData) => {},
  clearRound: () => {},
  saveGame: () => {}
}

const GameContext = React.createContext(gameContextValue);

export const GameContextProvider = (props: any) => {
  let emptyGameData: (RowData | null)[][] = new Array(config.numRounds).fill(new Array(config.numRows).fill(null));
  const [gameData, setGameData] = useState(emptyGameData);
  const [roundIndex, setRoundIndex] = useState(0);

  const updateGame = (rowIndex: number, rowData: RowData) => {
    setGameData((oldData: (RowData | null)[][]) => {
      let newData: (RowData | null)[][] = [];
      oldData.forEach(d => newData.push(d.slice()));

      if (rowData == null) {
        newData[roundIndex][rowIndex] = null;
      } else {
        newData[roundIndex][rowIndex] = {
          makeCount: rowData.makeCount,
          bonuses: rowData.bonuses.slice()
        };
      }

      return newData;
    })
  }

  const saveGame = () => {
    try {
      let gameHistory = [];

      const gameHistoryStringified = SecureStore.getItem("gameHistory");
      if (gameHistoryStringified) gameHistory = JSON.parse(gameHistoryStringified);

      console.log({
        date: new Date().toISOString().slice(0, 10),
        user: "Matty",
        game: gameData
      });

      return;
      gameHistory.push({
        date: new Date().toISOString().slice(0, 10),
        user: "Matty",
        game: gameData
      });

      SecureStore.setItem("gameHistory", JSON.stringify(gameHistory));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  const clearRound = () => {
    setGameData((oldData: (RowData | null)[][]) => {
      let newData: (RowData | null)[][] = [];
      oldData.forEach(d => newData.push(d.slice()));
      
      newData[roundIndex] = new Array(config.numRows).fill(null)

      return newData;
    });
  }

  gameContextValue = {
    gameData,
    roundIndex,
    setRound: setRoundIndex,
    updateGame,
    clearRound,
    saveGame
  };
  
  return (
    <GameContext.Provider value={gameContextValue}>
      {props.children}
    </GameContext.Provider>
  );
}

interface GameContextValue {
  gameData: RowData[][],
  roundIndex: number,
  setRound: (roundIndex: SetStateAction<number>) => void,
  updateGame: (rowIndex: number, rowData: RowData) => void,
  clearRound: () => void;
  saveGame: Function
};

export default GameContext;