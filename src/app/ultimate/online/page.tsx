
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

export default function UltimateOnlinePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [joinCode, setJoinCode] = useState("");
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [isLoadingJoin, setIsLoadingJoin] = useState(false);

  const createGame = async () => {
    setIsLoadingCreate(true);
    try {
      const initialBoards = {};

      const gameRef = await addDoc(collection(db, "ultimateGames"), {
        boards: initialBoards,
        mainBoard: Array(9).fill(null),
        players: { X: null, O: null },
        currentPlayer: "X",
        activeBoard: null,
        status: "waiting",
        createdAt: serverTimestamp(),
      });
      router.push(`/ultimate/online/${gameRef.id}`);
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
      const gameDoc = await getDoc(doc(db, "ultimateGames", joinCode.trim()));
      if (gameDoc.exists()) {
        router.push(`/ultimate/online/${joinCode.trim()}`);
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
          Ultimate Online
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
              {isLoadingCreate ? <UniqueLoading size="sm" /> : "Create Game" }
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
                 {isLoadingJoin ? <UniqueLoading size="sm" /> : "Join"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
