
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
import UniqueLoading from "@/components/ui/grid-loading";

export default function ClassicOnlinePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [joinCode, setJoinCode] = useState("");
  const [isLoadingJoin, setIsLoadingJoin] = useState(false);

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
          Join a Classic Game
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Enter a code to join an existing game.
        </p>
      </header>

      <div className="grid gap-8 max-w-sm mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Join a Game</CardTitle>
            <CardDescription>
              Enter a code from your friend to join their game.
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
            <div className="mt-4 text-center">
                 <Link href="/classic" passHref>
                    <Button variant="link">Or, create a new game</Button>
                 </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
