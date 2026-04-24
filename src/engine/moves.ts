import { Move, MoveStage } from '../types';

export function createPowerbomb(name: string, variant: 'normal' | 'last_ride' | 'high_cross' | 'avalanche' | 'top_rope'): Move {
  const stages: MoveStage[] = [];
  
  if (variant === 'last_ride') {
      stages.push({ time: 20, p1Pos: { x: 0, y: 0, rot: 0 }, p2Pos: { x: 10, y: -40, rot: 1.5 } }); // Lift to waist
      stages.push({ time: 40, p1Pos: { x: 0, y: 0, rot: 0 }, p2Pos: { x: 5, y: -100, rot: 3.14 } }); // High lift
      stages.push({ time: 60, p1Pos: { x: 20, y: 0, rot: 0 }, p2Pos: { x: 40, y: 20, rot: 0 } }); // Slam
  } else if (variant === 'high_cross') {
      stages.push({ time: 30, p1Pos: { x: 0, y: 0, rot: 0 }, p2Pos: { x: 0, y: -80, rot: 3.14 } });
      stages.push({ time: 60, p1Pos: { x: 10, y: 0, rot: 0 }, p2Pos: { x: 60, y: 10, rot: 1.5 } });
  } else if (variant === 'avalanche' || variant === 'top_rope') {
      stages.push({ time: 50, p1Pos: { x: 0, y: -60, rot: 0 }, p2Pos: { x: 10, y: -80, rot: 0 } });
      stages.push({ time: 90, p1Pos: { x: 30, y: 0, rot: 0.5 }, p2Pos: { x: 50, y: 25, rot: 3.14 } });
  } else {
      stages.push({ time: 30, p1Pos: { x: 0, y: 0, rot: 0 }, p2Pos: { x: 10, y: -60, rot: 3.14 } });
      stages.push({ time: 50, p1Pos: { x: 15, y: 0, rot: 0 }, p2Pos: { x: 30, y: 10, rot: 0 } });
  }

  return {
    name,
    dmg: 30,
    kx: 5,
    ky: -15,
    time: stages.reduce((acc, s) => acc + s.time, 0),
    category: variant === 'avalanche' ? 'corner' : 'standing',
    animation: 'grapple',
    stages
  };
}

export function createChokeslam(name: string, hands: 1 | 2 | 3): Move {
    // 3 is for "Punjabi Plunge" style
    const stages: MoveStage[] = [];
    if (hands === 3) {
        stages.push({ time: 40, p1Pos: { x: 0, y: 0, rot: 0 }, p2Pos: { x: 15, y: -90, rot: 0 } }); // Two hand lift
        stages.push({ time: 70, p1Pos: { x: 20, y: 0, rot: 0 }, p2Pos: { x: 45, y: 35, rot: 0 } }); // Hard toss
    } else {
        stages.push({ time: 30, p1Pos: { x: 0, y: 0, rot: 0 }, p2Pos: { x: 15, y: -80, rot: 0.2 } });
        stages.push({ time: 50, p1Pos: { x: 20, y: 0, rot: 0 }, p2Pos: { x: 40, y: 30, rot: 0 } });
    }
    return {
        name,
        dmg: 35,
        kx: 3,
        ky: -25,
        time: stages.reduce((acc, s) => acc + s.time, 0),
        category: 'standing',
        animation: 'ultra',
        stages
    };
}

export function createDDT(name: string, type: 'normal' | 'butterfly' | 'double_underhook'): Move {
    const stages: MoveStage[] = [];
    if (type === 'butterfly' || type === 'double_underhook') {
        stages.push({ time: 30, p1Pos: { x: 0, y: 0, rot: 0 }, p2Pos: { x: 5, y: -20, rot: 1 } }); // Lace arms
        stages.push({ time: 55, p1Pos: { x: 10, y: 30, rot: 0 }, p2Pos: { x: 15, y: 40, rot: 3.14 } }); // Spike
    } else {
        stages.push({ time: 25, p1Pos: { x: 0, y: 0, rot: 0 }, p2Pos: { x: 10, y: -5, rot: 1.5 } });
        stages.push({ time: 45, p1Pos: { x: 15, y: 20, rot: 0 }, p2Pos: { x: 20, y: 35, rot: 3.14 } });
    }
    return {
        name,
        dmg: 28,
        kx: 2,
        ky: -15,
        time: stages.reduce((acc, s) => acc + s.time, 0),
        category: 'standing',
        animation: 'grapple',
        stages,
        limbTarget: 'head'
    };
}

export function createTigerMove(name: string, type: 'bomb' | 'driver_96'): Move {
    const stages: MoveStage[] = [
        { time: 35, p1Pos: { x: 0, y: 0, rot: 0 }, p2Pos: { x: 8, y: -50, rot: 3.14 } }, // Lift
        { time: 65, p1Pos: { x: 15, y: 0, rot: 0 }, p2Pos: { x: 25, y: 25, rot: 4.5 } }  // Drop
    ];
    return {
        name,
        dmg: 32,
        kx: 4,
        ky: -20,
        time: 100,
        category: 'standing',
        animation: 'ultra',
        stages,
        limbTarget: 'body'
    };
}

export function createCornerMove(name: string, type: 'corner_bomb' | 'top_rope_bomb'): Move {
    const stages: MoveStage[] = [];
    if (type === 'top_rope_bomb') {
        stages.push({ time: 50, p1Pos: { x: 0, y: -60, rot: 0 }, p2Pos: { x: 10, y: -80, rot: 0 } }); // Climb/Position
        stages.push({ time: 90, p1Pos: { x: 30, y: 0, rot: 0.5 }, p2Pos: { x: 50, y: 20, rot: 3.14 } }); // Avalanche
    } else {
        stages.push({ time: 40, p1Pos: { x: 0, y: 0, rot: 0 }, p2Pos: { x: 5, y: -40, rot: 1.5 } });
        stages.push({ time: 70, p1Pos: { x: 12, y: 0, rot: 0 }, p2Pos: { x: 25, y: 30, rot: 0 } });
    }
    return {
        name,
        dmg: 45,
        kx: 10,
        ky: -30,
        time: stages.reduce((acc, s) => acc + s.time, 0),
        category: 'corner',
        animation: 'ultra',
        stages
    };
}

