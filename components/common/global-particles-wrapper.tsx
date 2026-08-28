'use client';

import React, { useEffect } from 'react';
import FloatingParticles from '@/components/common/floating-particles';
import { useUIStore } from '@/store/useUIStore';

export default function GlobalParticlesWrapper() {
  const { particlesEnabled, particlesTheme, particlesCustomIcons, particlesCount, fetchParticleConfig } = useUIStore();

  useEffect(() => {
    fetchParticleConfig();
  }, [fetchParticleConfig]);

  return (
    <FloatingParticles
      enabled={particlesEnabled}
      theme={particlesTheme}
      customIcons={particlesCustomIcons || undefined}
      count={particlesCount || 16}
    />
  );
}
