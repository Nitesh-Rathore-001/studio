
"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { UltimateGameBoard } from "@/components/game/ultimate/UltimateGameBoard";
import { Player, UltimateBoardState } from "@/lib/types";
import { checkUltimateWin, checkSmallWin } from "@/lib/ultimate-game-logic";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Users } from "lucide-react";
import UniqueLoading from "@/components/ui/grid-loading";

type GameState = {
  boards: { [key: string]: { [key: string]: Player } };
  mainBoard: Player[];
  currentPlayer: Player;
  activeBoard: number | null;
  winner: Player | null;
  players: { X: string | null, O: string | null };
  status: "waiting" | "playing" | "finished";
};

const getUserId = () => {
    let id = sessionStorage.getItem("tictac-userid");
    if (!id) {
        id = `user_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem("tictac-userid", id);
    }
    return id;
}

const boardMapToArray = (boardMap: { [key: string]: { [key: string]: Player } }): UltimateBoardState => {
  const array: UltimateBoardState = Array(9).fill(null).map(() => Array(9).fill(null));
  if (boardMap) {
    for (const boardIdx in boardMap) {
      if (array[boardIdx]) {
        for (const cellIdx in boardMap[boardIdx]) {
          array[boardIdx][cellIdx] = boardMap[boardIdx][cellIdx];
        }
      }
    }
  }
  return array;
};

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUserId(getUserId());
  }, []);

  useEffect(() => {
    if (!gameId || !userId) return;
    setIsLoading(true);

    const gameRef = doc(db, "ultimateGames", gameId);

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
        let currentRole: "X" | "O" | "spectator" = 'spectator';
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

  const boardsArray = useMemo(() => {
    if (game?.boards) {
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

    const newBoardsArray = boardMapToArray(game.boards);
    newBoardsArray[boardIndex][cellIndex] = game.currentPlayer;
    
    const newMainBoard = [...game.mainBoard];
    const smallWin = checkSmallWin(newBoardsArray[boardIndex]);
    
    if (smallWin) {
      newMainBoard[boardIndex] = game.currentPlayer;
    } else if (newBoardsArray[boardIndex].every(cell => cell !== null)) {
       newMainBoard[boardIndex] = 'D'; // Draw on small board
    }

    const gameWinner = checkUltimateWin(newMainBoard);
    let nextActiveBoard: number | null = cellIndex;
    if (newMainBoard[cellIndex] !== null) {
      nextActiveBoard = null;
    }
    
    const nextPlayer = game.currentPlayer === "X" ? "O" : "X";
    const newStatus = gameWinner ? "finished" : "playing";

    try {
        await updateDoc(doc(db, "ultimateGames", gameId), {
        [`boards.${boardIndex}.${cellIndex}`]: game.currentPlayer,
        mainBoard: newMainBoard,
        currentPlayer: nextPlayer,
        activeBoard: nextActiveBoard,
        winner: gameWinner ? game.currentPlayer : null,
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

  if (isLoading || !game || !playerRole) {
    return (
        <div className="container mx-auto px-4 py-12 text-center flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <UniqueLoading size="lg" />
            <p className="text-muted-foreground">Loading game...</p>
        </div>
    );
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
