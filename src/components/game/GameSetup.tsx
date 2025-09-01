"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Play } from "lucide-react";

export type GameSettings = {
  gridSize: number;
  winCondition: number;
};

type GameSetupProps = {
  onStartGame: (settings: GameSettings) => void;
};

export function GameSetup({ onStartGame }: GameSetupProps) {
  const [gridSize, setGridSize] = useState(10);
  const [winCondition, setWinCondition] = useState(5);

  const handleGridSizeChange = (value: number[]) => {
    const newSize = value[0];
    setGridSize(newSize);
    if (winCondition > newSize) {
      setWinCondition(newSize);
    }
  };

  const handleWinConditionChange = (value: number[]) => {
    setWinCondition(value[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartGame({ gridSize, winCondition });
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Game Setup</CardTitle>
          <CardDescription>Customize the rules to your liking.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="gridSize">Grid Size</Label>
                <span className="font-bold text-primary text-lg">{gridSize}x{gridSize}</span>
              </div>
              <Slider
                id="gridSize"
                min={3}
                max={20}
                step={1}
                value={[gridSize]}
                onValueChange={handleGridSizeChange}
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="winCondition">Win Condition</Label>
                <span className="font-bold text-primary text-lg">{winCondition}-in-a-row</span>
              </div>
              <Slider
                id="winCondition"
                min={3}
                max={gridSize}
                step={1}
                value={[winCondition]}
                onValueChange={handleWinConditionChange}
              />
            </div>
            <Button type="submit" className="w-full font-bold">
              <Play className="mr-2 h-4 w-4" /> Start Game
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
