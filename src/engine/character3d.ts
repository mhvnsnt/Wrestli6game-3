/**
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { CharacterData } from '../types';

export class Character3D {
  scene?: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  renderer?: THREE.WebGLRenderer;
  cd: CharacterData;
  group: THREE.Group;
  
  // Meshes
  lEye?: THREE.Group;
  rEye?: THREE.Group;
  lBrow?: THREE.Mesh;
  rBrow?: THREE.Mesh;
  nose?: THREE.Mesh;
  wrinkles?: THREE.Group;
  hairGroup?: THREE.Group;
  mouthU?: THREE.Mesh;
  mouthL?: THREE.Mesh;
  bodyMesh?: THREE.Mesh;
  headMesh?: THREE.Mesh;
  mouth?: THREE.Mesh;
  lBicep?: THREE.Mesh;
  lForearm?: THREE.Mesh;
  rBicep?: THREE.Mesh;
  rForearm?: THREE.Mesh;
  lThigh?: THREE.Mesh;
  lShin?: THREE.Mesh;
  rThigh?: THREE.Mesh;
  rShin?: THREE.Mesh;
  hips?: THREE.Mesh;
  
  // Layer Groups
  bodyLayer: THREE.Group;
  clothingLayer: THREE.Group;
  accessoryLayer: THREE.Group;
  baseHeadSize: number = 0.18;
  headScaleZ: number = 1.0;

  constructor(container: HTMLDivElement | null, charData: CharacterData) {
    this.cd = charData;
    this.group = new THREE.Group();
    this.bodyLayer = new THREE.Group();
    this.clothingLayer = new THREE.Group();
    this.accessoryLayer = new THREE.Group();
    this.group.add(this.bodyLayer, this.clothingLayer, this.accessoryLayer);
    
    if (container) {
      this.scene = new THREE.Scene();
      this.scene.background = null;
      
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      this.camera.position.set(0, 1.2, 3);
      this.camera.lookAt(0, 1, 0);
      
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.shadowMap.enabled = true;
      container.appendChild(this.renderer.domElement);
      
      this.scene.add(this.group);
      
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      this.scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
      directionalLight.position.set(5, 10, 5);
      directionalLight.castShadow = true;
      this.scene.add(directionalLight);

      const rimLight = new THREE.PointLight(0xff0000, 1.5, 10);
      rimLight.position.set(-2, 2, -2);
      this.scene.add(rimLight);
    }

    this.initModel();
  }

  updatePose(state: string, frame: number, facing: number, vx: number, vy: number, opponentPos?: THREE.Vector3) {
    if (!this.lThigh || !this.rThigh || !this.lBicep || !this.rBicep) return;

    // Head/Eye tracking opponent
    if (opponentPos && this.headMesh && this.lEye && this.rEye) {
        const localTarget = this.headMesh.worldToLocal(opponentPos.clone());
        this.lEye.lookAt(opponentPos);
        this.rEye.lookAt(opponentPos);
        const lookAngle = Math.atan2(localTarget.x, localTarget.z);
        this.headMesh.rotation.y = THREE.MathUtils.lerp(this.headMesh.rotation.y, Math.max(-0.8, Math.min(0.8, lookAngle)), 0.1);
        
        // Brow movement based on target proximity (aggressive focus)
        if (this.lBrow && this.rBrow) {
            const dist = opponentPos.distanceTo(this.group.position);
            const isAggressive = dist < 2;
            const browOff = isAggressive ? -0.05 : 0;
            this.lBrow.position.y = 0.2 * (0.18 * (this.cd.height/100) * (this.cd.proportions?.headSize || 1)) + browOff;
            this.rBrow.position.y = 0.2 * (0.18 * (this.cd.height/100) * (this.cd.proportions?.headSize || 1)) + browOff;
            
            if (this.wrinkles) this.wrinkles.visible = isAggressive || state === 'hit' || state === 'attack';
        }
    }

    const t = frame * 0.2;
    // Reset rotations gently
    this.lBicep.rotation.set(0, 0, Math.PI/8);
    this.rBicep.rotation.set(0, 0, -Math.PI/8);
    this.lThigh.rotation.set(0, 0, 0);
    this.rThigh.rotation.set(0, 0, 0);
    this.group.rotation.x = 0;
    this.group.position.y = 0;

    // Secondary Motion / Jiggle Physics
    const jiggle = Math.sin(frame * 0.15) * 0.05;
    const heavyJiggle = Math.sin(frame * 0.1) * 0.1;
    const muscleTremor = Math.sin(frame * 0.4) * 0.005 * this.cd.muscleMass;
    
    if (this.bodyMesh) {
        // Belly jiggle for heavy characters
        if (this.cd.fatMass > 0.6) {
           const belly = this.bodyMesh.children.find(c => c.type === 'Mesh' && (c as THREE.Mesh).geometry.type === 'SphereGeometry') as THREE.Mesh;
           if (belly) {
               belly.position.y = -0.1 + heavyJiggle * 0.2;
               belly.scale.z = 1.2 + heavyJiggle * 0.1;
               belly.rotation.z = Math.sin(frame * 0.05) * 0.02 * this.cd.fatMass;
           }
        }
        
        // Breast jiggle
        if (this.cd.gender === 'female' && this.cd.breastSize > 0) {
            const breasts = this.bodyMesh.children.filter(c => c.name !== 'belly' && c.type === 'Mesh' && (c as THREE.Mesh).geometry.type === 'SphereGeometry');
            breasts.forEach((b, i) => {
                const bJiggle = Math.sin(frame * 0.12 + (i * Math.PI)) * 0.08 * this.cd.breastSize;
                b.position.y = bJiggle * 0.2;
                b.rotation.x = bJiggle * 0.8;
                b.scale.setScalar(1 + bJiggle * 0.1);
            });
        }
        
        // Muscle Movement Physics (Pecs)
        const pecs = this.bodyMesh.children.filter(c => c.type === 'Mesh' && (c as THREE.Mesh).geometry.type === 'BoxGeometry' && c.position.z > 0.1);
        pecs.forEach((p, i) => {
            if (this.cd.muscleMass > 0.7) {
                p.scale.z = 1.0 + muscleTremor + (Math.abs(this.lBicep?.rotation.x || 0) * 0.1);
            }
        });
    }

    // Muscle Bulge (Flexing)
    if (this.lBicep && this.rBicep) {
        const lFlex = Math.abs(this.lBicep.rotation.x) + Math.abs(this.lForearm?.rotation.x || 0);
        const rFlex = Math.abs(this.rBicep.rotation.x) + Math.abs(this.rForearm?.rotation.x || 0);
        this.lBicep.scale.x = 1.0 + lFlex * 0.1 * this.cd.muscleMass;
        this.rBicep.scale.x = 1.0 + rFlex * 0.1 * this.cd.muscleMass;
    }

    // Mouth Grimace Animation
    if (this.mouth) {
        const isHurt = state === 'hit' || state === 'hurt' || state === 'knockdown';
        const isAttacking = state === 'attack';
        const mouthOpenTarget = isHurt ? 2.5 : (isAttacking ? 1.5 : 0.1);
        this.mouth.scale.y = THREE.MathUtils.lerp(this.mouth.scale.y, mouthOpenTarget, 0.2);
    }

    // Glute Jiggle Physics
    if (this.hips) {
        const gluteJiggle = Math.sin(frame * 0.18) * 0.05 * (this.cd.gluteSize || 0);
        // We'll simulate this by slightly pulsing the hip scale or adding glute segments
        // For now, let's pulse the hip scale Z (depth) for walking/motion
        this.hips.scale.z = 1.0 + gluteJiggle;
    }

    // Breathing (Procedural scaling)
    const breathe = Math.sin(frame * 0.08) * 0.015;
    if (this.bodyMesh) {
        this.bodyMesh.scale.set(1 + breathe, 1, 1 + breathe * 0.5);
    }

    // FACIAL ANIMATION DRIVE
    if (this.mouth) {
        const t = frame / 60;
        const isHurt = state === 'hit' || state === 'hurt' || state === 'knockdown';
        const isAttacking = state === 'attack';
        const isTaunting = state === 'taunting' || state === 'special';
        
        // Open mouth on pain/strain
        const mouthOpen = (isHurt || isAttacking || isTaunting) ? 1 : 0;
        this.mouth.scale.y = 0.5 + mouthOpen * 1.5;
        this.mouth.position.z = this.baseHeadSize * 0.8 * this.headScaleZ + (mouthOpen * 0.02);
        
        // Dynamic Tongue (flickers during taunt or pain)
        const tongue = this.mouth.getObjectByName('tongue') as THREE.Mesh;
        if (tongue) {
            tongue.visible = mouthOpen > 0;
            if (isTaunting) {
                tongue.scale.z = 1.2 + Math.sin(t * 10) * 0.5;
                tongue.rotation.x = Math.sin(t * 15) * 0.2;
            } else {
                tongue.scale.z = 1.0;
                tongue.rotation.x = 0;
            }
        }
    }

    // EYE BLINKING / TRACKING
    if (this.lEye && this.rEye) {
        const blink = Math.sin(t * 0.5) > 0.98 ? 0 : 1;
        this.lEye.scale.y = blink;
        this.rEye.scale.y = blink;
        
        // Basic tracking toward opponent if close
        if (opponentPos) {
            const lookAt = opponentPos.clone().sub(this.group.position).normalize();
            this.lEye.rotation.y = lookAt.x * 0.5;
            this.rEye.rotation.y = lookAt.x * 0.5;
        }
    }

    if (state === 'attack' && opponentPos) {
        const punchSide = (Math.floor(frame / 20) % 2 === 0) ? this.rBicep : this.lBicep;
        if (punchSide) {
            punchSide.rotation.x = -Math.PI / 1.8;
            punchSide.rotation.y = Math.sin(t * 3) * 0.4;
            // Extension (procedural scaling of forearm for "stretch")
            const forearm = punchSide.children[0] as THREE.Mesh;
            if (forearm) forearm.scale.y = 1 + Math.abs(Math.sin(t * 3)) * 0.2;
        }
    } else if (state === 'walk' || state === 'running') {
        const speed = state === 'walk' ? 0.6 : 1.4;
        const s = Math.sin(t * (state === 'running' ? 2 : 1));
        this.lThigh.rotation.x = s * speed;
        this.rThigh.rotation.x = -s * speed;
        this.lBicep.rotation.x = -s * speed * 0.5;
        this.rBicep.rotation.x = s * speed * 0.5;
        this.group.position.y = Math.abs(s) * 0.08;
        // Secondary Torso Sway
        this.bodyMesh.rotation.z = -s * 0.1;
        this.bodyMesh.position.x = s * 0.02;
    } else if (state === 'jump') {
        this.lThigh.rotation.x = -0.7;
        this.rThigh.rotation.x = 0.4;
        this.lBicep.rotation.z = Math.PI / 1.4;
        this.rBicep.rotation.z = -Math.PI / 1.4;
    } else if (state === 'dead' || state === 'knockdown' || state === 'hit' || state === 'ragdoll' || state === 'hurt') {
        // VISCERAL RAGDOLL PHYSICS
        const jitter = Math.sin(frame * 0.5) * 0.1 * Math.min(1, (Math.abs(vx) + Math.abs(vy))/5);
        this.group.rotation.x = -Math.PI / 2.1 + jitter;
        this.group.rotation.y += jitter * 0.5;
        this.group.rotation.z += Math.sin(frame * 0.1) * 0.1 * Math.abs(vx);
        
        // Random limb flailing based on velocity
        this.lThigh.rotation.x = 0.6 + Math.sin(frame * 0.2) * (vy * 0.15);
        this.rThigh.rotation.x = 0.8 + Math.cos(frame * 0.15) * (vx * 0.15);
        this.lBicep.rotation.z = Math.PI / 4 + Math.sin(frame * 0.3) * (vy * 0.3);
        this.rBicep.rotation.z = -Math.PI / 4 + Math.cos(frame * 0.25) * (vx * 0.3);
        
        // Hip rotation for "hanging" feel
        this.group.position.y += Math.sin(frame * 0.1) * 0.05;

        // Forearm flailing
        if (this.lForearm) this.lForearm.rotation.x = Math.sin(frame * 0.4) * 2.0;
        if (this.rForearm) this.rForearm.rotation.x = Math.cos(frame * 0.35) * 2.0;

        // Squish on impact
        if (state === 'hit' || (vy > 5 && state === 'ragdoll')) {
            this.bodyMesh.scale.y = 1.0 - (Math.abs(vy) * 0.03);
            this.group.position.y = -0.1; // Deeper into the mat for weight
        }
    } else if (state === 'rebounding') {
        // LEAN INTO ROPES (Visceral Rebound)
        this.group.rotation.x = Math.PI / 6; // Lean back
        this.lBicep.rotation.z = Math.PI / 2;
        this.rBicep.rotation.z = -Math.PI / 2;
        this.lThigh.rotation.x = -0.3;
        this.rThigh.rotation.x = -0.3;
    } else if (state === 'taunting' || state === 'special') {
        const s = Math.sin(t * 4);
        this.lBicep.rotation.z = Math.PI / 2 + s * 0.2;
        this.rBicep.rotation.z = -Math.PI / 2 - s * 0.2;
        this.group.rotation.y = s * 0.1;
        this.bodyMesh.scale.x = 1.05 + s * 0.02; // Flexing chest
    } else {
        // Idle sway
        this.group.rotation.z = Math.sin(frame * 0.05) * 0.02;
    }
  }

  initModel() {
    this.updateModel();
  }

  generateSkinTexture(cd: CharacterData) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.MeshStandardMaterial({ color: cd.skinColor });

    // Base Skin
    ctx.fillStyle = cd.skinColor || '#fde0be';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle Noise / Pores
    for (let i = 0; i < 5000; i++) {
        ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.03})`;
        ctx.fillRect(Math.random() * 512, Math.random() * 512, 1, 1);
    }

    // Vascularity / Veins (if high muscle)
    if (cd.muscleMass > 0.8) {
        ctx.strokeStyle = 'rgba(0,0,50,0.02)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * 512, Math.random() * 512);
            ctx.lineTo(Math.random() * 512, Math.random() * 512);
            ctx.stroke();
        }
    }

    // Facial Details (Area 0, 0 to 128, 128)
    // Eyes
    ctx.fillStyle = cd.eyeColor || '#111';
    ctx.fillRect(40, 44, 4, 2);
    ctx.fillRect(84, 44, 4, 2);

    // Lips
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(50, 80, 28, 4);

    // Depth/Shadows
    const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 400);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.1)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Layered Decals (Facepaint / Tattoos)
    if (cd.clothing.facepaint === 'skull') {
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.8;
        ctx.fillRect(30, 30, 70, 70);
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#000';
        ctx.fillRect(40, 50, 10, 10);
        ctx.fillRect(78, 50, 10, 10);
    }

    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.MeshStandardMaterial({ 
        map: texture,
        roughness: 0.7,
        metalness: 0.1
    });
  }

  updateModel() {
    // Clear previous
    [this.bodyLayer, this.clothingLayer, this.accessoryLayer].forEach(layer => {
      while(layer.children.length > 0) layer.remove(layer.children[0]);
    });
    this.hairGroup = new THREE.Group();

    const cd = this.cd;
    
    // Apply Attire Slot
    let effectiveClothing = cd.clothing;
    let effectiveTopColor = cd.topColor;
    let effectiveBottomColor = cd.bottomColor;
    let effectiveExtraColor = cd.extraColor;
    
    if (cd.attireSlot && cd.attireSlot > 1 && cd.alternateAttires && cd.alternateAttires[cd.attireSlot - 2]) {
        const alt = cd.alternateAttires[cd.attireSlot - 2];
        effectiveClothing = alt.clothing;
        effectiveTopColor = alt.topColor;
        effectiveBottomColor = alt.bottomColor;
        effectiveExtraColor = alt.extraColor;
    }

    const p = cd.proportions || { headSize: 1, neckLength: 1, shoulderWidth: 1, chestSize: 1, torsoLength: 1, waistWidth: 1, armLength: 1, armThickness: 1, legLength: 1, legThickness: 1, handSize: 1, footSize: 1, hipWidth: 1 };
    const scale = (cd.height / 100);
    const isFem = cd.gender === 'female';
    
    const muscle = cd.muscleMass;
    const fat = cd.fatMass;

    // Materials
    const skinMat = this.generateSkinTexture(cd);
    
    // Sweat effect (Increased specular/roughness variation)
    if (cd.sweatLevel && cd.sweatLevel > 0) {
        skinMat.roughness = 0.6 - (cd.sweatLevel * 0.4);
        skinMat.metalness = 0.05 + (cd.sweatLevel * 0.1);
    }
    const hairMat = new THREE.MeshStandardMaterial({ color: cd.hairColor, roughness: 0.9 });
    const eyeMat = new THREE.MeshStandardMaterial({ color: '#fff', roughness: 0.1 });
    const irisMat = new THREE.MeshStandardMaterial({ color: cd.eyeColor || '#111' });
    const bottomMat = new THREE.MeshStandardMaterial({ color: effectiveBottomColor, roughness: 0.8 });
    const topMat = new THREE.MeshStandardMaterial({ color: effectiveTopColor, roughness: 0.8 });
    const extraMat = new THREE.MeshStandardMaterial({ color: effectiveExtraColor, roughness: 0.5, metalness: 0.5 });
    const teethMat = new THREE.MeshStandardMaterial({ color: '#fff', roughness: 0.3 });

    // TORSO
    const chestW = (isFem ? 0.35 : 0.45) * (muscle * 0.6 + 0.7) * (1 + fat * 0.5) * p.shoulderWidth * (1 + (p.chestSize - 1) * 0.4);
    const chestH = 0.3 * scale * p.torsoLength;
    const chestGeo = new THREE.BoxGeometry(chestW, chestH, 0.2 + fat * 0.3 + (p.chestSize - 1) * 0.1);
    this.bodyMesh = new THREE.Mesh(chestGeo, effectiveClothing.top === 'bare' ? skinMat : topMat);
    this.bodyMesh.position.y = 1.45 * scale;
    this.bodyLayer.add(this.bodyMesh);

    // Waist
    const waistW = (isFem ? 0.28 : 0.42) * (1 + fat * 0.8) * p.waistWidth;
    const waistH = 0.25 * scale * p.torsoLength;
    const waistGeo = new THREE.BoxGeometry(waistW, waistH, 0.18 + fat * 0.5 + (p.waistWidth - 1) * 0.1);
    const waist = new THREE.Mesh(waistGeo, effectiveClothing.top === 'bare' ? skinMat : topMat);
    waist.position.y = this.bodyMesh.position.y - chestH/2 - waistH/2;
    this.bodyLayer.add(waist);

    // Belly (Extra sphere for high fat mass)
    if (fat > 0.6) {
        const bellyGeo = new THREE.SphereGeometry(waistW * 0.6, 16, 16);
        const belly = new THREE.Mesh(bellyGeo, skinMat);
        belly.position.set(0, -waistH * 0.2, fat * 0.15 * scale);
        belly.scale.set(1, 0.8, 1.2);
        belly.name = 'belly';
        waist.add(belly);
    }

    // Hips
    const hipW = (isFem ? 0.42 : 0.4) * (1 + fat * 0.5 + cd.gluteSize * 0.2) * (1 + (p.hipWidth - 1) * 0.2);
    const hipH = 0.15 * scale;
    const hipGeo = new THREE.BoxGeometry(hipW, hipH, 0.2 + fat * 0.2 + cd.gluteSize * 0.3);
    this.hips = new THREE.Mesh(hipGeo, bottomMat);
    this.hips.position.y = waist.position.y - waistH/2 - hipH/2;
    this.bodyLayer.add(this.hips);

    // Breasts
    if (isFem && cd.breastSize > 0) {
        const bSize = cd.breastSize * 0.08 * scale;
        const bGeo = new THREE.SphereGeometry(bSize, 12, 12);
        const lB = new THREE.Mesh(bGeo, effectiveClothing.top === 'bare' ? skinMat : topMat);
        const rB = new THREE.Mesh(bGeo, effectiveClothing.top === 'bare' ? skinMat : topMat);
        lB.position.set(-chestW * 0.25, 0, 0.1 * scale + bSize * 0.5);
        rB.position.set(chestW * 0.25, 0, 0.1 * scale + bSize * 0.5);
        this.bodyMesh.add(lB, rB);
    }

    // HEAD
    this.baseHeadSize = 0.18 * scale * p.headSize;
    this.headScaleZ = 1;
    let headScaleX = 1, headScaleY = 1;
    
    // Face Shape Morphs
    if (cd.faceShape === 'round') { headScaleX = 1.1; this.headScaleZ = 1.1; }
    if (cd.faceShape === 'sharp') { headScaleX = 0.9; headScaleY = 1.1; }
    if (cd.faceShape === 'square') { headScaleX = 1.05; headScaleY = 0.95; }
    if (cd.faceShape === 'angular') { headScaleX = 0.9; this.headScaleZ = 0.9; }
    if (cd.faceShape === 'soft') { headScaleX = 1.05; headScaleY = 1.05; }
    
    const headGeo = new THREE.SphereGeometry(this.baseHeadSize, 16, 16);
    this.headMesh = new THREE.Mesh(headGeo, skinMat);
    this.headMesh.scale.set(headScaleX, headScaleY, this.headScaleZ);
    this.headMesh.position.y = this.bodyMesh.position.y + chestH / 2 + (0.1 * p.neckLength * scale) + this.baseHeadSize * 0.5;
    this.bodyLayer.add(this.headMesh);

    // MOUTH / GRIMACE MORPH
    const mouthW = this.baseHeadSize * 0.4;
    const mouthH = this.baseHeadSize * 0.1;
    const mouthGeo = new THREE.BoxGeometry(mouthW, mouthH, 0.05);
    this.mouth = new THREE.Mesh(mouthGeo, teethMat);
    this.mouth.position.set(0, -this.baseHeadSize * 0.3, this.baseHeadSize * 0.8 * this.headScaleZ);
    this.headMesh.add(this.mouth);

    // Tongue
    const tongueGeo = new THREE.SphereGeometry(mouthW * 0.3, 8, 8);
    const tongueMat = new THREE.MeshStandardMaterial({ color: '#ff4466', roughness: 0.8 });
    const tongue = new THREE.Mesh(tongueGeo, tongueMat);
    tongue.name = 'tongue';
    tongue.position.set(0, -0.01, 0.01);
    tongue.scale.set(1, 0.2, 1.2);
    this.mouth.add(tongue);

    // NOSE SCULPTING (Anatomically calibrated)
    const noseGeo = new THREE.ConeGeometry(this.baseHeadSize * 0.12, this.baseHeadSize * 0.28, 4);
    this.nose = new THREE.Mesh(noseGeo, skinMat);
    this.nose.position.set(0, -this.baseHeadSize * 0.05, this.baseHeadSize * 0.95 * this.headScaleZ);
    this.nose.rotation.x = Math.PI / 1.1;
    this.headMesh.add(this.nose);

    // LAYERED DECALS: SIGILS / TATTOOS
    if (cd.sigil && cd.sigil !== 'none' && cd.sigil !== 'bare') {
        const sigilMat = new THREE.MeshStandardMaterial({ color: cd.sigil, transparent: true, opacity: 0.9, roughness: 1.0 });
        
        // Chest Decal (offset by fat and chest size)
        const chestSigilGeo = new THREE.PlaneGeometry(chestW * 0.4, chestH * 0.4);
        const chestSigil = new THREE.Mesh(chestSigilGeo, sigilMat);
        chestSigil.position.set(0, 0, (0.1 + fat * 0.15 + (p.chestSize - 1) * 0.05) + 0.01);
        this.bodyMesh.add(chestSigil);

        // Back Decal
        const backSigil = new THREE.Mesh(chestSigilGeo, sigilMat);
        backSigil.position.set(0, 0, -(0.1 + fat * 0.15 + (p.chestSize - 1) * 0.05) - 0.01);
        backSigil.rotation.y = Math.PI;
        this.bodyMesh.add(backSigil);
    }

    // Head Pieces Group
    this.headMesh.add(this.hairGroup);
    
    // MASK / FACEPAINT (LAYERED DECALS)
    if (effectiveClothing.mask && effectiveClothing.mask !== 'none') {
        const maskMat = new THREE.MeshStandardMaterial({ color: effectiveExtraColor, roughness: 0.5 });
        const maskGeo = new THREE.SphereGeometry(this.baseHeadSize * 1.02, 16, 16);
        const mask = new THREE.Mesh(maskGeo, maskMat);
        this.headMesh.add(mask);
    } else if (effectiveClothing.facepaint && effectiveClothing.facepaint !== 'none') {
        const fpMat = new THREE.MeshStandardMaterial({ color: effectiveExtraColor, transparent: true, opacity: 0.85, roughness: 0.9 });
        const fpGeo = new THREE.SphereGeometry(this.baseHeadSize * 1.01, 16, 16, 0, Math.PI * 2, 0.2, 0.8);
        const fp = new THREE.Mesh(fpGeo, fpMat);
        fp.rotation.x = -Math.PI / 2.2;
        this.headMesh.add(fp);
    }

    // EYES
    const createEye = (posX: number) => {
        const eye = new THREE.Group();
        const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.018 * scale, 8, 8), eyeMat);
        const iris = new THREE.Mesh(new THREE.SphereGeometry(0.012 * scale, 6, 6), irisMat);
        iris.position.z = 0.012 * scale;
        eye.add(sclera);
        eye.add(iris);

        const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.006 * scale, 6, 6), new THREE.MeshStandardMaterial({ color: '#000' }));
        pupil.position.z = 0.005 * scale;
        iris.add(pupil);

        eye.position.set(posX * this.baseHeadSize * 0.45, 0.08 * this.baseHeadSize, this.baseHeadSize * 0.8 * this.headScaleZ);
        return eye;
    };
    this.lEye = createEye(-1);
    this.rEye = createEye(1);
    this.headMesh.add(this.lEye, this.rEye);

    // SIGILS / TATTOOS (Layered Decals)
    if (cd.sigil && cd.sigil !== 'none') {
        const sigilMat = new THREE.MeshStandardMaterial({ color: cd.sigil, transparent: true, opacity: 0.9, roughness: 1.0 });
        const chestSigilGeo = new THREE.PlaneGeometry(chestW * 0.45, chestW * 0.45);
        const chestSigil = new THREE.Mesh(chestSigilGeo, sigilMat);
        chestSigil.position.set(0, 0, (0.1 + fat * 0.15 + (p.chestSize - 1) * 0.05) + 0.015);
        this.bodyMesh.add(chestSigil);

        const backSigil = new THREE.Mesh(chestSigilGeo, sigilMat);
        backSigil.position.set(0, 0, -(0.1 + fat * 0.15 + (p.chestSize - 1) * 0.05) - 0.015);
        backSigil.rotation.y = Math.PI;
        this.bodyMesh.add(backSigil);
    }

    // EYEBROWS (More detailed)
    const browGeo = new THREE.BoxGeometry(0.06 * scale, 0.02 * scale, 0.01 * scale);
    this.lBrow = new THREE.Mesh(browGeo, hairMat);
    this.rBrow = new THREE.Mesh(browGeo, hairMat);
    this.lBrow.position.set(-0.3 * this.baseHeadSize, 0.22 * this.baseHeadSize, this.baseHeadSize * 0.85);
    this.rBrow.position.set(0.3 * this.baseHeadSize, 0.22 * this.baseHeadSize, this.baseHeadSize * 0.85);
    this.lBrow.rotation.z = 0.1;
    this.rBrow.rotation.z = -0.1;
    this.headMesh.add(this.lBrow, this.rBrow);

    // WRINKLES/EXPRESSION LINES
    this.wrinkles = new THREE.Group();
    const wMat = new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0.15 });
    for(let i=0; i<3; i++) {
        const w = new THREE.Mesh(new THREE.BoxGeometry(0.15 * this.baseHeadSize, 0.005 * scale, 0.01 * scale), wMat);
        w.position.set(0, (0.3 + i * 0.08) * this.baseHeadSize, this.baseHeadSize * 0.85);
        this.wrinkles.add(w);
    }
    this.headMesh.add(this.wrinkles);

    // HAIR SYSTEM REFINED
    if (cd.hairStyle !== 'none' && cd.hairStyle !== 'bald') {
        if (cd.hairStyle === 'buzz') {
            const buzzGeo = new THREE.SphereGeometry(this.baseHeadSize * 1.03, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6);
            const buzz = new THREE.Mesh(buzzGeo, hairMat);
            this.hairGroup.add(buzz);
        } else if (cd.hairStyle === 'mohawk') {
            for(let i=0; i<15; i++) {
                const strip = new THREE.Mesh(new THREE.BoxGeometry(0.02 * scale, 0.12 * scale, 0.06 * scale), hairMat);
                strip.position.set(0, 0.5 * this.baseHeadSize, (i/15 - 0.5) * this.baseHeadSize * 1.6);
                strip.scale.y = 1 + Math.random() * 0.4;
                this.hairGroup.add(strip);
            }
        } else {
            const hairCount = cd.hairStyle === 'wild' ? 32 : 16;
            for(let i=0; i<hairCount; i++) {
                const pieceGeo = new THREE.SphereGeometry(this.baseHeadSize * 0.25, 8, 8);
                const piece = new THREE.Mesh(pieceGeo, hairMat);
                const angle = (i / hairCount) * Math.PI * 2;
                piece.position.set(
                    Math.cos(angle) * this.baseHeadSize * 0.6,
                    Math.random() * 0.4 * this.baseHeadSize + 0.4 * this.baseHeadSize,
                    Math.sin(angle) * this.baseHeadSize * 0.6
                );
                piece.scale.set(1, 1.2, 0.6);
                this.hairGroup.add(piece);
            }
        }
    }

    // SCARS & TATTOOS (Simple procedural decals)
    if (cd.scars) {
        cd.scars.forEach(s => {
            if (s === 'eye_slash') {
                const scar = new THREE.Mesh(new THREE.PlaneGeometry(0.005 * scale, 0.05 * scale), new THREE.MeshBasicMaterial({ color: '#c00', transparent: true, opacity: 0.5 }));
                scar.position.set(0.4 * this.baseHeadSize, 0.1 * this.baseHeadSize, this.baseHeadSize * 0.95);
                this.headMesh.add(scar);
            }
            if (s === 'cheek_cross') {
                const mat = new THREE.MeshBasicMaterial({ color: '#c00', transparent: true, opacity: 0.3 });
                const vertical = new THREE.Mesh(new THREE.PlaneGeometry(0.005 * scale, 0.04 * scale), mat);
                const horizontal = new THREE.Mesh(new THREE.PlaneGeometry(0.04 * scale, 0.005 * scale), mat);
                const cross = new THREE.Group();
                cross.add(vertical, horizontal);
                cross.position.set(-0.5 * this.baseHeadSize, -0.3 * this.baseHeadSize, this.baseHeadSize * 0.85);
                this.headMesh.add(cross);
            }
        });
    }

    // EARS
    const earGeo = new THREE.SphereGeometry(this.baseHeadSize * 0.15, 8, 8);
    const lEar = new THREE.Mesh(earGeo, skinMat);
    const rEar = new THREE.Mesh(earGeo, skinMat);
    lEar.scale.set(0.5, 1, 1);
    rEar.scale.set(0.5, 1, 1);
    lEar.position.set(-this.baseHeadSize * 1.0, 0, 0);
    rEar.position.set(this.baseHeadSize * 1.0, 0, 0);
    this.headMesh.add(lEar, rEar);
    // ANATOMY DETAILS (Pecs/Abs)
    if (muscle > 0.5) {
        const pecGeo = new THREE.BoxGeometry(chestW * 0.4, chestH * 0.4, 0.05 * scale);
        const lPec = new THREE.Mesh(pecGeo, skinMat);
        const rPec = new THREE.Mesh(pecGeo, skinMat);
        lPec.position.set(-chestW * 0.22, 0, 0.1 * scale);
        rPec.position.set(chestW * 0.22, 0, 0.1 * scale);
        this.bodyMesh.add(lPec, rPec);
        
        const abGeo = new THREE.BoxGeometry(waistW * 0.3, 0.05 * scale, 0.02 * scale);
        for(let i=0; i<3; i++) {
            const ab = new THREE.Mesh(abGeo, skinMat);
            ab.position.set(0, 0.1 * scale - i * 0.08 * scale, 0.1 * scale);
            waist.add(ab);
        }
    }

    // LEGS 
    const legW = 0.16 * (muscle * 0.4 + 0.7) * (1 + fat * 0.4) * p.legThickness;
    const thighH = 0.45 * scale * p.legLength;
    const thirstScale = muscle > 0.8 ? 1.2 : 1.0;
    const thighGeo = new THREE.CylinderGeometry(legW * thirstScale, legW * 0.8, thighH, 12);
    const shinGeo = new THREE.CylinderGeometry(legW * 0.8, legW * 0.5, thighH, 12);
    const jointGeo = new THREE.SphereGeometry(legW * 0.8, 8, 8);
    const footGeo = new THREE.BoxGeometry(legW * 0.9, 0.05 * scale, legW * 1.4);

    const createLeg = (posX: number) => {
        const thigh = new THREE.Mesh(thighGeo, bottomMat);
        thigh.position.set(posX, this.hips?.position.y ?? 0 - 0.1, 0);
        
        const knee = new THREE.Mesh(jointGeo, bottomMat);
        knee.position.y = -thighH / 2;
        thigh.add(knee);

        const shin = new THREE.Mesh(shinGeo, cd.clothing.boots !== 'none' ? extraMat : bottomMat);
        shin.position.set(0, -thighH / 2, 0);
        knee.add(shin);

        const foot = new THREE.Mesh(footGeo, cd.clothing.boots !== 'none' ? extraMat : skinMat);
        foot.position.set(0, -thighH / 2, legW * 0.3);
        shin.add(foot);

        return thigh;
    };

    this.lThigh = createLeg(-hipW * 0.3);
    this.rThigh = createLeg(hipW * 0.3);
    this.bodyLayer.add(this.lThigh, this.rThigh);
    
    // Assign shins for animation access
    this.lShin = this.lThigh.children[0].children[0] as THREE.Mesh;
    this.rShin = this.rThigh.children[0].children[0] as THREE.Mesh;

    // ARMS
    const bicepW = 0.1 * (muscle * 0.6 + 0.6) * (1 + fat * 0.2) * p.armThickness;
    const bicepH = 0.35 * scale * p.armLength;
    const elbowGeo = new THREE.SphereGeometry(bicepW * 0.7, 8, 8);
    const bicepGeo = new THREE.CylinderGeometry(bicepW * 1.1, bicepW, bicepH, 12);
    const forearmGeo = new THREE.CylinderGeometry(bicepW, bicepW * 0.7, bicepH, 12);
    const handGeo = new THREE.BoxGeometry(bicepW * 0.8, bicepW * 0.2, bicepW * 0.8);
    const armMat = effectiveClothing.top === 'bare' ? skinMat : topMat;

    const createArm = (posX: number, side: 'L' | 'R') => {
        const bicep = new THREE.Mesh(bicepGeo, armMat);
        bicep.position.set(posX, this.bodyMesh.position.y + 0.05, 0);
        
        const elbow = new THREE.Mesh(elbowGeo, armMat);
        elbow.position.y = -bicepH / 2;
        bicep.add(elbow);

        const forearm = new THREE.Mesh(forearmGeo, (side === 'L' ? cd.clothing.gloveL : cd.clothing.gloveR) !== 'none' ? extraMat : skinMat);
        forearm.position.set(0, -bicepH / 2, 0);
        elbow.add(forearm);

        const hand = new THREE.Mesh(handGeo, skinMat);
        hand.position.y = -bicepH / 2;
        forearm.add(hand);

        return bicep;
    };

    this.lBicep = createArm(-chestW * 0.6, 'L');
    this.rBicep = createArm(chestW * 0.6, 'R');
    this.bodyLayer.add(this.lBicep, this.rBicep);

    // Assign forearms for animation
    this.lForearm = this.lBicep.children[0].children[0] as THREE.Mesh;
    this.rForearm = this.rBicep.children[0].children[0] as THREE.Mesh;

    if (cd.tattoos) {
        cd.tattoos.forEach(t => {
            const tatMat = new THREE.MeshBasicMaterial({ color: '#111', transparent: true, opacity: 0.4 });
            if (t === 'arm_sleeve') {
                const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(bicepW * 1.05, bicepW * 1.05, bicepH, 8), tatMat);
                if (this.rBicep) this.rBicep.add(sleeve);
            }
            if (t === 'chest_piece') {
                const chestTat = new THREE.Mesh(new THREE.PlaneGeometry(chestW * 0.5, chestH * 0.4), tatMat);
                chestTat.position.z = 0.11 * scale;
                this.bodyMesh.add(chestTat);
            }
        });
    }
    
    this.group.rotation.y = (cd.yaw || 0) * Math.PI / 180;
  }

  render() {
    if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
    }
  }

  resize() {
    if (!this.renderer || !this.camera) return;
    const container = this.renderer.domElement.parentElement;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  destroy() {
    this.renderer?.dispose();
    this.renderer?.domElement.remove();
  }
}
