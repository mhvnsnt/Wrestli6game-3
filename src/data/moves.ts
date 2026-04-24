/**
 * SPDX-License-Identifier: Apache-2.0
 */

import { Move } from '../types';

export const MOVE_LIBRARY: { [key: string]: Move } = {
    // Light Attacks
    'JAB': { name: 'Jab', dmg: 5, kx: 2, ky: -1, time: 15, category: 'standing', animation: 'punch' },
    'HOOK': { name: 'Hook', dmg: 7, kx: 3, ky: -2, time: 18, category: 'standing', animation: 'punch' },
    'UPPERCUT': { name: 'Uppercut', dmg: 8, kx: 1, ky: -8, time: 22, category: 'standing', animation: 'punch' },
    'LOW_KICK': { name: 'Low Kick', dmg: 6, kx: 2, ky: -1, time: 16, category: 'standing', animation: 'kick' },
    'CHOP': { name: 'Knife Edge Chop', dmg: 9, kx: 4, ky: -1, time: 20, category: 'standing', animation: 'punch' },
    'ELBOW_DROP': { name: 'Elbow Drop', dmg: 12, kx: 2, ky: -1, time: 25, category: 'ground', animation: 'punch' },
    'KNEE_DROP': { name: 'Knee Drop', dmg: 10, kx: 1, ky: -2, time: 20, category: 'ground', animation: 'kick' },

    // Heavy Attacks
    'BIG_BOOT': { name: 'Big Boot', dmg: 14, kx: 8, ky: -2, time: 30, category: 'running', animation: 'kick' },
    'DROPKICK': { name: 'Dropkick', dmg: 15, kx: 9, ky: -5, time: 32, category: 'standing', animation: 'kick' },
    'LARIAT': { name: 'Lariat', dmg: 18, kx: 12, ky: -3, time: 35, category: 'running', animation: 'punch' },
    'SUPERKICK': { name: 'Superkick', dmg: 17, kx: 10, ky: -4, time: 28, category: 'standing', animation: 'kick' },
    'SPEAR': { name: 'Spear', dmg: 20, kx: 15, ky: -2, time: 40, category: 'running', animation: 'grapple' },

    // Grapples
    'SUPLEX': { name: 'Suplex', dmg: 22, kx: 3, ky: -15, time: 60, category: 'standing', animation: 'grapple' },
    'POWERBOMB': { name: 'Powerbomb', dmg: 28, kx: 1, ky: -25, time: 70, category: 'standing', animation: 'grapple' },
    'PILEDRIVER': { name: 'Piledriver', dmg: 30, kx: 0, ky: -28, time: 65, category: 'standing', animation: 'grapple' },
    'CHOKESLAM': { name: 'Chokeslam', dmg: 32, kx: 2, ky: -35, time: 80, category: 'standing', animation: 'grapple' },
    'SAMOAN_DROP': { name: 'Samoan Drop', dmg: 24, kx: 6, ky: -20, time: 65, category: 'standing', animation: 'grapple' },
    'BELLY_TO_BELLY': { name: 'Belly to Belly Suplex', dmg: 22, kx: 15, ky: -12, time: 55, category: 'standing', animation: 'grapple' },

    // Diving Moves
    'FROG_SPLASH': { name: 'Frog Splash', dmg: 35, kx: 1, ky: -5, time: 80, category: 'ground', animation: 'ultra' },
    'DIVING_ELBOW': { name: 'Diving Elbow Drop', dmg: 30, kx: 2, ky: -5, time: 70, category: 'ground', animation: 'ultra' },
    'MOONSAULT': { name: 'Moonsault', dmg: 38, kx: 2, ky: -2, time: 85, category: 'ground', animation: 'ultra' },

    // Corner Moves
    'MONKEY_FLIP': { name: 'Monkey Flip', dmg: 18, kx: 12, ky: -18, time: 45, category: 'standing', animation: 'grapple' },
    'CORNER_SPLASH': { name: 'Corner Splash', dmg: 15, kx: 3, ky: -2, time: 30, category: 'standing', animation: 'punch' },
    'BACK_BREAKER': { name: 'Back Breaker', dmg: 25, kx: 2, ky: -2, time: 55, category: 'standing', animation: 'grapple' },
    'NECK_BREAKER': { name: 'Neck Breaker', dmg: 24, kx: 5, ky: -10, time: 50, category: 'standing', animation: 'grapple' },
    'DDT': { name: 'DDT', dmg: 26, kx: 2, ky: -22, time: 45, category: 'standing', animation: 'grapple' },

    // Finishers
    'STUNNER': { name: 'Stone Cold Stunner', dmg: 55, kx: 1, ky: -25, time: 80, category: 'standing', animation: 'ultra' },
    'TOMBSTONE': { name: 'Tombstone Piledriver', dmg: 62, kx: 0, ky: -35, time: 100, category: 'standing', animation: 'ultra' },
    'RKO': { name: 'RKO', dmg: 52, kx: 4, ky: -28, time: 40, category: 'standing', animation: 'ultra' },
    'F5': { name: 'F-5', dmg: 58, kx: 15, ky: -15, time: 90, category: 'standing', animation: 'ultra' },
    'PEDIGREE': { name: 'Pedigree', dmg: 60, kx: 1, ky: -32, time: 85, category: 'standing', animation: 'ultra' },
    'CROSS_RHODES': { name: 'Cross Rhodes', dmg: 58, kx: 6, ky: -20, time: 75, category: 'standing', animation: 'ultra' },
    'ROCK_BOTTOM': { name: 'Rock Bottom', dmg: 54, kx: 5, ky: -18, time: 70, category: 'standing', animation: 'ultra' },
    'SCORPION_DEATH_DROP': { name: 'Scorpion Death Drop', dmg: 50, kx: 3, ky: -28, time: 65, category: 'standing', animation: 'ultra' },

    // Extended Legendary Move Collection
    'CRIPPLER_CROSSFACE': { name: 'Crippler Crossface', dmg: 48, kx: 0, ky: -2, time: 110, category: 'ground', animation: 'ultra' },
    'DIVING_HEADBUTT': { name: 'Diving Headbutt', dmg: 38, kx: 1, ky: -1, time: 90, category: 'ground', animation: 'ultra' },
    'GERMAN_SUPLEX': { name: 'German Suplex', dmg: 28, kx: 2, ky: -28, time: 55, category: 'standing', animation: 'grapple' },
    'JACKHAMMER': { name: 'Jackhammer', dmg: 65, kx: 1, ky: -35, time: 95, category: 'standing', animation: 'ultra' },
    'GORE': { name: 'Gore', dmg: 55, kx: 28, ky: -8, time: 42, category: 'running', animation: 'ultra' },
    'VAN_DAMINATOR': { name: 'Van Daminator', dmg: 44, kx: 18, ky: -15, time: 65, category: 'standing', animation: 'ultra' },
    'FIVE_STAR_FROG': { name: '5-Star Frog Splash', dmg: 60, kx: 1, ky: -5, time: 100, category: 'ground', animation: 'ultra' },
    'SABU_LEG_DROP': { name: 'Air Sabu Leg Drop', dmg: 32, kx: 5, ky: -5, time: 70, category: 'ground', animation: 'ultra' },
    'RAVEN_EFFECT': { name: 'Raven Effect DDT', dmg: 45, kx: 2, ky: -25, time: 50, category: 'standing', animation: 'ultra' },
    'DIAMOND_CUTTER': { name: 'Diamond Cutter', dmg: 52, kx: 6, ky: -26, time: 45, category: 'standing', animation: 'ultra' },
    'ANGLE_SLAM': { name: 'Angle Slam', dmg: 48, kx: 15, ky: -32, time: 75, category: 'standing', animation: 'ultra' },
    'COQUINA_CLUTCH': { name: 'Coquina Clutch', dmg: 55, kx: 0, ky: -2, time: 120, category: 'standing', animation: 'ultra' },
    'TROUBLE_IN_PARADISE': { name: 'Trouble in Paradise', dmg: 42, kx: 12, ky: -12, time: 35, category: 'standing', animation: 'ultra' },
    'SWEET_CHIN_MUSIC': { name: 'Sweet Chin Music', dmg: 58, kx: 14, ky: -18, time: 40, category: 'standing', animation: 'ultra' },
    'BULLDOG': { name: 'Bulldog', dmg: 22, kx: 10, ky: -15, time: 40, category: 'running', animation: 'grapple' },
    'STINGER_SPLASH': { name: 'Stinger Splash', dmg: 18, kx: 4, ky: -2, time: 35, category: 'running', animation: 'punch' },
    'STINKFACE': { 
        name: 'Stinkface', 
        dmg: 45, kx: 2, ky: -2, time: 180, category: 'standing', animation: 'grapple',
        stages: [
            { time: 40, p1Pos: { x: 0.1, y: 0, rot: 0 }, p2Pos: { x: 0.5, y: 0, rot: 0 }, p1Anim: 'grapple' },
            { time: 100, p1Pos: { x: 0.8, y: 0.2, rot: Math.PI }, p2Pos: { x: 0.4, y: 0, rot: -0.2 }, p1Anim: 'special' },
            { time: 40, p1Pos: { x: 0.5, y: 0, rot: 0 }, p2Pos: { x: 1.5, y: 0, rot: -0.5 }, p1Anim: 'idle' }
        ]
    },
    'STEINER_RECLINER': { name: 'Steiner Recliner', dmg: 55, kx: 0, ky: -2, time: 180, category: 'ground', animation: 'ultra', isHold: true }
};
