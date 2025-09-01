
"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { GameBoard } from "@/components/game/GameBoard";
import { Player } from "@/lib/types";
import { checkWin } from "@/lib/game-logic";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Users } from "lucide-react";
import UniqueLoading from "@/components/ui/grid-loading";

type GameState = {
  board: { [key: string]: Player };
  currentPlayer: Player;
  winner: Player | null;
  players: { X: string | null, O: string | null };
  status: "waiting" | "playing" | "finished";
  size: number;
  winCondition: number;
  winningCells?: number[][];
};

// This is a placeholder for a real user ID system
const getUserId = () => `user_${Math.random().toString(36).substr(2, 9)}`;

// Helper to convert Firestore map to a 2D array for the component
const boardMapToArray = (boardMap: { [key: string]: Player }, size: number): Player[][] => {
  const array: Player[][] = Array(size).fill(null).map(() => Array(size).fill(null));
  if (boardMap) {
    for (const key in boardMap) {
      const [row, col] = key.split("_").map(Number);
      if(row < size && col < size) {
         array[row][col] = boardMap[key];
      }
    }
  }
  return array;
};

export default function ClassicOnlineGamePage() {
  const params = useParams();
  const gameId = params.gameId as string;
  const { toast } = useToast();
  const [game, setGame] = useState<GameState | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [playerRole, setPlayerRole] = useState<"X" | "O" | "spectator" | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

    const gameRef = doc(db, "classicGames", gameId);

    // First, try to join the game if needed.
    const joinGameAndListen = async () => {
      try {
        const docSnap = await getDoc(gameRef);
        if (!docSnap.exists()) {
          toast({
            title: "Game not found",
            description: "This game does not exist or has been deleted.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const gameData = docSnap.data() as GameState;
        
        let currentRole: "X" | "O" | "spectator" | null = 'spectator';
        if (gameData.players.X === userId) {
          currentRole = "X";
        } else if (gameData.players.O === userId) {
          currentRole = "O";
        } else if (gameData.status === 'waiting') {
          if (!gameData.players.X) {
            await updateDoc(gameRef, { "players.X": userId });
            currentRole = "X";
          } else if (!gameData.players.O) {
            await updateDoc(gameRef, { "players.O": userId, status: 'playing' });
            currentRole = "O";
          }
        }
        setPlayerRole(currentRole);
      } catch (error) {
        console.error("Error joining game:", error);
        toast({
          title: "Error",
          description: "Could not join the game.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Now, set up the real-time listener.
      const unsubscribe = onSnapshot(gameRef, (doc) => {
        if (doc.exists()) {
          setGame(doc.data() as GameState);
        }
        if (isLoading) setIsLoading(false);
      });

      return unsubscribe;
    };

    const unsubPromise = joinGameAndListen();

    return () => {
      unsubPromise.then(unsub => {
        if (unsub) unsub();
      });
    };
  }, [gameId, userId, toast]);

  const boardArray = useMemo(() => {
    if (game) {
      return boardMapToArray(game.board, game.size);
    }
    // Return a default empty board to prevent errors before game loads
    return [];
  }, [game]);

  const handleCellClick = async (row: number, col: number) => {
    if (!game || game.winner || boardArray[row]?.[col] || game.currentPlayer !== playerRole) {
      return;
    }

    const currentBoardArray = boardMapToArray(game.board, game.size);
    currentBoardArray[row][col] = game.currentPlayer;

    const winInfo = checkWin(currentBoardArray, game.currentPlayer, game.winCondition);
    const nextPlayer = game.currentPlayer === "X" ? "O" : "X";
    const newStatus = winInfo ? "finished" : "playing";

    const updatedBoardField = `board.${row}_${col}`;

    await updateDoc(doc(db, "classicGames", gameId), {
      [updatedBoardField]: game.currentPlayer,
      currentPlayer: nextPlayer,
      winner: winInfo ? game.currentPlayer : null,
      winningCells: winInfo ? winInfo.winningCells : [],
      status: newStatus,
    });
  };
  
  const copyGameLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link).then(() => {
      toast({ title: "Copied!", description: "Game link copied to clipboard." });
    });
  };

  if (isLoading || !game || !playerRole) {
    return <div className="container mx-auto px-4 py-12 text-center flex flex-col items-center justify-center gap-4">
        <UniqueLoading size="lg" />
        Loading game...
    </div>;
  }
  
  const isDraw = !game.winner && Object.keys(game.board).filter(k => game.board[k]).length === (game.size * game.size);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center gap-8">
      <Card className="w-full max-w-lg">
        <CardContent className="p-6 text-center">
            <h1 className="font-headline text-3xl mb-2">{game.size}x{game.size} Online Game</h1>
            <p className="text-sm text-muted-foreground mb-4">Win by getting {game.winCondition} in a row.</p>
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
      
      <GameBoard
        board={boardArray}
        onCellClick={handleCellClick}
        disabled={game.status !== "playing" || playerRole !== game.currentPlayer}
        winningCells={game.winningCells || []}
      />
    </div>
  );
}
