/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { Fighter } from './fighter';
import { CharacterData } from '../types';
import { sounds } from './audio';

export type RefereeState = 'idle' | 'walking' | 'running' | 'counting' | 'downed' | 'checking';

export class Referee {
    x: number;
    y: number;
    z: number;
    w = 60;
    h = 180;
    vx = 0;
    vy = 0;
    vz = 0;
    facing = 1;
    state: RefereeState = 'idle';
    stateTimer = 0;
    
    count = 0;
    countTimer = 0;
    
    hp = 50; // Ref has very low HP
    isDowned = false;
    
    charData: CharacterData;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        
        // Custom Ref Data (Striped shirt, etc - we can refine visuals later)
        this.charData = {
            name: "OFFICIAL",
            gender: 'male',
            archetype: 'striker',
            height: 180,
            skinColor: '#fde0be',
            hairColor: '#442211',
            bottomColor: '#111',
            topColor: '#fff', 
            eyeColor: '#111',
            hairStyle: 'buzz',
            bodyType: 'lean',
            faceShape: 'angular',
            fatMass: 0.1,
            muscleMass: 0.2,
            breastSize: 0,
            gluteSize: 0,
            feminineCurve: 0,
            extraColor: '#ffffff',
            hairLength: 1,
            charisma: 80,
            stats: { 
                strength: 10, agility: 50, technique: 100 
            },
            clothing: {
                top: 'shirt',
                bottom: 'long_tights',
                boots: 'black',
                mask: 'none',
                facepaint: 'none',
                gloveL: 'none',
                gloveR: 'none',
                hairColor2: '#442211',
                hairBlend: 0,
                extra: 'none'
            },
            moveset: {
                light: [], heavy: [], grapples: [], backGrapples: [],
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
            },
            weaponType: 'none',
            tattoos: [],
            scars: [],
            abilities: [],
            sigil: 'none',
            proportions: {
                headSize: 1,
                neckLength: 1,
                shoulderWidth: 1,
                armLength: 1,
                armThickness: 1,
                handSize: 1,
                torsoLength: 1,
                waistWidth: 1,
                chestSize: 1,
                hipWidth: 1,
                legLength: 1,
                legThickness: 1,
                footSize: 1
            },
            overall: 70
        };
    }

    update(p1: Fighter, p2: Fighter) {
        if (this.isDowned) {
            this.stateTimer--;
            if (this.stateTimer <= 0) {
                this.isDowned = false;
                this.state = 'idle';
                this.hp = 50;
            }
            return;
        }

        const midX = (p1.x + p2.x) / 2;
        const midZ = (p1.z + p2.z) / 2;
        const targetX = midX;
        const targetZ = midZ + 200; // Stay behind the action

        // Check for Pinning
        const anyPinning = (p1.isBeingPinned || p2.isBeingPinned);
        
        if (anyPinning && this.state !== 'counting') {
            this.state = 'running';
            // Move fast to the pinned fighter
            const pinned = p1.isBeingPinned ? p1 : p2;
            const dist = Math.abs(this.x - pinned.x);
            if (dist < 100) {
                this.state = 'counting';
                this.count = 0;
                this.countTimer = 60;
                this.vx = 0;
            } else {
                this.vx = (pinned.x > this.x ? 1 : -1) * 8;
            }
        } else if (this.state === 'counting') {
            const pinned = p1.isBeingPinned ? p1 : p2;
            if (!pinned || !pinned.isBeingPinned) {
                this.state = 'idle';
                this.count = 0;
            } else {
                this.countTimer--;
                if (this.countTimer <= 0) {
                    this.count++;
                    this.countTimer = 60;
                    sounds.playImpact('light'); // Hand slap sound
                    // Emit some visual or sound for the count here?
                    if (this.count >= 3) {
                        // Match Over
                        this.state = 'idle';
                    }
                }
            }
        } else {
            // Idle/Follow Logic
            const dist = Math.abs(this.x - targetX);
            const zDist = Math.abs(this.z - targetZ);
            
            if (dist > 300 || zDist > 200) {
                this.state = 'running';
                this.vx = (targetX > this.x ? 1 : -1) * 5;
                this.vz = (targetZ > this.z ? 1 : -1) * 3;
            } else if (dist > 50) {
                this.state = 'walking';
                this.vx = (targetX > this.x ? 1 : -1) * 2;
                this.vz = (targetZ > this.z ? 1 : -1) * 1;
            } else {
                this.state = 'idle';
                this.vx *= 0.9;
                this.vz *= 0.9;
            }
        }

        this.x += this.vx;
        this.z += this.vz;
        this.facing = p1.x > this.x ? 1 : -1;
    }

    applyBump(force: number) {
        if (force > 15) {
            this.isDowned = true;
            this.state = 'downed';
            this.stateTimer = 180; // 3 seconds out
            sounds.playImpact('heavy');
        }
    }
}
