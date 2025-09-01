"use client";

import { useEffect, useState } from "react";
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

type GameState = {
  board: Player[][];
  currentPlayer: Player;
  winner: Player | null;
  players: { X: string | null, O: string | null };
  status: "waiting" | "playing" | "finished";
};

// This is a placeholder for a real user ID system
const getUserId = () => `user_${Math.random().toString(36).substr(2, 9)}`;

export default function ClassicOnlineGamePage() {
  const params = useParams();
  const gameId = params.gameId as string;
  const { toast } = useToast();
  const [game, setGame] = useState<GameState | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [playerRole, setPlayerRole] = useState<"X" | "O" | null>(null);

  useEffect(() => {
    const id = sessionStorage.getItem("tictac-userid") || getUserId();
    sessionStorage.setItem("tictac-userid", id);
    setUserId(id);
  }, []);

  useEffect(() => {
    if (!gameId || !userId) return;

    const gameRef = doc(db, "classicGames", gameId);

    const unsubscribe = onSnapshot(gameRef, async (docSnap) => {
      if (docSnap.exists()) {
        const gameData = docSnap.data() as GameState;

        // Player assignment logic
        if (gameData.status === "waiting") {
          const players = gameData.players;
          if (!players.X) {
            await updateDoc(gameRef, { "players.X": userId });
            setPlayerRole("X");
          } else if (!players.O && players.X !== userId) {
            await updateDoc(gameRef, { 
              "players.O": userId,
              status: "playing"
            });
            setPlayerRole("O");
          }
        } else {
            if (gameData.players.X === userId) setPlayerRole("X");
            else if (gameData.players.O === userId) setPlayerRole("O");
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

  const handleCellClick = async (row: number, col: number) => {
    if (!game || game.winner || game.board[row][col] || game.currentPlayer !== playerRole) {
      return;
    }

    const newBoard = game.board.map(r => [...r]);
    newBoard[row][col] = game.currentPlayer;

    const winInfo = checkWin(newBoard, game.currentPlayer, 3);
    const nextPlayer = game.currentPlayer === "X" ? "O" : "X";
    const newStatus = winInfo ? "finished" : "playing";

    await updateDoc(doc(db, "classicGames", gameId), {
      board: newBoard,
      currentPlayer: nextPlayer,
      winner: winInfo ? game.currentPlayer : null,
      status: newStatus,
    });
  };
  
  const copyGameLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link).then(() => {
      toast({ title: "Copied!", description: "Game link copied to clipboard." });
    });
  };

  if (!game) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading game...</div>;
  }
  
  const isSpectator = userId !== game.players.X && userId !== game.players.O;
  const isDraw = !game.winner && game.board.flat().every(cell => cell !== null);


  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center gap-8">
      <Card className="w-full max-w-lg">
        <CardContent className="p-6 text-center">
            <h1 className="font-headline text-3xl mb-2">Classic Online Game</h1>
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
                You are playing as {playerRole || 'Spectator'}
             </p>
        </CardContent>
      </Card>
      
      <GameBoard
        board={game.board.map(row => row.slice(0,3))} // This is a hack because GameBoard expects gridSize
        onCellClick={handleCellClick}
        disabled={game.status !== "playing" || playerRole !== game.currentPlayer}
        winningCells={[]}
      />
    </div>
  );
}
