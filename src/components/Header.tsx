"use client";

import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center justify-center text-sm text-muted-foreground bg-muted/50 w-full h-10 rounded-md">
          Ad Placeholder
        </div>
        <div className="pl-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
