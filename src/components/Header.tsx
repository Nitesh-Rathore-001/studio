import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="font-headline text-xl font-bold text-primary">
          TicTac Infinity
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
