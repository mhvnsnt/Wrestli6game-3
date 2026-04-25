/**
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { motion } from 'motion/react';
import { CharacterData, WeaponObject, Weapons, GameOptions, ArenaData } from '../types';
import { Fighter } from '../engine/fighter';
import { Fighter3DRenderer } from '../engine/fighter3d';
import { EnergyBolt, Particle, HitFlash, Sigil } from '../engine/effects';
import { RingRope, ArenaObjectPhysics, ScenePhysics } from '../engine/physics';
import { Referee } from '../engine/referee';
import { Referee3DRenderer } from '../engine/referee3d';
import { MatchRating } from './MatchRating';

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

interface GameCanvasProps {
  p1Data: CharacterData;
  p2Data: CharacterData;
  p1CPU?: boolean;
  p2CPU?: boolean;
  championship?: string;
  arena?: ArenaData;
  gameOptions: GameOptions;
  matchCategory?: string;
  matchType?: string;
  matchPhase: 'intro' | 'entrance' | 'fight' | 'victory' | 'report';
  isPaused?: boolean;
  onUpdate: (p1: any, p2: any) => void;
  onPhaseChange?: (phase: 'intro' | 'entrance' | 'fight' | 'victory' | 'report') => void;
  onGameOver: (winnerName: string | null) => void;
}

const create3DWeapon = (w: WeaponObject, scene: THREE.Scene): THREE.Group => {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ 
        color: w.type === 'chair' ? '#444' : (w.type === 'table' ? '#532' : '#888'),
        metalness: w.type === 'steel_steps' || w.type === 'chair' ? 0.8 : 0.2,
        roughness: 0.2
    });

    switch (w.type) {
        case 'table':
            const top = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.6), mat);
            group.add(top);
            for(let i=0; i<4; i++) {
                const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5), mat);
                leg.position.set(i<2 ? -0.5 : 0.5, -0.25, i%2 === 0 ? -0.25 : 0.25);
                group.add(leg);
            }
            break;
        case 'ladder':
            const lMat = new THREE.MeshStandardMaterial({ color: '#777', metalness: 0.8, roughness: 0.3 });
            const railL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.5, 0.05), lMat);
            railL.position.x = -0.2;
            const railR = railL.clone();
            railR.position.x = 0.2;
            group.add(railL, railR);
            for(let i=0; i<6; i++) {
                const rung = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 0.05), lMat);
                rung.position.y = -0.6 + i * 0.2;
                group.add(rung);
            }
            break;
        case 'chair':
            const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.05), mat);
            chairBack.position.y = 0.2;
            const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.4), mat);
            group.add(chairBack, chairSeat);
            break;
        case 'kendo':
            const kendoMat = new THREE.MeshStandardMaterial({ color: '#d2b48c', roughness: 0.9 });
            const kendoStick = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.9, 8), kendoMat);
            group.add(kendoStick);
            break;
        case 'glass_tube':
            const glassMat = new THREE.MeshStandardMaterial({ 
                color: '#fff', 
                transparent: true, 
                opacity: 0.4,
                metalness: 1, 
                roughness: 0 
            });
            const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1, 8), glassMat);
            group.add(tube);
            break;
        case 'stop_sign':
            const redMat = new THREE.MeshStandardMaterial({ color: '#f00', roughness: 0.5 });
            const sPole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8), mat);
            const sign = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 8), redMat);
            sign.position.y = 0.4;
            sign.rotation.x = Math.PI / 2;
            group.add(sPole, sign);
            break;
        default:
            const gen = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), mat);
            group.add(gen);
            break;
    }

    scene.add(group);
    return group;
};

export const GameCanvas: React.FC<GameCanvasProps> = ({ 
    p1Data, 
    p2Data, 
    p1CPU = false,
    p2CPU = true,
    championship,
    arena,
    gameOptions, 
    matchCategory, 
    matchType, 
    matchPhase,
    isPaused = false,
    onUpdate, 
    onPhaseChange,
    onGameOver 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p1Ref = useRef<Fighter | null>(null);
  const p2Ref = useRef<Fighter | null>(null);
  const p1VisualRef = useRef<Fighter3DRenderer | null>(null);
  const p2VisualRef = useRef<Fighter3DRenderer | null>(null);
  const refRef = useRef<Referee | null>(null);
  const refVisualRef = useRef<Referee3DRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const projsRef = useRef<EnergyBolt[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const hitFlashesRef = useRef<HitFlash[]>([]);
  const sigilsRef = useRef<Sigil[]>([]);
  const weaponsRef = useRef<WeaponObject[]>([]);
  const weaponVisualsRef = useRef<Map<WeaponObject, THREE.Group>>(new Map());
  const ropesRef = useRef<RingRope[]>([]);
  const matchScoreRef = useRef(0);
  const matchEventRef = useRef<string | null>(null);
  const eventTimerRef = useRef(0);
  const phaseRef = useRef(matchPhase);
  useEffect(() => { phaseRef.current = matchPhase; }, [matchPhase]);

  const ringGroupRef = useRef<THREE.Group | null>(null);
  const keysRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      const currentPhase = phaseRef.current;
      // Skip current cinematic phase on any key
      if ((currentPhase === 'entrance' || currentPhase === 'victory' || currentPhase === 'report') && !['escape', 'tab'].includes(key)) {
        if (currentPhase === 'entrance') onPhaseChange?.('fight');
        else if (currentPhase === 'victory') onPhaseChange?.('report');
        return;
      }

      if (currentPhase === 'fight') {
        keysRef.current[key] = true;
      }

      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', ' '].includes(key)) {
        e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    const handleMouseDown = () => {
      const currentPhase = phaseRef.current;
      if (currentPhase === 'entrance') onPhaseChange?.('fight');
      else if (currentPhase === 'victory') onPhaseChange?.('report');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      
      // Stop themes on exit
      import('../engine/audio').then(m => m.sounds.toggleTheme(false));
    };
  }, [matchPhase, onPhaseChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 3D SETUP
    const W = container.clientWidth || window.innerWidth || 800;
    const H = container.clientHeight || window.innerHeight || 600;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#020205');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
    camera.position.set(0, 3, 8);
    camera.lookAt(0, 1, 0);
    cameraRef.current = camera;

    // STADIUM ATMOSPHERE
    scene.fog = new THREE.FogExp2('#050510', 0.015);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // LIGHTS
    const amb = new THREE.AmbientLight(0xffffff, arena?.type === 'backstage' ? 0.05 : 0.2);
    scene.add(amb);
    
    const spot = new THREE.SpotLight(0xffffff, arena?.type === 'backstage' ? 1 : 3);
    spot.position.set(0, 15, 0);
    spot.angle = Math.PI / 4;
    spot.penumbra = 0.3;
    spot.decay = 2;
    spot.distance = 50;
    spot.castShadow = true;
    spot.shadow.mapSize.width = 2048;
    spot.shadow.mapSize.height = 2048;
    spot.shadow.camera.near = 0.5;
    spot.shadow.camera.far = 40;
    scene.add(spot);

    // Neon Arena Accents
    [arena?.lighting || 0xff00ff, 0x00ffff].forEach((c, i) => {
        const pl = new THREE.PointLight(c, 5, 20);
        pl.position.set(i === 0 ? -10 : 10, 5, -5);
        scene.add(pl);
    });

    // Materials that might be reused
    const ringBaseMat = new THREE.MeshStandardMaterial({ color: '#0a0a0c', roughness: 0.7 });
    const barMat = new THREE.MeshStandardMaterial({ color: '#111', roughness: 0.2, metalness: 0.8 });
    const tbMat = new THREE.MeshStandardMaterial({ color: '#000', metalness: 0.8, roughness: 0.2 });

    // RING STRUCTURE GROUP (For shake effects)
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);
    ringGroupRef.current = ringGroup;

    if (arena?.type === 'stadium' || !arena) {
        // Stadium Floor (Around the ring)
        const stadiumFloorGeo = new THREE.PlaneGeometry(80, 80);
        const stadiumFloorMat = new THREE.MeshStandardMaterial({ 
            color: '#050508', 
            roughness: 0.15, 
            metalness: 0.9 
        });
        const stadiumFloor = new THREE.Mesh(stadiumFloorGeo, stadiumFloorMat);
        stadiumFloor.rotation.x = -Math.PI / 2;
        stadiumFloor.position.y = -0.76;
        stadiumFloor.receiveShadow = true;
        scene.add(stadiumFloor);

        // RING STRUCTURE (The Box under the Ring)
        const ringBaseGeo = new THREE.BoxGeometry(10.5, 0.8, 10.5);
        const ringBase = new THREE.Mesh(ringBaseGeo, ringBaseMat);
        ringBase.position.y = -0.4;
        ringBase.receiveShadow = true;
        ringGroup.add(ringBase);

        // Elevated Apron Sides (Branding)
        const apronColors = [arena?.apronColor || '#ff0000', '#222', arena?.apronColor || '#ff0000', '#222'];
        apronColors.forEach((color, i) => {
            const apronGeo = new THREE.PlaneGeometry(10.5, 0.8);
            const apronMat = new THREE.MeshStandardMaterial({ 
                color: color, 
                emissive: i % 2 === 0 ? '#400' : '#000',
                roughness: 0.5 
            });
            const apron = new THREE.Mesh(apronGeo, apronMat);
            apron.position.y = -0.4;
            if (i === 0) apron.position.z = 5.25;
            if (i === 1) { apron.position.x = 5.25; apron.rotation.y = Math.PI / 2; }
            if (i === 2) { apron.position.z = -5.25; apron.rotation.y = Math.PI; }
            if (i === 3) { apron.position.x = -5.25; apron.rotation.y = -Math.PI / 2; }
            ringGroup.add(apron);
        });

        // RING MAT
        const ringGeo = new THREE.PlaneGeometry(10.5, 10.5);
        const ringMat = new THREE.MeshStandardMaterial({ color: arena?.matColor || '#1a1a2e', roughness: 0.9, metalness: 0.1 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.01; // Slightly above base to prevent flickering
        ring.receiveShadow = true;
        ringGroup.add(ring);

        // PRO STAGE LIGHTING
        const ambiLight = new THREE.AmbientLight(0xffffff, 0.05);
        scene.add(ambiLight);

        const createSpotlight = (x: number, y: number, z: number, target: THREE.Object3D) => {
            const spotHeight = 15;
            const spot = new THREE.SpotLight(0xffffff, 180, 50, 0.35, 0.5, 2);
            spot.position.set(x, spotHeight, z);
            spot.target = target;
            spot.castShadow = true;
            spot.shadow.mapSize.width = 1024;
            scene.add(spot);
            
            // Static Light Cone (Visualizer)
            const coneGeo = new THREE.CylinderGeometry(0.1, 3, spotHeight, 32, 1, true);
            const coneMat = new THREE.MeshBasicMaterial({ 
                color: 0xffffff, 
                transparent: true, 
                opacity: 0.1, 
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide 
            });
            const cone = new THREE.Mesh(coneGeo, coneMat);
            cone.position.set(x, spotHeight/2, z);
            scene.add(cone);
        };

        // ENTRANCE STAGE (TitanTron)
        const stageGroup = new THREE.Group();
        
        // Spotlights pointed at ring and entrance
        createSpotlight(-8, 12, 8, ringGroup);
        createSpotlight(8, 12, 8, ringGroup);
        createSpotlight(0, 12, -15, stageGroup); // Entrance Spotlight
        const screenGeo = new THREE.PlaneGeometry(16, 8);
        const screenMat = new THREE.MeshStandardMaterial({ 
            color: '#000', 
            emissive: '#050515', 
            metalness: 0.9, 
            roughness: 0.1 
        });
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.set(0, 5, -20);
        stageGroup.add(screen);

        const stageFloor = new THREE.Mesh(new THREE.PlaneGeometry(20, 10), new THREE.MeshStandardMaterial({ color: '#111', metalness: 0.8, roughness: 0.2 }));
        stageFloor.rotation.x = -Math.PI / 2;
        stageFloor.position.set(0, -0.75, -16);
        stageGroup.add(stageFloor);
        scene.add(stageGroup);

        // Truss Structure
        const trussMat = new THREE.MeshStandardMaterial({ color: '#333', metalness: 0.9, roughness: 0.1 });
        const createTruss = (x: number, z: number, rot: number) => {
            const truss = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 30, 8), trussMat);
            truss.position.set(x, 12, z);
            truss.rotation.z = Math.PI / 2;
            truss.rotation.y = rot;
            scene.add(truss);
        };
        createTruss(0, 10, 0);
        createTruss(0, -10, 0);

        // Barricades (Ringside) - Professional Metal Guardrails
        const railMat = new THREE.MeshStandardMaterial({ color: '#444', metalness: 1.0, roughness: 0.1 });
        const createBarricade = (w: number, h: number, x: number, z: number, ry: number) => {
            const group = new THREE.Group();
            const topRail = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, w), railMat);
            topRail.rotation.z = Math.PI / 2;
            topRail.position.y = h;
            group.add(topRail);
            
            // Vertical Bars
            for(let i=0; i<w*2; i++) {
                const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, h), railMat);
                bar.position.set(-w/2 + i * 0.5, h/2, 0);
                group.add(bar);
            }
            group.position.set(x, 0, z);
            group.rotation.y = ry;
            scene.add(group);
        };
        
        createBarricade(20, 1.2, -12, 0, Math.PI / 2);
        createBarricade(20, 1.2, 12, 0, -Math.PI / 2);
        createBarricade(20, 1.2, 0, 12, 0);
        createBarricade(20, 1.2, 0, -12, Math.PI);

        // Announce Table
        const tableGroup = new THREE.Group();
        const tableTop = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 1.5), new THREE.MeshStandardMaterial({ color: '#222' }));
        tableTop.position.y = 0.8;
        tableTop.name = 'table_top';
        tableGroup.add(tableTop);
        
        const tableBase = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.8, 1.3), new THREE.MeshStandardMaterial({ color: '#111' }));
        tableBase.position.y = 0.4;
        tableGroup.add(tableBase);

        // Add to weapons ref as special static type for collision detection
        const announceTable: WeaponObject = {
            id: 'announce_table_1',
            type: 'table',
            x: 1350, y: 380, z: 0,
            vx: 0, vy: 0, rotation: 0, rv: 0, onGround: true,
            durability: 10, maxDurability: 10
        };
        weaponsRef.current.push(announceTable);
        weaponVisualsRef.current.set(announceTable, tableGroup);

        // Monitors on Table
        for(let i=0; i<2; i++) {
            const mon = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.1), new THREE.MeshStandardMaterial({ color: '#000', emissive: '#050510' }));
            mon.position.set(-0.8 + i * 1.6, 1.0, 0);
            mon.rotation.x = -0.3;
            tableGroup.add(mon);
        }
        
        tableGroup.position.set(13.5, -0.8, 0);
        tableGroup.rotation.y = -Math.PI / 2;
        scene.add(tableGroup);
    } else if (arena?.type === 'backstage') {
        // Backstage Floor (Concrete)
        const concGeo = new THREE.PlaneGeometry(50, 50);
        const concMat = new THREE.MeshStandardMaterial({ color: '#222', roughness: 0.8, metalness: 0.1 });
        const conc = new THREE.Mesh(concGeo, concMat);
        conc.rotation.x = -Math.PI / 2;
        conc.position.y = 0;
        scene.add(conc);

        // Walls
        const wallGeo = new THREE.PlaneGeometry(50, 20);
        const wallMat = new THREE.MeshStandardMaterial({ color: '#111', roughness: 1 });
        const wall = new THREE.Mesh(wallGeo, wallMat);
        wall.position.z = -10;
        wall.position.y = 10;
        scene.add(wall);

        // Crates / Forklift Placeholder
        const crateGeo = new THREE.BoxGeometry(2, 2, 2);
        const crateMat = new THREE.MeshStandardMaterial({ color: '#543', roughness: 1 });
        for (let i = 0; i < 5; i++) {
            const crate = new THREE.Mesh(crateGeo, crateMat);
            crate.position.set(-8 + i * 4, 1, -8);
            crate.rotation.y = Math.random() * Math.PI;
            scene.add(crate);
        }
        
        // Rolling Shutter Door
        const doorGeo = new THREE.PlaneGeometry(8, 10);
        const doorMat = new THREE.MeshStandardMaterial({ color: '#333', metalness: 0.8, roughness: 0.2 });
        const door = new THREE.Mesh(doorGeo, doorMat);
        door.position.set(0, 5, -9.9);
        scene.add(door);
    }

    // Procedural Crowd Signs
    const createSign = (x: number, z: number, text: string, color: string) => {
        const signCanvas = document.createElement('canvas');
        signCanvas.width = 128; signCanvas.height = 64;
        const sctx = signCanvas.getContext('2d');
        if (sctx) {
            sctx.fillStyle = color; sctx.fillRect(0,0,128,64);
            sctx.fillStyle = '#000'; sctx.font = 'bold 20px "Share Tech Mono"';
            sctx.textAlign = 'center'; sctx.fillText(text, 64, 40);
        }
        const signTex = new THREE.CanvasTexture(signCanvas);
        const signMat = new THREE.MeshBasicMaterial({ map: signTex });
        const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.4), signMat);
        sign.position.set(x, 1, z);
        sign.lookAt(0, 2, 0);
        scene.add(sign);
    };
    
    ['AUDIT_THIS', 'SOVEREIGN', 'CORE_WIN', 'LP3_GANG'].forEach((t, i) => {
        createSign(-10.1, -6 + i * 4, t, i % 2 === 0 ? '#fff' : '#f00');
        createSign(10.1, -6 + i * 4, t, i % 2 === 0 ? '#fff' : '#f00');
    });

    // Front Barricade (Near Camera generally)
    const frontBarGeo = new THREE.BoxGeometry(20, 1, 0.2);
    const frontBar = new THREE.Mesh(frontBarGeo, barMat);
    frontBar.position.set(0, -0.2, 10);
    scene.add(frontBar);

    // Entrance Stage & Ramp
    const rampWidth = 4;
    const rampLength = 30;
    const rampGeo = new THREE.PlaneGeometry(rampWidth, rampLength);
    const rampMat = new THREE.MeshStandardMaterial({ 
        color: '#111', 
        emissive: '#222',
        roughness: 0.4
    });
    const ramp = new THREE.Mesh(rampGeo, rampMat);
    ramp.rotation.x = -Math.PI / 2;
    ramp.position.set(0, -0.49, -25);
    scene.add(ramp);

    // Side Ramp Lights
    for (let i = 0; i < 10; i++) {
        const gl = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({ color: '#ff0000' }));
        gl.position.set(-2, -0.4, -10 - (i * 3));
        scene.add(gl);
        const gl2 = gl.clone();
        gl2.position.x = 2;
        scene.add(gl2);
    }

    // Main Stage
    const stageGeo = new THREE.BoxGeometry(40, 0.5, 10);
    const stage = new THREE.Mesh(stageGeo, ringBaseMat);
    stage.position.set(0, -0.25, -45);
    scene.add(stage);

    // Stage Screen
    const screenGeo = new THREE.PlaneGeometry(30, 15);
    const screenMat = new THREE.MeshStandardMaterial({ 
        color: '#000', 
        emissive: '#100',
        metalness: 0.9 
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 7.5, -50.1);
    scene.add(screen);

    // Volumetric Light Beams (Pseudo)
    for (let i = 0; i < 4; i++) {
        const beamGeo = new THREE.CylinderGeometry(0.5, 3, 40, 16, 1, true);
        const beamMat = new THREE.MeshBasicMaterial({ 
            color: arena?.lighting || '#ff0000', 
            transparent: true, 
            opacity: 0.05,
            side: THREE.DoubleSide
        });
        const beam = new THREE.Mesh(beamGeo, beamMat);
        const angle = (i / 4) * Math.PI * 2;
        beam.position.set(Math.cos(angle) * 15, 15, Math.sin(angle) * 15);
        beam.lookAt(0, 0, 0);
        beam.rotation.x += Math.PI / 2;
        scene.add(beam);
    }

    // Title Belt (Hanging if Ladder match)
    if (matchType === 'ladder') {
        const beltGroup = new THREE.Group();
        const goldMat = new THREE.MeshStandardMaterial({ color: '#ffd700', metalness: 1, roughness: 0.1 });
        const leatherMat = new THREE.MeshStandardMaterial({ color: '#111', roughness: 0.8 });
        
        const strap = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.05), leatherMat);
        beltGroup.add(strap);
        
        const plate = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.25, 0.06), goldMat);
        beltGroup.add(plate);
        
        beltGroup.position.set(0, 4, 0);
        scene.add(beltGroup);
        
        // Cable
        const cableGeo = new THREE.CylinderGeometry(0.01, 0.01, 20);
        const cable = new THREE.Mesh(cableGeo, tbMat);
        cable.position.set(0, 14, 0);
        scene.add(cable);
    }

    // Arena Floor
    const floorGeo = new THREE.PlaneGeometry(150, 150);
    const floorMat = new THREE.MeshStandardMaterial({ color: arena?.floorColor || '#020205', roughness: 1 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.8; // Lower than ring
    floor.receiveShadow = true;
    scene.add(floor);

    // Turnbuckles and Ropes
    if (arena?.type === 'stadium' || !arena) {
        const tbPostGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.8, 16);
        const padGeo = new THREE.BoxGeometry(0.35, 0.35, 0.2);
        const cornMat = new THREE.MeshStandardMaterial({ color: '#111', roughness: 0.2, metalness: 0.8 });
        const padMat = new THREE.MeshStandardMaterial({ color: arena?.apronColor || '#ff0000', roughness: 0.6 });

        const corners = [[-5.2, 5.2], [5.2, 5.2], [5.2, -5.2], [-5.2, -5.2]];
        corners.forEach((c, i) => {
            const post = new THREE.Mesh(tbPostGeo, cornMat);
            post.position.set(c[0], 0.9, c[1]);
            ringGroup.add(post);

            // Turnbuckle Pads (Three per corner)
            for (let j = 0; j < 3; j++) {
                const pad = new THREE.Mesh(padGeo, padMat);
                pad.position.set(c[0] * 0.95, 0.5 + j * 0.5, c[1] * 0.95);
                pad.lookAt(0, pad.position.y, 0);
                ringGroup.add(pad);
            }
        });

        // ROPES (Physical high-res cylinders)
        const ropeMat = new THREE.MeshStandardMaterial({ 
            color: arena?.ropeColor || '#ffffff', 
            roughness: 0.4,
            metalness: 0.1 
        });
        // Background Crowd
        const crowdGeo = new THREE.PlaneGeometry(80, 20);
        const crowdMat = new THREE.MeshStandardMaterial({ 
            color: '#050505', 
            emissive: '#111',
            roughness: 1
        });
        const crowd = new THREE.Mesh(crowdGeo, crowdMat);
        crowd.position.z = -20;
        crowd.position.y = 8;
        scene.add(crowd);

        corners.forEach((pos, idx) => {
          const nextPos = corners[(idx + 1) % 4];
          const isVerticalSide = pos[0] === nextPos[0];
          const sideLen = isVerticalSide ? Math.abs(nextPos[1] - pos[1]) : Math.abs(nextPos[0] - pos[0]);

          [0.5, 1.0, 1.5].forEach(y => {
            // Each rope segment is a RingRope in the physics engine
            const ropePhys = new RingRope(isVerticalSide ? pos[0] : pos[1], 0, sideLen, 12, true);
            ropesRef.current.push(ropePhys);

            // Create 3D Rope segment Group (will be updated in loop)
            const ropeMeshGroup = new THREE.Group();
            ringGroup.add(ropeMeshGroup);
            (ropePhys as any).visualGroup = ropeMeshGroup;
            (ropePhys as any).y_fixed = y;
            (ropePhys as any).pos_fixed = pos;
            (ropePhys as any).nextPos_fixed = nextPos;
            (ropePhys as any).isVertical = isVerticalSide;

            const segCount = 11;
            for(let s=0; s<segCount; s++) {
                const segGeo = new THREE.CylinderGeometry(0.04, 0.04, sideLen / segCount + 0.02, 12);
                const segMat = new THREE.MeshStandardMaterial({ 
                    color: arena?.ropeColor || '#ffffff', 
                    roughness: 0.4,
                    metalness: 0.1 
                });
                const seg = new THREE.Mesh(segGeo, segMat);
                ropeMeshGroup.add(seg);
            }
          });
        });
    }

    // Match Specific Structures
    if (matchType === 'cage' || matchType === 'hell_in_a_cell' || matchType === 'elimination_chamber') {
        const structuralHeight = matchType === 'hell_in_a_cell' ? 8 : 4.5;
        const structuralRadius = matchType === 'hell_in_a_cell' ? 8 : 5.8;
        const cageGeo = new THREE.CylinderGeometry(structuralRadius, structuralRadius, structuralHeight, 16, 4, true);
        const cageMat = new THREE.MeshStandardMaterial({ 
            color: '#777', 
            wireframe: true,
            opacity: 0.6,
            transparent: true
        });
        const cage = new THREE.Mesh(cageGeo, cageMat);
        cage.position.y = structuralHeight / 2;
        scene.add(cage);
        
        // Add roof for HIAC
        if (matchType === 'hell_in_a_cell') {
            const roofGeo = new THREE.CircleGeometry(structuralRadius, 16);
            const roof = new THREE.Mesh(roofGeo, cageMat);
            roof.rotation.x = Math.PI / 2;
            roof.position.y = structuralHeight;
            scene.add(roof);
        }
    }

    const GROUND = 0;

    p1Ref.current = new Fighter(150, p1Data, false, 300, p1CPU);
    p2Ref.current = new Fighter(650, p2Data, true, 300, p2CPU);

    p1VisualRef.current = new Fighter3DRenderer(p1Ref.current, scene);
    p2VisualRef.current = new Fighter3DRenderer(p2Ref.current, scene);

    const referee = new Referee(450, 300, 200);
    refRef.current = referee;
    refVisualRef.current = new Referee3DRenderer(referee, scene);

    let rafId: number;
    let gameOverHandled = false;
    let hitStopFrames = 0;

    const loop = () => {
      if (!p1Ref.current || !p2Ref.current || !p1VisualRef.current || !p2VisualRef.current || !cameraRef.current) return;

      if (isPaused) {
        rendererRef.current?.render(scene, cameraRef.current);
        rafId = requestAnimationFrame(loop);
        return;
      }

      const p1 = p1Ref.current;
      const p2 = p2Ref.current;
      const camera = cameraRef.current;

      // HitStop Logic
      if (hitStopFrames > 0) {
        hitStopFrames--;
        rendererRef.current?.render(scene, camera);
        rafId = requestAnimationFrame(loop);
        return;
      }

      // Update Physics
      if (!gameOverHandled) {
        const oldP1Hp = p1.hp;
        const oldP2Hp = p2.hp;

        const hs1 = p1.update(keysRef.current, p2, projsRef.current, sigilsRef.current, particlesRef.current, hitFlashesRef.current, weaponsRef.current, gameOptions.bloodEnabled) as any;
        const hs2 = p2.update(keysRef.current, p1, projsRef.current, sigilsRef.current, particlesRef.current, hitFlashesRef.current, weaponsRef.current, gameOptions.bloodEnabled) as any;
        
        // PHYSICAL INTERACTIONS
        ScenePhysics.checkFighterCollision(p1, p2);
        ScenePhysics.checkTableBreaks(p1, weaponsRef.current, particlesRef.current);
        ScenePhysics.checkTableBreaks(p2, weaponsRef.current, particlesRef.current);
        // DYNAMIC CAMERA LOGIC
        const midPoint = new THREE.Vector3((p1.cx + p2.cx)/200, (p1.cy + p2.cy)/200, (p1.z + p2.z)/200);
        const dist = Math.abs(p1.cx - p2.cx) / 100;
        
        const cameraTargetPos = new THREE.Vector3();
        const cameraTargetLookAt = new THREE.Vector3();
        let cameraSmoothing = 0.05;

        const currentPhase = phaseRef.current;
        if (currentPhase === 'fight') {
            // Impact Zoom / Cinematic Focus
            const focusFighter = (p1.state === 'attack' || hitStopFrames > 0) ? p1 : p2;
            cameraTargetPos.set(focusFighter.cx/100 + focusFighter.facing * 2.5, 2.2, focusFighter.z/100 + 4.0);
            cameraTargetLookAt.set(focusFighter.cx/100, 1.4, focusFighter.z/100);
            cameraSmoothing = 0.12;
        } else if (p1.isBeingPinned || p2.isBeingPinned) {
            // Dramatic Pin Angle
            const pinned = p1.isBeingPinned ? p1 : p2;
            cameraTargetPos.set(pinned.cx/100 + 3.5, 1.2, pinned.z/100 + 3.5);
            cameraTargetLookAt.set(pinned.cx/100, 0.4, pinned.z/100);
            cameraSmoothing = 0.08;
        } else if (currentPhase === 'entrance') {
             // Wide sweep for entrance
             cameraTargetPos.set(Math.sin(Date.now()*0.0005)*5, 4, 15);
             cameraTargetLookAt.set(0, 2, 0);
             cameraSmoothing = 0.02;
        } else {
            // High-Octane Broadcast Follow
            const zoomZ = Math.max(7.5, dist * 0.75 + 5.5);
            cameraTargetPos.set(midPoint.x * 0.6, 4.2, midPoint.z + zoomZ);
            cameraTargetLookAt.set(midPoint.x, 1.6, midPoint.z);
            cameraSmoothing = 0.05;
        }

        camera.position.lerp(cameraTargetPos, cameraSmoothing);
        // LookAt interpolation for stability
        if (!camera.userData.lookAt) camera.userData.lookAt = new THREE.Vector3(0, 1, 0);
        const currentLookAt = camera.userData.lookAt as THREE.Vector3;
        currentLookAt.lerp(cameraTargetLookAt, 0.1);
        camera.lookAt(currentLookAt);

        // Match Rating / Event Detection (Storytelling Pacing)
        if (eventTimerRef.current > 0) eventTimerRef.current--;
        else matchEventRef.current = null;

        // Variety Bonus Logic (Internal tracking would go here, simplified for now)
        if (hs1 > 2 || hs2 > 2) {
            matchScoreRef.current += 1.2;
            if (hs1 > 12 || hs2 > 12) {
                matchScoreRef.current += 8;
                matchEventRef.current = 'HOLY SHIT!';
                eventTimerRef.current = 80;
                hitStopFrames = 15; // Extra impact freeze
            }
        }

        // Near Fall Bonus
        if ((oldP1Hp > 10 && p1.hp <= 10) || (oldP2Hp > 10 && p2.hp <= 10)) {
            matchScoreRef.current += 15;
            matchEventRef.current = 'NEAR FALL DRIVE!';
            eventTimerRef.current = 100;
        }

        // Kickout at 2 logic (Hard to detect perfectly here, but we can check if a pin ended quickly)
        if (p1.isBeingPinned || p2.isBeingPinned) {
            matchScoreRef.current += 0.05; // Points for holding the pin
        }

        // Referee Hit Detection
        if (refRef.current) {
            [p1, p2].forEach(f => {
                if (f.hitbox && refRef.current) {
                    const hb = f.hitbox;
                    const rx = refRef.current.x;
                    const rz = refRef.current.z;
                    if (Math.abs(hb.x - rx) < 60 && Math.abs(f.z - rz) < 60) {
                        refRef.current.applyBump(hb.dmg);
                        matchEventRef.current = 'REF BUMP!';
                        eventTimerRef.current = 90;
                    }
                }
            });
        }

        if (typeof hs1 === 'number' && hs1 > 0 || typeof hs2 === 'number' && hs2 > 0) {
          hitStopFrames = Math.max(typeof hs1 === 'number' ? hs1 : 0, typeof hs2 === 'number' ? hs2 : 0);
        }

        // Update Effects
        projsRef.current = projsRef.current.filter(p => p.update());
        particlesRef.current = particlesRef.current.filter(p => p.update());
        sigilsRef.current = sigilsRef.current.filter(s => s.update());
        hitFlashesRef.current = hitFlashesRef.current.filter(f => f.update());

        // Interactive Ropes Handling
        ropesRef.current.forEach(r => {
            const rData = r as any;
            let impactForce = 0;
            let impactPos = 0;

            // Detect fighter impact on ropes
            [p1, p2].forEach(f => {
                if (f.state === 'running' || f.isRebounding > 0) {
                    const fx = (f.x - 450) / 100;
                    const fz = (f.z) / 100;
                    
                    // Simplified distance check for ropes
                    if (rData.isVertical) {
                        const dist = Math.abs(fx - r.x);
                        if (dist < 0.2) {
                            impactForce = f.vx * 0.5;
                            impactPos = (300 - f.cy) / 100;
                        }
                    } else {
                        const dist = Math.abs(fz - r.x); // x in RingRope refers to its fixed axis pos
                        if (dist < 0.2) {
                            impactForce = f.vz * 0.5;
                            impactPos = (f.cx - 450) / 100;
                        }
                    }
                }
            });

            r.update(impactPos, 0, impactForce); 

            // Sync 3D Visuals
            const group = rData.visualGroup as THREE.Group;
            const nodes = r.nodes;
            const segs = group.children as THREE.Mesh[];

            for(let i=0; i<segs.length; i++) {
                const n1 = nodes[i];
                const n2 = nodes[i+1];
                const seg = segs[i];

                const p1 = new THREE.Vector3();
                const p2 = new THREE.Vector3();

                if (rData.isVertical) {
                    p1.set(n1.x, rData.y_fixed, rData.pos_fixed[1] + (n1.y - nodes[0].y));
                    p2.set(n2.x, rData.y_fixed, rData.pos_fixed[1] + (n2.y - nodes[0].y));
                } else {
                    // This logic depends on which side it's on... but let's assume simple mapping for now
                    p1.set(rData.pos_fixed[0] + (n1.y - nodes[0].y), rData.y_fixed, r.x + n1.dispX);
                    p2.set(rData.pos_fixed[0] + (n2.y - nodes[0].y), rData.y_fixed, r.x + n2.dispX);
                }

                seg.position.set((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, (p1.z + p2.z) / 2);
                seg.lookAt(p2);
                seg.rotateX(Math.PI / 2);
            }
        });

        // Mat Shake Logic
        if (ringGroupRef.current) {
            const shakeY = (Math.max(0, p1.vy) + Math.max(0, p2.vy)) * 0.01 * (p1.onGround && p1.vy > 5 ? 1 : 0);
            ringGroupRef.current.position.y = Math.sin(Date.now() * 0.1) * shakeY * 0.5;
            
            // Damping shake
            ringGroupRef.current.position.y *= 0.9;
        }

        // Improved Arena Object Physics Integration
        weaponsRef.current.forEach(w => {
            (ArenaObjectPhysics as any).update(w, p1.groundY, [p1, p2]);
            
            // Sync 3D Visual for Weapons
            let visual = weaponVisualsRef.current.get(w);
            if (!visual) {
                visual = create3DWeapon(w, scene);
                weaponVisualsRef.current.set(w, visual);
            }
            visual.position.x = (w.x - 450) / 100;
            visual.position.y = (p1.groundY - w.y) / 100;
            visual.position.z = (w.z || 0) / 100;
            visual.rotation.z = w.rotation;
            
            if (w.isBroken && !visual.userData.isBrokenHandled) {
                // Break effect (visual only)
                visual.scale.y = 0.2;
                visual.userData.isBrokenHandled = true;
                particlesRef.current.push(new Particle(w.x, w.y, (Math.random()-0.5)*10, (Math.random()-0.5)*10, '#532', 2, 60, false, p1.groundY));
            }
        });

        // Remove visuals for weapons no longer in world
        for (const [w, visual] of weaponVisualsRef.current.entries()) {
            if (!weaponsRef.current.includes(w)) {
                scene.remove(visual);
                weaponVisualsRef.current.delete(w);
            }
        }

        // Send updates to HUD
        onUpdate(
          { 
            hp: p1.hp, 
            energy: p1.energy, 
            stamina: p1.stamina,
            maxStamina: p1.maxStamina,
            sigMeter: p1.sigMeter, 
            finMeter: p1.finMeter, 
            sigStocks: p1.sigStocks, 
            finStocks: p1.finStocks, 
            data: p1.char.cd, 
            combo: p1.comboCount, 
            bodyDamage: p1.bodyDamage 
          },
          { 
            hp: p2.hp, 
            energy: p2.energy, 
            stamina: p2.stamina,
            maxStamina: p2.maxStamina,
            sigMeter: p2.sigMeter, 
            finMeter: p2.finMeter, 
            sigStocks: p2.sigStocks, 
            finStocks: p2.finStocks, 
            data: p2.char.cd, 
            combo: p2.comboCount, 
            bodyDamage: p2.bodyDamage 
          },
          {
            score: matchScoreRef.current,
            event: matchEventRef.current
          }
        );

        if (p1.hp <= 0 || p2.hp <= 0) {
          gameOverHandled = true;
          setTimeout(() => onGameOver(p1.hp > p2.hp ? p1Data.name : p2Data.name), 2000);
        }
      }

      // Sync 3D Visuals
      if (p1VisualRef.current && p2VisualRef.current) {
        p1VisualRef.current.update(p2VisualRef.current.group?.position);
        p2VisualRef.current.update(p1VisualRef.current.group?.position);
      }
      
      if (refRef.current && refVisualRef.current) {
          refRef.current.update(p1, p2);
          refVisualRef.current.update();
      }

      // Camera & Phase Logic
      const currentPhase = phaseRef.current;
      if (currentPhase === 'entrance') {
        const p1Vis = p1VisualRef.current;
        if (p1Vis) {
            if (!p1Vis.userData) (p1Vis as any).userData = {};
            if (!p1Vis.userData.entranceTimer) p1Vis.userData.entranceTimer = Date.now();
            const elapsed = (Date.now() - p1Vis.userData.entranceTimer) / 1000;

            if (elapsed < 4) {
                // Angle 1: High wide from stage
                camera.position.set(0, 10, -55);
                camera.lookAt(0, 2, -40);
            } else if (elapsed < 8) {
                // Angle 2: Low angle ramp side
                camera.position.set(-5, 0.5, -35);
                camera.lookAt(0, 2, -25);
            } else {
                // Angle 3: Follow fighter down ramp
                const fPos = p1Vis.group.position;
                camera.position.lerp(new THREE.Vector3(fPos.x - 3, fPos.y + 2, fPos.z - 5), 0.05);
                camera.lookAt(fPos.x, fPos.y + 1.5, fPos.z);
            }

            // Make fighters walk down towards center (visual only in entrance)
            p1Vis.group.position.z += 0.05;
            if (p1Vis.group.position.z > 0) p1Vis.group.position.z = 0;
            
            p1.vx = 0; p1.state = 'walk';
            p2.vx = 0;
            p2.state = 'idle';

        // Auto move to fight after some time
        if (elapsed > 12) {
            onPhaseChange?.('fight');
        }
        }
      } else if (currentPhase === 'victory') {
        const winner = p1.hp > p2.hp ? p1VisualRef.current : p2VisualRef.current;
        const orbitAngle = Date.now() * 0.001;
        const targetX = winner.group.position.x + Math.cos(orbitAngle) * 4;
        const targetZ = winner.group.position.z + Math.sin(orbitAngle) * 4;
        
        camera.position.x += (targetX - camera.position.x) * 0.1;
        camera.position.z += (targetZ - camera.position.z) * 0.1;
        camera.position.y += (3 - camera.position.y) * 0.1;
        camera.lookAt(winner.group.position.x, 1.5, winner.group.position.z);
      } else {
        // Camera Follow (Battle)
        const midPoint = new THREE.Vector3().addVectors(p1VisualRef.current.group.position, p2VisualRef.current.group.position).multiplyScalar(0.5);
        const dist = Math.abs(p1VisualRef.current.group.position.x - p2VisualRef.current.group.position.x);
        
        const targetZ = Math.max(6, dist * 1.3);
        camera.position.x += (midPoint.x - camera.position.x) * 0.1;
        camera.position.z += (targetZ - camera.position.z) * 0.1;
        camera.position.y += (3 - camera.position.y) * 0.1; // Baseline cam height

        // Visceral Screen Shake
        const shakeForce = (Math.max(0, p1.vy) + Math.max(0, p2.vy)) * 0.008 * (p1.onGround || p2.onGround ? 1 : 0);
        if (shakeForce > 0.01) {
            camera.position.x += (Math.random() - 0.5) * shakeForce;
            camera.position.y += (Math.random() - 0.5) * shakeForce;
        }

        camera.lookAt(midPoint.x, 1, 0);
      }

      rendererRef.current?.render(scene, camera);

      // Draw 2D Overlay with correct mapping
      const canvas2d = overlayCanvasRef.current;
      const ctx = canvas2d?.getContext('2d');
      if (ctx && canvas2d && cameraRef.current && rendererRef.current) {
          ctx.clearRect(0, 0, canvas2d.width, canvas2d.height);
          
          const cam = cameraRef.current;
          
          const project = (x2d: number, y2d: number) => {
              // Map 2D logic to 3D world
              const x3d = (x2d - 450) / 100;
              const y3d = (300 - y2d) / 100;
              const z3d = 0; // Simplified for 2D effects

              const vector = new THREE.Vector3(x3d, y3d, z3d);
              vector.project(cam);

              return {
                  x: (vector.x * 0.5 + 0.5) * canvas2d.width,
                  y: (-vector.y * 0.5 + 0.5) * canvas2d.height
              };
          };

          // Draw effects with projection
          if (currentPhase === 'entrance') {
              ctx.save();
              ctx.font = '900 14px "Orbitron"';
              ctx.fillStyle = 'rgba(255,255,255,0.7)';
              ctx.textAlign = 'center';
              ctx.fillText('PRESS ANY KEY TO SKIP ENTRANCE', canvas2d.width/2, canvas2d.height - 40);
              ctx.restore();
          }

          particlesRef.current.forEach(p => {
              const pos = project(p.x, p.y);
              ctx.save();
              ctx.translate(pos.x, pos.y);
              // Scale size based on distance if needed, but standard size mostly works
              p.drawManual(ctx);
              ctx.restore();
          });

          projsRef.current.forEach(p => {
              const pos = project(p.x, p.y);
              ctx.save();
              ctx.translate(pos.x, pos.y);
              p.drawManual(ctx);
              ctx.restore();
          });

          sigilsRef.current.forEach(s => {
              const pos = project(s.x, s.y);
              ctx.save();
              ctx.translate(pos.x, pos.y);
              s.drawManual(ctx);
              ctx.restore();
          });

          hitFlashesRef.current.forEach(f => {
              const pos = project(f.x, f.y);
              ctx.save();
              ctx.translate(pos.x, pos.y);
              f.drawManual(ctx);
              ctx.restore();
          });

          // Draw Reversal Prompts (WWE 2k style)
          [p1, p2].forEach(f => {
              if (f.reverseWindow > 0 || f.secondaryReverseWindow > 0) {
                  const pos = project(f.cx, f.cy - 120);
                  ctx.save();
                  ctx.translate(pos.x, pos.y);
                  
                  // Pulse effect
                  const pulse = Math.sin(Date.now() * 0.02) * 0.2 + 0.8;
                  ctx.scale(pulse, pulse);
                  
                  ctx.fillStyle = '#ffaa00';
                  ctx.shadowColor = '#ffff00';
                  ctx.shadowBlur = 10;
                  ctx.strokeStyle = '#000';
                  ctx.lineWidth = 3;
                  ctx.font = '900 18px "Orbitron"';
                  ctx.textAlign = 'center';
                  ctx.strokeText('REVERSAL', 0, 0);
                  ctx.fillText('REVERSAL', 0, 0);
                  ctx.restore();
              }
          });
          const fighters = [p1Ref.current, p2Ref.current];
          fighters.forEach((f, i) => {
              if (!f || f.isAI) return;
              const opponent = fighters[1 - i];
              if (opponent && (opponent.reverseWindow > 0 || opponent.secondaryReverseWindow > 0)) {
                  const pos = project(f.cx, f.y - 40);
                  ctx.save();
                  ctx.translate(pos.x, pos.y);
                  
                  // Pulse effect
                  const s = 0.8 + Math.sin(Date.now() / 100) * 0.2;
                  ctx.scale(s, s);
                  
                  ctx.font = '900 14px "Orbitron"';
                  ctx.textAlign = 'center';
                  ctx.shadowBlur = 15;
                  ctx.shadowColor = '#ffff00';
                  
                  // Label
                  ctx.fillStyle = '#ffff00';
                  ctx.fillText('REVERSE', 0, 0);
                  
                  // Button Prompt (Xbox Y / PS Triangle Style)
                  ctx.beginPath();
                  ctx.arc(0, 20, 12, 0, Math.PI * 2);
                  ctx.fillStyle = '#111';
                  ctx.fill();
                  ctx.strokeStyle = '#ffff00';
                  ctx.lineWidth = 2;
                  ctx.stroke();
                  
                  ctx.fillStyle = '#ffff00';
                  ctx.font = 'bold 12px sans-serif';
                  ctx.fillText('Y', 0, 24);
                  
                  ctx.restore();
              }
          });
      }

      rafId = requestAnimationFrame(loop);
    };

    loop();
    
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (overlayCanvasRef.current) {
          overlayCanvasRef.current.width = w;
          overlayCanvasRef.current.height = h;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call to set canvas sizes

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
      p1VisualRef.current?.destroy();
      p2VisualRef.current?.destroy();
    };
  }, [p1Data, p2Data]);

  const drawWeapon = (ctx: CanvasRenderingContext2D, w: WeaponObject) => {
    ctx.save();
    ctx.translate(w.x, w.y);
    ctx.rotate(w.rotation);
    ctx.scale(0.8, 0.8);
    ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(255,255,255,0.3)';

    switch (w.type) {
      case 'table':
          if (w.durability <= 0) {
              // Broken Table
              ctx.fillStyle = '#421'; ctx.fillRect(-45, 10, 30, 8);
              ctx.fillRect(15, 10, 30, 8);
              ctx.fillStyle = '#532'; ctx.rotate(0.3); ctx.fillRect(-20, 5, 40, 6);
          } else {
              ctx.fillStyle = '#532'; ctx.fillRect(-45, -5, 90, 8);
              ctx.fillStyle = '#421'; ctx.fillRect(-40, 3, 6, 25); ctx.fillRect(34, 3, 6, 25);
          }
          break;
      case 'garbage_can':
          ctx.fillStyle = '#888'; ctx.fillRect(-18, -25, 36, 45);
          ctx.strokeStyle = '#555'; ctx.lineWidth = 1;
          for(let i=0; i<4; i++){ ctx.beginPath(); ctx.moveTo(-18+i*9, -25); ctx.lineTo(-18+i*9, 20); ctx.stroke(); }
          break;
      case 'steel_steps':
          ctx.fillStyle = '#333'; ctx.fillRect(-25, -15, 50, 35);
          ctx.fillStyle = '#222'; ctx.fillRect(-20, -28, 40, 13);
          break;
      case 'katana':
        ctx.fillStyle = '#b0b0b0'; ctx.fillRect(-2, -35, 4, 40);
        ctx.fillStyle = '#222'; ctx.fillRect(-3, 5, 6, 8);
        break;
      case 'mace':
        ctx.fillStyle = '#666'; ctx.fillRect(-3, -10, 6, 20);
        ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(0, -12, 10, 0, Math.PI * 2); ctx.fill();
        break;
      case 'staff':
        ctx.fillStyle = '#5d4037'; ctx.fillRect(-2, -40, 4, 80);
        break;
      case 'chair':
        ctx.strokeStyle = '#444'; ctx.lineWidth = 4;
        ctx.strokeRect(-12, -15, 24, 30);
        ctx.strokeRect(-12, -15, 24, 4);
        ctx.fillStyle = '#222'; ctx.fillRect(-10, -10, 20, 20);
        break;
      case 'kendo_stick':
        ctx.fillStyle = '#d7ba7d'; ctx.fillRect(-3, -40, 6, 80);
        ctx.strokeStyle = '#b08d57'; ctx.lineWidth = 1;
        for(let i=-35; i<40; i+=10) { ctx.beginPath(); ctx.moveTo(-3, i); ctx.lineTo(3, i); ctx.stroke(); }
        break;
      case 'sledgehammer':
        ctx.fillStyle = '#4e342e'; ctx.fillRect(-2, -10, 4, 45);
        ctx.fillStyle = '#333'; ctx.fillRect(-12, -22, 24, 12);
        break;
      case 'ladder':
        ctx.strokeStyle = '#777'; ctx.lineWidth = 3;
        ctx.strokeRect(-15, -60, 30, 120);
        for(let i=-50; i<60; i+=20) { ctx.beginPath(); ctx.moveTo(-15, i); ctx.lineTo(15, i); ctx.stroke(); }
        break;
      case 'brass_knuckles':
        ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI*2); ctx.fill();
        break;
    }

    // Durability bar
    if (!w.onGround) {
        ctx.fillStyle = '#222'; ctx.fillRect(-15, -50, 30, 3);
        ctx.fillStyle = '#f00'; ctx.fillRect(-15, -50, (w.durability / w.maxDurability) * 30, 3);
    }

    ctx.restore();
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
       <div 
        ref={containerRef} 
        className="w-full h-full"
      />
      <canvas 
        ref={overlayCanvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />
      {/* Visual Glitch Overlays */}
      <div className="absolute inset-x-0 inset-y-0 pointer-events-none z-10 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_3px,#00000010_3px,#00000010_4px)]" />
      <div className="absolute inset-x-0 inset-y-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_50%,#00000088_100%)]" />
      
      {/* HUD OVERLAYS (PINNING & SUBMISSIONS) */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center gap-4">
         {p1Ref.current && p1Ref.current.isBeingPinned && (
             <PinBar fighter={p1Ref.current} />
         )}
         {p2Ref.current && p2Ref.current.isBeingPinned && (
             <PinBar fighter={p2Ref.current} />
         )}
         
         {p1Ref.current && (p1Ref.current.isSubmitting || p1Ref.current.isBeingSubmitted) && (
             <SubmissionBar fighter={p1Ref.current} />
         )}
         {p2Ref.current && (p2Ref.current.isSubmitting || p2Ref.current.isBeingSubmitted) && p2Data.name !== p1Data.name && (
             <SubmissionBar fighter={p2Ref.current} />
         )}
      </div>

      {/* Match Rating */}
      <MatchRating score={matchScoreRef.current} highlightEvent={matchEventRef.current} />

      {/* Cinematic Phase UI */}
      {(matchPhase === 'entrance' || matchPhase === 'victory') && (
          <div className="absolute inset-0 flex flex-col items-center justify-between p-12 z-[500] pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/80 border-t border-b border-red-600 px-12 py-4 backdrop-blur-md"
              >
                <h2 className="text-white text-4xl font-black italic tracking-tighter uppercase">
                    {matchPhase === 'entrance' ? 'Match Entrance' : 'Victory Scene'}
                </h2>
                <p className="text-zinc-500 text-center text-xs tracking-widest uppercase">
                    {matchPhase === 'entrance' ? 'The Main Event' : (p1Ref.current?.hp || 0) > (p2Ref.current?.hp || 0) ? p1Data.name : p2Data.name}
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                    if (matchPhase === 'entrance') onPhaseChange?.('fight');
                    else onPhaseChange?.('report');
                }}
                className="bg-red-600 text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-sm pointer-events-auto shadow-[0_0_20px_rgba(220,38,38,0.5)] border border-white/20"
              >
                Skip Scene
              </motion.button>
          </div>
      )}
    </div>
  );
};

const PinBar = ({ fighter }: { fighter: Fighter }) => {
    const targetW = fighter.pinKickoutTarget * 200;
    const needleX = fighter.pinMeterPos * 200;
    const healthPercent = (fighter.hp / fighter.maxHp) * 100;
    
    return (
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-black/80 p-6 border-2 border-red-600/50 backdrop-blur-xl shadow-[0_0_40px_rgba(220,38,38,0.3)] skew-x-[-12deg]"
        >
            <div className="text-[12px] font-['Orbitron'] font-black text-white text-center mb-3 tracking-[2px] skew-x-[12deg] uppercase scale-y-110">
                P I N F A L L <span className="text-red-500 animate-pulse ml-2">!!!</span>
            </div>
            <div className="relative w-[240px] h-6 bg-zinc-950 border border-white/10 overflow-hidden">
                <div 
                    className="absolute h-full bg-gradient-to-r from-green-500 to-emerald-400" 
                    style={{ left: 120 - targetW/2, width: targetW }} 
                />
                <motion.div 
                    className="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_15px_#fff] z-10" 
                    animate={{ left: needleX * 1.2 }} 
                    transition={{ type: 'tween', ease: 'linear', duration: 0 }}
                />
            </div>
            <div className="text-[9px] text-zinc-500 font-bold mt-2 text-center skew-x-[12deg] tracking-widest uppercase">
                Tap <span className="text-white bg-white/10 px-1">LIGHT</span> to Kickout
            </div>
        </motion.div>
    );
};

const SubmissionBar = ({ fighter }: { fighter: Fighter }) => {
    const progress = fighter.submissionMeter * 100;
    const isVictim = fighter.isBeingSubmitted;

    return (
        <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-black/90 p-6 border-b-4 border-cyan-500 backdrop-blur-xl min-w-[300px]"
        >
            <div className="flex justify-between items-center mb-2">
                <span className="text-cyan-400 text-[10px] font-black uppercase tracking-[3px]">Submission</span>
                <span className="text-white text-[10px] font-black">{Math.floor(progress)}%</span>
            </div>
            <div className="h-3 w-full bg-zinc-900 border border-white/5 rounded-full overflow-hidden">
                <motion.div 
                    className={cn(
                        "h-full transition-all duration-75",
                        progress > 75 ? "bg-red-500" : (progress > 40 ? "bg-orange-500" : "bg-cyan-500")
                    )}
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="text-[10px] text-white/50 font-bold mt-3 text-center uppercase tracking-widest animate-pulse">
                {isVictim ? 'MASH ESCAPE!' : 'FORCE THE TAP!'}
            </div>
        </motion.div>
    );
};
