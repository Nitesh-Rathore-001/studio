import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-headline text-xl font-bold text-primary">
            TicTac Infinity
          </Link>
          <nav className="hidden md:flex items-center gap-2">
             <Link href="/classic" passHref>
                <Button variant="ghost">Classic</Button>
             </Link>
             <Link href="/ultimate" passHref>
                <Button variant="ghost">Ultimate</Button>
             </Link>
          </nav>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
