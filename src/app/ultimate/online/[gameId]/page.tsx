
"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { UltimateGameBoard } from "@/components/game/ultimate/UltimateGameBoard";
import { Player, UltimateBoardState } from "@/lib/types";
import { checkUltimateWin, checkSmallWin } from "@/lib/ultimate-game-logic";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Users } from "lucide-react";

type GameState = {
  boards: { [key: number]: { [key: number]: Player } };
  mainBoard: Player[];
  currentPlayer: Player;
  activeBoard: number | null;
  winner: Player | null;
  players: { X: string | null, O: string | null };
  status: "waiting" | "playing" | "finished";
};

// Helper to convert Firestore map of maps to a 2D array for the component
const boardMapToArray = (boardMap: { [key: number]: { [key: number]: Player } }): UltimateBoardState => {
  const array: UltimateBoardState = Array(9).fill(null).map(() => Array(9).fill(null));
  for (const boardIdx in boardMap) {
    for (const cellIdx in boardMap[boardIdx]) {
      array[boardIdx][cellIdx] = boardMap[boardIdx][cellIdx];
    }
  }
  return array;
};


const getUserId = () => `user_${Math.random().toString(36).substr(2, 9)}`;

const createEmptyUltimateBoard = (): UltimateBoardState => {
    return Array(9).fill(null).map(() => Array(9).fill(null));
};

export default function UltimateOnlineGamePage() {
  const params = useParams();
  const gameId = params.gameId as string;
  const { toast } = useToast();
  const [game, setGame] = useState<GameState | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [playerRole, setPlayerRole] = useState<"X" | "O" | "spectator" | null>(null);

  useEffect(() => {
    let id = sessionStorage.getItem("tictac-userid");
    if (!id) {
      id = getUserId();
      sessionStorage.setItem("tictac-userid", id);
    }
    setUserId(id);
  }, []);

  useEffect(() => {
    if (!gameId || !userId) return;

    const gameRef = doc(db, "ultimateGames", gameId);

    const unsubscribe = onSnapshot(gameRef, async (docSnap) => {
      if (docSnap.exists()) {
        const gameData = docSnap.data() as GameState;
        
        // Determine player role
        if (gameData.players.X === userId) {
          setPlayerRole("X");
        } else if (gameData.players.O === userId) {
          setPlayerRole("O");
        } else if (gameData.status === 'waiting') {
            // Try to join the game
            if (!gameData.players.X) {
                await updateDoc(gameRef, { "players.X": userId });
                setPlayerRole("X");
            } else if (!gameData.players.O) {
                await updateDoc(gameRef, { "players.O": userId, status: 'playing' });
                setPlayerRole("O");
            } else {
                setPlayerRole("spectator");
            }
        } else {
            setPlayerRole("spectator");
        }

        setGame(gameData);
      } else {
        toast({
          title: "Game not found",
          description: "This game does not exist or has been deleted.",
          variant: "destructive",
        });
      }
    });

    return () => unsubscribe();
  }, [gameId, userId, toast]);

  const boardsArray = useMemo(() => {
    if (game) {
      return boardMapToArray(game.boards);
    }
    return createEmptyUltimateBoard();
  }, [game]);
  
  const handleCellClick = async (boardIndex: number, cellIndex: number) => {
    if (!game || game.winner || boardsArray[boardIndex][cellIndex] || game.mainBoard[boardIndex] ||
        (game.activeBoard !== null && game.activeBoard !== boardIndex) || 
        game.currentPlayer !== playerRole) {
      return;
    }

    const currentBoardsArray = boardMapToArray(game.boards);
    currentBoardsArray[boardIndex][cellIndex] = game.currentPlayer;
    
    const newMainBoard = [...game.mainBoard];
    const smallWin = checkSmallWin(currentBoardsArray[boardIndex]);
    if (smallWin) {
      newMainBoard[boardIndex] = game.currentPlayer;
    } else if (currentBoardsArray[boardIndex].every(cell => cell !== null)) {
      newMainBoard[boardIndex] = 'D';
    }

    const gameWinner = checkUltimateWin(newMainBoard);
    let nextActiveBoard: number | null = cellIndex;
    if (newMainBoard[cellIndex] !== null) {
      nextActiveBoard = null;
    }
    
    const nextPlayer = game.currentPlayer === "X" ? "O" : "X";
    const newStatus = gameWinner ? "finished" : "playing";

    await updateDoc(doc(db, "ultimateGames", gameId), {
      [`boards.${boardIndex}.${cellIndex}`]: game.currentPlayer,
      mainBoard: newMainBoard,
      currentPlayer: nextPlayer,
      activeBoard: nextActiveBoard,
      winner: gameWinner ? game.currentPlayer : null,
      status: newStatus,
    });
  };

  const copyGameLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link).then(() => {
      toast({ title: "Copied!", description: "Game link copied to clipboard." });
    });
  };

  if (!game || !playerRole) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading game...</div>;
  }
  
  const isDraw = !game.winner && game.mainBoard.every(cell => cell !== null);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center gap-8">
      <Card className="w-full max-w-2xl">
         <CardContent className="p-6 text-center">
            <h1 className="font-headline text-3xl mb-2">Ultimate Online Game</h1>
            {game.status === 'waiting' && (
                <Alert>
                    <Users className="h-4 w-4" />
                    <AlertTitle>Waiting for opponent</AlertTitle>
                    <AlertDescription>
                        Share the game code or link with a friend.
                        <div className="flex items-center justify-center gap-2 mt-2">
                           <span className="font-mono bg-muted px-2 py-1 rounded-md">{gameId}</span>
                           <Button variant="outline" size="icon" onClick={copyGameLink}>
                               <Copy className="h-4 w-4"/>
                           </Button>
                        </div>
                    </AlertDescription>
                </Alert>
            )}
             {game.status !== 'waiting' && (
                <div className="text-xl">
                    {game.winner ? `Player ${game.winner} Wins!` : isDraw ? "It's a Draw!" : `Turn: ${game.currentPlayer}`}
                </div>
             )}
             <p className="mt-2 text-sm text-muted-foreground">
                You are playing as {playerRole}
             </p>
        </CardContent>
      </Card>
      
      <UltimateGameBoard
        boards={boardsArray}
        mainBoard={game.mainBoard}
        onCellClick={handleCellClick}
        activeBoard={game.activeBoard}
        disabled={game.status !== "playing" || playerRole !== game.currentPlayer}
      />
    </div>
  );
}
