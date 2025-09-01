
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import UniqueLoading from "@/components/ui/grid-loading";

export default function ClassicOnlinePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [joinCode, setJoinCode] = useState("");
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [isLoadingJoin, setIsLoadingJoin] = useState(false);

  const createGame = async () => {
    setIsLoadingCreate(true);
    try {
      // Firestore doesn't support nested arrays. We'll use a map instead.
      const board = {};
      for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
            board[`${i}_${j}`] = null;
        }
      }

      const gameRef = await addDoc(collection(db, "classicGames"), {
        board: board,
        players: { X: null, O: null },
        currentPlayer: "X",
        status: "waiting",
        createdAt: serverTimestamp(),
        size: 3,
      });
      router.push(`/classic/online/${gameRef.id}`);
    } catch (error) {
      console.error("Error creating game:", error);
      toast({
        title: "Error",
        description: "Failed to create a game. Please try again.",
        variant: "destructive",
      });
      setIsLoadingCreate(false);
    }
  };

  const joinGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setIsLoadingJoin(true);
    try {
      const gameDoc = await getDoc(doc(db, "classicGames", joinCode.trim()));
      if (gameDoc.exists()) {
        router.push(`/classic/online/${joinCode.trim()}`);
      } else {
        toast({
          title: "Game not found",
          description: "The game code you entered is invalid.",
          variant: "destructive",
        });
        setIsLoadingJoin(false);
      }
    } catch (error) {
      console.error("Error joining game:", error);
      toast({
        title: "Error",
        description: "Failed to join the game. Please check the code and try again.",
        variant: "destructive",
      });
      setIsLoadingJoin(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tighter">
          Classic Online
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Create a room or join with a code.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create a New Game</CardTitle>
            <CardDescription>
              Start a new game and invite a friend.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={createGame} disabled={isLoadingCreate} className="w-full">
              {isLoadingCreate ? <UniqueLoading size="sm" className="w-6 h-6" /> : "Create Game"}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Join a Game</CardTitle>
            <CardDescription>
              Enter a code to join an existing game.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={joinGame} className="flex gap-2">
              <Input
                placeholder="Enter game code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                disabled={isLoadingJoin}
              />
              <Button type="submit" disabled={isLoadingJoin || !joinCode.trim()}>
                 {isLoadingJoin ? <UniqueLoading size="sm" className="w-6 h-6" /> : "Join"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
