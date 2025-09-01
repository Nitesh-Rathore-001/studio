import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';
import { SplashCursor } from '@/components/ui/splash-cursor';

export const metadata: Metadata = {
  title: 'TicTac Infinity',
  description: 'A modern, infinite Tic Tac Toe experience with customizable grids and ultimate mode.',
  keywords: ['Tic Tac Toe', 'Game', 'React', 'Next.js', 'Firebase', 'Multiplayer'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Poppins:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <Providers>
          <SplashCursor />
          <Header />
          <main className="flex-grow">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

    