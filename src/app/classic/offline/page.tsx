
"use client";

import { useEffect, useState } from 'react';
import { CustomGame } from "@/components/game/CustomGame";
import type { GameSettings } from '@/components/game/GameSetup';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import UniqueLoading from '@/components/ui/grid-loading';

export default function ClassicOfflinePage() {
    const [settings, setSettings] = useState<GameSettings | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedSettings = sessionStorage.getItem('classicGameSettings');
        if (storedSettings) {
            try {
                const parsedSettings = JSON.parse(storedSettings);
                setSettings(parsedSettings);
            } catch (error) {
                console.error("Failed to parse game settings from storage", error);
                router.push('/classic');
            }
        } else {
             // If no settings, redirect to setup
             router.push('/classic');
        }
    }, [router]);

    if (!settings) {
        return (
            <div className="container mx-auto px-4 py-12 text-center flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <UniqueLoading size="lg" />
                <p className="text-muted-foreground">Loading game settings...</p>
                <p className="text-sm text-muted-foreground mt-2">
                    If you are not redirected, <Button variant="link" onClick={() => router.push('/classic')}>click here to set up a game</Button>.
                </p>
            </div>
        );
    }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <CustomGame gameSettings={settings} />
    </div>
  );
}

