/**
 * SPDX-License-Identifier: Apache-2.0
 *
 * eyeColor.ts — procedural iris textures for the Wrestli6game-3 customizer.
 *
 * Ported from the AshLane customizer's eye-colors module (makeIrisTexture):
 * a dark limbal ring, radial striations from the pupil, and a baked pupil so
 * flat hex colors read as eyes rather than painted spheres. Skin is never
 * touched — only the iris material gets this texture.
 */

import * as THREE from 'three';

const textureCache = new Map<string, THREE.CanvasTexture>();

/** Generate a 128px iris texture: limbal ring + radial striations + pupil. */
export function makeIrisTexture(hex: string): THREE.CanvasTexture {
  const cached = textureCache.get(hex);
  if (cached) return cached;

  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const c = new THREE.Color(hex);

  // Base radial gradient: light center -> saturated rim.
  const g = ctx.createRadialGradient(size / 2, size / 2, size * 0.08, size / 2, size / 2, size / 2);
  const light = c.clone().offsetHSL(0, -0.05, 0.22);
  const dark = c.clone().offsetHSL(0, 0.05, -0.18);
  g.addColorStop(0, `#${light.getHexString()}`);
  g.addColorStop(0.55, `#${c.getHexString()}`);
  g.addColorStop(0.82, `#${dark.getHexString()}`);
  g.addColorStop(1, '#050505'); // limbal ring
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  // Radial striations.
  const cx = size / 2;
  const cy = size / 2;
  for (let i = 0; i < 140; i++) {
    const a = (i / 140) * Math.PI * 2 + Math.sin(i * 12.9898) * 0.05;
    const r0 = size * (0.1 + 0.04 * Math.abs(Math.sin(i * 78.233)));
    const r1 = size * (0.4 + 0.06 * Math.abs(Math.sin(i * 39.425)));
    const shade = Math.sin(i * 37.719) > 0 ? 0 : 1;
    ctx.strokeStyle = shade ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
    ctx.stroke();
  }

  // Pupil.
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.085, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  textureCache.set(hex, tex);
  return tex;
}

/** Clear the texture cache (e.g. on full scene teardown). */
export function clearIrisCache(): void {
  for (const t of textureCache.values()) t.dispose();
  textureCache.clear();
}
