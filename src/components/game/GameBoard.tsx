"use client";

import React from "react";
import { type Player } from "@/lib/types";
import { Cell } from "./Cell";

type GameBoardProps = {
  board: Player[][];
  onCellClick: (row: number, col: number) => void;
  disabled: boolean;
  winningCells: number[][];
};

export function GameBoard({ board, onCellClick, disabled, winningCells }: GameBoardProps) {
  const gridSize = board.length;

  return (
    <div
      className="grid aspect-square w-full max-w-lg shadow-lg rounded-lg bg-card border p-2"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        gap: '0.25rem',
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isWinning = winningCells.some(
            ([r, c]) => r === rowIndex && c === colIndex
          );
          return (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              onClick={() => onCellClick(rowIndex, colIndex)}
              disabled={disabled || !!cell}
              isWinning={isWinning}
            />
          );
        })
      )}
    </div>
  );
}
