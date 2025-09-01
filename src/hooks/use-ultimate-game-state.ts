"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Player, UltimateBoardState } from "@/lib/types";
import { checkUltimateWin, checkSmallWin } from "@/lib/ultimate-game-logic";

const createEmptyUltimateBoard = (): UltimateBoardState => {
  return Array(9).fill(null).map(() => Array(9).fill(null));
};

const createEmptyMainBoard = (): Player[] => {
  return Array(9).fill(null);
};

type UltimateHistory = {
  boards: UltimateBoardState;
  mainBoard: Player[];
  currentPlayer: Player;
  activeBoard: number | null;
}

export const useUltimateGameState = () => {
  const [boards, setBoards] = useState<UltimateBoardState>(createEmptyUltimateBoard());
  const [mainBoard, setMainBoard] = useState<Player[]>(createEmptyMainBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [activeBoard, setActiveBoard] = useState<number | null>(null);
  const [winner, setWinner] = useState<Player>(null);
  
  const [history, setHistory] = useState<UltimateHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const initializeGame = useCallback(() => {
    const initialBoards = createEmptyUltimateBoard();
    const initialMainBoard = createEmptyMainBoard();
    const initialPlayer = "X";
    const initialActiveBoard = null;

    setBoards(initialBoards);
    setMainBoard(initialMainBoard);
    setCurrentPlayer(initialPlayer);
    setActiveBoard(initialActiveBoard);
    setWinner(null);

    const initialHistory: UltimateHistory = {
      boards: initialBoards,
      mainBoard: initialMainBoard,
      currentPlayer: initialPlayer,
      activeBoard: initialActiveBoard,
    };
    setHistory([initialHistory]);
    setHistoryIndex(0);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const saveStateToHistory = useCallback((newState: Omit<UltimateHistory, 'winner'>) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const isDraw = useMemo(() => {
    if (winner) return false;
    // Game is a draw if all boards are won or drawn
    return mainBoard.every(cell => cell !== null);
  }, [mainBoard, winner]);

  const resetGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCellClick = useCallback((boardIndex: number, cellIndex: number) => {
    if (
      winner ||
      boards[boardIndex][cellIndex] ||
      mainBoard[boardIndex] ||
      (activeBoard !== null && activeBoard !== boardIndex)
    ) {
      return;
    }

    const newBoards = boards.map(b => [...b]) as UltimateBoardState;
    newBoards[boardIndex][cellIndex] = currentPlayer;
    setBoards(newBoards);

    const newMainBoard = [...mainBoard];
    const smallWin = checkSmallWin(newBoards[boardIndex]);
    if (smallWin) {
      newMainBoard[boardIndex] = currentPlayer;
      setMainBoard(newMainBoard);
    } else if (newBoards[boardIndex].every(cell => cell !== null)) {
      // Small board is a draw
      newMainBoard[boardIndex] = 'D' as Player; // Using 'D' for draw
      setMainBoard(newMainBoard);
    }

    const gameWinner = checkUltimateWin(newMainBoard);
    if (gameWinner) {
      setWinner(currentPlayer);
    }

    let nextActiveBoard: number | null = cellIndex;
    if (newMainBoard[cellIndex] !== null) {
      nextActiveBoard = null; // Next player can play anywhere
    }
    setActiveBoard(nextActiveBoard);

    const nextPlayer = currentPlayer === "X" ? "O" : "X";
    setCurrentPlayer(nextPlayer);

    saveStateToHistory({
      boards: newBoards,
      mainBoard: newMainBoard,
      currentPlayer: nextPlayer,
      activeBoard: nextActiveBoard,
    });

  }, [boards, mainBoard, currentPlayer, activeBoard, winner, saveStateToHistory]);
  
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const undo = useCallback(() => {
    if (canUndo) {
        const newIndex = historyIndex - 1;
        const previousState = history[newIndex];
        setHistoryIndex(newIndex);
        setBoards(previousState.boards);
        setMainBoard(previousState.mainBoard);
        setCurrentPlayer(previousState.currentPlayer);
        setActiveBoard(previousState.activeBoard);
        setWinner(null); // Reset winner as we go back in time
    }
  }, [canUndo, historyIndex, history]);

  const redo = useCallback(() => {
    if (canRedo) {
        const newIndex = historyIndex + 1;
        const nextState = history[newIndex];
        setHistoryIndex(newIndex);
        setBoards(nextState.boards);
        setMainBoard(nextState.mainBoard);
        setCurrentPlayer(nextState.currentPlayer);
        setActiveBoard(nextState.activeBoard);
        
        // Check for winner at this re-done state
        const gameWinner = checkUltimateWin(nextState.mainBoard);
        if(gameWinner) {
          setWinner(nextState.currentPlayer === 'X' ? 'O' : 'X');
        } else {
          setWinner(null);
        }
    }
  }, [canRedo, historyIndex, history]);

  return {
    boards,
    mainBoard,
    currentPlayer,
    activeBoard,
    winner,
    isDraw,
    handleCellClick,
    resetGame,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};
