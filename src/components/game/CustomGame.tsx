
"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { GameSetup, type GameSettings } from "./GameSetup";
import { GameBoard } from "./GameBoard";
import { GameInfo } from "./GameInfo";
import { GameControls } from "./GameControls";
import { WinAnimation } from "./WinAnimation";
import { useGameState } from "@/hooks/use-game-state";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";


interface CustomGameProps {
  gameSettings: GameSettings;
}

export function CustomGame({ gameSettings }: CustomGameProps) {
  const [settings, setSettings] = useState<GameSettings | null>(gameSettings);
  const router = useRouter();

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
  
  // Update internal state if props change
  useEffect(() => {
    setSettings(gameSettings);
  }, [gameSettings]);


  const handleNewGame = useCallback(() => {
    // This should take the user back to the classic mode setup
    sessionStorage.removeItem('classicGameSettings');
    router.push('/classic');
  }, [router]);
  
  const gameStarted = useMemo(() => !!settings, [settings]);

  if (!gameStarted) {
    // This part should ideally not be reached if routing is correct
    return <GameSetup onStartGame={(newSettings) => setSettings(newSettings)} />;
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
            winCondition={settings.winCondition}
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

