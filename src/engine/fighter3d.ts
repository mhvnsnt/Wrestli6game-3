/**
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { Fighter } from './fighter';
import { Character3D } from './character3d';

export class Fighter3DRenderer {
  fighter: Fighter;
  visual: Character3D;
  group: THREE.Group;
  userData: any = {};

  constructor(fighter: Fighter, scene: THREE.Scene) {
    this.fighter = fighter;
    
    // FIX: Pass null so it only builds the geometry, not a new WebGL canvas
    this.visual = new Character3D(null, fighter.char.cd);
    
    this.group = this.visual.group;
    scene.add(this.group);
  }

  update(opponentPos?: THREE.Vector3) {
    // Sync physics to visual
    // Convert 2D logic coordinates to 3D world space
    this.group.position.x = (this.fighter.cx - 450) / 100;
    this.group.position.y = (this.fighter.groundY - (this.fighter.y + this.fighter.h)) / 100;
    this.group.position.z = this.fighter.z / 100;
    
    // Handle facing direction and ragdoll rotation
    this.group.rotation.y = (this.fighter.facing > 0 ? 0 : Math.PI);
    this.group.rotation.z = (this.fighter.rot || 0);

    const frame = Date.now() / 16;
    
    // Sync status for dynamic animations
    this.visual.cd.hp = this.fighter.hp;
    this.visual.cd.stamina = this.fighter.stamina;

    // Pass everything to pose engine
    this.visual.updatePose(
      this.fighter.poseState || this.fighter.state, 
      frame, 
      this.fighter.facing, 
      this.fighter.vx, 
      this.fighter.vy, 
      opponentPos
    );
  }

  destroy() {
    this.visual.destroy();
  }
}
