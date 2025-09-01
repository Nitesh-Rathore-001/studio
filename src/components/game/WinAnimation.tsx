"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const PARTICLE_COUNT = 150;

export function WinAnimation() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 2 + 3}s`,
        animationDelay: `${Math.random() * 2}s`,
        backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
        width: `${Math.floor(Math.random() * 8) + 8}px`,
        height: `${Math.floor(Math.random() * 4) + 4}px`,
      },
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 rounded-full"
          style={{ ...p.style, animationName: 'fall', animationTimingFunction: 'linear' }}
        />
      ))}
    </div>
  );
}
