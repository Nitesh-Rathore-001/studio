"use client";

import React from "react";
import { UltimateGameBoard } from "./UltimateGameBoard";
import { GameInfo } from "../GameInfo";
import { GameControls } from "../GameControls";
import { WinAnimation } from "../WinAnimation";
import { useUltimateGameState } from "@/hooks/use-ultimate-game-state";
import { Card, CardContent } from "@/components/ui/card";

export function UltimateGame() {
  const {
    mainBoard,
    boards,
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
  } = useUltimateGameState();

  const handleNewGame = () => {
    // For now, it just resets. In the future, this could go to a setup screen.
    resetGame();
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {winner && <WinAnimation />}
      <Card className="w-full max-w-4xl">
        <CardContent className="p-4 md:p-6">
          <GameInfo
            currentPlayer={currentPlayer}
            winner={winner}
            isDraw={isDraw}
            gridSize={3} // Ultimate is always 3x3 main board
          />
        </CardContent>
      </Card>

      <UltimateGameBoard
        boards={boards}
        mainBoard={mainBoard}
        onCellClick={handleCellClick}
        activeBoard={activeBoard}
        disabled={!!winner || isDraw}
      />

      <GameControls
        onReset={resetGame}
        onNewGame={handleNewGame} // You might want a different function here
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
    </div>
  );
}
