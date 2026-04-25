/**
 * SPDX-License-Identifier: Apache-2.0
 */

export class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  isBlood: boolean;
  groundY: number;
  isStuck: boolean = false;

  constructor(x: number, y: number, vx: number, vy: number, color: string, size: number, life: number, isBlood = false, groundY = 800) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.life = life;
    this.maxLife = life;
    this.isBlood = isBlood;
    this.groundY = groundY;
  }

  update() {
    if (this.isStuck) {
        this.life--;
        return this.life > 0;
    }

    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.isBlood ? 0.45 : 0.18; // Blood falls faster
    this.vx *= this.isBlood ? 0.94 : 0.97;

    if (this.isBlood && this.y >= this.groundY) {
        this.y = this.groundY;
        this.isStuck = true;
        this.vx = 0;
        this.vy = 0;
    }

    this.life--;
    return this.life > 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const a = this.life / this.maxLife;
    ctx.save();
    ctx.globalAlpha = a;
    if (this.isBlood) {
        ctx.fillStyle = '#800000'; // Dark blood
        ctx.beginPath();
        // Elongated blood drops
        const speed = Math.sqrt(this.vx**2 + this.vy**2);
        const angle = Math.atan2(this.vy, this.vx);
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);
        ctx.fillRect(-this.size, -this.size/2, this.size * (1 + speed/2), this.size);
    } else {
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * a, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
  }

  drawManual(ctx: CanvasRenderingContext2D) {
    const a = this.life / this.maxLife;
    ctx.save();
    ctx.globalAlpha = a;
    if (this.isBlood) {
        ctx.fillStyle = '#800000';
        ctx.beginPath();
        const speed = Math.sqrt(this.vx**2 + this.vy**2);
        const angle = Math.atan2(this.vy, this.vx);
        ctx.rotate(angle);
        ctx.fillRect(-this.size, -this.size/2, this.size * (1 + speed/2), this.size);
    } else {
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * a, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
  }
}

export class HitFlash {
  x: number;
  y: number;
  text: string;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  vy: number;

  constructor(x: number, y: number, text: string, color: string, size = 22) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.size = size;
    this.life = 38;
    this.maxLife = 38;
    this.vy = -1.2;
  }

  update() {
    this.y += this.vy;
    this.life--;
    return this.life > 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const a = Math.min(1, (this.life / this.maxLife) * 2);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.font = `900 ${this.size}px 'Orbitron'`;
    ctx.textAlign = 'center';
    ctx.shadowBlur = 20;
    ctx.shadowColor = this.color;
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.strokeText(this.text, this.x, this.y);
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }

  drawManual(ctx: CanvasRenderingContext2D) {
    const a = Math.min(1, (this.life / this.maxLife) * 2);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.font = `900 ${this.size}px 'Orbitron'`;
    ctx.textAlign = 'center';
    ctx.shadowBlur = 20;
    ctx.shadowColor = this.color;
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.strokeText(this.text, 0, 0);
    ctx.fillText(this.text, 0, 0);
    ctx.restore();
  }
}

export class EnergyBolt {
  x: number;
  y: number;
  vx: number;
  color: string;
  type: string;
  life: number;
  maxLife: number;
  width: number;
  height: number;
  angle: number = 0;
  hit: boolean = false;

  constructor(x: number, y: number, dir: number, color: string, type = 'blade') {
    this.x = x;
    this.y = y;
    this.vx = dir * (type === 'ultra' ? 10 : 7);
    this.color = color;
    this.type = type;
    this.life = 40;
    this.maxLife = 40;
    this.width = type === 'ultra' ? 90 : 48;
    this.height = type === 'ultra' ? 18 : 9;
  }

  update() {
    this.x += this.vx;
    this.angle += 0.15;
    this.life--;
    return this.life > 0 && this.x > -120 && this.x < 1020;
  }

  getRect() {
    return { x: this.x - this.width / 2, y: this.y - this.height * 2, w: this.width, h: this.height * 4 };
  }

  draw(ctx: CanvasRenderingContext2D) {
    const a = this.life / this.maxLife;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.globalAlpha = a;
    if (this.type === 'blade') {
      const g = ctx.createLinearGradient(-this.width / 2, 0, this.width / 2, 0);
      g.addColorStop(0, 'transparent');
      g.addColorStop(0.2, this.color + 'aa');
      g.addColorStop(0.5, '#fff');
      g.addColorStop(0.8, this.color + 'aa');
      g.addColorStop(1, 'transparent');
      ctx.shadowBlur = 18; ctx.shadowColor = this.color; ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(-this.width / 2, 0); ctx.lineTo(0, -this.height);
      ctx.lineTo(this.width / 2, 0); ctx.lineTo(0, this.height); ctx.closePath(); ctx.fill();
    } else {
      for (let i = 0; i < 3; i++) {
        const off = Math.sin(this.angle + i * 1.2) * 5;
        const g = ctx.createLinearGradient(-this.width / 2, 0, this.width / 2, 0);
        g.addColorStop(0, 'transparent'); g.addColorStop(0.15, this.color + '88');
        g.addColorStop(0.5, i === 1 ? '#fff' : this.color); g.addColorStop(0.85, this.color + '88');
        g.addColorStop(1, 'transparent');
        ctx.shadowBlur = 28; ctx.shadowColor = this.color; ctx.fillStyle = g;
        const h = [this.height * 2, this.height * 0.7, this.height * 1.5][i];
        ctx.fillRect(-this.width / 2, off - h / 2, this.width, h);
      }
    }
    ctx.restore();
  }

  drawManual(ctx: CanvasRenderingContext2D) {
    const a = this.life / this.maxLife;
    ctx.save();
    ctx.globalAlpha = a;
    if (this.type === 'blade') {
      const g = ctx.createLinearGradient(-this.width / 2, 0, this.width / 2, 0);
      g.addColorStop(0, 'transparent');
      g.addColorStop(0.2, this.color + 'aa');
      g.addColorStop(0.5, '#fff');
      g.addColorStop(0.8, this.color + 'aa');
      g.addColorStop(1, 'transparent');
      ctx.shadowBlur = 18; ctx.shadowColor = this.color; ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(-this.width / 2, 0); ctx.lineTo(0, -this.height);
      ctx.lineTo(this.width / 2, 0); ctx.lineTo(0, this.height); ctx.closePath(); ctx.fill();
    } else {
      for (let i = 0; i < 3; i++) {
        const off = Math.sin(this.angle + i * 1.2) * 5;
        const g = ctx.createLinearGradient(-this.width / 2, 0, this.width / 2, 0);
        g.addColorStop(0, 'transparent'); g.addColorStop(0.15, this.color + '88');
        g.addColorStop(0.5, i === 1 ? '#fff' : this.color); g.addColorStop(0.85, this.color + '88');
        g.addColorStop(1, 'transparent');
        ctx.shadowBlur = 28; ctx.shadowColor = this.color; ctx.fillStyle = g;
        const h = [this.height * 2, this.height * 0.7, this.height * 1.5][i];
        ctx.fillRect(-this.width / 2, off - h / 2, this.width, h);
      }
    }
    ctx.restore();
  }
}

export class Sigil {
  x: number; y: number; color: string; life: number; maxLife: number; r: number = 0; angle: number = 0;
  constructor(x: number, y: number, color: string) {
    this.x = x; this.y = y; this.color = color; this.life = 55; this.maxLife = 55;
  }
  update() { this.r += (55 - this.r) * 0.14; this.angle += 0.055; this.life--; return this.life > 0; }
  draw(ctx: CanvasRenderingContext2D) {
    const a = this.life / this.maxLife;
    ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle); ctx.globalAlpha = a * 0.85;
    ctx.shadowBlur = 22; ctx.shadowColor = this.color; ctx.strokeStyle = this.color; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, this.r, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a1 = (i / 6) * Math.PI * 2, a2 = ((i + 0.5) / 6) * Math.PI * 2;
      const x1 = Math.cos(a1) * this.r, y1 = Math.sin(a1) * this.r;
      const x2 = Math.cos(a2) * this.r * 0.38, y2 = Math.sin(a2) * this.r * 0.38;
      if (i === 0) ctx.moveTo(x1, y1); else ctx.lineTo(x1, y1); ctx.lineTo(x2, y2);
    }
    ctx.closePath(); ctx.stroke();
    ctx.globalAlpha = a; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  drawManual(ctx: CanvasRenderingContext2D) {
    const a = this.life / this.maxLife;
    ctx.save(); ctx.rotate(this.angle); ctx.globalAlpha = a * 0.85;
    ctx.shadowBlur = 22; ctx.shadowColor = this.color; ctx.strokeStyle = this.color; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, this.r, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a1 = (i / 6) * Math.PI * 2, a2 = ((i + 0.5) / 6) * Math.PI * 2;
      const x1 = Math.cos(a1) * this.r, y1 = Math.sin(a1) * this.r;
      const x2 = Math.cos(a2) * this.r * 0.38, y2 = Math.sin(a2) * this.r * 0.38;
      if (i === 0) ctx.moveTo(x1, y1); else ctx.lineTo(x1, y1); ctx.lineTo(x2, y2);
    }
    ctx.closePath(); ctx.stroke();
    ctx.globalAlpha = a; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

export class Shockwave {
  x: number; y: number; r: number = 0; maxR: number; life: number; maxLife: number; color: string;
  constructor(x: number, y: number, color = '#fff', maxR = 150) {
    this.x = x; this.y = y; this.color = color; this.maxR = maxR; this.life = 25; this.maxLife = 25;
  }
  update() {
    this.r += (this.maxR - this.r) * 0.2;
    this.life--;
    return this.life > 0;
  }
  draw(ctx: CanvasRenderingContext2D) {
    const a = this.life / this.maxLife;
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 10 * a;
    ctx.globalAlpha = a * 0.5;
    ctx.stroke();
    ctx.restore();
  }
}

export class BloodDecal {
    x: number;
    y: number;
    size: number;
    rotation: number;
    opacity: number;
    life: number;
    maxLife: number;

    constructor(x: number, y: number, size: number) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.rotation = Math.random() * Math.PI * 2;
        this.opacity = 0.5 + Math.random() * 0.3;
        this.life = 2000; // Last for ~30 seconds at 60fps
        this.maxLife = 2000;
    }

    update() {
        this.life--;
        return this.life > 0;
    }

    drawManual(ctx: CanvasRenderingContext2D) {
        const a = (this.life / this.maxLife) * this.opacity;
        ctx.save();
        ctx.translate(0, 0); // Position is handled by GameCanvas projection
        ctx.rotate(this.rotation);
        ctx.globalAlpha = a;
        ctx.fillStyle = '#600'; // Dried blood look
        ctx.beginPath();
        // Randomized splatter
        ctx.ellipse(0, 0, this.size, this.size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Add some small spatters around
        for(let i=0; i<3; i++) {
            const dist = this.size * (1 + Math.random());
            const ang = Math.random() * Math.PI * 2;
            ctx.beginPath();
            ctx.arc(Math.cos(ang) * dist, Math.sin(ang) * dist, this.size * 0.2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}
