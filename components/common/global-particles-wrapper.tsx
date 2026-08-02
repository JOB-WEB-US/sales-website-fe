'use client';

import React from 'react';
import FloatingParticles from '@/components/common/floating-particles';
import { useUIStore } from '@/store/useUIStore';

export default function GlobalParticlesWrapper() {
  const { particlesEnabled, particlesTheme } = useUIStore();

  return (
    <FloatingParticles
      enabled={particlesEnabled}
      theme={particlesTheme}
    />
  );
}
