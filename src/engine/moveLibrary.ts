import { Move, Moveset } from '../types';
import { createPowerbomb, createChokeslam, createDDT, createTigerMove, createCornerMove, createFinisher, createGenericStrike, createSubmission, createIconicMove } from './moves';

export const MoveLibrary: any = {
    // Powerbombs
    POWERBOMB_1: createPowerbomb('Last Ride Powerbomb', 'last_ride'),
    POWERBOMB_2: createPowerbomb('High Cross Powerbomb', 'high_cross'),
    POWERBOMB_AVALANCHE: createPowerbomb('Avalanche Powerbomb', 'avalanche'),
    POWERBOMB_TOP_ROPE: createPowerbomb('Top Rope Powerbomb', 'top_rope'),
    POWERBOMB_NORMAL: createPowerbomb('Powerbomb', 'normal'),
    
    // Finishers
    STUNNER: createFinisher('Stunner', 'stunner'),
    RKO: createFinisher('Sovereign Cutter', 'rko'),
    GERMAN_SUPLEX: createFinisher('German Suplex', 'german'),
    BULLDOG: createFinisher('Running Bulldog', 'bulldog'),
    TOMBSTONE: createIconicMove('Tombstone Piledriver', 'tombstone'),
    F5: createIconicMove('F-5', 'f5'),
    AA: createIconicMove('Attitude Adjustment', 'aa'),
    ROCK_BOTTOM: createIconicMove('Rock Bottom', 'rock_bottom'),
    PEDIGREE: createIconicMove('Pedigree', 'pedigree'),
    SHARPSHOOTER: createIconicMove('Sharpshooter', 'sharpshooter'),
    
    // Strikes
    HEADBUTT: createGenericStrike('European Headbutt', 'headbutt'),
    KNEE_STRIKE: createGenericStrike('Shining Wizard', 'knee'),
    
    // Submissions
    SLEEPER: createSubmission('Sleeper Hold', 'head'),
    ARM_BAR: createSubmission('Fujiwara Armbar', 'arm'),
    ANKLE_LOCK: createSubmission('Ankle Lock', 'leg'),
    
    // Chokeslams
    CHOKESLAM_1: createChokeslam('Chokeslam', 1),
    CHOKESLAM_2: createChokeslam('Two-Handed Chokeslam', 2),
    CHOKESLAM_TOSS: createChokeslam('Two-Handed Choke Toss', 3),
    PUNJABI_PLUNGE: createChokeslam('Punjabi Plunge', 3),
    
    // DDTs
    DDT_1: createDDT('DDT', 'normal'),
    DDT_2: createDDT('DDT 2', 'normal'),
    DDT_BUTTERFLY: createDDT('Butterfly DDT', 'butterfly'),
    DDT_DOUBLE_UNDERHOOK: createDDT('Double Underhook DDT', 'double_underhook'),
    DDT_DOUBLE_UNDERHOOK_2: createDDT('Double Underhook DDT 2', 'double_underhook'),
    
    // Tiger Moves
    TIGER_BOMB: createTigerMove('Tiger Bomb', 'bomb'),
    TIGER_DRIVER_96: createTigerMove('Tiger Driver 96', 'driver_96'),
    
    // Butterfly Variations
    BUTTERFLY_BACKBREAKER: { name: 'Butterfly Backbreaker', dmg: 26, kx: 2, ky: -12, time: 60, category: 'standing', animation: 'grapple' },
    BUTTERFLY_POWERBOMB: { name: 'Butterfly Powerbomb', dmg: 32, kx: 4, ky: -18, time: 70, category: 'standing', animation: 'grapple' },
    
    // Corner Moves
    CORNER_BOMB: createCornerMove('Corner Powerbomb', 'corner_bomb'),
    TOP_ROPE_BOMB: createCornerMove('Top Rope Powerbomb', 'top_rope_bomb'),
    
    // Other variations
    SAMOAN_DROP: { name: 'Samoan Drop', dmg: 24, kx: 4, ky: -10, time: 55, category: 'standing', animation: 'grapple' },
    POWERSLAM: { name: 'Powerslam', dmg: 23, kx: 3, ky: -14, time: 52, category: 'standing', animation: 'grapple' },
    PILEDRIVER: { name: 'Piledriver', dmg: 28, kx: 1, ky: -20, time: 65, category: 'standing', animation: 'grapple' },
    BRAINBUSTER: { name: 'Brainbuster', dmg: 27, kx: 2, ky: -18, time: 62, category: 'standing', animation: 'grapple' },
    GTS: { name: 'G.T.S.', dmg: 34, kx: 2, ky: -12, time: 75, category: 'standing', animation: 'ultra' },
    SPEAR: { name: 'Spear', dmg: 28, kx: 8, ky: -2, time: 40, category: 'standing', animation: 'ultra' },
    CURB_STOMP: { name: 'Curb Stomp', dmg: 29, kx: 2, ky: -22, time: 50, category: 'standing', animation: 'ultra' },

    getProceduralMoveset: (archetype?: string): Moveset => {
        const emptyMove = (name: string): Move => ({ name, dmg: 10, kx: 2, ky: -5, time: 40, category: 'standing', animation: 'strike' });
        
        return {
            light: [emptyMove('Jab'), emptyMove('Straight'), emptyMove('Low Kick'), emptyMove('Hook'), emptyMove('Uppercut')],
            heavy: [MoveLibrary.HEADBUTT, MoveLibrary.KNEE_STRIKE, emptyMove('Lariat'), emptyMove('Roundhouse'), emptyMove('Side Kick')],
            grapples: [MoveLibrary.POWERBOMB_NORMAL, MoveLibrary.CHOKESLAM_1, MoveLibrary.DDT_1, MoveLibrary.SAMOAN_DROP, MoveLibrary.POWERSLAM],
            backGrapples: [MoveLibrary.GERMAN_SUPLEX, emptyMove('Back Suplex')],
            
            groundHead: [MoveLibrary.SLEEPER, emptyMove('Stomp'), emptyMove('Elbow Drop')],
            groundSide: [MoveLibrary.ARM_BAR, emptyMove('Rib Breaker'), emptyMove('Leg Drop')],
            groundFeet: [MoveLibrary.ANKLE_LOCK, emptyMove('Ankle Lock'), emptyMove('Texas Cloverleaf')],
            groundSeated: [emptyMove('Penalty Kick'), emptyMove('Low Dropkick'), emptyMove('Sleeper')],
            groundKneeling: [emptyMove('Knee Strike'), emptyMove('Kneeling DDT')],
            
            cornerFront: [MoveLibrary.CORNER_BOMB, emptyMove('Chops'), emptyMove('Shoulder Thrusts')],
            cornerBack: [emptyMove('Backstabber'), emptyMove('Reverse Suplex')],
            cornerSeated: [emptyMove('Running Face Wash')],
            topRopeFrontSeated: [MoveLibrary.TOP_ROPE_BOMB, emptyMove('Superplex')],
            topRopeBackSeated: [emptyMove('Spider Suplex')],
            treeOfWoe: [emptyMove('Double Stomp')],
            
            ropeLeaning: [emptyMove('Clothesline Over'), emptyMove('Rope DDT')],
            ropeTied: [emptyMove('Chops')],
            ropeMiddle: [emptyMove('Rope Assisted Senton')],
            
            apronInsideToOutside: [emptyMove('Apron Suplex Out')],
            apronOutsideToInside: [emptyMove('Apron Suplex In')],
            apronToApron: [emptyMove('Apron Chokeslam')],
            apronToFloor: [emptyMove('Apron Moonsault')],
            apronSpringboardStanding: [emptyMove('Slingshot Forearm')],
            apronSpringboardGround: [emptyMove('Slingshot Splash')],
            
            divingStanding: [emptyMove('Flying Clothesline'), emptyMove('Missile Dropkick')],
            divingGround: [emptyMove('Frog Splash'), emptyMove('Elbow Drop')],
            springboardStanding: [emptyMove('Springboard Dropkick')],
            springboardGround: [emptyMove('Springboard Moonsault')],
            springboardOutside: [emptyMove('Suicide Dive')],
            
            runningStrike: [emptyMove('Running Clothesline'), emptyMove('Running Knee')],
            runningHeavy: [emptyMove('Running Big Boot')],
            runningGrapple: [MoveLibrary.BULLDOG, emptyMove('Running DDT')],
            runningGroundStrike: [emptyMove('Running Senton')],
            irishWhipRebound: [emptyMove('Pop-up Powerbomb')],
            reboundStrike: [emptyMove('Rebound Kick')],
            reboundHeavy: [emptyMove('Rebound Lariat')],
            reboundGrapple: [MoveLibrary.ROCK_BOTTOM, emptyMove('Rebound Powerslam')],
            pullBack: [emptyMove('Short-arm Clothesline')],
            
            signatures: [MoveLibrary.TIGER_DRIVER_96, MoveLibrary.STUNNER, MoveLibrary.BULLDOG, MoveLibrary.PEDIGREE],
            finishers: [MoveLibrary.TIGER_BOMB, MoveLibrary.RKO, MoveLibrary.TOMBSTONE, MoveLibrary.F5, MoveLibrary.AA, MoveLibrary.SHARPSHOOTER],
            paybacks: [],
            comebacks: [],
            taunts: { standing: [emptyMove('Taunt 1')], corner: [emptyMove('Taunt Corner')], apron: [], ground: [] },
            combos: []
        };
    }
};
