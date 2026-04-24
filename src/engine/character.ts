/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { CharacterData, FighterState, AttackType } from '../types';
import { HairChain, JigglePart } from './physics';

export class ProceduralCharacter {
  cd: CharacterData;
  jBreastL!: JigglePart;
  jBreastR!: JigglePart;
  jGluteL!: JigglePart;
  jGluteR!: JigglePart;
  jBelly?: JigglePart;
  jArmL!: JigglePart;
  jArmR!: JigglePart;
  jThighL!: JigglePart;
  jThighR!: JigglePart;
  hairChains: HairChain[] = [];

  constructor(charData: CharacterData) {
    this.cd = charData;
    this.initPhysics();
  }

  initPhysics() {
    const cd = this.cd;
    const isFem = cd.gender === 'female';
    const isHeavy = cd.bodyType === 'heavy';
    const isStocky = cd.bodyType === 'stocky';

    if (isFem && cd.breastSize > 0) {
      const bs = cd.breastSize;
      this.jBreastL = new JigglePart(-10, -20, 8 + bs * 10, 7 + bs * 8, 0.08 - bs * 0.02, 0.62, 0.9 + bs * 0.5, true);
      this.jBreastR = new JigglePart(10, -20, 8 + bs * 10, 7 + bs * 8, 0.08 - bs * 0.02, 0.62, 0.9 + bs * 0.5, true);
    } else {
      this.jBreastL = new JigglePart(-9, -18, 8 + cd.muscleMass * 6, 6 + cd.muscleMass * 4, 0.22, 0.80, 0.6 + cd.muscleMass * 0.3, false);
      this.jBreastR = new JigglePart(9, -18, 8 + cd.muscleMass * 6, 6 + cd.muscleMass * 4, 0.22, 0.80, 0.6 + cd.muscleMass * 0.3, false);
    }

    const gs = isFem ? cd.gluteSize : cd.fatMass * 0.4;
    const gluteStiffness = isFem ? 0.09 - gs * 0.03 : 0.20;
    this.jGluteL = new JigglePart(-8, 18, 10 + gs * 12, 9 + gs * 10, gluteStiffness, 0.65, 1.0 + gs * 0.6, isFem);
    this.jGluteR = new JigglePart(8, 18, 10 + gs * 12, 9 + gs * 10, gluteStiffness, 0.65, 1.0 + gs * 0.6, isFem);

    if (cd.fatMass > 0.4 || isHeavy) {
      const fm = cd.fatMass;
      this.jBelly = new JigglePart(0, 2, 14 + fm * 14, 10 + fm * 10, 0.12, 0.68, 1.2 + fm * 0.8, false);
    }

    this.jArmL = new JigglePart(-22, -8, 7 + cd.muscleMass * 5, 5 + cd.muscleMass * 3, 0.3, 0.82, 0.5);
    this.jArmR = new JigglePart(22, -8, 7 + cd.muscleMass * 5, 5 + cd.muscleMass * 3, 0.3, 0.82, 0.5);

    this.jThighL = new JigglePart(-10, 30, 9 + cd.fatMass * 8 + cd.muscleMass * 5, 8 + cd.fatMass * 6, 0.18, 0.76, 0.8);
    this.jThighR = new JigglePart(10, 30, 9 + cd.fatMass * 8 + cd.muscleMass * 5, 8 + cd.fatMass * 6, 0.18, 0.76, 0.8);

    const hLen = Math.max(1, cd.hairLength);
    const hStiff = cd.hairStyle === 'spiky' ? 0.45 : cd.hairStyle === 'afro' ? 0.4 : cd.hairStyle === 'mohawk' ? 0.5 : 0.2;
    const hDamp = cd.hairStyle === 'spiky' ? 0.85 : 0.68;
    const segL = cd.hairStyle === 'long_straight' || cd.hairStyle === 'ponytail' ? 9 : 7;

    this.hairChains = [];
    const hairCount = cd.hairStyle === 'afro' ? 8 : cd.hairStyle === 'spiky' ? 5 : 3;
    for (let i = 0; i < hairCount; i++) {
      const angle = (i / hairCount) * Math.PI - Math.PI * 0.7;
      const ox = Math.cos(angle) * 10;
      this.hairChains.push(new HairChain(ox, -40, hLen, segL, hStiff, hDamp));
    }
  }

  updatePhysics(worldX: number, worldY: number, facing: number, bodyVX: number, bodyVY: number) {
    const cx = worldX;
    const chestY = worldY - 22;
    const hipY = worldY + 8;
    const headY = worldY - 42;

    this.jBreastL.update(cx, chestY, bodyVX, bodyVY, facing);
    this.jBreastR.update(cx, chestY, bodyVX, bodyVY, facing);
    this.jGluteL.update(cx, hipY, bodyVX, bodyVY, facing);
    this.jGluteR.update(cx, hipY, bodyVX, bodyVY, facing);
    if (this.jBelly) this.jBelly.update(cx, worldY, bodyVX, bodyVY, facing);
    this.jArmL.update(cx, worldY - 16, bodyVX, bodyVY, facing);
    this.jArmR.update(cx, worldY - 16, bodyVX, bodyVY, facing);
    this.jThighL.update(cx, worldY + 24, bodyVX, bodyVY, facing);
    this.jThighR.update(cx, worldY + 24, bodyVX, bodyVY, facing);

    for (let i = 0; i < this.hairChains.length; i++) {
      const angle = (i / this.hairChains.length) * Math.PI - Math.PI * 0.7;
      const ox = worldX + Math.cos(angle) * 10 * facing;
      this.hairChains[i].update(ox, headY, bodyVX, bodyVY, 0.3);
    }
  }

  draw(ctx: CanvasRenderingContext2D, cx: number, cy: number, facing: number, state: FighterState, animFrame: number, attackType: AttackType | null, hurtFlash: boolean, rotation: number = 0, isReversing: number = 0) {
    const cd = this.cd;
    const isFem = cd.gender === 'female';
    const sc = cd.skinColor;
    const ec = cd.eyeColor;
    const tc = cd.topColor || '#222';
    const bc = cd.bottomColor || '#111';

    const scaleH = cd.height / 88;
    const zoom = (cd as any).zoom || 1;
    const tilt = (cd as any).tilt || 0; // Pitch in degrees
    const tiltRad = (tilt * Math.PI) / 180;
    
    const props = cd.proportions || { 
      headSize: 1, neckLength: 1, shoulderWidth: 1, armLength: 1, armThickness: 1, handSize: 1,
      torsoLength: 1, waistWidth: 1, chestSize: 1, hipWidth: 1, legLength: 1, legThickness: 1, footSize: 1 
    };

    const bodyW = (isFem ? (28 + cd.fatMass * 8) : (32 + cd.muscleMass * 10 + cd.fatMass * 6) * (cd.bodyType === 'stocky' ? 1.25 : 1)) * props.chestSize;
    const bodyH = 65 * scaleH * props.torsoLength;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(zoom, zoom);
    
    if (state === 'ragdoll' || state === 'dead' || state === 'grounded') {
        ctx.rotate(rotation);
    }
    
    // Horizontal Rotation (Yaw)
    const yaw = (cd as any).yaw || 0;
    const yawRad = (yaw * Math.PI) / 180;
    const yawCos = Math.cos(yawRad);
    
    // Vertical Tilt (Pitch) - simulated by foreshortening
    const tiltCos = Math.cos(tiltRad);
    const tiltSin = Math.sin(tiltRad);

    if (isReversing > 0) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#fff';
    }

    ctx.translate(0, -tiltSin * 50); // Vertical shift based on tilt
    ctx.scale(facing * yawCos, 1 * tiltCos);

    if (hurtFlash) ctx.globalAlpha = Math.sin(Date.now() * 0.04) * 0.4 + 0.6;
    
    // ANATOMICAL DETAIL: Muscle Lines
    const drawMuscles = (isBack: boolean = false) => {
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 1.5;
        if (!isBack) {
            // Chest
            ctx.beginPath();
            ctx.moveTo(-bodyW * 0.4, 5); ctx.quadraticCurveTo(0, 10, bodyW * 0.4, 5);
            ctx.stroke();
            // Abs
            if (cd.muscleMass > 0.4) {
               for(let i=0; i<4; i++) {
                   ctx.beginPath(); ctx.moveTo(-bodyW*0.15, 25+i*8); ctx.lineTo(bodyW*0.15, 25+i*8); ctx.stroke();
               }
            }
        } else {
            // Back
            ctx.beginPath();
            ctx.moveTo(0, 0); ctx.lineTo(0, 40);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-bodyW * 0.3, 10); ctx.lineTo(bodyW * 0.3, 10);
            ctx.stroke();
        }
    };

    // SHADOW
    ctx.restore();
    ctx.save();
    ctx.translate(cx, cy);
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(0, bodyH * 1.6 * props.legLength, bodyW * 0.8, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(facing, 1);

    // HAIR (back)
    if (cd.hairStyle === 'long_straight' || cd.hairStyle === 'braid' || cd.hairStyle === 'ponytail') {
      for (let i = 1; i < this.hairChains.length; i++) {
        const w = (i === 1 ? 4 : 3) * props.headSize;
        ctx.save();
        ctx.translate(-cx, -cy);
        this.hairChains[i].draw(ctx, cd.hairColor, w);
        ctx.restore();
      }
    }

    // LEGS
    const legOff = state === 'walk' ? Math.sin(animFrame * 1.4) * 10 : state === 'jump' ? -12 : 0;
    const legW = (10 + cd.muscleMass * 2.5 + cd.fatMass * 1.5) * props.legThickness;
    const legH = 80 * scaleH * props.legLength;

    // LEFT LEG
    ctx.save();
    ctx.fillStyle = bc;
    ctx.shadowBlur = 6; ctx.shadowColor = bc;
    this._roundRect(ctx, -legW - 2, bodyH + legOff, legW, legH, 3);
    
    // Clothing: Knee Pads / Boots / Kickpads
    if (cd.clothing.kneePadL && cd.clothing.kneePadL !== 'none') {
        ctx.fillStyle = cd.extraColor || '#222';
        this._roundRect(ctx, -legW - 3, bodyH + legOff + legH * 0.3, legW + 2, legH * 0.25, 2);
    }
    if (cd.clothing.boots && cd.clothing.boots !== 'none') {
        ctx.fillStyle = cd.extraColor || '#111';
        this._roundRect(ctx, -legW - 3, bodyH + legOff + legH * 0.7, legW + 2, legH * 0.35, 2);
        // Kickpads
        if (cd.clothing.kickpads && cd.clothing.kickpads !== 'none') {
            ctx.fillStyle = cd.topColor || '#333';
            this._roundRect(ctx, -legW - 4, bodyH + legOff + legH * 0.65, legW + 4, legH * 0.38, 2);
        }
    }

    ctx.translate(-cx, -cy);
    ctx.fillStyle = sc + 'aa';
    const tjL = this.jThighL;
    ctx.beginPath();
    ctx.ellipse(tjL.x, tjL.y, tjL.rx * 0.8 * props.legThickness, tjL.ry * 0.8 * props.legThickness, tjL.rotation, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // RIGHT LEG
    ctx.save();
    ctx.fillStyle = bc;
    ctx.shadowBlur = 6; ctx.shadowColor = bc;
    this._roundRect(ctx, 2, bodyH - legOff, legW, legH, 3);

    // Clothing: Knee Pads / Boots / Kickpads
    if (cd.clothing.kneePadR && cd.clothing.kneePadR !== 'none') {
        ctx.fillStyle = cd.extraColor || '#222';
        this._roundRect(ctx, 1, bodyH - legOff + legH * 0.3, legW + 2, legH * 0.25, 2);
    }
    if (cd.clothing.boots && cd.clothing.boots !== 'none') {
        ctx.fillStyle = cd.extraColor || '#111';
        this._roundRect(ctx, 1, bodyH - legOff + legH * 0.7, legW + 2, legH * 0.35, 2);
         // Kickpads
         if (cd.clothing.kickpads && cd.clothing.kickpads !== 'none') {
            ctx.fillStyle = cd.topColor || '#333';
            this._roundRect(ctx, 0, bodyH - legOff + legH * 0.65, legW + 4, legH * 0.38, 2);
        }
    }

    ctx.translate(-cx, -cy);
    ctx.fillStyle = sc + 'aa';
    const tjR = this.jThighR;
    ctx.beginPath();
    ctx.ellipse(tjR.x, tjR.y, tjR.rx * 0.8 * props.legThickness, tjR.ry * 0.8 * props.legThickness, tjR.rotation, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // GLUTES
    ctx.save();
    ctx.translate(-cx, -cy);
    ctx.globalAlpha = 0.5 + (isFem ? 0.4 : 0.15);
    ctx.shadowBlur = isFem ? 8 : 4;
    ctx.shadowColor = bc;
    ctx.fillStyle = bc;
    ctx.beginPath();
    ctx.ellipse(this.jGluteL.x, this.jGluteL.y, this.jGluteL.rx * props.hipWidth, this.jGluteL.ry * props.hipWidth, this.jGluteL.rotation, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(this.jGluteR.x, this.jGluteR.y, this.jGluteR.rx * props.hipWidth, this.jGluteR.ry * props.hipWidth, this.jGluteR.rotation, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // TORSO
    ctx.save();
    const isShowingBack = yawCos < 0;
    ctx.shadowBlur = 10; ctx.shadowColor = tc;
    ctx.fillStyle = tc;
    this._roundRect(ctx, (-bodyW * props.waistWidth) / 2, 0, bodyW * props.waistWidth, bodyH, 5);
    drawMuscles(isShowingBack);
    
    // Skin visibility (cutout)
    if (!isShowingBack && cd.clothing.top === 'bare') {
        ctx.fillStyle = sc;
        this._roundRect(ctx, -bodyW * 0.22, -4, bodyW * 0.44, 14, 3);
    }
    ctx.restore();

    if (this.jBelly) {
      ctx.save();
      ctx.translate(-cx, -cy);
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = sc;
      ctx.beginPath();
      ctx.ellipse(this.jBelly.x, this.jBelly.y, this.jBelly.rx * props.waistWidth, this.jBelly.ry * props.waistWidth, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // ARMS
    const atkFwd = (state === 'attack') ? (attackType === 'heavy' ? 22 : 12) : 0;
    const isCarrying = state === 'carrying';
    const isHeld = state === 'held';
    const armW = (8 + cd.muscleMass * 3) * props.armThickness;
    const armL = 22 * props.armLength;

    // LEFT ARM (Back)
    ctx.save();
    ctx.fillStyle = sc;
    ctx.shadowBlur = 4;
    ctx.translate(-bodyW / 2 * props.shoulderWidth, 4);
    if (isCarrying) ctx.rotate(-Math.PI / 1.5);
    if (isHeld) ctx.rotate(Math.PI / 1.5);
    this._roundRect(ctx, -armW + 2, 0, armW, armL, 4);
    
    // Clothing: Sleeves / Elbow Pads / Wristbands
    ctx.fillStyle = tc;
    if (cd.clothing.top !== 'bare') {
        this._roundRect(ctx, -armW + 2, 0, armW, 12, 4);
    }
    if (cd.clothing.elbowPadL && cd.clothing.elbowPadL !== 'none') {
        ctx.fillStyle = cd.extraColor || '#222';
        this._roundRect(ctx, -armW + 1, armL * 0.4, armW + 2, armL * 0.3, 2);
    }
    if (cd.clothing.wristbandL && cd.clothing.wristbandL !== 'none') {
        ctx.fillStyle = cd.extraColor || '#fff';
        this._roundRect(ctx, -armW + 1, armL * 0.8, armW + 2, armL * 0.2, 1);
    }
    if (cd.clothing.gloveL && cd.clothing.gloveL !== 'none') {
        ctx.fillStyle = cd.extraColor || '#111';
        this._roundRect(ctx, -armW + 0.5, armL * 0.9, armW + 3, armL * 0.2, 2);
    }
    ctx.restore();

    // RIGHT ARM (Front)
    ctx.save();
    ctx.fillStyle = sc;
    ctx.translate(bodyW / 2 * props.shoulderWidth, 4);
    if (isCarrying) ctx.rotate(-Math.PI / 1.5);
    if (isHeld) ctx.rotate(Math.PI / 1.5);
    this._roundRect(ctx, -2, -atkFwd * 0.3, armW, armL + atkFwd * 0.5, 4);
    
    // Clothing: Sleeves / Elbow Pads / Wristbands
    ctx.fillStyle = tc;
    if (cd.clothing.top !== 'bare') {
        this._roundRect(ctx, -2, 0, armW, 12, 4);
    }
    if (cd.clothing.elbowPadR && cd.clothing.elbowPadR !== 'none') {
        ctx.fillStyle = cd.extraColor || '#222';
        this._roundRect(ctx, -3, armL * 0.4, armW + 2, armL * 0.3, 2);
    }
    if (cd.clothing.wristbandR && cd.clothing.wristbandR !== 'none') {
        ctx.fillStyle = cd.extraColor || '#fff';
        this._roundRect(ctx, -3, armL * 0.8, armW + 2, armL * 0.2, 1);
    }
    if (cd.clothing.gloveR && cd.clothing.gloveR !== 'none') {
        ctx.fillStyle = cd.extraColor || '#111';
        this._roundRect(ctx, -3.5, armL * 0.9, armW + 3, armL * 0.2, 2);
    }
    ctx.restore();

    // HANDS
    ctx.save();
    ctx.fillStyle = sc;
    ctx.shadowBlur = state === 'attack' ? 12 : 4;
    ctx.shadowColor = cd.sigil || '#ff2244';
    ctx.beginPath();
    ctx.arc(bodyW/2 * props.shoulderWidth + armW/2 + atkFwd, armL + atkFwd * 0.3, armW * 0.7 * props.handSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // BREASTS
    if (isFem && cd.breastSize > 0) {
      ctx.save();
      ctx.translate(-cx, -cy);
      ctx.globalAlpha = 0.88;
      ctx.shadowBlur = 6; ctx.shadowColor = sc;
      ctx.fillStyle = sc;
      ctx.beginPath();
      ctx.ellipse(this.jBreastL.x, this.jBreastL.y, this.jBreastL.rx * props.chestSize, this.jBreastL.ry * props.chestSize, this.jBreastL.rotation, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(this.jBreastR.x, this.jBreastR.y, this.jBreastR.rx * props.chestSize, this.jBreastR.ry * props.chestSize, this.jBreastR.rotation, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = tc + 'cc';
      ctx.beginPath();
      ctx.ellipse(this.jBreastL.x, this.jBreastL.y, this.jBreastL.rx * 0.92 * props.chestSize, this.jBreastL.ry * 0.85 * props.chestSize, this.jBreastL.rotation, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(this.jBreastR.x, this.jBreastR.y, this.jBreastR.rx * 0.92 * props.chestSize, this.jBreastR.ry * 0.85 * props.chestSize, this.jBreastR.rotation, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // NECK
    ctx.fillStyle = sc;
    ctx.shadowBlur = 4;
    this._roundRect(ctx, -5, -4 - 12 * props.neckLength, 10, 14 * props.neckLength, 3);

    // HEAD
    const hw = (cd.faceShape === 'round' ? 18 : cd.faceShape === 'square' ? 17 : 15) * props.headSize;
    const hh = (cd.faceShape === 'oval' ? 22 : cd.faceShape === 'heart' ? 20 : 18) * props.headSize;
    const headOffY = -bodyH - 12 * (props.neckLength - 1) - (hh - 18);

    ctx.save();
    ctx.translate(0, headOffY + 34);
    
    // If we're looking at the back of the head
    if (yawCos < 0) {
        ctx.fillStyle = sc;
        ctx.beginPath();
        ctx.ellipse(0, -hh - 16, hw, hh, 0, 0, Math.PI * 2);
        ctx.fill();
        this._drawHair(ctx, 0, 0, cd, 1);
        ctx.restore();
        ctx.restore(); // Return for character
        ctx.restore(); // Final
        return;
    }

    ctx.shadowBlur = 10; ctx.shadowColor = cd.sigil + '55';
    ctx.fillStyle = sc;
    ctx.beginPath();
    if (cd.faceShape === 'square') {
      this._roundRect(ctx, -hw, -hh - 24, hw * 2, hh * 2, 4);
    } else if (cd.faceShape === 'angular' || cd.faceShape === 'sharp') {
      ctx.moveTo(-hw, -hh - 24);
      ctx.lineTo(hw, -hh - 24);
      ctx.lineTo(hw + 3, -12);
      ctx.lineTo(7, -4 + hh * 0.8);
      ctx.lineTo(-7, -4 + hh * 0.8);
      ctx.lineTo(-hw - 3, -12);
      ctx.closePath();
    } else {
      ctx.ellipse(0, -hh - 16, hw, hh, 0, 0, Math.PI * 2);
    }
    ctx.fill();

    // FACEPAINT / MASK
    if (cd.clothing.facepaint === 'sting' || cd.clothing.facepaint === 'crow' || cd.clothing.facepaint === 'skull') {
        ctx.fillStyle = cd.faceColor1 || (cd.clothing.facepaint === 'skull' ? '#f0f0f0' : '#fff');
        ctx.fill();
        ctx.fillStyle = cd.faceColor2 || '#000';
        ctx.beginPath();
        if (cd.clothing.facepaint === 'skull') {
            // Skull eye sockets
            ctx.arc(-6, -hh-18, 5, 0, Math.PI*2);
            ctx.arc(6, -hh-18, 5, 0, Math.PI*2);
            ctx.fill();
            // Nasal cavity
            ctx.beginPath(); ctx.moveTo(0, -hh-10); ctx.lineTo(-2, -hh-6); ctx.lineTo(2, -hh-6); ctx.closePath(); ctx.fill();
            // Teeth lines
            ctx.lineWidth = 1;
            for(let i=-6; i<=6; i+=3) {
                ctx.beginPath(); ctx.moveTo(i, -hh); ctx.lineTo(i, -hh+6); ctx.stroke();
            }
        } else {
            // Eye streaks (Spectral / Crow style)
            ctx.fillRect(-hw * 0.6, -hh - 22, hw * 0.35, hh * 1.1);
            ctx.fillRect(hw * 0.25, -hh - 22, hw * 0.35, hh * 1.1);
            // Mouth detail
            ctx.beginPath(); 
            ctx.arc(0, -hh + 12, 4, 0, Math.PI * 2); 
            ctx.fill();
            // Chin line
            ctx.fillRect(-hw * 0.4, -hh + 18, hw * 0.8, 3);
        }
    }
    if (cd.clothing.facepaint === 'samoan') {
        ctx.strokeStyle = cd.faceColor1 || '#333';
        ctx.lineWidth = 1;
        // Tribal patterns on half face
        for(let i=0; i<5; i++) {
            ctx.beginPath();
            ctx.moveTo(0, -hh-20 + i*4);
            ctx.lineTo(hw*0.8, -hh-10 + i*4);
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(hw * 0.4, -hh - 18, 8, 0, Math.PI);
        ctx.stroke();
    }
    if (cd.clothing.facepaint === 'warrior') {
        ctx.fillStyle = cd.faceColor1 || '#f0f';
        ctx.beginPath();
        // Spiky butterfly warrior pattern
        ctx.moveTo(-hw, -hh - 16); 
        ctx.lineTo(-hw + 8, -hh); 
        ctx.lineTo(0, -hh + 8); 
        ctx.lineTo(hw - 8, -hh); 
        ctx.lineTo(hw, -hh - 16); 
        ctx.closePath(); 
        ctx.fill();
        ctx.strokeStyle = cd.faceColor2 || '#111';
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    // EYES
    ctx.shadowBlur = 12; ctx.shadowColor = ec;
    
    // Eyebrows
    ctx.fillStyle = cd.hairColor;
    ctx.globalAlpha = 0.7;
    ctx.beginPath(); ctx.ellipse(-6 * props.headSize, -hh-25, 6 * props.headSize, 1.5 * props.headSize, 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(6 * props.headSize, -hh-25, 6 * props.headSize, 1.5 * props.headSize, -0.2, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1.0;

    // Left Eye
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(-5.5 * props.headSize, -hh-18, 4.5 * props.headSize, 5 * props.headSize, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = ec;
    ctx.beginPath(); ctx.ellipse(-6 * props.headSize, -hh-18, 2.8 * props.headSize, 3.5 * props.headSize, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.ellipse(-6.5 * props.headSize, -hh-18, 1.4 * props.headSize, 1.8 * props.headSize, 0, 0, Math.PI * 2); ctx.fill();

    // Right Eye
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(5.5 * props.headSize, -hh-18, 4.5 * props.headSize, 5 * props.headSize, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = ec;
    ctx.beginPath(); ctx.ellipse(6 * props.headSize, -hh-18, 2.8 * props.headSize, 3.5 * props.headSize, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.ellipse(6.5 * props.headSize, -hh-18, 1.4 * props.headSize, 1.8 * props.headSize, 0, 0, Math.PI * 2); ctx.fill();

    // TEETH / MOUTH
    const isGrinning = true;
    if (isGrinning) {
        ctx.fillStyle = (cd as any).teethColor || '#fff';
        ctx.beginPath(); ctx.arc(0, -hh-2, 6, 0, Math.PI, false); ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.4)';
        ctx.lineWidth = 0.5;
        // Grills/Teeth lines
        ctx.beginPath(); ctx.moveTo(-4, -hh+1); ctx.lineTo(4, -hh+1); ctx.stroke();
    } else {
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath(); ctx.arc(0, -hh-2, 3, 0, Math.PI, false); ctx.fill();
    }

    ctx.restore();
    this._drawHair(ctx, cx, cy, cd, facing);
    ctx.restore();
  }

  _drawHair(ctx: CanvasRenderingContext2D, cx: number, cy: number, cd: CharacterData, facing: number) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(facing, 1);
    ctx.translate(-cx, -cy);
    
    // Hair Color Blend
    const h1 = cd.hairColor;
    const h2 = cd.clothing?.hairColor2 || h1;
    const blend = cd.clothing?.hairBlend || 0;
    
    let activeColor = h1;
    if (blend > 0) {
        // Simple linear blend simulation using transparency or layered draws
    }

    for (let i = 0; i < this.hairChains.length; i++) {
        const w = (i === 0) ? 5 : 3;
        const color = (i > 1 && blend > 0.5) ? h2 : h1;
        this.hairChains[i].draw(ctx, color, w, (cd.hairStyle === 'wild' || cd.hairStyle === 'spiky') ? cd.sigil : null);
    }
    ctx.restore();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(facing, 1);
    if (cd.hairStyle === 'afro') {
      ctx.fillStyle = cd.hairColor;
      ctx.shadowBlur = 8; ctx.shadowColor = cd.hairColor + '66';
      ctx.beginPath(); ctx.arc(0, -40, 18 + cd.hairLength * 1.5, 0, Math.PI * 2); ctx.fill();
    } else if (cd.hairStyle === 'mohawk') {
      ctx.fillStyle = cd.hairColor;
      ctx.shadowBlur = 10; ctx.shadowColor = cd.sigil;
      ctx.beginPath(); ctx.moveTo(-4, -52); ctx.lineTo(0, -52 - cd.hairLength * 4); ctx.lineTo(4, -52); ctx.closePath(); ctx.fill();
    } else if (cd.hairStyle === 'bun') {
      ctx.fillStyle = cd.hairColor;
      ctx.shadowBlur = 5;
      ctx.beginPath(); ctx.arc(0, -50, 8 + cd.hairLength, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  _roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
  }

  _drawProceduralWeapon(ctx: CanvasRenderingContext2D, type: string, color: string) {
    ctx.shadowBlur = 8;
    ctx.shadowColor = color;
    switch (type) {
      case 'katana':
        ctx.fillStyle = '#eee';
        ctx.fillRect(-2, -50, 4, 60);
        ctx.fillStyle = '#222';
        ctx.fillRect(-3, 0, 6, 12);
        break;
      case 'mace':
        ctx.fillStyle = '#666';
        ctx.fillRect(-3, -20, 6, 30);
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(0, -22, 10, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'staff':
        ctx.fillStyle = '#834';
        ctx.fillRect(-2, -40, 4, 80);
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(0, -40, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(0, 40, 4, 0, Math.PI * 2); ctx.fill();
        break;
      case 'brass_knuckles':
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 3;
        ctx.strokeRect(-6, -6, 12, 12);
        break;
    }
  }
}
