"use client";

import React from "react";
import { Player } from "@/lib/types";
import { Cell } from "../Cell";
import { cn } from "@/lib/utils";

type SmallBoardProps = {
  board: Player[];
  boardIndex: number;
  onCellClick: (boardIndex: number, cellIndex: number) => void;
  disabled: boolean;
};

export function SmallBoard({ board, boardIndex, onCellClick, disabled }: SmallBoardProps) {
  return (
    <div
      className="grid grid-cols-3 grid-rows-3 gap-1 aspect-square w-full h-full"
    >
      {board.map((cell, cellIndex) => (
        <Cell
          key={cellIndex}
          value={cell}
          onClick={() => onCellClick(boardIndex, cellIndex)}
          disabled={disabled || !!cell}
          isWinning={false} // Winning state is handled on the main board
        />
      ))}
    </div>
  );
}
