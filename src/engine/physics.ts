/**
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { sounds } from './audio';

export class SpringNode {
  x: number;
  y: number;
  px: number;
  py: number;
  ax: number;
  ay: number;
  stiffness: number;
  damping: number;
  mass: number;
  vx: number;
  vy: number;

  constructor(x: number, y: number, stiffness = 0.18, damping = 0.72, mass = 1.0) {
    this.x = x;
    this.y = y;
    this.px = x;
    this.py = y;
    this.ax = x;
    this.ay = y;
    this.stiffness = stiffness;
    this.damping = damping;
    this.mass = mass;
    this.vx = 0;
    this.vy = 0;
  }

  setAnchor(x: number, y: number) {
    this.ax = x;
    this.ay = y;
  }

  update(extForceX = 0, extForceY = 0) {
    const dx = this.ax - this.x;
    const dy = this.ay - this.y;
    const fx = dx * this.stiffness + extForceX;
    const fy = dy * this.stiffness + extForceY;

    const nx = this.x + (this.x - this.px) * this.damping + (fx / this.mass) * 0.016;
    const ny = this.y + (this.y - this.py) * this.damping + (fy / this.mass) * 0.016;

    this.px = this.x;
    this.py = this.y;
    this.x = nx;
    this.y = ny;
    this.vx = this.x - this.px;
    this.vy = this.y - this.py;
  }

  get dispX() { return this.x - this.ax; }
  get dispY() { return this.y - this.ay; }
}

export class HairChain {
  nodes: SpringNode[];
  segLen: number;

  constructor(rootX: number, rootY: number, segments: number, segLen: number, stiffness = 0.25, damping = 0.7) {
    this.nodes = [];
    this.segLen = segLen;
    for (let i = 0; i < segments; i++) {
      this.nodes.push(new SpringNode(
        rootX, rootY + i * segLen,
        stiffness * Math.pow(0.9, i),
        damping,
        0.6 + i * 0.1
      ));
    }
  }

  update(rootX: number, rootY: number, bodyVX = 0, bodyVY = 0, gravity = 0.4) {
    this.nodes[0].ax = rootX;
    this.nodes[0].ay = rootY;
    this.nodes[0].x = rootX + this.nodes[0].dispX;
    this.nodes[0].y = rootY + this.nodes[0].dispY;

    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      if (i > 0) {
        const prev = this.nodes[i - 1];
        const angle = Math.atan2(n.ay - prev.ay, n.ax - prev.ax);
        n.ax = prev.x + Math.cos(angle) * this.segLen;
        n.ay = prev.y + Math.sin(angle) * this.segLen;
      }
      n.update(-bodyVX * 0.08 * (i * 0.4), gravity * (i * 0.3));
    }
  }

  draw(ctx: CanvasRenderingContext2D, color: string, width = 3, glow: string | null = null) {
    if (this.nodes.length < 2) return;
    ctx.save();
    if (glow) { ctx.shadowBlur = 10; ctx.shadowColor = glow; }
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(this.nodes[0].x, this.nodes[0].y);
    for (let i = 1; i < this.nodes.length; i++) {
      const prev = this.nodes[i - 1];
      const curr = this.nodes[i];
      const mx = (prev.x + curr.x) / 2;
      const my = (prev.y + curr.y) / 2;
      ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
    }
    ctx.lineTo(this.nodes[this.nodes.length - 1].x, this.nodes[this.nodes.length - 1].y);
    ctx.stroke();
    ctx.restore();
  }
}

export class JigglePart {
  offX: number;
  offY: number;
  rx: number;
  ry: number;
  node: SpringNode;
  isFeminine: boolean;
  rotation: number;
  rotVel: number;

  constructor(offX: number, offY: number, rx: number, ry: number, stiffness: number, damping: number, mass: number, isFeminine = false) {
    this.offX = offX;
    this.offY = offY;
    this.rx = rx;
    this.ry = ry;
    this.node = new SpringNode(0, 0, stiffness, damping, mass);
    this.isFeminine = isFeminine;
    this.rotation = 0;
    this.rotVel = 0;
  }

  update(worldX: number, worldY: number, bodyVX: number, bodyVY: number, facing: number) {
    const anchorX = worldX + this.offX * facing;
    const anchorY = worldY + this.offY;
    this.node.setAnchor(anchorX, anchorY);

    const rotForce = -bodyVX * facing * 0.003;
    this.rotVel += rotForce;
    this.rotVel *= 0.85;
    this.rotation += this.rotVel;
    this.rotation *= 0.92;

    this.node.update(-bodyVX * 0.12, -bodyVY * 0.08);
  }

  get x() { return this.node.x; }
  get y() { return this.node.y; }
  get stretch() { return Math.sqrt(this.node.dispX ** 2 + this.node.dispY ** 2); }
}

export class ArenaObjectPhysics {
    static update(obj: any, groundY: number, fighters: any[]) {
      if (obj.isBroken && obj.type !== 'table' && obj.type !== 'glass_tube') return;
  
      // Weight Factor
      const weight = obj.type === 'steel_steps' ? 5.0 : (obj.type === 'ladder' ? 2.5 : (obj.type === 'table' ? 3.0 : 1.0));
      const gravity = 0.8 * weight;

      // Gravity
      if (!obj.onGround) {
        obj.vy += weight * 0.4;
      }
  
      obj.x += obj.vx;
      obj.y += obj.vy;
      obj.rotation = (obj.rotation || 0) + obj.rv;
  
      // Air Drag (Visceral damping)
      obj.vx *= (0.99 - (weight * 0.005));
      obj.vy *= 0.99;
      obj.rv *= 0.97;
  
      // Ground Collision
      if (obj.y + obj.h / 2 > groundY) {
        const impact = Math.abs(obj.vy);
        obj.y = groundY - obj.h / 2;
        obj.vx *= (0.4 + (1/weight) * 0.2); // Heavier objects slide less
        obj.vy = impact > 2 ? -obj.vy * (0.2 + (1/weight) * 0.1) : 0;
        
        // Rotational friction on ground
        obj.rv *= 0.5;
        if (impact > 3) {
            obj.rv += (Math.random() - 0.5) * 0.1 * impact / weight;
            
            // Material Sound Detection
            let sType: 'clank' | 'wood' | 'glass' | 'heavy' = 'heavy';
            if (['chair', 'steel_steps', 'stop_sign', 'trash_can'].includes(obj.type)) sType = 'clank';
            else if (['table', 'kendo'].includes(obj.type)) sType = 'wood';
            else if (obj.type === 'glass_tube') sType = 'glass';
            sounds.playImpact(sType);
        }
        
        obj.onGround = Math.abs(obj.vy) < 0.5;
        
        // Stable landing for ladders/tables if slow
        if (obj.onGround && Math.abs(obj.rv) < 0.01) {
            const nearestPI = Math.round(obj.rotation / (Math.PI / 2)) * (Math.PI / 2);
            obj.rotation = THREE.MathUtils.lerp(obj.rotation, nearestPI, 0.1);
        }
      } else {
        obj.onGround = false;
      }
  
      // Wall Collision (Arena Boundaries)
      if (obj.x < 10 || obj.x > 1190) {
        obj.vx *= -0.7;
        obj.rv += obj.vx * 0.02;
        obj.x = Math.max(10, Math.min(1190, obj.x));
      }
  
      // Interaction with fighters
      for (const f of fighters) {
        const dx = obj.x - f.cx;
        const dy = obj.y - f.cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = (obj.w + f.w) * 0.6;
  
        if (dist < minDist) {
          // Push away physics
          const angle = Math.atan2(dy, dx);
          const push = (minDist - dist) * 0.4;
          
          // Only push object if fighter is moving or attacking
          if (Math.abs(f.vx) > 1 || f.state === 'attack' || f.state === 'running') {
              const weightPenalty = 1 / weight;
              obj.vx += (Math.cos(angle) * push + f.vx * 0.2) * weightPenalty;
              obj.vy += (Math.sin(angle) * push + f.vy * 0.2) * weightPenalty;
              obj.rv += f.vx * 0.02 * weightPenalty;
              obj.onGround = false;
              
              if (f.state === 'attack' && dist < minDist * 0.8) {
                  obj.vx += f.facing * (12 * weightPenalty);
                  obj.vy -= 4 * weightPenalty;
                  let sType: 'clank' | 'wood' | 'glass' | 'heavy' = 'heavy';
                  if (['chair', 'steel_steps', 'stop_sign'].includes(obj.type)) sType = 'clank';
                  else if (['table', 'kendo'].includes(obj.type)) sType = 'wood';
                  sounds.playImpact(sType);
              }
          }
        }
      }
    }
  }
  
  export class RingRope {
  x: number;
  y: number;
  width: number;
  nodes: SpringNode[];
  isLeft: boolean;

  constructor(x: number, y: number, width: number, nodes = 10, isLeft = true) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.isLeft = isLeft;
    this.nodes = [];
    const step = width / (nodes - 1);
    for (let i = 0; i < nodes; i++) {
      this.nodes.push(new SpringNode(x, y + i * step, 0.15, 0.85, 0.8));
    }
  }

  update(impactX: number, impactY: number, force: number) {
    for (let i = 0; i < this.nodes.length; i++) {
        const n = this.nodes[i];
        const dist = Math.abs(n.y - impactY);
        let fx = 0;
        if (dist < 50) {
            fx = force * (1 - dist/50);
        }
        n.update(fx, 0);
    }
  }

  draw(ctx: CanvasRenderingContext2D, color: string) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(this.nodes[0].x, this.nodes[0].y);
    for (let i = 1; i < this.nodes.length; i++) {
      const prev = this.nodes[i - 1];
      const curr = this.nodes[i];
      const mx = (prev.x + curr.x) / 2;
      const my = (prev.y + curr.y) / 2;
      ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
    }
    ctx.lineTo(this.nodes[this.nodes.length - 1].x, this.nodes[this.nodes.length - 1].y);
    ctx.stroke();
    
    // Support posts
    ctx.fillStyle = '#222';
    ctx.fillRect(this.x - 5, this.y - 100, 10, 400);
    ctx.restore();
  }
}
