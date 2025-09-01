"use client";

import React from "react";
import { Player, UltimateBoardState } from "@/lib/types";
import { SmallBoard } from "./SmallBoard";
import { cn } from "@/lib/utils";

type UltimateGameBoardProps = {
  boards: UltimateBoardState;
  mainBoard: Player[];
  onCellClick: (boardIndex: number, cellIndex: number) => void;
  activeBoard: number | null;
  disabled: boolean;
};

export function UltimateGameBoard({ boards, mainBoard, onCellClick, activeBoard, disabled }: UltimateGameBoardProps) {

  const getWinnerSymbol = (winner: Player) => {
    if (winner === 'X') {
      return (
        <svg viewBox="0 0 100 100" className="text-red-500 w-full h-full">
          <line x1="10" y1="10" x2="90" y2="90" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
          <line x1="90" y1="10" x2="10" y2="90" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
        </svg>
      );
    }
    if (winner === 'O') {
      return (
        <svg viewBox="0 0 100 100" className="text-blue-500 w-full h-full">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="10" fill="none" />
        </svg>
      );
    }
    return null;
  }

  return (
    <div
      className="grid grid-cols-3 grid-rows-3 gap-2 p-2 aspect-square w-full max-w-2xl bg-border rounded-lg shadow-lg"
    >
      {Array.from({ length: 9 }).map((_, boardIndex) => {
        const boardWinner = mainBoard[boardIndex];
        const isActive = activeBoard === null || activeBoard === boardIndex;

        return (
          <div
            key={boardIndex}
            className={cn(
              "relative bg-background rounded-md transition-all duration-300",
              !disabled && isActive && "bg-primary/10 ring-2 ring-primary",
              boardWinner && "bg-muted"
            )}
          >
            {boardWinner ? (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                {getWinnerSymbol(boardWinner)}
              </div>
            ) : (
               <SmallBoard
                board={boards[boardIndex]}
                boardIndex={boardIndex}
                onCellClick={onCellClick}
                disabled={disabled || !isActive}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
