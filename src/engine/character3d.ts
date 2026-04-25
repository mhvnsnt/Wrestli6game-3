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
  rBicep?: THREE.Mesh;
  lForearm?: THREE.Mesh;
  rForearm?: THREE.Mesh;
  lWrist?: THREE.Group;
  rWrist?: THREE.Group;
  lWristMesh?: THREE.Mesh;
  rWristMesh?: THREE.Mesh;
  lThigh?: THREE.Mesh;
  rThigh?: THREE.Mesh;
  lShin?: THREE.Mesh;
  rShin?: THREE.Mesh;
  lAnkle?: THREE.Group;
  rAnkle?: THREE.Group;
  lAnkleMesh?: THREE.Mesh;
  rAnkleMesh?: THREE.Mesh;
  lHandGroup?: THREE.Group;
  rHandGroup?: THREE.Group;
  lElbow?: THREE.Mesh;
  rElbow?: THREE.Mesh;
  lKnee?: THREE.Mesh;
  rKnee?: THREE.Mesh;
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

    private resetPoses() {
        if (!this.lThigh || !this.rThigh || !this.lBicep || !this.rBicep || !this.bodyMesh || !this.lShin || !this.rShin || !this.headMesh) return;
        
        this.group.position.set(0, 0, 0);
        this.bodyMesh.position.set(0, this.bodyMesh.position.y, 0);
        this.bodyMesh.rotation.set(0, 0, 0);
        this.headMesh.rotation.set(0, 0, 0);
        this.headMesh.position.set(0, this.headMesh.position.y, this.headMesh.position.z);
        
        this.lThigh.rotation.set(0, 0, -0.1);
        this.rThigh.rotation.set(0, 0, 0.1);
        this.lShin.rotation.set(0, 0, 0);
        this.rShin.rotation.set(0, 0, 0);
        if (this.lAnkle) this.lAnkle.rotation.set(0, 0, 0);
        if (this.rAnkle) this.rAnkle.rotation.set(0, 0, 0);
        if (this.lAnkleMesh) this.lAnkleMesh.rotation.set(0, 0, 0);
        if (this.rAnkleMesh) this.rAnkleMesh.rotation.set(0, 0, 0);
        
        if (this.lKnee) this.lKnee.rotation.set(0, 0, 0);
        if (this.rKnee) this.rKnee.rotation.set(0, 0, 0);
        if (this.lElbow) this.lElbow.rotation.set(0, 0, 0);
        if (this.rElbow) this.rElbow.rotation.set(0, 0, 0);
        
        this.lBicep.rotation.set(0, 0, -0.2);
        this.rBicep.rotation.set(0, 0, 0.2);
        if (this.lForearm) this.lForearm.rotation.set(0, 0, 0);
        if (this.rForearm) this.rForearm.rotation.set(0, 0, 0);
        if (this.lWrist) this.lWrist.rotation.set(0, 0, 0);
        if (this.rWrist) this.rWrist.rotation.set(0, 0, 0);
        if (this.lWristMesh) this.lWristMesh.rotation.set(0, 0, 0);
        if (this.rWristMesh) this.rWristMesh.rotation.set(0, 0, 0);
    }

    updatePose(state: string, frame: number, facing: number, vx: number, vy: number, opponentPos?: THREE.Vector3) {
        if (!this.lThigh || !this.rThigh || !this.lBicep || !this.rBicep || !this.bodyMesh || !this.lShin || !this.rShin || !this.headMesh) return;
        const t = frame / 60;
        this.resetPoses();
    const scale = this.cd.height / 100;

    // Head/Eye tracking opponent
    if (opponentPos && this.headMesh && this.lEye && this.rEye) {
        try {
            const localTarget = this.headMesh.worldToLocal(opponentPos.clone());
            this.lEye.lookAt(opponentPos);
            this.rEye.lookAt(opponentPos);
            
            const lookAngle = Math.atan2(localTarget.x, localTarget.z);
            const targetRotY = Math.max(-0.8, Math.min(0.8, lookAngle));
            this.headMesh.rotation.y = THREE.MathUtils.lerp(this.headMesh.rotation.y, targetRotY, 0.1);
            
            // Pitch (looking up/down)
            const targetRotX = Math.max(-0.4, Math.min(0.4, -localTarget.y / 1.5));
            this.headMesh.rotation.x = THREE.MathUtils.lerp(this.headMesh.rotation.x, targetRotX, 0.05);

            // Brow movement based on target proximity (aggressive focus)
        if (this.lBrow && this.rBrow) {
                const height = this.cd.height || 180;
                const headSize = (0.18 * (height/100) * (this.cd.proportions?.headSize || 1));
                const dist = opponentPos.distanceTo(this.group.position);
                const isAggressive = dist < 2;
                const browOff = isAggressive ? -0.05 : 0;
                this.lBrow.position.y = 0.22 * headSize + browOff;
                this.rBrow.position.y = 0.22 * headSize + browOff;
                
                if (this.wrinkles) this.wrinkles.visible = isAggressive || state === 'hit' || state === 'attack';
            }
        } catch (e) {
            // Matrix not ready yet
        }
    }

    // Breathing (Dynamic based on Health/Stamina)
    const fatigue = (1 - (this.cd.hp || 100) / 100) + (1 - (this.cd.stamina || 100) / 100);
    const breatheSpeed = 0.05 + fatigue * 0.15;
    const breatheAmp = 0.01 + fatigue * 0.04;
    const breathe = Math.sin(frame * breatheSpeed) * breatheAmp;
    
    // Muscle Flexing (Subtle expansion based on movement and stats)
    const muscleMult = (this.cd.proportions?.muscleMass || 1);
    const pulse = 1 + (Math.abs(vx) + Math.abs(vy)) * 0.005 + breathe;
    
    this.bodyMesh.scale.set(1 + breathe * 0.8, pulse, 1 + breathe * 0.4);
    
    // Pec/Arm Flex logic
    if (this.lBicep && this.rBicep) {
        const armPulse = 1 + (state === 'attack' ? 0.15 : 0) * muscleMult;
        this.lBicep.scale.set(armPulse, armPulse, armPulse);
        this.rBicep.scale.set(armPulse, armPulse, armPulse);
    }

    // FACIAL ANIMATION DRIVE
    if (this.mouth) {
        const isHurt = state === 'hit' || state === 'hurt' || state === 'knockdown' || state === 'ragdoll';
        const isAttacking = state === 'attack' || state.startsWith('strike');
        const isTaunting = state === 'taunting' || state === 'special' || state === 'victory';
        
        const mouthOpenTarget = (isHurt || isAttacking || isTaunting) ? 1.5 : 0.1;
        this.mouth.scale.y = THREE.MathUtils.lerp(this.mouth.scale.y, mouthOpenTarget, 0.2);
        
        const tongue = this.mouth.getObjectByName('tongue') as THREE.Mesh;
        if (tongue) {
            tongue.visible = mouthOpenTarget > 0.5;
            if (isTaunting) {
                tongue.scale.z = 1.2 + Math.sin(frame * 0.1) * 0.5;
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

    if (state === 'attack' || state.startsWith('strike')) {
        const attackFrame = frame % 30;
        const progress = Math.min(1, attackFrame / 12);
        const recovery = Math.max(0, (attackFrame - 12) / 18);
        
        const isRightHand = (Math.floor(frame / 60) % 2 === 0);
        const bicep = isRightHand ? this.rBicep : this.lBicep;
        const elbow = isRightHand ? this.rElbow : this.lElbow;
        const forearm = isRightHand ? this.rForearm : this.lForearm;
        const wrist = isRightHand ? this.rWrist : this.lWrist;
        const otherBicep = isRightHand ? this.lBicep : this.rBicep;
        const sign = isRightHand ? 1 : -1;

        if (state.includes('heavy') || state.includes('kick')) {
            const windup = Math.pow(progress, 2);
            const strike = Math.sin(Math.sqrt(recovery) * Math.PI);
            
            this.bodyMesh.rotation.y = -windup * 0.9 * sign + strike * 1.5 * sign;
            this.bodyMesh.rotation.x = windup * 0.2;
            
            bicep.rotation.x = -windup * Math.PI/1.5 - strike * Math.PI * 0.8;
            bicep.rotation.z = -sign * (Math.PI/3 + windup * 0.4);
            
            if (elbow) elbow.rotation.x = windup * 1.2 - strike * 0.5;
            if (wrist) {
                wrist.rotation.x = -windup * 0.5 + strike * 1.2;
                wrist.rotation.y = strike * sign * 0.4;
            }
            
            // Torque the legs
            this.lThigh.rotation.y = windup * 0.4;
            this.rThigh.rotation.y = -windup * 0.4;
            if (this.lKnee) this.lKnee.rotation.x = windup * 0.5;
            if (this.rKnee) this.rKnee.rotation.x = windup * 0.5;
        } else {
            const snap = Math.sin(progress * Math.PI);
            bicep.rotation.x = -snap * Math.PI/1.3;
            bicep.rotation.z = -sign * snap * 0.3;
            
            this.bodyMesh.rotation.y = snap * 0.4 * sign;
            if (elbow) elbow.rotation.x = snap * 0.6;
            if (wrist) wrist.rotation.x = snap * 1.1;
            
            otherBicep.rotation.z = -sign * Math.PI/2.8;
            otherBicep.rotation.x = -0.4;
        }
    } else if (state === 'stagger' || state === 'hurt') {
        const bounce = Math.sin(frame * 0.1);
        const stagger = Math.cos(frame * 0.05);

        this.bodyMesh.rotation.z = stagger * 0.2;
        this.bodyMesh.rotation.x = 0.3 + bounce * 0.15;
        this.headMesh.rotation.y = -stagger * 0.5;
        this.headMesh.rotation.x = bounce * 0.3;

        this.lBicep.rotation.z = -0.6 + bounce * 0.3;
        this.rBicep.rotation.z = 0.6 + bounce * 0.3;
        
        // Clutching hurt area (if possible to determine, or just generic "hurt" pose)
        if (this.lElbow) this.lElbow.rotation.x = 1.2 + bounce * 0.2;
        if (this.rElbow) this.rElbow.rotation.x = 1.2 + bounce * 0.2;

        this.lThigh.rotation.x = stagger * 0.4;
        this.rThigh.rotation.x = -stagger * 0.4;
        if (this.lKnee) this.lKnee.rotation.x = 0.6;
        if (this.rKnee) this.rKnee.rotation.x = 0.6;
    } else if (state === 'victory') {
        // TAUNTING / CELEBRATING
        const wave = Math.sin(frame * 0.1);
        this.bodyMesh.rotation.y = wave * 0.2;
        
        this.rBicep.rotation.x = -Math.PI + wave * 0.3;
        this.rBicep.rotation.z = 0.2;
        if (this.rWrist) this.rWrist.rotation.x = wave * 0.5;
        
        this.lBicep.rotation.z = -0.4;
        this.lBicep.rotation.x = -0.2;
    } else if (state === 'lockup' || state === 'grappling') {
        // COLLAR AND ELBOW TIE UP / CLINCH
        const idle = Math.sin(frame * 0.1) * 0.05;
        this.bodyMesh.rotation.x = 0.3 + idle; // Lean in
        this.bodyMesh.position.z = 0.1;
        
        this.lBicep.rotation.set(-0.8, 0.4, 0.2);
        this.rBicep.rotation.set(-0.8, -0.4, -0.2);
        if (this.lForearm) this.lForearm.rotation.x = 1.2;
        if (this.rForearm) this.rForearm.rotation.x = 1.2;
        
        this.lThigh.rotation.x = 0.4;
        this.rThigh.rotation.x = -0.4;
    } else if (state === 'suplexing' || state === 'lifting') {
        // POWER LIFT / ARCH
        const progress = Math.sin(frame * 0.05);
        this.bodyMesh.rotation.x = -0.8 * progress; // Arch back
        this.lBicep.rotation.set(-Math.PI/1.2, 0, 0.5);
        this.rBicep.rotation.set(-Math.PI/1.2, 0, -0.5);
        this.lThigh.rotation.x = -0.5;
        this.rThigh.rotation.x = -0.5;
    } else if (state === 'walk' || state === 'running') {
        // WALK / RUNNING (Swagger & High-Impact Movement)
        const walkSpeed = state === 'walk' ? 0.8 : 1.8;
        const cycleSpeed = state === 'running' ? 2.5 : 1.2;
        const s = Math.sin(t * cycleSpeed);
        const c = Math.cos(t * cycleSpeed);
        
        this.group.position.y = Math.abs(s) * 0.12; // Bounce
        this.group.rotation.y = s * 0.15 * (state === 'walk' ? 1 : 0.5); // Hip swagger
        
        this.lThigh.rotation.x = s * walkSpeed;
        this.rThigh.rotation.x = -s * walkSpeed;
        this.lShin.rotation.x = Math.max(0, -s * walkSpeed * 0.8);
        this.rShin.rotation.x = Math.max(0, s * walkSpeed * 0.8);
        
        if (this.lAnkle) this.lAnkle.rotation.x = -s * 0.4;
        if (this.rAnkle) this.rAnkle.rotation.x = s * 0.4;
        
        this.lBicep.rotation.x = -s * walkSpeed * 0.6;
        this.rBicep.rotation.x = s * walkSpeed * 0.6;
        this.lBicep.rotation.z = Math.PI / 4 + s * 0.1;
        this.rBicep.rotation.z = -Math.PI / 4 + s * 0.1;
        
        // Torso rotation into the step
        this.bodyMesh.rotation.y = -s * 0.2;
        this.bodyMesh.rotation.z = c * 0.1;
    } else if (state === 'jump') {
        const lift = Math.min(0.5, vy * 0.1);
        this.lThigh.rotation.x = -0.8 - lift;
        this.rThigh.rotation.x = 0.5 + lift;
        this.lBicep.rotation.z = Math.PI / 1.2;
        this.rBicep.rotation.z = -Math.PI / 1.2;
        this.bodyMesh.rotation.x = -0.2;
    } else if (state === 'dead' || state === 'knockdown' || state === 'hit' || state === 'ragdoll' || state === 'hurt') {
        // VISCERAL RAGDOLL PHYSICS
        const jitter = Math.sin(frame * 0.5) * 0.1 * Math.min(1, (Math.abs(vx) + Math.abs(vy))/5);
        this.group.rotation.x = -Math.PI / 2.1 + jitter;
        this.group.rotation.y += jitter * 0.5;
        this.group.rotation.z += Math.sin(frame * 0.1) * 0.1 * Math.abs(vx);
        
        // Random limb flailing based on velocity
        this.lThigh.rotation.x = 0.6 + Math.sin(frame * 0.2) * (vy * 0.15) + (vx * 0.05);
        this.rThigh.rotation.x = 0.8 + Math.cos(frame * 0.15) * (vx * 0.15) - (vy * 0.05);
        this.lBicep.rotation.z = Math.PI / 3 + Math.sin(frame * 0.3) * (vy * 0.3);
        this.rBicep.rotation.z = -Math.PI / 3 + Math.cos(frame * 0.25) * (vx * 0.3);
        
        if (this.lAnkle) this.lAnkle.rotation.x = Math.sin(frame * 0.5) * 1.5;
        if (this.rAnkle) this.rAnkle.rotation.x = Math.cos(frame * 0.45) * 1.5;

        // Hip rotation for "hanging" feel
        this.group.position.y += Math.sin(frame * 0.1) * 0.05;

        // Forearm flailing
        if (this.lForearm) this.lForearm.rotation.x = Math.sin(frame * 0.4) * 2.5;
        if (this.rForearm) this.rForearm.rotation.x = Math.cos(frame * 0.35) * 2.5;

        // Squish on impact
        if (state === 'hit' || (vy > 5 && state === 'ragdoll')) {
            this.bodyMesh.scale.y = 1.1 + (Math.abs(vy) * 0.04);
            this.bodyMesh.scale.x = 0.9 - (Math.abs(vy) * 0.02);
            this.group.position.y = -0.15; // Deeper into the mat for weight
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
    } else if (state === 'stagger') {
        const s = Math.sin(t * 2);
        this.group.rotation.z = s * 0.15;
        this.group.rotation.y += s * 0.1;
        this.headMesh.rotation.x = 0.2 + s * 0.1;
        this.lBicep.rotation.z = Math.PI/2 + s * 0.3;
        this.rBicep.rotation.z = -Math.PI/2 + s * 0.3;
    } else if (state === 'seated' || state === 'grounded') {
        this.group.rotation.x = -Math.PI/2.2;
        this.bodyMesh.rotation.x = 0.5;
        this.lThigh.rotation.x = -1.2;
        this.rThigh.rotation.x = -1.2;
        this.lBicep.rotation.z = Math.PI/2;
        this.rBicep.rotation.z = -Math.PI/2;
    } else if (state === 'kneeling') {
        this.group.position.y = -0.3;
        this.lThigh.rotation.x = -1.5;
        this.rThigh.rotation.x = -1.5;
        this.lShin.rotation.x = 1.5;
        this.rShin.rotation.x = 1.5;
        this.bodyMesh.rotation.x = -0.2;
    } else {
        // IDLE SWAGGER (Heavy breathing and ready stance)
        const idleSpeed = 0.08;
        const breathing = Math.sin(frame * idleSpeed) * 0.04;
        const sway = Math.sin(frame * idleSpeed * 0.5) * 0.05;
        
        this.group.rotation.y += sway;
        this.bodyMesh.position.y = 1.45 * scale + breathing;
        
        // Powerful Ready Stance (Opposable joint flex)
        this.lBicep.rotation.z = Math.PI / 5 + breathing;
        this.rBicep.rotation.z = -Math.PI / 5 - breathing;
        this.lBicep.rotation.x = 0.4;
        this.rBicep.rotation.x = 0.4;
        
        const lForearm = this.lBicep.getObjectByName('forearm');
        const rForearm = this.rBicep.getObjectByName('forearm');
        if (lForearm) lForearm.rotation.x = 0.8 + breathing;
        if (rForearm) rForearm.rotation.x = 0.8 + breathing;
        
        // Wrist flex (Opposable joints)
        const lHand = this.lBicep.getObjectByName('hand');
        const rHand = this.rBicep.getObjectByName('hand');
        if (lHand) lHand.rotation.x = 0.3 + breathing;
        if (rHand) rHand.rotation.x = 0.3 + breathing;

        this.lThigh.rotation.z = -0.15;
        this.rThigh.rotation.z = 0.15;
        this.lThigh.rotation.x = -0.2;
        this.rThigh.rotation.x = -0.2;
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

    if (cd.name === 'OFFICIAL') {
        // Render Vertical Stripes for Official shirt
        ctx.fillStyle = '#000';
        for (let i = 0; i < 512; i += 40) {
            ctx.fillRect(i, 0, 20, 512);
        }
    } else {
        // Subtle Noise / Pores
        for (let i = 0; i < 5000; i++) {
            ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.03})`;
            ctx.fillRect(Math.random() * 512, Math.random() * 512, 1, 1);
        }
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

    // Procedural Tattoos
    if (cd.tattoos && cd.tattoos.length > 0) {
        ctx.fillStyle = 'rgba(0,0,20,0.4)';
        cd.tattoos.forEach(t => {
            if (t === 'arm_sleeve') {
                for(let i=0; i<20; i++) {
                    ctx.beginPath();
                    ctx.arc(400 + Math.random()*80, 100 + Math.random()*300, 2 + Math.random()*5, 0, Math.PI*2);
                    ctx.fill();
                }
            }
            if (t === 'chest_piece') {
                ctx.beginPath();
                ctx.moveTo(256, 400);
                ctx.lineTo(200, 350);
                ctx.lineTo(312, 350);
                ctx.closePath();
                ctx.fill();
            }
        });
    }

    // Scars
    if (cd.scars && cd.scars.length > 0) {
        ctx.strokeStyle = 'rgba(150,50,50,0.3)';
        ctx.lineWidth = 2;
        cd.scars.forEach(s => {
            if (s === 'eye_slash') {
                ctx.beginPath(); ctx.moveTo(40, 30); ctx.lineTo(40, 60); ctx.stroke();
            }
            if (s === 'torso_slash') {
                ctx.beginPath(); ctx.moveTo(200, 400); ctx.lineTo(300, 450); ctx.stroke();
            }
        });
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

    const defaultProportions = { 
        headSize: 1, neckLength: 1, shoulderWidth: 1, chestSize: 1, torsoLength: 1, 
        waistWidth: 1, armLength: 1, armThickness: 1, legLength: 1, legThickness: 1, 
        handSize: 1, footSize: 1, hipWidth: 1 
    };
    const p = { ...defaultProportions, ...(cd.proportions || {}) };
    const scale = (cd.height / 100);
    const isFem = cd.gender === 'female';
    
    const muscle = cd.muscleMass;
    const fat = cd.fatMass;

    // Materials
    const skinMat = this.generateSkinTexture(cd);
    
    // Sweat effect (Broadcast specular shine)
    skinMat.roughness = 0.35; // Global lowered roughness for that sweaty athlete look
    skinMat.metalness = 0.15; 
    
    // Pro Rim Lighting for TV broadcast look (Cinematic backlight)
    const rimColor = new THREE.Color('#ffffff');
    skinMat.emissive = rimColor;
    skinMat.emissiveIntensity = 0.22; // Punchy rim light to help pop against dark arena
    
    const hairMat = new THREE.MeshStandardMaterial({ 
        color: cd.hairColor, 
        roughness: 0.7,
        metalness: 0.1
    });
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

    // ANATOMICAL DEFINITION (Pecs/Abs/Serratus)
    if (effectiveClothing.top === 'bare') {
        const pecGeo = new THREE.BoxGeometry(chestW * 0.48, chestH * 0.45, 0.1 * scale);
        const lPec = new THREE.Mesh(pecGeo, skinMat);
        const rPec = new THREE.Mesh(pecGeo, skinMat);
        lPec.position.set(-chestW * 0.25, chestH * 0.22, 0.14 * scale);
        rPec.position.set(chestW * 0.25, chestH * 0.22, 0.14 * scale);
        lPec.rotation.y = 0.15;
        rPec.rotation.y = -0.15;
        lPec.rotation.z = 0.05;
        rPec.rotation.z = -0.05;
        this.bodyMesh.add(lPec, rPec);

        // AB DEFINITION (Heavyweight Core)
        const abGeo = new THREE.BoxGeometry(chestW * 0.38, 0.06 * scale, 0.06 * scale);
        for (let i = 0; i < 4; i++) {
            const ab = new THREE.Mesh(abGeo, skinMat);
            ab.position.set(0, -chestH * 0.05 - (i * 0.09 * scale), 0.14 * scale);
            ab.scale.set(1.1 - i * 0.06, 1, 1);
            this.bodyMesh.add(ab);
        }
        
        // Serratus (Side definition)
        const ribGeo = new THREE.BoxGeometry(0.12 * scale, 0.03 * scale, 0.02 * scale);
        for (let i = 0; i < 3; i++) {
            const lRib = new THREE.Mesh(ribGeo, skinMat);
            const rRib = new THREE.Mesh(ribGeo, skinMat);
            lRib.position.set(-chestW * 0.45, -chestH * 0.05 + i * 0.08, 0.1 * scale);
            rRib.position.set(chestW * 0.45, -chestH * 0.05 + i * 0.08, 0.1 * scale);
            lRib.rotation.y = -0.5;
            rRib.rotation.y = 0.5;
            this.bodyMesh.add(lRib, rRib);
        }
    }

    // TRAPS (Anatomical definition)
    const trapGeo = new THREE.BoxGeometry(chestW * 0.65, 0.12 * scale, 0.2 * scale);
    const traps = new THREE.Mesh(trapGeo, skinMat);
    traps.position.y = chestH * 0.5;
    traps.scale.set(1.15, 1, 0.9);
    this.bodyMesh.add(traps);

    // LATS (V-taper - Pro Wrestler Physique)
    const latGeo = new THREE.BoxGeometry(chestW * 0.35, 0.5 * scale, 0.15 * scale);
    const lLat = new THREE.Mesh(latGeo, skinMat);
    const rLat = new THREE.Mesh(latGeo, skinMat);
    lLat.position.set(-chestW * 0.45, -0.15 * scale, -0.05 * scale);
    rLat.position.set(chestW * 0.45, -0.15 * scale, -0.05 * scale);
    lLat.rotation.z = 0.3;
    rLat.rotation.z = -0.3;
    this.bodyMesh.add(lLat, rLat);

    // Waist
    const waistW = (isFem ? 0.28 : 0.42) * (1 + fat * 0.8) * p.waistWidth;
    const waistH = 0.25 * scale * p.torsoLength;
    const waistGeo = new THREE.BoxGeometry(waistW, waistH, 0.18 + fat * 0.5 + (Math.max(0.1, p.waistWidth) - 1) * 0.1);
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

    // Hips & Glutes (Defined pro-wrestler power base)
    const hipW = (isFem ? 0.42 : 0.4) * (1 + fat * 0.5 + cd.gluteSize * 0.2) * (1 + (p.hipWidth - 1) * 0.2);
    const hipH = 0.15 * scale;
    const hipGeo = new THREE.BoxGeometry(hipW, hipH, 0.2 + fat * 0.2 + cd.gluteSize * 0.3);
    this.hips = new THREE.Mesh(hipGeo, bottomMat);
    this.hips.position.y = waist.position.y - waistH / 2 - hipH / 2;
    this.bodyLayer.add(this.hips);

    const gluteW = 0.18 * scale * (1 + (cd.gluteSize || 0));
    const gluteGeo = new THREE.SphereGeometry(gluteW, 16, 16);
    const lGlute = new THREE.Mesh(gluteGeo, bottomMat);
    const rGlute = new THREE.Mesh(gluteGeo, bottomMat);
    lGlute.position.set(-hipW * 0.25, -0.05 * scale, -0.12 * scale);
    rGlute.position.set(hipW * 0.25, -0.05 * scale, -0.12 * scale);
    lGlute.scale.set(1.1, 1.3, 0.85);
    rGlute.scale.set(1.1, 1.3, 0.85);
    this.hips.add(lGlute, rGlute);

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
    // NECK
    const neckGeo = new THREE.CylinderGeometry(0.04 * scale, 0.05 * scale, 0.1 * scale * p.neckLength);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.name = "neck";
    neck.position.y = chestH / 2 + (0.1 * scale * p.neckLength) / 2;
    this.bodyMesh.add(neck);

    // HEAD 
    this.headMesh.position.y = (0.1 * scale * p.neckLength) / 2 + this.baseHeadSize * 0.8;
    neck.add(this.headMesh);

    // Anatomical Brow refinement
    const browGeoRefined = new THREE.BoxGeometry(this.baseHeadSize * 1.4, this.baseHeadSize * 0.3, this.baseHeadSize * 0.4);
    const brow = new THREE.Mesh(browGeoRefined, skinMat);
    brow.position.set(0, this.baseHeadSize * 0.2, this.baseHeadSize * 0.8);
    brow.scale.set(1/headScaleX, 1/headScaleY, 1/this.headScaleZ);
    this.headMesh.add(brow);

    // Jawline (Powerful pro-wrestler jaw)
    const jawGeo = new THREE.BoxGeometry(this.baseHeadSize * 1.5, this.baseHeadSize * 0.5, this.baseHeadSize * 0.8);
    const jaw = new THREE.Mesh(jawGeo, skinMat);
    jaw.position.set(0, -this.baseHeadSize * 0.5, this.baseHeadSize * 0.2);
    jaw.rotation.x = -0.3;
    jaw.scale.set(1/headScaleX, 1/headScaleY, 1/this.headScaleZ);
    this.headMesh.add(jaw);

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
    const eyebrowGeo = new THREE.BoxGeometry(0.06 * scale, 0.02 * scale, 0.01 * scale);
    this.lBrow = new THREE.Mesh(eyebrowGeo, hairMat);
    this.rBrow = new THREE.Mesh(eyebrowGeo, hairMat);
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
    if (cd.scars && Array.isArray(cd.scars)) {
        cd.scars.forEach(s => {
            if (s === 'eye_slash') {
                const scar = new THREE.Mesh(new THREE.PlaneGeometry(0.005 * scale, 0.05 * scale), new THREE.MeshBasicMaterial({ color: '#c00', transparent: true, opacity: 0.5 }));
                scar.position.set(0.4 * this.baseHeadSize, 0.1 * this.baseHeadSize, this.baseHeadSize * 0.95);
                this.headMesh?.add(scar);
            }
            if (s === 'cheek_cross') {
                const mat = new THREE.MeshBasicMaterial({ color: '#c00', transparent: true, opacity: 0.3 });
                const vertical = new THREE.Mesh(new THREE.PlaneGeometry(0.005 * scale, 0.04 * scale), mat);
                const horizontal = new THREE.Mesh(new THREE.PlaneGeometry(0.04 * scale, 0.005 * scale), mat);
                const cross = new THREE.Group();
                cross.add(vertical, horizontal);
                cross.position.set(-0.5 * this.baseHeadSize, -0.3 * this.baseHeadSize, this.baseHeadSize * 0.85);
                this.headMesh?.add(cross);
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
    const ankleGeo = new THREE.SphereGeometry(legW * 0.6, 8, 8);
    const footGeo = new THREE.BoxGeometry(legW * 0.9, 0.05 * scale, legW * 1.4);

    const createLeg = (posX: number) => {
        const thigh = new THREE.Mesh(thighGeo, bottomMat);
        thigh.position.set(posX, this.hips?.position.y ?? 0 - 0.1, 0);
        
        // Quads definition
        if (muscle > 0.6) {
            const quadGeo = new THREE.BoxGeometry(legW * 0.8, thighH * 0.6, 0.08 * scale);
            const quads = new THREE.Mesh(quadGeo, bottomMat);
            quads.position.z = legW * 0.5;
            quads.position.y = 0.1 * scale;
            thigh.add(quads);
        }

        const knee = new THREE.Mesh(jointGeo, bottomMat);
        knee.name = "knee";
        knee.position.y = -thighH / 2;
        thigh.add(knee);
        if (posX < 0) this.lKnee = knee; else this.rKnee = knee;

        const shin = new THREE.Mesh(shinGeo, cd.clothing.boots !== 'none' ? extraMat : bottomMat);
        shin.name = "shin";
        shin.position.set(0, -thighH / 2, 0);
        knee.add(shin);

        const ankleJoint = new THREE.Mesh(ankleGeo, cd.clothing.boots !== 'none' ? extraMat : skinMat);
        ankleJoint.name = "ankle_joint";
        ankleJoint.position.y = -thighH / 2;
        shin.add(ankleJoint);
        if (posX < 0) this.lAnkleMesh = ankleJoint; else this.rAnkleMesh = ankleJoint;

        const ankle = new THREE.Group();
        ankle.name = "ankle";
        ankleJoint.add(ankle);

        const foot = new THREE.Mesh(footGeo, cd.clothing.boots !== 'none' ? extraMat : skinMat);
        foot.name = "foot";
        foot.position.set(0, -0.02 * scale, legW * 0.3);
        ankle.add(foot);

        return thigh;
    };

    this.lThigh = createLeg(-hipW * 0.3);
    this.rThigh = createLeg(hipW * 0.3);
    this.hips.add(this.lThigh, this.rThigh);
    
    // Assign shins for animation access
    this.lShin = this.lThigh.getObjectByName('shin') as THREE.Mesh;
    this.rShin = this.rThigh.getObjectByName('shin') as THREE.Mesh;
    this.lAnkle = this.lShin.getObjectByName('ankle') as THREE.Group;
    this.rAnkle = this.rShin.getObjectByName('ankle') as THREE.Group;

    // ARMS REFINED (Biceps / Delts)
    const bicepW = 0.1 * (muscle * 0.6 + 0.6) * (1 + fat * 0.2) * p.armThickness;
    const bicepH = 0.35 * scale * p.armLength;
    const deltGeo = new THREE.SphereGeometry(bicepW * 1.35, 16, 16);
    const bicepGeo = new THREE.CylinderGeometry(bicepW * 1.2, bicepW, bicepH, 12);
    const elbowGeo = new THREE.SphereGeometry(bicepW * 0.75, 12, 12);
    const wristJointGeo = new THREE.SphereGeometry(bicepW * 0.5, 8, 8);
    const forearmGeo = new THREE.CylinderGeometry(bicepW, bicepW * 0.7, bicepH, 12);
    const handGeo = new THREE.BoxGeometry(bicepW * 0.8, bicepW * 0.2, bicepW * 0.6);
    const fingerGeo = new THREE.BoxGeometry(bicepW * 0.15, bicepW * 0.3, bicepW * 0.15);
    const armMat = effectiveClothing.top === 'bare' ? skinMat : topMat;

    const createArm = (posX: number, side: 'L' | 'R') => {
        const bicep = new THREE.Mesh(bicepGeo, armMat);
        const bodyPosY = this.bodyMesh?.position.y ?? 0;
        bicep.position.set(posX, bodyPosY + 0.05, 0);
        
        // Detailed Deltoid
        const delt = new THREE.Mesh(deltGeo, skinMat);
        delt.name = "delt";
        delt.position.y = bicepH * 0.45;
        delt.scale.set(1.2, 1.4, 1.1);
        bicep.add(delt);

        const elbow = new THREE.Mesh(elbowGeo, armMat);
        elbow.name = "elbow";
        elbow.position.y = -bicepH / 2;
        bicep.add(elbow);
        if (side === 'L') this.lElbow = elbow; else this.rElbow = elbow;

        const forearm = new THREE.Mesh(forearmGeo, (side === 'L' ? cd.clothing.gloveL : cd.clothing.gloveR) !== 'none' ? extraMat : skinMat);
        forearm.name = "forearm";
        forearm.position.set(0, -bicepH / 2, 0);
        elbow.add(forearm);

        const wristJoint = new THREE.Mesh(wristJointGeo, (side === 'L' ? cd.clothing.gloveL : cd.clothing.gloveR) !== 'none' ? extraMat : skinMat);
        wristJoint.name = "wrist_joint";
        wristJoint.position.y = -bicepH / 2;
        forearm.add(wristJoint);
        if (side === 'L') this.lWristMesh = wristJoint; else this.rWristMesh = wristJoint;

        const wrist = new THREE.Group();
        wrist.name = "wrist";
        wristJoint.add(wrist);

        const hand = new THREE.Group();
        hand.name = "hand_group";
        wrist.add(hand);
        if (side === 'L') this.lHandGroup = hand; else this.rHandGroup = hand;

        const palm = new THREE.Mesh(handGeo, skinMat);
        palm.position.y = -bicepW * 0.2;
        hand.add(palm);

        // Add 4 fingers
        for(let i=0; i<4; i++) {
            const finger = new THREE.Mesh(fingerGeo, skinMat);
            finger.position.set((i-1.5) * bicepW * 0.2, -bicepW * 0.5, 0);
            hand.add(finger);
        }
        // Thumb
        const thumb = new THREE.Mesh(fingerGeo, skinMat);
        thumb.position.set(side === 'L' ? 0.3 * bicepW : -0.3 * bicepW, -bicepW * 0.3, 0.2 * bicepW);
        thumb.rotation.y = side === 'L' ? 0.5 : -0.5;
        hand.add(thumb);

        return bicep;
    };

    this.lBicep = createArm(-chestW * 0.6, 'L');
    this.rBicep = createArm(chestW * 0.6, 'R');
    this.bodyLayer.add(this.lBicep, this.rBicep);

    // Assign limbs for animation access
    this.lForearm = this.lBicep.getObjectByName('forearm') as THREE.Mesh;
    this.rForearm = this.rBicep.getObjectByName('forearm') as THREE.Mesh;
    this.lWrist = this.lForearm.getObjectByName('wrist') as THREE.Group;
    this.rWrist = this.rForearm.getObjectByName('wrist') as THREE.Group;

            if (cd.tattoos && Array.isArray(cd.tattoos)) {
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
