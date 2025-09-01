
"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { doc, onSnapshot, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";
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
  players: { X: string | null; O: string | null };
  status: "waiting" | "playing" | "finished";
  size: number;
  winCondition: number;
  winningCells?: number[][];
};

const getUserId = () => {
    let id = sessionStorage.getItem("tictac-userid");
    if (!id) {
        id = `user_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem("tictac-userid", id);
    }
    return id;
}

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
    setUserId(getUserId());
  }, []);

  useEffect(() => {
    if (!gameId || !userId) return;
    setIsLoading(true);

    const gameRef = doc(db, "classicGames", gameId);

    const joinGame = async () => {
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
      let currentRole: "X" | "O" | "spectator" = "spectator";

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
    };

    joinGame().catch(error => {
      console.error("Error joining game:", error);
      toast({
        title: "Error",
        description: "Could not join the game.",
        variant: "destructive",
      });
    });
    
    const unsubscribe = onSnapshot(gameRef, (doc) => {
      if (doc.exists()) {
        setGame(doc.data() as GameState);
      } else {
         toast({ title: "Game not found", description: "This game may have been deleted.", variant: "destructive" });
      }
      if (isLoading) setIsLoading(false);
    }, (error) => {
        console.error("Snapshot error:", error);
        toast({
            title: "Connection error",
            description: "Lost connection to the game.",
            variant: "destructive"
        });
    });

    return () => {
      unsubscribe();
    };

  }, [gameId, userId, toast]);

  const boardArray = useMemo(() => {
    if (game?.board && game.size) {
      return boardMapToArray(game.board, game.size);
    }
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

    try {
      await updateDoc(doc(db, "classicGames", gameId), {
        [updatedBoardField]: game.currentPlayer,
        currentPlayer: nextPlayer,
        winner: winInfo ? game.currentPlayer : null,
        winningCells: winInfo ? winInfo.winningCells : [],
        status: newStatus,
      });
    } catch(err) {
      console.error("Error updating game state:", err);
      toast({ title: "Error", description: "Could not make a move.", variant: "destructive"})
    }
  };
  
  const copyGameLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link).then(() => {
      toast({ title: "Copied!", description: "Game link copied to clipboard." });
    });
  };

  if (isLoading || !game || !playerRole || boardArray.length === 0) {
    return (
        <div className="container mx-auto px-4 py-12 text-center flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <UniqueLoading size="lg" />
            <p className="text-muted-foreground">Loading game...</p>
        </div>
    );
  }
  
  const isDraw = !game.winner && game.board && Object.keys(game.board).length === (game.size * game.size);

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
