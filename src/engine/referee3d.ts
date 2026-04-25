/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { Referee } from './referee';
import { Character3D } from './character3d';

export class Referee3DRenderer {
  referee: Referee;
  visual: Character3D;
  group: THREE.Group;

  constructor(referee: Referee, scene: THREE.Scene) {
    this.referee = referee;
    this.visual = new Character3D(null, referee.charData);
    this.group = this.visual.group;
    scene.add(this.group);
  }

  update() {
    // Sync logic to visual
    this.group.position.x = (this.referee.x - 450) / 100;
    this.group.position.z = this.referee.z / 100;
    this.group.position.y = (300 - (this.referee.y + this.referee.h)) / 100;
    
    this.group.rotation.y = (this.referee.facing > 0 ? 0 : Math.PI);

    const frame = Date.now() / 16;
    let poseState = this.referee.state;

    // Custom pose logic for Ref
    if (this.referee.state === 'counting') {
        // Drop to knees
        this.group.position.y = -0.5; // Kneeling position
        this.group.rotation.x = -Math.PI / 4;
        
        // Hand slap animation
        const slap = Math.sin(this.referee.countTimer * 0.2);
        if (this.visual.rBicep) {
            this.visual.rBicep.rotation.x = -Math.PI / 2 + slap;
        }
    }

    this.visual.updatePose(
      this.referee.state === 'running' ? 'running' : (this.referee.state === 'walking' ? 'walk' : 'idle'), 
      frame, 
      this.referee.facing, 
      this.referee.vx, 
      0
    );
  }

  destroy() {
    this.visual.destroy();
  }
}
