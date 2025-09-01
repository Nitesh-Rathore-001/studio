"use client";

import React from "react";
import { type Player } from "@/lib/types";
import { cn } from "@/lib/utils";

type CellProps = {
  value: Player;
  onClick: () => void;
  disabled: boolean;
  isWinning: boolean;
};

const PlayerIcon = ({ player }: { player: Player }) => {
  if (!player) return null;

  const iconClasses = "w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105";

  if (player === "X") {
    return (
      <svg viewBox="0 0 100 100" className={cn("text-red-500", iconClasses)}>
        <line x1="15" y1="15" x2="85" y2="85" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
        <line x1="85" y1="15" x2="15" y2="85" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className={cn("text-blue-500", iconClasses)}>
      <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="12" fill="none" />
    </svg>
  );
};

export function Cell({ value, onClick, disabled, isWinning }: CellProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative flex items-center justify-center aspect-square rounded-md bg-background hover:bg-muted transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:z-10",
        {
          "cursor-not-allowed": disabled,
          "animate-pulse bg-primary/20 ring-4 ring-primary": isWinning,
        }
      )}
      aria-label={`Cell ${value ? `is ${value}` : 'is empty'}`}
    >
      <div className={cn("absolute inset-0 p-[15%] transition-all duration-300", value ? 'scale-100 opacity-100' : 'scale-50 opacity-0')}>
        {value && <PlayerIcon player={value} />}
      </div>
    </button>
  );
}
