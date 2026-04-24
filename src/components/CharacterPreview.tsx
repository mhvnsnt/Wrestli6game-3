/**
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { CharacterData } from '../types';
import { Character3D } from '../engine/character3d';

interface CharacterPreviewProps {
  data: CharacterData;
  className?: string;
  autoRotate?: boolean;
}

export const CharacterPreview: React.FC<CharacterPreviewProps> = ({ data, className = '', autoRotate = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const char3dRef = useRef<Character3D | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number;
    let frameCount = 0;

    const init3D = () => {
      if (!char3dRef.current && container.offsetWidth > 0) {
        char3dRef.current = new Character3D(container, data);
        rafId = requestAnimationFrame(animate);
      }
    };

    const animate = () => {
      if (char3dRef.current) {
        frameCount++;
        if (autoRotate && char3dRef.current.group) {
          char3dRef.current.group.rotation.y += 0.01;
        }
        char3dRef.current.updatePose('idle', frameCount, 1, 0, 0);
        char3dRef.current.render();
      }
      rafId = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(() => {
      char3dRef.current?.resize();
    });
    
    init3D();
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      char3dRef.current?.destroy();
      char3dRef.current = null;
    };
  }, [data, autoRotate]);

  return <div ref={containerRef} className={`w-full h-full ${className}`} />;
};
