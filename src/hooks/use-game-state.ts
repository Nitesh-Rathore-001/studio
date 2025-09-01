"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { type Player } from "@/lib/types";
import { checkWin } from "@/lib/game-logic";
import type { GameSettings } from "@/components/game/GameSetup";

const createEmptyBoard = (size: number): Player[][] => {
  return Array(size).fill(null).map(() => Array(size).fill(null));
};

export const useGameState = (settings: GameSettings | null) => {
  const [board, setBoard] = useState<Player[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player>(null);
  const [winningCells, setWinningCells] = useState<number[][]>([]);
  const [history, setHistory] = useState<Player[][][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    if (settings) {
      const newBoard = createEmptyBoard(settings.gridSize);
      setBoard(newBoard);
      setHistory([newBoard]);
      setHistoryIndex(0);
      setWinner(null);
      setWinningCells([]);
      setCurrentPlayer("X");
    }
  }, [settings]);

  const isDraw = useMemo(() => {
    if (winner) return false;
    return board.every(row => row.every(cell => cell !== null));
  }, [board, winner]);

  const resetGame = useCallback(() => {
    if (settings) {
      const newBoard = createEmptyBoard(settings.gridSize);
      setBoard(newBoard);
      setHistory([newBoard]);
      setHistoryIndex(0);
      setWinner(null);
      setWinningCells([]);
      setCurrentPlayer("X");
    }
  }, [settings]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (board[row]?.[col] || winner || !settings) {
      return;
    }

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = currentPlayer;

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newBoard);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    setBoard(newBoard);

    const winInfo = checkWin(newBoard, currentPlayer, settings.winCondition);
    if (winInfo) {
      setWinner(currentPlayer);
      setWinningCells(winInfo.winningCells);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  }, [board, currentPlayer, winner, history, historyIndex, settings]);
  
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const undo = useCallback(() => {
    if (canUndo) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setBoard(history[newIndex]);
        setCurrentPlayer(newIndex % 2 === 0 ? "X" : "O");
        setWinner(null);
        setWinningCells([]);
    }
  }, [canUndo, historyIndex, history]);

  const redo = useCallback(() => {
    if (canRedo) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setBoard(history[newIndex]);
        setCurrentPlayer(newIndex % 2 === 0 ? "X" : "O");
        setWinner(null);
        setWinningCells([]);
    }
  }, [canRedo, historyIndex, history]);

  return {
    board,
    currentPlayer,
    winner,
    winningCells,
    isDraw,
    handleCellClick,
    resetGame,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};
