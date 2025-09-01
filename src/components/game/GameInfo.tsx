
import { type Player } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

type GameInfoProps = {
  currentPlayer: Player;
  winner: Player;
  isDraw: boolean;
  gridSize: number;
  winCondition: number;
};

export function GameInfo({ currentPlayer, winner, isDraw, gridSize, winCondition }: GameInfoProps) {
  let status;

  if (winner && winner !== 'D') {
    status = <span className="text-2xl font-bold">Player <span className={winner === 'X' ? 'text-red-500' : 'text-blue-500'}>{winner}</span> wins!</span>;
  } else if (isDraw) {
    status = <span className="text-2xl font-bold text-muted-foreground">It's a draw!</span>;
  } else {
    status = (
      <div className="flex items-center gap-2">
        <span className="text-xl">Turn:</span>
        <span className={`text-3xl font-bold ${currentPlayer === 'X' ? 'text-red-500' : 'text-blue-500'}`}>{currentPlayer}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between w-full">
       <div className="text-center sm:text-left mb-4 sm:mb-0">
         <h2 className="font-headline text-3xl">
           {gridSize}x{gridSize} Board
         </h2>
         <p className="text-sm text-muted-foreground">{winCondition} in a row to win</p>
       </div>
      <div className="text-center">{status}</div>
    </div>
  );
}
