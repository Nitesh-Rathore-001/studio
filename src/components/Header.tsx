"use client";

import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Input } from "@/components/ui/input";

export function Header() {
  const [name, setName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("tictac-username");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  useEffect(() => {
    if (name) {
      localStorage.setItem("tictac-username", name);
    }
  }, [name]);
  
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                Welcome, {name || 'guest'}
            </span>
            <Input 
                type="text"
                placeholder="Enter your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-40 h-8 text-sm"
                aria-label="Enter your name"
            />
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
