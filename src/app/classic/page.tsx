import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Wifi } from 'lucide-react';

export default function ClassicModePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tighter">
          Classic Tic Tac Toe
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Choose your game mode.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users />
              Offline Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Play with a friend on the same device.
            </p>
            <Link href="/custom" passHref>
              <Button className="w-full">Play Offline</Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi />
              Online Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Challenge players from around the world.
            </p>
            <Link href="/classic/online" passHref>
              <Button className="w-full">Play Online</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
