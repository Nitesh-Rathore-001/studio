import { Button } from "@/components/ui/button";
import { RotateCcw, Undo2, Redo2, Home } from "lucide-react";

type GameControlsProps = {
  onReset: () => void;
  onNewGame: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

export function GameControls({
  onReset,
  onNewGame,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: GameControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button variant="outline" onClick={onUndo} disabled={!canUndo}>
        <Undo2 className="mr-2 h-4 w-4" /> Undo
      </Button>
      <Button variant="outline" onClick={onRedo} disabled={!canRedo}>
        <Redo2 className="mr-2 h-4 w-4" /> Redo
      </Button>
      <Button variant="secondary" onClick={onReset}>
        <RotateCcw className="mr-2 h-4 w-4" /> Reset Board
      </Button>
       <Button variant="ghost" onClick={onNewGame}>
        <Home className="mr-2 h-4 w-4" /> New Game
      </Button>
    </div>
  );
}
