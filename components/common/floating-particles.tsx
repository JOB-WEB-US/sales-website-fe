'use client';

import React, { useEffect, useState } from 'react';

export type ParticleTheme =
  | 'halloween'
  | 'christmas'
  | 'sparkles'
  | 'autumn'
  | 'fireworks'
  | 'sakura'
  | 'sports'
  | 'vintage';

export const PARTICLE_PRESETS: Record<ParticleTheme, string[]> = {
  halloween: ['🎃', '🦇', '👻', '💀', '🕷️'],
  christmas: ['❄️', '🎄', '🔔', '🎁', '⛄', '🎅'],
  sparkles: ['✨', '🌟', '💖', '🔥', '💎', '⭐'],
  autumn: ['🍂', '🍁', '🎃', '🌾', '☕'],
  fireworks: ['🎆', '🎇', '✨', '🎉', '🔥', '🥳'],
  sakura: ['🌸', '🌺', '✨', '🍃', '💮', '🌷'],
  sports: ['🏈', '🏆', '⚽', '⚡', '🔥'],
  vintage: ['🎸', '📻', '🎙️', '⚡', '🖤'],
};

interface ParticleItem {
  id: number;
  icon: string;
  left: number; // percentage
  size: number; // px
  duration: number; // seconds
  delay: number; // seconds
  opacity: number;
}

interface FloatingParticlesProps {
  enabled?: boolean;
  theme?: ParticleTheme;
  customIcons?: string[];
  count?: number;
}

export default function FloatingParticles({
  enabled = true,
  theme = 'halloween',
  customIcons,
  count = 16,
}: FloatingParticlesProps) {
  const [particles, setParticles] = useState<ParticleItem[]>([]);

  useEffect(() => {
    if (!enabled) {
      setParticles([]);
      return;
    }

    const iconsToUse = customIcons || PARTICLE_PRESETS[theme] || PARTICLE_PRESETS.halloween;
    const generated: ParticleItem[] = [];

    for (let i = 0; i < count; i++) {
      generated.push({
        id: i,
        icon: iconsToUse[Math.floor(Math.random() * iconsToUse.length)],
        left: Math.random() * 95, // 0 - 95%
        size: Math.floor(Math.random() * 16) + 14, // 14px - 30px
        duration: Math.random() * 10 + 8, // 8s - 18s
        delay: Math.random() * 5, // 0s - 5s
        opacity: Math.random() * 0.4 + 0.3, // 0.3 - 0.7
      });
    }

    setParticles(generated);
  }, [enabled, theme, customIcons, count]);

  if (!enabled || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute select-none animate-falling-particle"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.icon}
        </span>
      ))}

      {/* CSS Keyframes for smooth falling animation */}
      <style jsx global>{`
        @keyframes fallingParticle {
          0% {
            transform: translateY(-50px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(105vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-falling-particle {
          animation-name: fallingParticle;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
}
