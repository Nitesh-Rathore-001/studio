
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GameSetup, type GameSettings } from "@/components/game/GameSetup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Wifi } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import UniqueLoading from "@/components/ui/grid-loading";

export default function ClassicModePage() {
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [isLoadingOnline, setIsLoadingOnline] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleGameSetup = (newSettings: GameSettings) => {
    // Persist settings in sessionStorage to be picked up by the offline game page
    sessionStorage.setItem('classicGameSettings', JSON.stringify(newSettings));
    setSettings(newSettings);
  };
  
  const handlePlayOffline = () => {
    router.push('/classic/offline');
  };

  const handlePlayOnline = async () => {
     if (!settings) return;
     setIsLoadingOnline(true);
     try {
       const board: { [key: string]: null } = {};
       
       const gameRef = await addDoc(collection(db, "classicGames"), {
         board: board,
         players: { X: null, O: null },
         currentPlayer: "X",
         status: "waiting",
         createdAt: serverTimestamp(),
         size: settings.gridSize,
         winCondition: settings.winCondition,
         winningCells: [],
       });
       router.push(`/classic/online/${gameRef.id}`);
     } catch (error) {
       console.error("Error creating game:", error);
       toast({
         title: "Error",
         description: "Failed to create a game. Please try again.",
         variant: "destructive",
       });
       setIsLoadingOnline(false);
     }
  };


  if (!settings) {
    return (
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
            <h1 className="font-headline text-4xl font-bold tracking-tighter">
            Classic Tic Tac Toe
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
            First, set up your game rules.
            </p>
        </header>
        <GameSetup onStartGame={handleGameSetup} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tighter">
          Choose Your Mode
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          You've set up a {settings.gridSize}x{settings.gridSize} game with a {settings.winCondition}-in-a-row win condition.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users />
              Offline Mode
            </CardTitle>
            <CardDescription>
                Play with a friend on the same device.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={handlePlayOffline}>Play Offline</Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi />
              Online Mode
            </CardTitle>
             <CardDescription>
                Challenge a friend with a game code.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={handlePlayOnline} disabled={isLoadingOnline}>
                {isLoadingOnline ? <UniqueLoading size="sm" /> : "Create Online Game"}
            </Button>
          </CardContent>
        </Card>
      </div>
       <div className="text-center mt-8">
            <Button variant="link" onClick={() => {
                sessionStorage.removeItem('classicGameSettings');
                setSettings(null);
            }}>
                Change Game Rules
            </Button>
       </div>
    </div>
  );
}

