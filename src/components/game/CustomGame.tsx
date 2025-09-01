"use client";

import React, { useState, useCallback, useMemo } from "react";
import { GameSetup, type GameSettings } from "./GameSetup";
import { GameBoard } from "./GameBoard";
import { GameInfo } from "./GameInfo";
import { GameControls } from "./GameControls";
import { WinAnimation } from "./WinAnimation";
import { useGameState } from "@/hooks/use-game-state";
import { Card, CardContent } from "@/components/ui/card";

export function CustomGame() {
  const [settings, setSettings] = useState<GameSettings | null>(null);

  const {
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
  } = useGameState(settings);

  const handleGameStart = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
  }, []);

  const handleNewGame = useCallback(() => {
    setSettings(null);
    resetGame();
  }, [resetGame]);
  
  const gameStarted = useMemo(() => !!settings, [settings]);

  if (!gameStarted) {
    return <GameSetup onStartGame={handleGameStart} />;
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {winner && <WinAnimation />}
      <Card className="w-full max-w-4xl">
        <CardContent className="p-4 md:p-6">
          <GameInfo
            currentPlayer={currentPlayer}
            winner={winner}
            isDraw={isDraw}
            gridSize={settings.gridSize}
          />
        </CardContent>
      </Card>

      <GameBoard
        board={board}
        onCellClick={handleCellClick}
        disabled={!!winner || isDraw}
        winningCells={winningCells}
      />

      <GameControls
        onReset={resetGame}
        onNewGame={handleNewGame}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
    </div>
  );
}
