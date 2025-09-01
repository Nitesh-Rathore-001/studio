import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 flex items-center justify-end h-16">
        <ThemeToggle />
      </div>
    </header>
  );
}
