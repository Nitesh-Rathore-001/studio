import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, Grid3x3, Users, Wifi } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-accent">
          TicTac Infinity
        </h1>
        <p className="text-muted-foreground mt-4 text-lg md:text-xl">
          The classic game, reimagined.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="hover:shadow-primary/20 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <SlidersHorizontal className="text-primary" />
              <span className="font-headline text-2xl">Custom Game</span>
            </CardTitle>
            <CardDescription>
              Your rules. Your game. Choose your grid size and win condition for endless fun.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="w-4 h-4 mr-2" />
              <span>1-2 Players (Local)</span>
            </div>
            <Link href="/custom" passHref>
              <Button className="w-full font-bold">Play Now</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-muted-foreground">
              <Grid3x3 />
              <span className="font-headline text-2xl">Ultimate Tic Tac Toe</span>
            </CardTitle>
            <CardDescription>
              A strategic game of tic-tac-toe within tic-tac-toe. A true test of skill.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Wifi className="w-4 h-4 mr-2" />
              <span>Online Multiplayer</span>
            </div>
            <Button disabled className="w-full font-bold">
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
