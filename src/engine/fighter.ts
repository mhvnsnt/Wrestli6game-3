/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { CharacterData, FighterState, AttackType, Weapons, WeaponObject, BodyDamage, Move, Moveset } from '../types';
import { ProceduralCharacter } from './character';
import { sounds } from './audio';
import { MoveLibrary } from './moveLibrary';
import { Particle, HitFlash, EnergyBolt, Sigil } from './effects';
import { ScenePhysics } from './physics';

const WEAPON_STATS: Record<Weapons, { dmg: number, reach: number, durability: number }> = {
    none: { dmg: 0, reach: 0, durability: 0 },
    katana: { dmg: 14, reach: 80, durability: 12 },
    mace: { dmg: 22, reach: 68, durability: 10 },
    staff: { dmg: 10, reach: 95, durability: 15 },
    brass_knuckles: { dmg: 12, reach: 45, durability: 20 },
    chair: { dmg: 26, reach: 72, durability: 5 },
    kendo_stick: { dmg: 9, reach: 88, durability: 14 },
    sledgehammer: { dmg: 38, reach: 62, durability: 4 },
    ladder: { dmg: 20, reach: 98, durability: 7 },
    table: { dmg: 30, reach: 100, durability: 2 },
    garbage_can: { dmg: 15, reach: 70, durability: 8 },
    steel_steps: { dmg: 40, reach: 60, durability: 5 },
    kendo: { dmg: 9, reach: 88, durability: 14 },
    glass_tube: { dmg: 45, reach: 65, durability: 1 },
    stop_sign: { dmg: 18, reach: 75, durability: 6 },
    trash_can: { dmg: 15, reach: 70, durability: 8 }
};

const defaultMoveset: Moveset = {
    light: [
        { name: 'Jab', dmg: 5, kx: 2, ky: -1, time: 15, category: 'standing', animation: 'punch' }
    ],
    heavy: [
        { name: 'Dropkick', dmg: 15, kx: 8, ky: -4, time: 40, category: 'standing', animation: 'kick' }
    ],
    grapples: [
        { name: 'Suplex', dmg: 22, kx: 5, ky: -12, time: 60, category: 'standing', animation: 'grapple' }
    ],
    backGrapples: [],
    groundHead: [], groundSide: [], groundFeet: [], groundSeated: [], groundKneeling: [],
    cornerFront: [], cornerBack: [], cornerSeated: [], topRopeFrontSeated: [], topRopeBackSeated: [], treeOfWoe: [],
    ropeLeaning: [], ropeTied: [], ropeMiddle: [],
    apronInsideToOutside: [], apronOutsideToInside: [], apronToApron: [], apronToFloor: [],
    apronSpringboardStanding: [], apronSpringboardGround: [],
    divingStanding: [], divingGround: [], springboardStanding: [], springboardGround: [], springboardOutside: [],
    runningStrike: [], runningHeavy: [], runningGrapple: [], runningGroundStrike: [],
    irishWhipRebound: [], reboundStrike: [], reboundHeavy: [], reboundGrapple: [],
    pullBack: [],
    signatures: [], finishers: [], paybacks: [], comebacks: [],
    taunts: { standing: [], corner: [], apron: [], ground: [] },
    combos: []
};

export class Fighter {
  x: number;
  y: number;
  z: number = 0;
  groundY: number;
  w = 60;
  h = 185;
  vx = 0;
  groundType: 'mat' | 'concrete' | 'padding' = 'mat';
  weightClass: 'cruiser' | 'heavy' | 'super' = 'heavy';
  vy = 0;
  vz = 0;
  onGround = true;
  facing: number;
  isP2: boolean;

  hp = 100;
  maxHp = 100;
  energy = 60;
  maxEnergy = 100;
  energyRegen = 0.11;
  
  // momentum system (WWE 2k style)
  sigMeter = 0; // Blue bar
  finMeter = 0; // Red bar (charisma influenced)
  sigStocks = 0; // Max 6
  finStocks = 0; // Max 6
  buttonHoldTimers: Record<string, number> = {};
  
  bodyDamage: BodyDamage = { head: 0, body: 0, arms: 0, legs: 0 };
  reverseWindow = 0; // Frame window to reverse this fighter's attack
  secondaryReverseWindow = 0; // Second window for grapple escapes/reversals
  isReversing = 0; // Frames spent in reversal stance
  isRebounding = 0; // Frames spent rebounding off ropes
  lastAttackKey: 'light' | 'heavy' | 'special' | 'ultra' | 'grapple' | null = null;

  state: FighterState = 'idle';
  stateTimer = 0;
  attackType: AttackType | null = null;
  hitbox: any = null;
  hitboxTimer = 0;
  comboCount = 0;
  comboTimer = 0;
  animFrame = 0;
  animTimer = 0;
  hurtFlash = false;
  
  grappleTarget: Fighter | null = null;
  isGrappled = false;
  rot = 0; // Rotation for ragdoll
  rv = 0; // Rotational velocity
  lastOpponent: Fighter | null = null;
  charisma: number = 100;
  isAI: boolean = false;
  stunMeter: number = 0;
  maxStunMeter: number = 100;
  isStunned: boolean = false;
  stunTimer: number = 0;
  resiliencyUsed: boolean = false;
  limbDamage: { head: number, body: number, arms: number, legs: number } = { head: 0, body: 0, arms: 0, legs: 0 };
  pinProgress: number = 0;
  isBeingPinned: boolean = false;
  isSubmitting: boolean = false;
  isBeingSubmitted: boolean = false;
  submissionMeter: number = 0;
  inFacelock: boolean = false;
  isStaggered: boolean = false;
  pinKickoutTarget: number = 0;
  pinMeterSpeed: number = 0.05;
  pinMeterPos: number = 0;
  worldW: number = 1200;
  stamina: number = 100;
  maxStamina: number = 100;

  currentMove: Move | null = null;
  moveStageIndex: number = 0;
  moveStageTimer: number = 0;
  moveOriginalPos: { x: number, y: number, rot: number } = { x: 0, y: 0, rot: 0 };
  opponentOriginalPos: { x: number, y: number, rot: number } = { x: 0, y: 0, rot: 0 };
  walkToCornerTimer: number = 0;
  poseState: string = 'idle';

  lightCD = 0; heavyCD = 0; specialCD = 0; ultraCD = 0;
  keys: Record<string, boolean> = {};
  char: ProceduralCharacter;
  inputBuffer: { key: string, time: number }[] = [];
  weaponHeld: Weapons = 'none';
  weaponDurability = 0;
  maxWeaponDurability = 0;

  constructor(x: number, charData: CharacterData, isP2 = false, groundY: number, isAI = false) {
    this.x = x;
    this.groundY = groundY;
    this.y = this.groundY - this.h;
    this.isP2 = isP2;
    this.isAI = isAI;
    this.facing = isP2 ? -1 : 1;
    this.charisma = charData.charisma || 100;

    // STATS Based on Morphology (Calibration)
    const heightFactor = charData.height / 100;
    const muscle = charData.muscleMass;
    const fat = charData.fatMass;
    
    // Weight dictates momentum and resistance
    this.weightClass = (heightFactor < 0.82) ? 'cruiser' : (heightFactor > 1.05 || charData.bodyType === 'heavy' ? 'super' : 'heavy');
    
    this.maxHp = 200 * (1.2 + fat * 0.5 + muscle * 0.2); // Doubled base HP for pacing
    if (this.weightClass === 'super') this.maxHp += 100;
    this.hp = this.maxHp;
    
    // Calculated momentum specs
    this.energyRegen = 0.08 * (1.2 - fat * 0.4); // Slower energy regen initially
    const speedMult = 1.0 * (1 - fat * 0.25) * (2 - heightFactor); 
    // Small fast guys vs big slow tanks
    
    this.char = new ProceduralCharacter(charData);
    
    // Ensure moveset is populated
    if (!this.char.cd.moveset) {
        this.char.cd.moveset = MoveLibrary.getProceduralMoveset(charData.archetype);
    }

    this.weaponHeld = charData.weaponType;
    if (this.weaponHeld !== 'none') {
        const stats = WEAPON_STATS[this.weaponHeld];
        this.weaponDurability = stats.durability;
        this.maxWeaponDurability = stats.durability;
    }
  }

  expressionScore: number = 0;
  isRunning: boolean = false;
  momentum: number = 0;
  
  onImpact(force: number, type: 'light' | 'heavy' | 'thud' | 'clank' | 'wood' | 'glass' | 'snap' | 'ring_bell') {
    if (force > 5) {
        sounds.playImpact(type);
        this.momentum += force * 0.1;
        if (force > 15) sounds.playCrowdReaction('gasp');
    }
  }

  updateGroundLevel() {
    const ringW = 1050; // 10.5 * 100
    const centerX = 450;
    const ringLeft = centerX - ringW / 2;
    const ringRight = centerX + ringW / 2;
    
    // In ring?
    if (this.x > ringLeft && this.x < ringRight - this.w && this.z < 525 && this.z > -525) {
        this.groundY = 300;
        this.groundType = 'mat';
    } else {
        // Ringside Floor
        this.groundY = 380; // Dropped approx 80 units
        
        // Define floor materials based on position (pseudo-logic for now)
        if (Math.abs(this.x - 450) < 1000 && Math.abs(this.z) < 1000) {
            this.groundType = 'padding';
        } else {
            this.groundType = 'concrete';
        }
    }
  }

  get cx() { return this.x + this.w / 2; }
  get cy() { return this.y + this.h * 0.45; }
  get cz() { return this.z; }

  getRect() { return { x: this.x + 8, y: this.y + 10, w: this.w - 16, h: this.h - 10 }; }

  canLift(target: Fighter): boolean {
    if (this.weightClass === 'super') return true;
    if (this.weightClass === 'heavy' && target.weightClass !== 'super') return true;
    if (this.weightClass === 'cruiser' && target.weightClass === 'cruiser') return true;
    return false;
  }

  cx_old() { return this.x + this.w / 2; }

  applyDamage(dmg: number, kx: number, ky: number, type: AttackType, sigils: Sigil[], particles: Particle[], attacker?: Fighter) {
    if (this.state === 'dead') return;

    // Stamina influences damage resistance
    const staminaDefense = 0.5 + (this.stamina / this.maxStamina) * 0.5;
    let actualDmg = dmg / staminaDefense;

    if (actualDmg > 20) {
        // Visceral blood spurt
        const splashCount = Math.floor(actualDmg / 5);
        for(let i=0; i<splashCount; i++) {
            particles.push(new Particle(this.cx, this.cy, (Math.random()-0.5)*15, (Math.random()-0.5)*15, '#c00', 3, 120, false, this.groundY));
        }
    }

    // Weight reduction for knockback
    const weightMult = this.weightClass === 'super' ? 0.6 : (this.weightClass === 'heavy' ? 0.9 : 1.15);

    // Stun Meter Logic
    if (!this.isStunned) {
        this.stunMeter += actualDmg * 0.9;
        if (this.stunMeter >= this.maxStunMeter) {
            this.isStunned = true;
            this.stunTimer = 180; // 3 seconds at 60fps
            this.stunMeter = this.maxStunMeter;
            sounds.playImpact('heavy'); // Stun feedback
            if (this.isAI && Math.random() < 0.5) sounds.playCrowdReaction('cheer');
        }
    }

    // Limb Damage Logic
    if (type === 'ultra') {
        this.limbDamage.head += actualDmg * 0.4;
        this.limbDamage.body += actualDmg * 0.4;
    } else if (Math.abs(ky) > 15) {
        this.limbDamage.head += actualDmg * 0.6;
    } else if (Math.abs(ky) < 5 && Math.abs(kx) > 10) {
        this.limbDamage.legs += actualDmg * 0.5;
    } else {
        this.limbDamage.body += actualDmg * 0.5;
    }

    // Resiliency Logic
    if (this.hp < 15 && !this.resiliencyUsed && this.char.cd.abilities?.includes('resiliency')) {
        this.hp += 25;
        this.stamina = this.maxStamina;
        this.resiliencyUsed = true;
        this.isStunned = false; 
        this.stunMeter = 0;
        // Green flash for resiliency
        // sigils.push(new Sigil(this.cx, this.cy, '#00ff44')); 
        sounds.playCrowdReaction('cheer');
    }

    // Momentum loss on hit
    this.sigMeter = Math.max(0, this.sigMeter - actualDmg * 0.3);
    this.finMeter = Math.max(0, this.finMeter - actualDmg * 0.15);

    // Juggling Logic...
    let actualKy = ky;
    if (this.state === 'ragdoll' || !this.onGround) {
        actualKy = Math.min(ky, -8);
    }

    // Body Part Damage Logic
    const parts: (keyof BodyDamage)[] = ['head', 'body', 'arms', 'legs'];
    const hitPart = parts[Math.floor(Math.random() * parts.length)];
    this.bodyDamage[hitPart] = Math.min(100, this.bodyDamage[hitPart] + actualDmg * 0.5);

    // Visceral Screen Shake trigger 
    let hitstop = 0;
    if (actualDmg > 10) hitstop = 2;
    if (actualDmg > 25) hitstop = 6;
    if (type === 'ultra') hitstop = 12;

    this.hp = Math.max(0, this.hp - actualDmg);
    this.vx = kx * weightMult;
    this.vy = actualKy * weightMult;
    this.rv = (kx / 15) * weightMult; // Rotational torque
    
    // VISCERAL SELLING (WWE 2K style)
    const totalDamage = (this.maxHp - this.hp) / this.maxHp;
    const sellDuration = Math.floor(30 + totalDamage * 120 + (1 - this.stamina/this.maxStamina) * 60);

    if (Math.abs(kx) > 10 || actualDmg > 25 || actualKy < -10) {
        this.state = 'ragdoll';
        this.stateTimer = sellDuration; // Dynamic sell time
        this.onGround = false;
        sounds.playImpact('heavy');
        if (actualDmg > 30) sounds.playCrowdReaction('gasp');
    } else {
        this.state = 'hurt';
        this.stateTimer = type === 'ultra' ? 48 : type === 'heavy' ? 30 : 18;
        this.onGround = false;
        sounds.playImpact(type === 'heavy' ? 'heavy' : 'light');
    }
    
    this.hurtFlash = true;
    
    if (attacker) {
      const charismaMult = 1 + (attacker.charisma - 100) / 100;
      const momGain = (actualDmg * 0.8) * charismaMult;
      attacker.sigMeter = Math.min(100, attacker.sigMeter + momGain);
      attacker.finMeter = Math.min(100, attacker.finMeter + momGain * 0.4);
      attacker.stamina = Math.min(attacker.maxStamina, attacker.stamina + 5); // Adrenaline gain
    }

    return hitstop;
  }

  spawnHitFX(x: number, y: number, color: string, particles: Particle[], bloodEnabled: boolean = true) {
    // REALISTIC IMPACT VFX (Sweat & Dust)
    for (let i = 0; i < 12; i++) {
      const ang = Math.random() * Math.PI * 2, spd = 0.5 + Math.random() * 3;
      const isSweat = Math.random() < 0.6;
      particles.push(new Particle(x, y, Math.cos(ang) * spd, Math.sin(ang) * spd - 1,
        isSweat ? '#fff' : '#d2b48c', 0.8 + Math.random() * 1.5, 12 + Math.random() * 15, false, this.groundY));
    }
    
    // Grime/Dirt if near ground
    if (y > this.groundY - 50) {
        for (let i = 0; i < 6; i++) {
          const spd = 1 + Math.random() * 2;
          particles.push(new Particle(x, y, (Math.random()-0.5)*spd, -Math.random()*spd, '#543', 2, 20, false, this.groundY));
        }
    }

    // Procedural Blood (Subtle spray)
    if (bloodEnabled) {
        for (let i = 0; i < 8; i++) {
            const ang = Math.random() * Math.PI * 2, spd = 1 + Math.random() * 4;
            particles.push(new Particle(x, y, Math.cos(ang) * spd, Math.sin(ang) * spd - 2, '#600', 1.2, 45, true, this.groundY));
        }
    }
  }

  attack(type: AttackType, projs: EnergyBolt[], sigils: Sigil[], particles: Particle[]) {
    if (this.state === 'dead' || this.state === 'hurt' || this.state === 'grappled') return;
    const cds: Record<AttackType, string> = { light: 'lightCD', heavy: 'heavyCD', special: 'specialCD', ultra: 'ultraCD', grapple: 'heavyCD', taunt: 'lightCD', whip: 'heavyCD' };
    const cooldownKey = cds[type] as keyof Fighter;
    if ((this[cooldownKey] as number) > 0) return;
    
    // Stamina Cost Calculation
    const staminaCost: Record<AttackType, number> = { 
        light: 5, heavy: 15, special: 30, ultra: 50, grapple: 20, taunt: 0, whip: 15 
    };
    
    if (this.stamina < staminaCost[type]) {
        // "Gasping" state - too tired to attack
        this.onImpact(1, 'thud');
        return;
    }

    // Fatigued / Injured speeds
    const injuryPenalty = (this.limbDamage.head + this.limbDamage.body + this.limbDamage.arms + this.limbDamage.legs) / 400;
    const isFatigued = this.stamina < 30;
    const speedMult = (isFatigued ? 1.35 : 1.0) + injuryPenalty;
    const dmgMult = (isFatigued ? 0.75 : 1.0) * (1 - injuryPenalty * 0.5);

    this.stamina -= staminaCost[type];
    
    this.state = 'attack';
    this.attackType = type;
    
    // Attack Timings (Broadcast pacing: Heavy moves have more weight)
    const baseTimings: Record<AttackType, number> = { 
        light: 18, heavy: 32, special: 24, ultra: 40, grapple: 35, taunt: 60, whip: 28 
    };
    this.stateTimer = Math.floor(baseTimings[type] * speedMult);
    this.reverseWindow = Math.floor(14 * speedMult); // Reversal windows increase as you tire
    (this[cooldownKey] as number) = Math.floor((baseTimings[type] * 1.2) * speedMult);

    const color = this.char.cd.sigil;

    // LIMB TARGETING (Situational)
    const targetLimb = (type === 'heavy' && Math.random() < 0.4) ? (['head', 'body', 'legs'][Math.floor(Math.random() * 3)] as any) : undefined;

    if (type === 'special' || type === 'ultra') {
      // sigils.push(new Sigil(this.cx + this.facing * 20, this.cy - 20, color));
      // if (type === 'ultra') sigils.push(new Sigil(this.cx, this.cy, color));
    } else if (type === 'grapple') {
        const reach = 85;
        this.hitbox = {
            x: this.facing > 0 ? this.cx : this.cx - reach, y: this.y + 10, w: reach, h: 70,
            dmg: 0, kx: 0, ky: 0, type, color, isGrapple: true
        };
        this.hitboxTimer = 15;
    } else {
      let reach = type === 'heavy' ? 75 : 55;
      let dmg = (type === 'heavy' ? 13 : 7) * dmgMult;
      let kx = type === 'heavy' ? 5 : 3;
      let ky = type === 'heavy' ? -5 : -3;

      if (this.weaponHeld !== 'none') {
          const stats = WEAPON_STATS[this.weaponHeld];
          reach += stats.reach / 2;
          dmg += stats.dmg;
          kx += 2;
          this.weaponDurability--;
          if (this.weaponDurability <= 0) {
              this.weaponHeld = 'none';
          }
      }

      this.hitbox = {
        x: this.facing > 0 ? this.cx : this.cx - reach, y: this.y + 18, w: reach, h: 55,
        dmg, kx, ky, type, color
      };
      this.hitboxTimer = type === 'heavy' ? 12 : 8;
    }

    for (let i = 0; i < 8; i++) {
        particles.push(new Particle(this.cx + this.facing * 22, this.cy, this.facing * (2 + Math.random() * 3), (Math.random() - 0.6) * 3, color, 1.5 + Math.random() * 2, 14 + Math.random() * 12, false, this.groundY));
    }
  }

  runAI(opponent: Fighter, weapons: WeaponObject[]) {
    const dist = Math.abs(opponent.cx - this.cx);
    const zDist = Math.abs(opponent.z - this.z);
    const combinedDist = Math.sqrt(dist * dist + zDist * zDist);
    const now = Date.now();
    
    // Clear keys
    const k: Record<string, boolean> = {
        w: false, a: false, s: false, d: false, j: false, k: false, l: false, i: false, u: false, v: false, space: false, shift: false, e: false, q: false
    };

    if (this.state === 'dead' || this.state === 'victory' || this.state === 'cutscene') {
        this.keys = k;
        return;
    }

    if (this.isStunned) {
        // Mash to recover from stun
        if (now % 200 < 50) k.j = true;
        this.keys = k;
        return;
    }

    // Reaction to opponent pin
    if (this.isBeingPinned) {
        // Kickout logic (simulated mashing/timing)
        if (now % 150 < 40) k.j = true; 
        this.keys = k;
        return;
    }

    // Facing logic for movement
    const targetFacing = opponent.cx > this.cx ? 1 : -1;

    // Tactical Positioning: Ring Awareness
    const ringW = 1050; 
    const centerX = 450;
    const ringLeft = centerX - ringW / 2;
    const ringRight = centerX + ringW / 2;
    const inRing = this.x > ringLeft && this.x < ringRight - this.w && Math.abs(this.z) < 525;
    
    const isNearRopes = inRing && (Math.abs(this.x - ringLeft) < 100 || Math.abs(this.x - ringRight) < 100 || Math.abs(this.z - 525) < 100 || Math.abs(this.z + 525) < 100);

    // AI PERSONALITY / STRATEGY
    const isCowardly = this.hp < this.maxHp * 0.25 || this.stamina < 20;
    const isAggressive = this.sigStocks > 0 || this.finStocks > 0 || (opponent.hp < opponent.maxHp * 0.4 && !isCowardly);

    // Retreat if low stamina or HP
    if (isCowardly && combinedDist < 250) {
        if (opponent.cx > this.cx) k.a = true; else k.d = true;
        if (opponent.z > this.z) k.w = true; else k.s = true;
        if (this.stamina > 10 && Math.random() < 0.1) k.shift = true; // Run away
        this.keys = k;
        return;
    }

    // Weapon Hunting logic (Enhanced)
    const needsWeapon = this.weaponHeld === 'none' && !isCowardly && (Math.random() < 0.1 || this.sigMeter < 20);
    if (needsWeapon) {
        const nearWeapon = weapons.find(w => !w.isBroken && Math.sqrt((w.x - this.cx)**2 + (w.z - this.z)**2) < 500);
        if (nearWeapon) {
            if (nearWeapon.x > this.cx) k.d = true; else k.a = true;
            if (nearWeapon.z > this.z) k.s = true; else k.w = true;
            if (Math.abs(nearWeapon.x - this.cx) < 40 && Math.abs(nearWeapon.z - this.z) < 40) k.q = true; // Collect
            this.keys = k;
            return;
        }
    }

    // Grounded Opponent logic
    if (opponent.state === 'grounded' || opponent.state === 'ragdoll') {
        if (combinedDist < 120) {
            const roll = Math.random();
            if (roll < 0.15 && opponent.hp < opponent.maxHp * 0.3) {
                k.l = true; // PIN THEM!
            } else if (roll < 0.4) {
               k.j = true; // Ground Strike
            } else if (roll < 0.6) {
               k.k = true; // Ground Grapple / Submission
            } else {
               k.e = true; // Lift them up
            }
        } else {
            // Move toward grounded opponent
            if (opponent.cx > this.cx) k.d = true; else k.a = true;
            if (opponent.z > this.z) k.s = true; else k.w = true;
        }
        this.keys = k;
        return;
    }

    // Standard Combat Logic
    if (combinedDist > 180) {
        // Move towards
        if (opponent.cx > this.cx) k.d = true; else k.a = true;
        if (opponent.z > this.z) k.s = true; else k.w = true;
        
        // Sprint if far and aggressive
        if (combinedDist > 300 && isAggressive && Math.random() < 0.05) k.shift = true;
    } else if (combinedDist < 80) {
        // Close range: Grapples and fast strikes
        const roll = Math.random();
        if (this.finStocks > 0 && Math.random() < 0.4) {
            k.u = true; // FINISHER
        } else if (this.sigStocks > 0 && Math.random() < 0.3) {
            k.i = true; // SIGNATURE
        } else if (roll < 0.3) {
            k.l = true; // Grapple
        } else if (roll < 0.6) {
            k.j = true; // Quick Strike
        } else if (roll < 0.8) {
            k.k = true; // Strong Strike
        } else {
            // Circling logic
            if (now % 2000 < 1000) k.w = true; else k.s = true;
        }
    } else {
        // Medium range: Running attacks or approaching
        const roll = Math.random();
        if (this.isRunning && combinedDist < 150) {
            if (roll < 0.5) k.j = true; else k.l = true; // Running strike or grapple
        } else {
            if (opponent.cx > this.cx) k.d = true; else k.a = true;
            if (Math.random() < 0.05) k.j = true;
        }
    }

    // Defensive Reflexes (Reversals)
    if (opponent.reverseWindow > 0) {
        // Difficult-adjusted reversal rate
        const reversalChance = this.hp < this.maxHp * 0.3 ? 0.05 : 0.15;
        if (Math.random() < reversalChance) {
            k.i = true;
        }
    }

    this.keys = k;
  }

  update(keys: Record<string, boolean>, opponent: Fighter, projs: EnergyBolt[], sigils: Sigil[], particles: Particle[], hitFlashes: HitFlash[], worldWeapons: WeaponObject[], bloodEnabled: boolean = true) {
    this.updateGroundLevel();
    if (this.isAI) {
        this.runAI(opponent, worldWeapons);
    } else {
        this.keys = keys;
    }
    const currentKeys = this.keys;
    this.lastOpponent = opponent;

    // Standardized Input Shortcuts (Xbox Layout Mapping)
    const kJ = currentKeys.j; // X: Light Strike
    const kK = currentKeys.k; // A: Grapple / Heavy
    const kL = currentKeys.l; // B: Irish Whip / Pin
    const kI = currentKeys.i; // Y: Reversal
    const kRT = currentKeys.space; // RT: Modifier / Block
    const kLT = currentKeys.shift; // LT: Run
    const kRB = currentKeys.e; // RB: Target / Facelock
    const kLB = currentKeys.q; // LB: Pick up / Climb
    const kRun = kLT || this.isRunning;

    const dist = Math.abs(opponent.cx - this.cx);
    const zDist = Math.abs(opponent.z - this.z);
    const combinedDist = Math.sqrt(dist * dist + zDist * zDist);
    const isNearOpponent = combinedDist < 100;

    // SPIRIT / REGEN SYSTEM (Pacing)
    if (this.state !== 'dead' && this.state !== 'hurt' && this.state !== 'ragdoll' && this.state !== 'grappled') {
        const healthFactor = this.hp / this.maxHp;
        const canRegen = this.hp < this.maxHp * 0.85;
        if (canRegen) this.hp += 0.012 * (this.stamina / this.maxStamina); // Healthy wrestlers recover faster
        
        // Stamina regen - Dynamic
        const isResting = this.state === 'idle' || this.state === 'taunting';
        const regenBonus = isResting ? (0.4 + (1 - healthFactor) * 0.2) : 0.08;
        this.stamina = Math.min(this.maxStamina, this.stamina + regenBonus);
    }

    // SPRINT STAMINA DRAIN
    if (this.state === 'running') {
        this.stamina -= 0.35;
        if (this.stamina <= 0) {
            this.stamina = 0;
            this.state = 'idle'; // Stop running if exhausted
        }
    }

    // SITUATIONAL LOGIC (Predicaments)
    if (this.state === 'idle' && isNearOpponent && kRB && !this.inFacelock) {
        // Front Facelock Implementation
        this.inFacelock = true;
        this.state = 'attack';
        this.attackType = 'grapple';
        this.stateTimer = 60;
        this.grappleTarget = opponent;
        opponent.state = 'grappled';
        opponent.stateTimer = 60;
        sounds.playImpact('light');
    }

    // REVERSAL LOGIC (Broadcasting prompt)
    if (opponent.state === 'attack' && opponent.reverseWindow > 0 && kI && !this.isGrappled) {
        // SUCCESSFUL REVERSAL
        this.onImpact(0, 'light');
        this.state = 'attack';
        this.attackType = 'heavy';
        this.stateTimer = 40;
        opponent.state = 'hurt';
        opponent.stateTimer = 60;
        opponent.reverseWindow = 0;
        sounds.playCrowdReaction('gasp');
        return;
    }

    // Submission Logic
    if (this.isSubmitting || this.isBeingSubmitted) {
        const victim = this.isBeingSubmitted ? this : this.grappleTarget;
        const attacker = this.isSubmitting ? this : this.grappleTarget;
        
        if (victim && attacker) {
            // Mashing Logic for Submissions
            if (this === attacker) {
                // Attacker mashing J/K/L to force tap
                if (this.inputBuffer.some(b => now - b.time < 50)) {
                    this.submissionMeter += 0.005;
                }
            } else if (this === victim) {
                // Victim mashing space/wasd to escape
                if (this.inputBuffer.some(b => now - b.time < 50)) {
                    this.submissionMeter -= 0.008 * (this.stamina / this.maxStamina); // Healthy escaping is easier
                }
            }
            
            // AI Mashing
            if (attacker.isAI) attacker.submissionMeter += 0.004;
            if (victim.isAI) victim.submissionMeter -= 0.003;
            
            // Submission Meter Boundaries
            if (this.submissionMeter > 1) {
                // TAP OUT
                victim.hp = 0;
                victim.state = 'dead';
                attacker.state = 'idle';
                sounds.playCrowdReaction('cheer');
            } else if (this.submissionMeter < 0) {
                // ESCAPE
                this.isSubmitting = false;
                this.isBeingSubmitted = false;
                attacker.state = 'hurt';
                attacker.stateTimer = 40;
                victim.state = 'idle';
            }
        }
    }
    if (this.onGround) {
        this.rv *= 0.8;
        this.rot *= 0.9;
    }
    // Input Buffer Management
    const now = Date.now();
    Object.keys(keys).forEach(k => {
      // Key Down
      if (keys[k]) {
        if (!this.inputBuffer.some(b => b.key === k && now - b.time < 50)) {
          this.inputBuffer.push({ key: k, time: now });
          this.buttonHoldTimers[k] = (this.buttonHoldTimers[k] || 0) + 1;
        } else if (this.buttonHoldTimers[k] !== undefined) {
          this.buttonHoldTimers[k]++;
        }
      } else {
        // Key Up / Release
        this.buttonHoldTimers[k] = 0;
      }
    });
    this.inputBuffer = this.inputBuffer.filter(b => now - b.time < 500);

    // Momentum Logic (Per Frame)
    const charismaMult = 1 + (this.char.cd.charisma || 50) / 100;
    if (this.state !== 'dead' && this.state !== 'hurt') {
        // Passive gain (Scaled by charisma and stamina)
        const staminaFactor = this.stamina / this.maxStamina;
        this.sigMeter = Math.min(100, this.sigMeter + 0.05 * charismaMult * (0.5 + 0.5 * staminaFactor));
        this.finMeter = Math.min(100, this.finMeter + 0.025 * charismaMult * (0.5 + 0.5 * staminaFactor));

        if (this.sigMeter >= 100 && this.sigStocks < 6) {
            this.sigMeter = 0;
            this.sigStocks++;
            sounds.playImpact('snap'); // Feedback for stock gain
        }
        if (this.finMeter >= 100 && this.finStocks < 6) {
            this.finMeter = 0;
            this.finStocks++;
            sounds.playImpact('snap');
        }
        
        // Stamina Exhaustion Check
        if (this.stamina <= 0 && !this.isStunned && this.state !== 'ragdoll') {
            this.isStunned = true;
            this.stunTimer = 120; // 2s stagger
            this.stamina = 5; // Start recovery
            sounds.playCrowdReaction('gasp');
            this.state = 'idle'; // Reset to staggered idle
        }
    }

    if (this.lightCD > 0) this.lightCD--; if (this.heavyCD > 0) this.heavyCD--;
    if (this.specialCD > 0) this.specialCD--; if (this.ultraCD > 0) this.ultraCD--;
    if (this.hitboxTimer > 0) this.hitboxTimer--; else this.hitbox = null;
    if (this.state !== 'dead') this.energy = Math.min(this.maxEnergy, this.energy + this.energyRegen);
    if (this.comboTimer > 0) this.comboTimer--; else this.comboCount = 0;

    // Stun logic
    if (this.isStunned) {
        this.stunTimer--;
        if (this.stunTimer <= 0) {
            this.isStunned = false;
            this.stunMeter = 0;
            if (this.state === 'idle') this.stateTimer = 0;
        } else {
            // Force idle animation wobble if stunned
            if (this.state === 'idle') {
                this.animFrame = Math.floor(Date.now() / 150) % 2;
            }
        }
    } else {
        // Slow natural decay of stun meter
        if (this.stunMeter > 0) this.stunMeter -= 0.05;
    }

    // Pin logic (Victim perspective)
    if (this.isBeingPinned) {
        // Needle speed increases as health decreases
        const healthFactor = this.hp / this.maxHp;
        this.pinMeterSpeed = 0.04 + (1 - healthFactor) * 0.06;
        this.pinKickoutTarget = 0.1 + (healthFactor * 0.3); // Target window shrinks as health drops
        
        this.pinMeterPos += this.pinMeterSpeed;
        if (this.pinMeterPos >= 1) this.pinMeterPos = 0;
        
        // Check for Input
        if (keys.j || keys.k || keys.l) {
            const needle = this.pinMeterPos;
            const targetMin = 0.5 - this.pinKickoutTarget / 2;
            const targetMax = 0.5 + this.pinKickoutTarget / 2;
            
            if (needle >= targetMin && needle <= targetMax) {
                // Success! Kick out!
                this.isBeingPinned = false;
                this.state = 'ragdoll';
                this.stateTimer = 40;
                this.vx = (this.facing > 0 ? -1 : 1) * 8;
                this.vy = -6;
                this.onGround = false;
                sounds.playCrowdReaction('cheer');
                if (this.grappleTarget) {
                    this.grappleTarget.state = 'idle';
                    this.grappleTarget.stateTimer = 0;
                    this.grappleTarget.isGrappled = false;
                    this.grappleTarget.grappleTarget = null;
                }
                this.grappleTarget = null;
            } else {
                // Mistimed - small penalty to speed?
                this.pinMeterPos = 0;
            }
        }

        // Check if attacker has reached counts
        if (this.grappleTarget) {
            const pinTime = 180 - this.grappleTarget.stateTimer;
            if (pinTime >= 60 && pinTime < 62) sounds.playImpact('light'); // 1 count
            if (pinTime >= 120 && pinTime < 122) sounds.playImpact('light'); // 2 count
            if (pinTime >= 178) {
                this.state = 'dead'; // 3 count!
                this.hp = 0;
                sounds.playImpact('heavy');
                sounds.playCrowdReaction('cheer');
            }
        }
    }

    if (this.stateTimer > 0) {
      this.stateTimer--;
      
      // Procedural Move Stage Logic
      if (this.currentMove && this.currentMove.stages && this.grappleTarget) {
          const opponent = this.grappleTarget;
          const stage = this.currentMove.stages[this.moveStageIndex];
          
          if (stage) {
              const progress = 1 - (this.moveStageTimer / stage.time);
              
              const startX = this.moveOriginalPos.x;
              const startY = this.moveOriginalPos.y;
              const startRot = this.moveOriginalPos.rot;
              
              const oppStartX = this.opponentOriginalPos.x;
              const oppStartY = this.opponentOriginalPos.y;
              const oppStartRot = this.opponentOriginalPos.rot;

              // Move Attacker
              this.x = startX + stage.p1Pos.x * progress * this.facing;
              this.y = startY + stage.p1Pos.y * progress;
              this.rot = startRot + stage.p1Pos.rot * progress;
              
              // Move Opponent
              opponent.x = oppStartX + stage.p2Pos.x * progress * this.facing;
              opponent.y = oppStartY + stage.p2Pos.y * progress;
              opponent.rot = oppStartRot + stage.p2Pos.rot * progress;
              
              this.moveStageTimer--;
              
              // Secondary Reversal Window check (mid-move escapes)
              if (stage?.allowReverse && this.moveStageTimer > stage.time * 0.2 && this.moveStageTimer < stage.time * 0.8) {
                  this.secondaryReverseWindow = 2; // Always refreshing while in window
              } else {
                  this.secondaryReverseWindow = 0;
              }

              if (this.moveStageTimer <= 0) {
                  this.moveStageIndex++;
                  if (this.moveStageIndex < this.currentMove.stages.length) {
                      this.moveStageTimer = this.currentMove.stages[this.moveStageIndex].time;
                      this.moveOriginalPos = { x: this.x, y: this.y, rot: this.rot };
                      this.opponentOriginalPos = { x: opponent.x, y: opponent.y, rot: opponent.rot };
                      if (this.currentMove.stages[this.moveStageIndex].sound) {
                          sounds.playImpact('grapple');
                      }
                  } else {
                      // Move complete
                      opponent.applyDamage(this.currentMove.dmg, this.facing * this.currentMove.kx, this.currentMove.ky, 'ultra', sigils, particles);
                      this.currentMove = null;
                      this.grappleTarget = null;
                      this.state = 'idle';
                  }
              }
          }
      }

      if (this.stateTimer <= 0 && this.state !== 'dead') { 
          // Finalize taunt
          if (this.state === 'taunting' || this.attackType === 'taunt') {
              this.sigMeter = Math.min(100, this.sigMeter + 25);
              this.finMeter = Math.min(100, this.finMeter + 15);
          }

          // Finalize grapple damage if any
          if (this.currentMove && !this.currentMove.stages && this.grappleTarget) {
              const move = this.currentMove;
              const opponent = this.grappleTarget;
              opponent.applyDamage(move.dmg, this.facing * move.kx, move.ky, 'ultra', sigils, particles, this);
              this.currentMove = null;
              this.grappleTarget = null;
          }

          this.state = 'idle'; 
          this.attackType = null; 
          this.hurtFlash = false; 
          this.reverseWindow = 0;
      }
    }

    if (this.comboTimer > 0) {
        this.comboTimer--;
        if (this.comboTimer <= 0) {
            this.comboCount = 0;
            this.lastAttackKey = null;
        }
    }

    if (this.reverseWindow > 0) this.reverseWindow--;
    if (this.secondaryReverseWindow > 0) this.secondaryReverseWindow--;
    if (this.isReversing > 0) this.isReversing--;
    if (this.isRebounding > 0) this.isRebounding--;

    if (this.state === 'climbing_ladder') {
        const speed = 2.5;
        if (currentKeys.w) this.y -= speed;
        if (currentKeys.s) this.y += speed;
        this.vx = 0;
        this.vy = 0;
        
        // Clamp to ladder height (conceptual)
        if (this.y < this.groundY - 450) {
            this.y = this.groundY - 450;
            if (currentKeys.w) {
                // Try to reach or sit on top?
                this.state = 'on_turnbuckle'; // Placeholder for top of ladder
            }
        }
        if (this.y > this.groundY - this.h) {
            this.y = this.groundY - this.h;
            this.state = 'idle';
        }
        
        // Attack from ladder
        if (currentKeys.j || currentKeys.k) {
            this.state = 'attack';
            this.attackType = currentKeys.j ? 'light' : 'heavy';
            this.stateTimer = 40;
            this.vy = -5;
            this.onGround = false;
        }
        
        this.char.updatePhysics(this.cx, this.cy, this.facing, this.vx, this.vy);
        return 0;
    }

    if (this.state === 'dead' || this.state === 'victory' || this.state === 'stunned') {
      if (this.stateTimer > 0) this.stateTimer--;
      if (this.stateTimer <= 0 && this.state !== 'dead') this.state = 'idle';
      this.vx *= 0.95;
      this.char.updatePhysics(this.cx, this.cy, this.facing, this.vx, this.vy);
      return 0;
    }

    if (this.state === 'ragdoll') {
      this.vx *= 0.93; // Heavier air friction
      this.vy += 0.75; // Much heavier gravity (broadcast feel)
      this.x += this.vx; this.y += this.vy;
      this.rot += this.vx * 0.035;
      
      // Environmental Interaction: Weapons & Objects
      for (const w of worldWeapons) {
          const dist = Math.sqrt((this.cx - w.x) ** 2 + (this.cz - w.z) ** 2);
          if (dist < 60) {
              // Impact with object
              const impact = Math.abs(this.vx) + Math.abs(this.vy) + Math.abs(this.vz);
              if (impact > 5) {
                  const weightDmgMult = this.weightClass === 'super' ? 1.5 : 1.0;
                  this.applyDamage(impact * 1.8 * weightDmgMult, 0, 0, 'light', sigils, particles);
                  
                  w.durability -= 1;
                  w.vx += this.vx * 0.5;
                  w.vy += this.vy * 0.3;
                  w.onGround = false;
                  
                  // Screen Shake trigger (handled in Fight component via sound callback or similar usually, 
                  // but here we just ensure the impact is felt)

                  // Specific Material Sounds
                  if (w.type === 'chair' || w.type === 'steel_steps' || w.type === 'stop_sign') {
                      sounds.playImpact('clank');
                  } else if (w.type === 'table' || w.type === 'kendo') {
                      sounds.playImpact('wood');
                  } else if (w.type === 'glass_tube') {
                      sounds.playImpact('glass');
                  } else {
                      sounds.playImpact('heavy');
                  }

                  // Table Break Logic: Visual Shards
                  if (w.type === 'table' && (impact > 12 || this.weightClass === 'super')) {
                      w.durability = 0;
                      w.isBroken = true;
                      sounds.playImpact('wood');
                      // Spawn wood particles
                      for(let i=0; i<15; i++) {
                         particles.push(new Particle(w.x, w.y, (Math.random()-0.5)*10, -5-Math.random()*10, '#421', 4, 100, false, this.groundY));
                      }
                  }
                  // Glass Tube Break Logic
                  if (w.type === 'glass_tube' && impact > 3) {
                      w.durability = 0;
                      w.isBroken = true;
                      sounds.playImpact('glass');
                      this.spawnHitFX(w.x, w.y, '#fff', particles, false); // Glass shards
                  }
              }
          }
      }

      // Bouncing off walls (Ring Ropes)
      if (this.x < 10 || this.x > 890 - this.w) {
          this.vx *= -0.8;
          this.x = Math.max(10, Math.min(880 - this.w, this.x));
          // Sound trigger: Impact
      }

    if (this.y >= this.groundY - this.h) { 
        const prevVy = this.vy;
        this.y = this.groundY - this.h; 
        const impact = Math.abs(prevVy);
        
        // Falling damage (visceral)
        if (impact > 12) {
            this.applyDamage(impact * 6, 0, 0, 'heavy', sigils, particles);
            sigils.push(new Sigil(this.cx, this.cy, '#ff0000'));
        }

        // Material physics
        let bounciness = 0.3;
        let soundType: 'light' | 'heavy' | 'thud' | 'clank' | 'wood' | 'glass' | 'snap' | 'ring_bell' = 'light';
        
        if (this.groundType === 'mat') {
            bounciness = 0.4;
            soundType = impact > 8 ? 'thud' : 'light';
        } else if (this.groundType === 'concrete') {
            bounciness = 0.05; // Concrete is rigid
            soundType = 'heavy';
        } else if (this.groundType === 'padding') {
            bounciness = 0.2;
            soundType = 'thud';
        }
        
        this.vy = impact > 2 ? this.vy * -bounciness : 0; 
        this.vx *= 0.8;
        
        if (impact > 4) {
            this.onImpact(impact, soundType);
        }

        if (Math.abs(this.vy) < 0.2) {
            if (this.state === 'ragdoll') {
                this.state = 'grounded';
                this.stateTimer = 90;
            } else if (this.state === 'grounded' && this.stateTimer === 0) {
                this.state = 'seated';
                this.stateTimer = 60;
            } else if (this.state === 'seated' && this.stateTimer === 0) {
                this.state = 'kneeling';
                this.stateTimer = 60;
            } else if (this.state === 'kneeling' && this.stateTimer === 0) {
                this.state = 'idle';
            }
            this.rot = 0;
        }
    }
      this.char.updatePhysics(this.cx, this.cy, this.facing, this.vx, this.vy);
      return 0;
    }

    if (this.state === 'grappled') {
        const target = this.grappleTarget;
        if (target) {
            this.x = target.cx + target.facing * 30 - this.w / 2;
            this.y = target.y + 5;
            this.facing = -target.facing;
            this.vx = target.vx;
            this.vy = target.vy;
            if (target.state !== 'attack' || target.attackType !== 'grapple') {
                this.state = 'idle';
                this.grappleTarget = null;
            }
        } else {
            this.state = 'idle';
        }
        this.char.updatePhysics(this.cx, this.cy, this.facing, this.vx, this.vy);
        return 0;
    }

    if (this.state === 'hurt') {
      this.vx *= 0.78; this.vy += 0.6; this.x += this.vx; this.y += this.vy;
      if (this.y >= this.groundY - this.h) { this.y = this.groundY - this.h; this.vy = 0; this.onGround = true; }
      this.char.updatePhysics(this.cx, this.cy, this.facing, this.vx, this.vy);
      return 0;
    }

    // Reversal / Combo Breaker logic (WWE 2K style)
    if (this.state === 'idle' || this.state === 'walk' || this.state === 'running' || this.state === 'stagger' || this.state === 'being_grappled') {
        if (opponent.reverseWindow > 0 || opponent.secondaryReverseWindow > 0) {
            let triggeredReversal = false;
            
            // 1. Standard Reversal Key (Y/Triangle style)
            if (kI) triggeredReversal = true;
            
            // 2. Combo Breaker: Match the opponent's button
            if (opponent.lastAttackKey === 'light' && kJ) triggeredReversal = true;
            if (opponent.lastAttackKey === 'heavy' && kK) triggeredReversal = true;
            if (opponent.lastAttackKey === 'grapple' && kK && kRT) triggeredReversal = true;
            
            if (triggeredReversal) {
                this.executeReversal(opponent, projs, sigils, particles);
                return 0;
            }
        } else if (kI && !this.isReversing && this.state === 'idle') {
            // Whiffed reversal penalty
            this.isReversing = 15;
        }
    }

    if (currentKeys.i && this.onGround && this.state === 'idle') {
        this.state = 'taunting';
        this.stateTimer = 80;
        this.attackType = 'taunt';
        sounds.playImpact('grapple'); 
        sounds.playCrowdReaction('cheer');
    }

    // Climbing logic
    if (this.onGround && (this.state === 'idle' || this.state === 'walk' || this.state === 'running')) {
        const atCorner = this.x < 100 || this.x > this.worldW - 100;
        if (atCorner) {
            if (this.state === 'running') {
                this.state = 'on_turnbuckle';
                this.y = this.groundY - 120;
                this.onGround = false;
            } else if (this.state === 'walk') {
                this.walkToCornerTimer = (this.walkToCornerTimer || 0) + 1;
                if (this.walkToCornerTimer > 90) { // 1.5 seconds
                    this.state = 'on_turnbuckle_middle';
                    this.y = this.groundY - 60;
                    this.onGround = false;
                    this.walkToCornerTimer = 0;
                }
            }
        }
    }

    if (this.state === 'on_turnbuckle' || this.state === 'on_turnbuckle_middle') {
        this.vx = 0; this.vy = 0;
        if (currentKeys.s) { this.state = 'idle'; this.onGround = true; this.y = this.groundY - this.h; }
        if (kJ || kK) { this.executeAttack(kJ ? 'light' : 'heavy', projs, sigils, particles); return 0; }
    }

    if (this.state === 'attack' && this.attackType === 'grapple' && this.grappleTarget) {
        if (kJ) {
            this.state = 'carrying';
            this.stateTimer = 180;
        }
        if (kJ || kK) {
            this.throwOpponent(this.grappleTarget, projs, sigils, particles, worldWeapons);
            return 0;
        }
    }

    if (this.state === 'carrying' && this.grappleTarget) {
        let speed = kRun ? 3.5 : 1.5;
        if (currentKeys.a) { this.vx = -speed; this.facing = -1; }
        else if (currentKeys.d) { this.vx = speed; this.facing = 1; }
        else this.vx = 0;

        if (kJ || kK) {
            this.throwOpponent(this.grappleTarget, projs, sigils, particles, worldWeapons);
        }

        const target = this.grappleTarget;
        target.x = this.cx + this.facing * 10 - target.w / 2;
        target.y = this.cy - 65;
        target.state = 'held';
        target.rot = Math.PI;
        target.vx = this.vx;
        target.vy = 0;
    }

    if (this.state === 'idle' || this.state === 'walk' || this.state === 'running' || this.state === 'stagger') {
      const staminaFactor = (this.stamina / this.maxStamina);
      const speedMult = (staminaFactor * 0.3 + 0.7); // Low stamina slows you down
      let speed = kLT ? 7.6 * speedMult : 4.2 * speedMult;
      
      if (currentKeys.a) { this.vx = -speed; this.state = kLT ? 'running' : 'walk'; this.facing = -1; }
      else if (currentKeys.d) { this.vx = speed; this.state = currentKeys.shift ? 'running' : 'walk'; this.facing = 1; }
      else { 
          this.vx *= 0.72; 
          if (this.state === 'running' || this.state === 'walk') this.state = 'idle';
      }

      const pW = currentKeys.w || currentKeys.arrowup;
      const pS = currentKeys.s || currentKeys.arrowdown;
      if (pW && this.onGround) this.z += speed * 0.5;
      if (pS && this.onGround) this.z -= speed * 0.5;

      ScenePhysics.checkBounds(this, this.worldW);
      ScenePhysics.checkTableBreaks(this, worldWeapons, particles);

      // ATTACKS & GRAPPLES (Tactical Layout)
      if (kJ) this.executeAttack(kRT ? 'heavy' : 'light', projs, sigils, particles);
      if (kK) this.executeAttack('grapple', projs, sigils, particles);
      
      // PIN / WHIP Context
      if (kL && this.onGround && this.state === 'idle') {
          if (isNearOpponent && (opponent.state === 'grounded' || opponent.state === 'ragdoll')) {
              this.tryPin(opponent);
          } else if (isNearOpponent) {
              this.executeAttack('whip', projs, sigils, particles);
          }
      }

      // TAUNT (Contextual DPAD)
      if (currentKeys.t) {
           const ms = this.char.cd.moveset.taunts;
           let pool = ms.standing;
           if (this.state === 'idle' && pool.length > 0) {
               const taunt = pool[Math.floor(Math.random() * pool.length)];
               this.state = 'attack';
               this.attackType = 'taunt';
               this.stateTimer = taunt.time;
               this.stunMeter = Math.min(100, this.stunMeter + 15);
               sounds.playCrowdReaction('cheer');
           }
      }

      // Modifier Actions (Blocking)
      if (kRT && this.state === 'idle') {
          this.isReversing = 10; // Active block frames
      }
    }

    // Grapple State Inputs (when performing a grapple)
    if (this.state === 'attack' && this.attackType === 'grapple' && this.grappleTarget) {
        const dir = { 
          x: currentKeys.a ? -1 : (currentKeys.d ? 1 : 0), 
          y: currentKeys.w ? -1 : (currentKeys.s ? 1 : 0) 
        };
        const anyThis = (this as any);
        if (currentKeys.j) { anyThis.grappleAction('light', dir, sigils); return 0; }
        if (currentKeys.k) { anyThis.grappleAction('heavy', dir, sigils); return 0; }
        if (currentKeys.l) { anyThis.grappleAction('whip', dir, sigils); return 0; }
    }
    if (this.state === 'attack' && this.onGround) this.vx *= 0.5;

    this.x += this.vx; this.vy += 0.58; this.y += this.vy;
    const gnd = this.groundY - this.h;
    if (this.y >= gnd) { this.y = gnd; this.vy = 0; this.onGround = true; if (this.state === 'jump') this.state = 'idle'; }
    else this.onGround = false;

    // Rope Rebound Logic
    const LEFT_ROPE = 20;
    const RIGHT_ROPE = 880 - this.w;
    if (this.x < LEFT_ROPE || this.x > RIGHT_ROPE) {
      if (this.state === 'running') {
        this.vx = -this.vx * 1.2; // Bounce back with acceleration
        this.facing = -this.facing;
        this.x = this.x < LEFT_ROPE ? LEFT_ROPE + 5 : RIGHT_ROPE - 5;
        this.isRebounding = 40; // Window for rebound attacks
        sounds.playImpact('grapple');
        sigils.push(new Sigil(this.cx, this.cy, '#ffffff'));
      } else {
        this.x = Math.max(0, Math.min(900 - this.w, this.x));
        this.vx = 0;
      }
    }
    if (this.state !== 'attack') this.facing = opponent.cx > this.cx ? 1 : -1;

    this.animTimer++;
    if (this.animTimer > 7) { this.animTimer = 0; this.animFrame = (this.animFrame + 1) % 4; }

    this.char.updatePhysics(this.cx, this.cy, this.facing, this.vx, this.vy);

    // Sync poseState for 3D engine refined animations
    this.poseState = this.state;
    if (this.state === 'attack') {
        if (this.attackType === 'light') this.poseState = 'strike-light';
        else if (this.attackType === 'heavy') this.poseState = 'strike-heavy';
        else if (this.attackType === 'grapple' || this.attackType === 'special' || this.attackType === 'ultra') {
             this.poseState = this.currentMove?.animation || 'grappling';
        }
    } else if (this.state === 'idle' && this.isStunned) {
        this.poseState = 'stagger';
    } else if (this.isBeingSubmitted || this.isBeingPinned) {
        this.poseState = 'ragdoll';
    }

    // Collision check melee (moved from end of update)
    if (this.hitbox && this.hitboxTimer > 0) {
      const hb = this.hitbox, or = opponent.getRect();
      if (hb.x < or.x + or.w && hb.x + hb.w > or.x && hb.y < or.y + or.h && hb.y + hb.h > or.y) {
        if (hb.isGrapple) {
            this.startGrapple(opponent, sigils, particles);
        } else {
            opponent.applyDamage(hb.dmg, hb.kx, hb.ky, hb.type, sigils, particles);
            opponent.spawnHitFX(opponent.cx, opponent.cy, hb.color, particles, bloodEnabled);
            hitFlashes.push(new HitFlash(opponent.cx, opponent.cy - 55, hb.type === 'heavy' ? 'HEAVY!' : 'STRIKE!', hb.color, hb.type === 'heavy' ? 28 : 20));
            this.comboCount++; this.comboTimer = 120;
        }
        this.hitbox = null; this.hitboxTimer = 0;
        return hb.type === 'heavy' ? 8 : 4;
      }
    }
    return 0;
  }

  checkPosition(): 'standing' | 'corner' | 'apron' | 'running' | 'aerial' | 'rope' {
      const worldW = 1000;
      const cornerMargin = 80;
      const apronMargin = 120;
      
      if (!this.onGround || this.y < this.groundY - this.h - 20) return 'aerial';
      if (Math.abs(this.vx) > 4.5) return 'running';
      if (this.x < cornerMargin || this.x > worldW - cornerMargin) return 'corner';
      if (this.x < apronMargin || this.x > worldW - apronMargin) return 'apron';
      
      // Check ropes (simplified)
      if (Math.abs(this.x - worldW/2) > 380) return 'rope';

      return 'standing';
  }

  getProceduralMove(category: string, type: AttackType): Move {
      const ms = this.char.cd.moveset;
      let list = (ms as any)[category] || [];
      
      if (!list || list.length === 0) {
          if (type === 'light') list = ms.light || [];
          if (type === 'heavy') list = ms.heavy || [];
          if (type === 'grapple') list = ms.grapples || [];
          if (type === 'special') list = ms.signatures || [];
      }
      
      if (!list || list.length === 0) {
          return { 
              name: 'Generic Strike', 
              dmg: 10, kx: 2, ky: -2, time: 20,
              category: 'standing',
              animation: 'strike'
          };
      }

      return list[Math.floor(Math.random() * list.length)];
  }

  executeAttack(type: AttackType, projs: EnergyBolt[], sigils: Sigil[], particles: Particle[]) {
    const opponent = this.lastOpponent;
    if (!opponent) return;

    if (this.state === 'dead' || this.state === 'hurt' || this.state === 'grappled') return;

    // Use Context-Aware standardized keys
    const kRTModifier = this.keys.space; // RT Modifier
    const isHold = this.inputBuffer.some(b => b.key === (type === 'light' ? 'j' : 'k') && (Date.now() - b.time > 150));

    const isBack = opponent.facing === this.facing;
    const isGrounded = opponent.state === 'grounded' || (opponent.state === 'ragdoll' && opponent.onGround);
    const pos = this.checkPosition();

    // Special moves (Signature/Finisher - Space + Attack)
    if (kRTModifier && (this.keys.j || this.keys.k)) {
        if (this.sigStocks > 0 || this.finStocks > 0) {
            const moveType = this.finStocks > 0 ? 'finisher' : 'signature';
            this[moveType === 'finisher' ? 'finStocks' : 'sigStocks']--;
            this.performComplexMove(moveType, isHold, opponent, projs, sigils, particles);
            return;
        }
    }

    // Catch finishers logic
    if (!this.onGround && opponent.state === 'attack' && this.sigStocks > 0) {
        // Diving catch? (conceptual)
    }

    // Determine move pool based on situation
    const ms = this.char.cd.moveset;
    let pool: Move[] = [];
    
    // Diving Attacks
    if (this.state === 'on_turnbuckle' || this.state === 'on_turnbuckle_middle') {
        pool = isGrounded ? ms.divingGround : ms.divingStanding;
        if (!pool || pool.length === 0) pool = ms.heavy; // Fallback
        
        const move = pool[0]; // Take primary diving move
        if (move) {
            this.state = 'attack';
            this.attackType = 'heavy';
            this.currentMove = move;
            this.stateTimer = move.time || 60;
            this.vy = -5;
            this.vx = (opponent.cx - this.cx) / 10; // Launch towards opponent
            this.onGround = false;
            sounds.playImpact('heavy');
            return;
        }
    }

    // Opponent states
    const isSeated = opponent.state === 'seated' || opponent.state === 'corner_seated';
    const isKneeling = opponent.state === 'kneeling';

    if (isGrounded) {
        const distToOpp = Math.abs(this.cx - opponent.cx);
        if (distToOpp < 50) pool = ms.groundHead;
        else if (distToOpp < 120) pool = ms.groundSide;
        else pool = ms.groundFeet;
    } else if (isSeated) {
        pool = ms.groundSeated;
    } else if (isKneeling) {
        pool = ms.groundKneeling;
    } else if (pos === 'corner') {
        if (isBack) pool = ms.cornerBack;
        else if (opponent.state === 'corner_seated') pool = ms.cornerSeated;
        else pool = ms.cornerFront;
    } else if (this.state === 'running') {
        pool = type === 'grapple' ? ms.runningGrapple : (type === 'heavy' ? ms.runningHeavy : ms.runningStrike);
    } else if (isBack) {
        pool = ms.backGrapples;
    } else {
        // Neutral Standing
        if (type === 'light') pool = ms.light;
        else if (type === 'heavy') pool = ms.heavy;
        else if (type === 'grapple') pool = ms.grapples;
    }

    if (!pool || pool.length === 0) {
        pool = [this.getProceduralMove(type === 'grapple' ? 'grapples' : 'light', type)];
    }

    const kJ = this.keys['w'] || this.keys['arrowup'];
    const kDown = this.keys['s'] || this.keys['arrowdown'];
    const kL = this.keys['a'] || this.keys['arrowleft'];
    const kR = this.keys['d'] || this.keys['arrowright'];
    const dir = { x: kL ? -1 : (kR ? 1 : 0), y: kJ ? -1 : (kDown ? 1 : 0) };
    
    let slot = 0;
    if (dir.y < -0.5) slot = 1; else if (dir.y > 0.5) slot = 2; else if (dir.x !== 0) slot = 3;
    
    const kModifier = this.keys['shift'] || this.keys['r'];
    if (kModifier && pool.length > 5) slot += 5;

    let move = pool[slot] || pool[0];
    if (!move) return;

    // Resource Check
    const cost = type === 'heavy' ? 5 : 0;
    if (this.energy < cost) return;
    this.energy -= cost;

    // Execution
    this.state = 'attack';
    this.attackType = type;
    this.lastAttackKey = type as any;
    this.stateTimer = move.time || 20;
    this.reverseWindow = 12;
    this.currentMove = move;
    
    const cdKey = type === 'light' ? 'lightCD' : type === 'heavy' ? 'heavyCD' : type === 'special' ? 'specialCD' : 'ultraCD';
    (this as any)[cdKey] = this.stateTimer + 10;

    const reach = (type === 'heavy' ? 70 : 50) + (this.weaponHeld !== 'none' ? 30 : 0);
    this.hitbox = {
        x: this.facing > 0 ? this.cx : this.cx - reach,
        y: this.y + 20,
        w: reach, h: 60,
        dmg: move.dmg, kx: move.kx, ky: move.ky, type,
        color: this.char.cd.sigil,
        isGrapple: type === 'grapple'
    };
    this.hitboxTimer = 10;

    sounds.playImpact(type === 'heavy' ? 'heavy' : 'light');
    
    this.sigMeter = Math.min(100, this.sigMeter + 2);
    this.finMeter = Math.min(100, this.finMeter + 1);
  }

  performComplexMove(type: 'signature' | 'finisher', isHold: boolean, opponent: Fighter, projs: EnergyBolt[], sigils: Sigil[], particles: Particle[]) {
      this.state = 'attack';
      this.attackType = type === 'signature' ? 'special' : 'ultra';
      this.stateTimer = 80;
      
      const ms = this.char.cd.moveset;
      const list = type === 'signature' ? ms.signatures : ms.finishers;
      
      // Situational logic (WWE 2k style)
      const dist = Math.abs(this.cx - opponent.cx);
      const isBack = opponent.facing === this.facing;
      const isGrounded = opponent.state === 'grounded' || (opponent.state === 'ragdoll' && opponent.onGround);
      const isCorner = this.x < 100 || this.x > 800; // Simplified ring corner detection
      const isDiving = !this.onGround;

      // Filter list based on situation
      let move: Move | undefined;
      
      // Weight check for lifting moves
      const category = isDiving ? 'diving' : (isGrounded ? 'ground' : (isCorner ? 'corner' : (isBack ? 'back' : 'standing')));
      const isLiftingMove = category === 'standing' || category === 'back'; // Rough approximation
      
      if (isLiftingMove && !this.canLift(opponent)) {
          // Fail to lift
          opponent.applyDamage(10, this.facing * 2, -2, 'heavy', sigils, particles, this);
          this.stateTimer = 40;
          this.vx = -this.facing * 3;
          sounds.playImpact('light');
          return;
      }

      if (isDiving) move = list.find(m => m.category === 'diving');
      else if (isGrounded) move = list.find(m => m.category === 'ground');
      else if (isCorner) move = list.find(m => m.category === 'corner');
      else if (isBack) move = list.find(m => m.category === 'back');
      
      // Default to first signature/finisher if no situational match
      if (!move) move = list[0];
      if (!move) move = defaultMoveset[type === 'signature' ? 'signatures' : 'finishers'][0];

      opponent.state = 'stunned';
      opponent.stateTimer = move.time || 60;
      this.stateTimer = move.time || 60;

      // Special visual effects
      sounds.playImpact('heavy');
      sounds.playImpact('grapple');
      sigils.push(new Sigil(this.cx, this.cy, this.char.cd.sigil));
      
      for (let i = 0; i < 20; i++) {
          particles.push(new Particle(opponent.cx, opponent.cy, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, this.char.cd.sigil, 2, 30));
      }

      // Damage & Knockback
      opponent.applyDamage(move.dmg, this.facing * move.kx, move.ky, this.attackType, sigils, particles);
      
      // Final flash removed for realism
      // const flashColor = type === 'signature' ? '#00ccff' : '#ff2244';
      // sigils.push(new Sigil(opponent.cx, opponent.cy, flashColor));
  }

  tryInteraction(opponent: Fighter, weapons: WeaponObject[], keys: any, sigils: Sigil[]) {
    const kJ = this.isAI ? this.keys.w : (this.isP2 ? keys['arrowup'] : keys['w']);
    const kDown = this.isAI ? this.keys.s : (this.isP2 ? keys['arrowdown'] : keys['s']);
    const kL = this.isAI ? this.keys.a : (this.isP2 ? keys['arrowleft'] : keys['a']);
    const kR = this.isAI ? this.keys.d : (this.isP2 ? keys['arrowright'] : keys['d']);
    const worldW = 1000;

    // 0. Ladder Climbing logic merged
    if (this.state !== 'attack' && this.state !== 'hurt') {
        const ladderRange = 60;
        const ladder = weapons.find(w => w.type === 'ladder' && w.onGround && Math.abs(w.x - this.cx) < ladderRange);
        if (ladder && kJ) {
            this.state = 'climbing_ladder';
            this.x = ladder.x - this.w / 2;
            return;
        }
    }

    // 1. Catch weapon mid-air
    const catchRange = 80;
    const airWeaponIdx = weapons.findIndex(w => !w.onGround && Math.abs(w.x - this.cx) < catchRange && Math.abs(w.y - this.cy) < catchRange);
    if (airWeaponIdx !== -1) {
        if (this.weaponHeld !== 'none') this.dropWeapon(weapons);
        this.weaponHeld = weapons[airWeaponIdx].type;
        this.weaponDurability = weapons[airWeaponIdx].durability;
        this.maxWeaponDurability = weapons[airWeaponIdx].maxDurability;
        weapons.splice(airWeaponIdx, 1);
        return;
    }

    // 2. Drop or Pickup existing weapon
    if (this.weaponHeld !== 'none' && kDown) { 
        this.dropWeapon(weapons);
        return;
    }

    const pickupRange = 60;
    const groundWeaponIdx = weapons.findIndex(w => w.onGround && Math.abs(w.x - this.cx) < pickupRange && Math.abs(w.y - this.cy) < pickupRange);
    if (groundWeaponIdx !== -1) {
        if (this.weaponHeld !== 'none') this.dropWeapon(weapons);
        this.weaponHeld = weapons[groundWeaponIdx].type;
        this.weaponDurability = weapons[groundWeaponIdx].durability;
        this.maxWeaponDurability = weapons[groundWeaponIdx].maxDurability;
        weapons.splice(groundWeaponIdx, 1);
        sounds.playImpact('light');
        return;
    }

    // 2. Turnbuckle Pad
    const isAtLeftCorner = this.x < 100;
    const isAtRightCorner = this.x > worldW - 100;
    if ((isAtLeftCorner && kL) || (isAtRightCorner && kR)) {
        sounds.playImpact('heavy');
        sigils.push(new Sigil(this.x + (isAtLeftCorner ? 0 : 100), this.groundY - 100, '#fff'));
        return;
    }

    // 3. Announce Table
    for (const w of weapons) {
        if (w.type === 'table' && w.durability > 0 && Math.sqrt((this.cx - w.x) ** 2 + (this.cy - w.y) ** 2) < 80) {
            sounds.playImpact('heavy');
            sigils.push(new Sigil(w.x, w.y, '#663300'));
            return;
        }
    }

    // 4. Exit Ring
    if (((isAtLeftCorner && kL) || (isAtRightCorner && kR) || kDown) && this.onGround && this.state === 'idle') {
        if (this.x < 150) this.x = -50; 
        else if (this.x > worldW - 150) this.x = worldW + 50; 
        else this.y = this.groundY + 100; 
        sounds.playImpact('light');
        return;
    }

    // 5. Try grapple / Toss
    const dist = Math.abs(this.cx - opponent.cx);
    if (this.state === 'attack' && this.attackType === 'grapple' && this.grappleTarget) {
        this.throwOpponent(this.grappleTarget, [], sigils, [], weapons);
        return;
    }
    
    if (dist < 80) {
        if (opponent.onGround && (opponent.state === 'stunned' || opponent.state === 'ragdoll')) {
            const isHead = Math.abs(this.cx - opponent.cx) < 30; // Closer to head
            const dir = { 
                x: kL ? -1 : (kR ? 1 : 0), 
                y: kJ ? -1 : (kDown ? 1 : 0) 
            };
            
            let slot = 0;
            if (dir.y < -0.5) slot = 1;      // Up
            else if (dir.y > 0.5) slot = 2; // Down
            else if (dir.x !== 0) slot = 3; // Side
            
            const ms = this.char.cd.moveset;
            const pool = isHead ? ms.groundHead : ms.groundFeet;
            const move = pool[slot] || pool[0];
            
            if (move) {
                this.executeSpecificMove(move, opponent, sigils);
            } else {
                this.tryPin(opponent);
            }
        } else {
            this.executeAttack('grapple', [], sigils, []);
        }
    }
  }

  startGrapple(opponent: Fighter, sigils: Sigil[], particles: Particle[]) {
    if (opponent.state === 'dead') return;
    
    // Catch Finisher check
    if (opponent.state === 'ragdoll' || !opponent.onGround) {
        sounds.playImpact('heavy');
        opponent.applyDamage(25, 0, -5, 'ultra', sigils, particles); // Bonus catch damage
        return;
    }

    this.grappleTarget = opponent;
    this.state = 'attack';
    this.attackType = 'grapple';
    this.lastAttackKey = 'grapple';
    this.stateTimer = 120;
    this.animFrame = 0;
    this.reverseWindow = 12;
    
    opponent.state = 'grappled';
    opponent.grappleTarget = this;
    opponent.stateTimer = 120;
    opponent.facing = -this.facing;
    sounds.playImpact('grapple');
  }

  grappleAction(action: 'light' | 'heavy' | 'whip', direction: { x: number, y: number }, sigils: Sigil[]) {
    if (!this.grappleTarget) return;
    const opponent = this.grappleTarget;
    
    if (action === 'whip') {
        const whipPower = 15;
        opponent.state = 'ragdoll';
        opponent.stateTimer = 60;
        opponent.vx = direction.x !== 0 ? direction.x * whipPower : -this.facing * whipPower;
        opponent.vy = -2;
        this.state = 'idle';
        this.grappleTarget = null;
        sounds.playImpact('heavy');
        return;
    }

    // Weight Detection
    if (!this.canLift(opponent)) {
        const isHeavyMove = action === 'heavy' || direction.y !== 0; 
        if (isHeavyMove) {
            this.state = 'attack';
            this.stateTimer = 40;
            this.vx = -this.facing * 3;
            opponent.state = 'idle';
            opponent.stateTimer = 0;
            this.grappleTarget = null;
            sounds.playImpact('light');
            sigils.push(new Sigil(this.cx, this.cy, '#ff0000'));
            return;
        }
    }
    
    // Directional move selection logic
    const ms = this.char.cd.moveset;
    let slot = 0;
    if (action === 'light') {
        if (direction.y < -0.5) slot = 1;      // Up
        else if (direction.y > 0.5) slot = 2; // Down
        else if (direction.x !== 0) slot = 3; // Side
        else slot = 0;                        // Neutral
    } else {
        if (direction.y < -0.5) slot = 6;      // Up Heavy
        else if (direction.y > 0.5) slot = 7; // Down Heavy
        else if (direction.x !== 0) slot = 8; // Side Heavy
        else slot = 5;                        // Neutral Heavy
    }
    
    const move = ms.grapples[slot] || ms.grapples[0] || { name: 'Fallback Suplex', dmg: 20, kx: 5, ky: -10, time: 60, category: 'standing', animation: 'grapple' };
    this.executeSpecificMove(move, opponent, sigils);
  }

  executeSpecificMove(move: Move, opponent: Fighter, sigils: Sigil[]) {
      this.state = 'attack';
      this.attackType = 'grapple';
      this.lastAttackKey = 'grapple';
      this.stateTimer = move.time;
      this.animFrame = 0;
      this.reverseWindow = 15; // Window to reverse the move execution
      this.currentMove = move;
      
      if (move.stages && move.stages.length > 0) {
          this.moveStageIndex = 0;
          this.moveStageTimer = move.stages[0].time;
          this.moveOriginalPos = { x: this.x, y: this.y, rot: this.rot };
          this.opponentOriginalPos = { x: opponent.x, y: opponent.y, rot: opponent.rot };
          opponent.state = 'being_grappled';
          opponent.stateTimer = move.time;
      } else {
          // Legacy or simplified move execution
          const target = move.limbTarget || (
              (move.name.toLowerCase().includes('ddt') || move.name.toLowerCase().includes('piledriver')) ? 'head' : 'body'
          );
          
          if (target === 'head') opponent.limbDamage.head += move.dmg * 0.8;
          else if (target === 'legs') opponent.limbDamage.legs += move.dmg * 0.8;
          else if (target === 'arms') opponent.limbDamage.arms += move.dmg * 0.8;
          else opponent.limbDamage.body += move.dmg * 0.8;

          opponent.state = 'being_grappled';
          opponent.stateTimer = move.time;
      }
  }

  tryPin(opponent: Fighter) {
    if (opponent.onGround && (opponent.state === 'stunned' || opponent.state === 'ragdoll')) {
      this.state = 'attack';
      this.attackType = 'grapple';
      this.stateTimer = 180; // 3 count
      
      opponent.isBeingPinned = true;
      opponent.pinProgress = 0;
      opponent.pinMeterPos = 0;
      opponent.pinMeterSpeed = 0.01 + (opponent.energy / opponent.maxEnergy) * 0.03;
      
      // Target bar for kickout (smaller if more damaged)
      const healthFactor = opponent.energy / opponent.maxEnergy;
      opponent.pinKickoutTarget = 0.2 + (healthFactor * 0.4);
      
      this.grappleTarget = opponent;
      sounds.playImpact('grapple');
    }
  }

  kickout(type: 'tap' | 'meter') {
      if (!this.isBeingPinned) return;
      
      const success = Math.abs(this.pinMeterPos - 0.5) < this.pinKickoutTarget / 2;
      
      if (success) {
          this.isBeingPinned = false;
          this.state = 'ragdoll';
          this.stateTimer = 30;
          this.vy = -8;
          this.vx = this.facing * -5;
          if (this.grappleTarget) {
              this.grappleTarget.state = 'idle';
              this.grappleTarget.stateTimer = 0;
          }
          sounds.playImpact('light');
      } else {
          // Failed attempt reduces resiliency or increases pin speed
          this.pinMeterSpeed += 0.005;
      }
  }

  executeReversal(opponent: Fighter, projs: EnergyBolt[], sigils: Sigil[], particles: Particle[]) {
      opponent.state = 'stunned';
      opponent.stateTimer = 45;
      opponent.vx = this.facing * -5;
      opponent.vy = -4;
      opponent.reverseWindow = 0;
      opponent.grappleTarget = null;
      this.grappleTarget = null;
      this.state = 'idle';
      
      this.sigMeter = Math.min(100, this.sigMeter + 15);
      sounds.playImpact('grapple');
      
      // Flash effect or hitFX
      opponent.spawnHitFX(opponent.cx, opponent.cy, this.char.cd.sigil, particles, true);
  }

  throwOpponent(opponent: Fighter, projs: EnergyBolt[], sigils: Sigil[], particles: Particle[], weapons: WeaponObject[]) {
    this.state = 'attack';
    this.attackType = 'heavy';
    this.stateTimer = 40;
    
    opponent.state = 'ragdoll';
    opponent.vx = this.facing * 16;
    opponent.vy = -10;
    opponent.grappleTarget = null;
    this.grappleTarget = null;

    // Check for weapons in the path within a certain range
    const slamRange = 100;
    const targetWeapon = weapons.find(w => 
        w.onGround && 
        Math.abs(w.x - (this.cx + this.facing * 60)) < slamRange &&
        Math.abs(w.y - this.groundY) < 50
    );

    if (targetWeapon) {
        // Slammed into weapon!
        opponent.applyDamage(35, this.facing * 5, -8, 'heavy', sigils, particles, this);
        targetWeapon.durability -= 2;
        sounds.playImpact('heavy');
        
        if (targetWeapon.type === 'table') {
            targetWeapon.durability = 0;
            sounds.playCrowdReaction('shock');
            particles.push(new Particle(targetWeapon.x, targetWeapon.y, 0, -2, '#885500', 3, 40));
        }
        
        // Visual effect for object slam
        sigils.push(new Sigil(targetWeapon.x, targetWeapon.y - 20, '#ffffff'));
    } else {
        opponent.applyDamage(22, this.facing * 16, -10, 'heavy', sigils, particles, this);
    }
  }

  dropWeapon(weapons: WeaponObject[]) {
    weapons.push({
        id: 'w_' + Date.now(),
        type: this.weaponHeld,
        x: this.cx, y: this.cy - 10,
        z: this.z,
        vx: this.facing * 5, vy: -4,
        rotation: 0, rv: this.facing * 0.2,
        onGround: false,
        durability: this.weaponDurability,
        maxDurability: this.maxWeaponDurability
    });
    this.weaponHeld = 'none';
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.char.draw(ctx, this.cx, this.cy, this.facing, this.state, this.animFrame, this.attackType, this.hurtFlash, this.rot, this.isReversing);
  }
}
