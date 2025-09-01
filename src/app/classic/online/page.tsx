
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function ClassicOnlinePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [joinCode, setJoinCode] = useState("");
  const [isLoadingJoin, setIsLoadingJoin] = useState(false);

  // Create game is now handled on the /classic page.
  // This page is now only for joining a game.

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
          Create a custom game or join with a code.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create a New Game</CardTitle>
            <CardDescription>
              Start a new game with custom rules and invite a friend.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/classic" passHref>
                <Button className="w-full">Create Custom Game</Button>
            </Link>
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
                 {isLoadingJoin ? "Joining..." : "Join"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
