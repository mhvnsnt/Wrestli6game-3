import { CharacterData, Move, Moveset, Team, SKIN_COLORS, HAIR_COLORS, EYE_COLORS, HAIR_STYLES, BodyType, FaceShape, Archetype, Ability } from '../types';
import { MoveLibrary } from '../engine/moveLibrary';

const standardMoveset: Moveset = MoveLibrary.getProceduralMoveset();

export const TEAMS: Team[] = [
    {
        id: 'team_kings',
        name: 'THE CROWN COUNCIL',
        members: ['THE CROWN SOVEREIGN', 'THE SPECTRAL REAPER'],
        sigil: '#ffcc00',
        bio: "An elite assembly of rulers from different dimensions, bound by an ancient pact of sovereignty.",
        allies: ['THE FORBIDDEN WOLVERINE'],
        rivals: ['THE VOID VIGILANTE', 'THE ARCHITECT']
    },
    {
        id: 'team_apex',
        name: 'APEX SYNDICATE',
        members: ['THE APEX PREDATOR', 'THE ARCHITECT'],
        sigil: '#22cc88',
        bio: "A high-precision unit focused on tactical dominance and surgical strikes.",
        allies: [],
        rivals: ['THE CROWN COUNCIL']
    }
];

export const ROSTER: CharacterData[] = [
    {
        name: 'THE FORBIDDEN WOLVERINE',
        bio: "A technical savage with a past shrouded in controversy. He respects the steel but loves the struggle.",
        record: { wins: 88, losses: 12 },
        hometown: "Edmonton, Canada",
        allies: ['THE CROWN SOVEREIGN'],
        rivals: [],
        bodyType: 'stocky', faceShape: 'square', skinColor: '#fde0be', hairColor: '#2a1a0a', eyeColor: '#111',
        hairStyle: 'wild', clothing: { top: 'bare', bottom: 'pants', extra: 'none', boots: 'regular' },
        topColor: '#111', bottomColor: '#003366', extraColor: '#ffffff',
        height: 80, muscleMass: 1.2, fatMass: 0.1, feminineCurve: 0, breastSize: 0, gluteSize: 0.35, hairLength: 4,
        gender: 'male', sigil: '#003366', weaponType: 'none', archetype: 'grappler', abilities: ['power_strike', 'armor'], manager: 'none', attireSlot: 0, charisma: 140,
        scars: ['eye_slash'],
        alternateAttires: [
            { clothing: { top: 'bare', bottom: 'pants', extra: 'none', boots: 'regular' }, topColor: '#111', bottomColor: '#003366', extraColor: '#ffffff' }, // Classic Blue
            { clothing: { top: 'bare', bottom: 'pants', extra: 'none', boots: 'regular' }, topColor: '#111', bottomColor: '#330000', extraColor: '#ffffff' }, // Classic Red
            { clothing: { top: 'bare', bottom: 'shorts', extra: 'none', boots: 'regular' }, topColor: '#111', bottomColor: '#000000', extraColor: '#ffffff' } // Training
        ],
        moveset: { 
            ...MoveLibrary.getProceduralMoveset(),
            finishers: [{ name: 'CRIPPLER CROSSFACE', dmg: 75, kx: 0, ky: -2, time: 200, category: 'ground', animation: 'ultra', isHold: true }]
        }
    },
    {
        name: 'THE SPECTRAL REAPER',
        bio: "The phenom of the grid. He controls the darkness and commands the shadows of the arena.",
        record: { wins: 200, losses: 21 },
        hometown: "Death Valley",
        teamId: 'team_kings',
        bodyType: 'heavy', faceShape: 'angular', skinColor: '#f5c49a', hairColor: '#111', eyeColor: '#ffffff',
        hairStyle: 'long_straight', clothing: { top: 'tshirt', bottom: 'pants', extra: 'cloak', boots: 'regular', gloveL: 'none', gloveR: 'none' },
        topColor: '#000', bottomColor: '#000', extraColor: '#111',
        height: 102, muscleMass: 0.95, fatMass: 0.1, feminineCurve: 0, breastSize: 0, gluteSize: 0.3, hairLength: 8,
        gender: 'male', sigil: '#8844ff', weaponType: 'none', archetype: 'grappler', abilities: ['armor', 'resiliency'], manager: 'none', attireSlot: 0, charisma: 160,
        alternateAttires: [
            { clothing: { top: 'tshirt', bottom: 'pants', extra: 'cloak', boots: 'regular' }, topColor: '#000', bottomColor: '#000', extraColor: '#000' }, // Modern
            { clothing: { top: 'bare', bottom: 'pants', extra: 'cloak', boots: 'regular', gloveL: 'none', gloveR: 'none', wristbandL: 'gray', wristbandR: 'gray' }, topColor: '#000', bottomColor: '#000', extraColor: '#666' }, // 1994 Purple
            { clothing: { top: 'jacket', bottom: 'pants', extra: 'none', boots: 'regular' }, topColor: '#111', bottomColor: '#111', extraColor: '#333' }, // Big Evil
            { clothing: { top: 'armor', bottom: 'pants', extra: 'cloak', boots: 'regular' }, topColor: '#000', bottomColor: '#000', extraColor: '#8844ff' } // Ministry
        ],
        moveset: { 
            ...standardMoveset,
            grapples: [
                MoveLibrary.CHOKESLAM_1, MoveLibrary.DDT_1, MoveLibrary.SUPLEX || { name: 'Suplex', dmg: 20, kx: 5, ky: -10, time: 60, category: 'standing', animation: 'grapple' }, MoveLibrary.SAMOAN_DROP, MoveLibrary.PILEDRIVER,
                MoveLibrary.PUNJABI_PLUNGE, MoveLibrary.POWERBOMB_1, MoveLibrary.CHOKESLAM_2, 
                MoveLibrary.DDT_DOUBLE_UNDERHOOK, MoveLibrary.TIGER_BOMB
            ],
            finishers: [{ name: 'TOMBSTONE PILEDRIVER', dmg: 80, kx: 0, ky: -35, time: 120, category: 'standing', animation: 'ultra' }]
        },
        entrance: { music: 'THEME_SPECTRAL', lighting: 'PURPLE_DARK', taunt: 'LIGHTS_OUT' }
    },
    {
        name: 'THE SAMOAN SUBMISSION MACHINE',
        bio: "A world-traveled destroyer with a lethal combination of striking and technical grappling. Power personified.",
        record: { wins: 152, losses: 38 },
        hometown: "Huntington Beach, CA",
        bodyType: 'stocky', faceShape: 'square', skinColor: '#e8a87c', hairColor: '#111', eyeColor: '#111',
        hairStyle: 'short_back', clothing: { top: 'bare', bottom: 'shorts', extra: 'none', boots: 'regular', kneePadL: 'black', kneePadR: 'black' },
        topColor: '#111', bottomColor: '#111', extraColor: '#111',
        height: 86, muscleMass: 1.1, fatMass: 0.35, feminineCurve: 0, breastSize: 0, gluteSize: 0.45, hairLength: 1,
        gender: 'male', sigil: '#ff8800', weaponType: 'none', archetype: 'hybrid', abilities: ['power_strike', 'armor'], manager: 'none', attireSlot: 0, charisma: 145,
        tattoos: ['arm_sleeve'],
        alternateAttires: [
            { clothing: { top: 'bare', bottom: 'shorts', extra: 'none', boots: 'regular', kneePadL: 'black', kneePadR: 'black' }, topColor: '#111', bottomColor: '#111', extraColor: '#ffcc00' }, // Black/Yellow
            { clothing: { top: 'bare', bottom: 'trunks', extra: 'none', boots: 'regular', kneePadL: 'white', kneePadR: 'white' }, topColor: '#111', bottomColor: '#ffffff', extraColor: '#003366' }, // White/Blue Classic
            { clothing: { top: 'bare', bottom: 'shorts', extra: 'none', boots: 'regular', facepaint: 'skull' }, topColor: '#111', bottomColor: '#000000', extraColor: '#ff2244' } // Island Warrior
        ],
        moveset: { 
            ...standardMoveset,
            finishers: [
                { name: 'COQUINA CLUTCH', dmg: 70, kx: 0, ky: -2, time: 240, category: 'ground', animation: 'ultra', isHold: true },
                { name: 'MUSCLE BUSTER', dmg: 85, kx: 2, ky: -45, time: 100, category: 'standing', animation: 'ultra' }
            ]
        }
    },
    {
        name: "THE DARK PIONEER",
        bio: "An indie legend who redefined technical wrestling. Her strikes are surgical, her spirit unbreakable.",
        record: { wins: 142, losses: 40 },
        hometown: "Cleveland, OH",
        bodyType: 'feminine_athletic', faceShape: 'sharp', skinColor: '#fde0be', hairColor: '#2a1a0a', eyeColor: '#3a7acc',
        hairStyle: 'undercut', clothing: { top: 'tank', bottom: 'tights', extra: 'none', boots: 'regular', wristbandL: 'black', wristbandR: 'black' },
        topColor: '#222', bottomColor: '#222', extraColor: '#444',
        height: 82, muscleMass: 0.8, fatMass: 0.1, feminineCurve: 0.6, breastSize: 0.4, gluteSize: 0.55, hairLength: 5,
        gender: 'female', sigil: '#ff0055', weaponType: 'none', archetype: 'technician', abilities: ['speed_burst', 'resiliency'], manager: 'none', attireSlot: 0, charisma: 135,
        moveset: { 
            ...standardMoveset,
            finishers: [{ name: 'PIONEER PRESS', dmg: 75, kx: 5, ky: -40, time: 90, category: 'diving', animation: 'special' }]
        },
        tattoos: ['arm_sleeve']
    },
    {
        name: "TITAN OF THE TUNDRA",
        bio: "A powerhouse from the frozen north. She doesn't just win matches; she conquers spirits.",
        record: { wins: 95, losses: 5 },
        hometown: "Novosibirsk, Russia",
        bodyType: 'amazon', faceShape: 'angular', skinColor: '#fde0be', hairColor: '#ffffff', eyeColor: '#4488ff',
        hairStyle: 'braid', clothing: { top: 'armor', bottom: 'armored', extra: 'none', boots: 'regular' },
        topColor: '#445566', bottomColor: '#334455', extraColor: '#ccddee',
        height: 105, muscleMass: 1.5, fatMass: 0.2, feminineCurve: 0.3, breastSize: 0.4, gluteSize: 0.5, hairLength: 10,
        gender: 'female', sigil: '#00ffff', archetype: 'powerhouse', abilities: ['armor', 'shock_strike'], manager: 'none', attireSlot: 0, charisma: 150,
        moveset: { 
            ...standardMoveset,
            finishers: [{ name: 'TUNDRA SLAM', dmg: 90, kx: 0, ky: -55, time: 110, category: 'standing', animation: 'ultra' }]
        }
    },
    {
        name: "AZTEC EAGLE",
        bio: "The high-flying sensation of the highlands. Gravity is merely a suggestion to him.",
        record: { wins: 110, losses: 45 },
        hometown: "Mexico City",
        bodyType: 'slim', faceShape: 'oval', skinColor: '#c8845a', hairColor: '#111', eyeColor: '#2a9a55',
        hairStyle: 'none', clothing: { top: 'bare', bottom: 'tights', extra: 'none', mask: 'warrior', boots: 'regular' },
        topColor: '#0a4d26', bottomColor: '#0a4d26', extraColor: '#ffd700',
        height: 78, muscleMass: 0.6, fatMass: 0.05, feminineCurve: 0, breastSize: 0, gluteSize: 0.3, hairLength: 0,
        gender: 'male', sigil: '#0a4d26', weaponType: 'none', archetype: 'high_flyer', abilities: ['speed_boost', 'teleport'], manager: 'none', attireSlot: 0, charisma: 160,
        moveset: { 
            ...standardMoveset,
            finishers: [{ name: 'EAGLE DIVE', dmg: 80, kx: 10, ky: -30, time: 80, category: 'diving', animation: 'ultra' }]
        }
    },
    {
        name: "KIMURA THE CAGE MASTER",
        bio: "An apex predator in the octagon who brought her lethal joint locks to the squared circle. Perfection in pain.",
        record: { wins: 62, losses: 8 },
        hometown: "Tokyo, Japan",
        bodyType: 'feminine_athletic', faceShape: 'sharp', skinColor: '#fdebce', hairColor: '#111', eyeColor: '#3c1f10',
        hairStyle: 'undercut', clothing: { top: 'tank', bottom: 'shorts', extra: 'hand_wraps', boots: 'regular' },
        topColor: '#551100', bottomColor: '#222222', extraColor: '#bbbbbb',
        height: 84, muscleMass: 0.9, fatMass: 0.08, feminineCurve: 0.5, breastSize: 0.25, gluteSize: 0.5, hairLength: 3,
        gender: 'female', sigil: '#ff3300', archetype: 'technician', abilities: ['lifesteal', 'speed_burst'], manager: 'none', attireSlot: 0, charisma: 142,
        moveset: { 
            ...standardMoveset,
            finishers: [{ name: 'KIMURA LOCK', dmg: 75, kx: 0, ky: -2, time: 300, category: 'ground', animation: 'ultra', isHold: true }]
        }
    },
    {
        name: "RENEGADE RYDER",
        bio: "The punk rock powerhouse. She fights for the outcasts and strikes with the force of a tectonic shift.",
        record: { wins: 78, losses: 23 },
        hometown: "London, UK",
        bodyType: 'athletic', faceShape: 'angular', skinColor: '#fde0be', hairColor: '#ff2244', eyeColor: '#111',
        hairStyle: 'mohawk', clothing: { top: 'jacket', bottom: 'pants', extra: 'none', boots: 'regular' },
        topColor: '#111', bottomColor: '#000', extraColor: '#ff2244',
        height: 88, muscleMass: 1.1, fatMass: 0.15, feminineCurve: 0.4, breastSize: 0.35, gluteSize: 0.45, hairLength: 6,
        gender: 'female', sigil: '#ff2244', archetype: 'brawler', abilities: ['rage', 'power_strike'], manager: 'none', attireSlot: 0, charisma: 138,
        moveset: { 
            ...standardMoveset,
            finishers: [{ name: 'RYDER KICK', dmg: 80, kx: 12, ky: -15, time: 60, category: 'standing', animation: 'ultra' }]
        },
        tattoos: ['arm_sleeve', 'chest_piece']
    },
    {
        name: 'THE CROWN SOVEREIGN',
        bio: "The king of kings. He builds empires and crushes anyone who dares question his authority.",
        record: { wins: 145, losses: 40 },
        hometown: "Greenwich, CT",
        teamId: 'team_kings',
        bodyType: 'muscular', faceShape: 'square', skinColor: '#fde0be', hairColor: '#e8d080', eyeColor: '#3a7acc',
        hairStyle: 'short_back', clothing: { top: 'bare', bottom: 'pants', extra: 'none' },
        topColor: '#111', bottomColor: '#111', extraColor: '#ffcc00',
        height: 90, muscleMass: 1.1, fatMass: 0.05, feminineCurve: 0, breastSize: 0, gluteSize: 0.4, hairLength: 2,
        gender: 'male', sigil: '#ffcc00', weaponType: 'sledgehammer', archetype: 'grappler', abilities: ['armor', 'power_strike'], manager: 'none', attireSlot: 1, charisma: 150,
        moveset: { 
            ...standardMoveset,
            grapples: [
                MoveLibrary.DDT_1, MoveLibrary.SUPLEX || { name: 'Suplex', dmg: 20, kx: 5, ky: -10, time: 60, category: 'standing', animation: 'grapple' }, MoveLibrary.POWERSLAM, MoveLibrary.PILEDRIVER, MoveLibrary.POWERBOMB_NORMAL,
                MoveLibrary.DDT_BUTTERFLY, MoveLibrary.TIGER_BOMB, MoveLibrary.CHOKESLAM_2, 
                MoveLibrary.DDT_DOUBLE_UNDERHOOK, MoveLibrary.TIGER_DRIVER_96
            ],
            finishers: [{ name: 'THE PEDIGREE', dmg: 72, kx: 2, ky: -32, time: 90, category: 'standing', animation: 'ultra' }]
        }
    },
    {
        name: 'THE VOID VIGILANTE',
        bodyType: 'athletic', faceShape: 'sharp', skinColor: '#ffffff', hairColor: '#111', eyeColor: '#ffffff',
        hairStyle: 'long_straight', clothing: { top: 'tshirt', bottom: 'pants', extra: 'none', facepaint: 'sting' },
        topColor: '#000', bottomColor: '#000', extraColor: '#ffffff',
        height: 92, muscleMass: 0.85, fatMass: 0.05, feminineCurve: 0, breastSize: 0, gluteSize: 0.3, hairLength: 7,
        gender: 'male', sigil: '#ffffff', weaponType: 'staff', archetype: 'hybrid', abilities: ['power_strike', 'armor'], manager: 'none', attireSlot: 1, charisma: 165,
        faceColor1: '#ffffff', faceColor2: '#000000',
        moveset: { 
            ...standardMoveset,
            finishers: [{ name: 'SCORPION DEATH DROP', dmg: 68, kx: 2, ky: -35, time: 75, category: 'standing', animation: 'ultra' }]
        }
    },
    {
        name: 'THE ARCHITECT',
        bodyType: 'athletic', faceShape: 'sharp', skinColor: '#fde0be', hairColor: '#111', eyeColor: '#111',
        hairStyle: 'undercut', clothing: { top: 'jacket', bottom: 'pants', extra: 'none' },
        topColor: '#111', bottomColor: '#111', extraColor: '#cc44ff',
        height: 88, muscleMass: 0.75, fatMass: 0.05, feminineCurve: 0, breastSize: 0, gluteSize: 0.3, hairLength: 5,
        gender: 'male', sigil: '#cc44ff', weaponType: 'none', archetype: 'hybrid', abilities: ['speed_burst', 'resiliency'], manager: 'none', attireSlot: 1, charisma: 155,
        moveset: { 
            ...standardMoveset,
            finishers: [{ name: 'CURB STOMP', dmg: 60, kx: 2, ky: -22, time: 55, category: 'standing', animation: 'ultra' }]
        }
    },
    {
        name: 'THE APEX PREDATOR',
        bodyType: 'athletic', faceShape: 'sharp', skinColor: '#e0c0a0', hairColor: '#2a1a0a', eyeColor: '#2a9a55',
        hairStyle: 'short_back', clothing: { top: 'bare', bottom: 'shorts', extra: 'none' },
        topColor: '#111', bottomColor: '#111', extraColor: '#111',
        height: 91, muscleMass: 0.88, fatMass: 0.05, feminineCurve: 0, breastSize: 0, gluteSize: 0.35, hairLength: 1,
        gender: 'male', sigil: '#22cc88', weaponType: 'none', archetype: 'hybrid', abilities: ['speed_burst'], manager: 'none', attireSlot: 1, charisma: 150,
        moveset: { 
            ...standardMoveset,
            finishers: [{ name: 'RKO', dmg: 62, kx: 8, ky: -28, time: 35, category: 'standing', animation: 'ultra' }]
        }
    },
    // --- FEMALE & FEMININE EXPANSION ---
    {
        name: 'THE IRISH LASLASS',
        bio: "The Man of the division. She clawed her way from the bottom to become the undisputed queen of the core.",
        hometown: "Dublin, Ireland",
        bodyType: 'athletic', faceShape: 'sharp', skinColor: '#fde0be', hairColor: '#ff6600', eyeColor: '#3a7acc',
        hairStyle: 'steampunk', clothing: { top: 'jacket', bottom: 'pants', extra: 'none', gloveL: 'black', gloveR: 'black' },
        topColor: '#111', bottomColor: '#111', extraColor: '#ff6600',
        height: 72, muscleMass: 0.7, fatMass: 0.05, feminineCurve: 0.8, breastSize: 0.5, gluteSize: 0.6, hairLength: 6,
        gender: 'female', sigil: '#ff6600', archetype: 'hybrid', abilities: ['resiliency'], charisma: 155,
        moveset: { ...standardMoveset, finishers: [{ name: 'DIS-ARM-HER', dmg: 70, kx: 0, ky: -2, time: 180, category: 'ground', animation: 'ultra', isHold: true }] }
    },
    {
        name: 'THE GENETIC QUEEN',
        bio: "The daughter of a legend, but a titan in her own right. Diamonds are forever, and so is her reign.",
        hometown: "Charlotte, NC",
        bodyType: 'amazon', faceShape: 'sharp', skinColor: '#fde0be', hairColor: '#ffffcc', eyeColor: '#3a7acc',
        hairStyle: 'long_straight', clothing: { top: 'armor', bottom: 'trunks', extra: 'cloak' },
        topColor: '#111', bottomColor: '#111', extraColor: '#ff66ff',
        height: 78, muscleMass: 0.8, fatMass: 0.05, feminineCurve: 0.9, breastSize: 0.7, gluteSize: 0.7, hairLength: 9,
        gender: 'female', sigil: '#ffcc00', archetype: 'grappler', abilities: ['armor'], charisma: 160,
        moveset: { ...standardMoveset, finishers: [{ name: 'FIGURE-EIGHT', dmg: 75, kx: 0, ky: -2, time: 200, category: 'ground', animation: 'ultra', isHold: true }] }
    },
    {
        name: 'THE INTERPOL KICKER',
        bio: "The strongest woman in the world. Her kicks are lightning, her justice is absolute.",
        hometown: "Fukien, China",
        bodyType: 'amazon', faceShape: 'soft', skinColor: '#fde0be', hairColor: '#2a1a0a', eyeColor: '#2a1a0a',
        hairStyle: 'buns', clothing: { top: 'jacket', bottom: 'pants', extra: 'none', gloveL: 'white', gloveR: 'white' },
        topColor: '#003366', bottomColor: '#003366', extraColor: '#ffffff',
        height: 74, muscleMass: 0.9, fatMass: 0.05, feminineCurve: 1.0, breastSize: 0.6, gluteSize: 1.1, hairLength: 3,
        gender: 'female', sigil: '#003366', archetype: 'striker', abilities: ['speed_burst'], charisma: 170,
        moveset: { ...standardMoveset, finishers: [{ name: 'KIKOKEN TURBO', dmg: 65, kx: 12, ky: -15, time: 50, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'THE DELTA ASSASSIN',
        bio: "A memory-wiped elite agent with legs like steel traps. Target identified. Mission: Neutralize.",
        hometown: "London, England",
        bodyType: 'athletic', faceShape: 'sharp', skinColor: '#fde0be', hairColor: '#ffffcc', eyeColor: '#2a1a0a',
        hairStyle: 'braids', clothing: { top: 'bare', bottom: 'trunks', extra: 'none', gloveL: 'red', gloveR: 'red' },
        topColor: '#225522', bottomColor: '#225522', extraColor: '#ff0000',
        height: 70, muscleMass: 0.75, fatMass: 0.1, feminineCurve: 0.85, breastSize: 0.4, gluteSize: 0.9, hairLength: 10,
        gender: 'female', sigil: '#ff0000', archetype: 'striker', abilities: ['speed_burst'], charisma: 150,
        moveset: { ...standardMoveset, finishers: [{ name: 'SPIRAL ARROW', dmg: 62, kx: 15, ky: -10, time: 45, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'THE BOSS_LADY',
        bio: "The standard. The blueprint. She doesn't just run the match, she runs the industry.",
        hometown: "Boston, MA",
        bodyType: 'athletic', faceShape: 'sharp', skinColor: '#8d5524', hairColor: '#cc44ff', eyeColor: '#111',
        hairStyle: 'steampunk', clothing: { top: 'jacket', bottom: 'pants', extra: 'none' },
        topColor: '#111', bottomColor: '#111', extraColor: '#ffcc00',
        height: 68, muscleMass: 0.6, fatMass: 0.05, feminineCurve: 0.95, breastSize: 0.4, gluteSize: 0.75, hairLength: 7,
        gender: 'female', sigil: '#cc44ff', archetype: 'hybrid', abilities: ['resiliency'], charisma: 165,
        moveset: { ...standardMoveset, finishers: [{ name: 'BANK STATEMENT', dmg: 68, kx: 0, ky: -2, time: 180, category: 'ground', animation: 'ultra', isHold: true }] }
    },
    {
        name: 'THE EMPRESS OF ASH',
        bio: "No one is ready for her. A chaotic force of nature from the Far East with mask and mist.",
        hometown: "Osaka, Japan",
        bodyType: 'athletic', faceShape: 'round', skinColor: '#fde0be', hairColor: '#ff00ff', eyeColor: '#111',
        hairStyle: 'wild', clothing: { top: 'jacket', bottom: 'pants', extra: 'none', facepaint: 'skull' },
        topColor: '#ff00ff', bottomColor: '#000', extraColor: '#00ff00',
        height: 66, muscleMass: 0.65, fatMass: 0.1, feminineCurve: 1.0, breastSize: 0.6, gluteSize: 0.85, hairLength: 5,
        gender: 'female', sigil: '#ff00ff', archetype: 'hybrid', abilities: ['poison_mist'], charisma: 168,
        moveset: { ...standardMoveset, finishers: [{ name: 'ASUKA LOCK', dmg: 72, kx: 0, ky: -2, time: 200, category: 'ground', animation: 'ultra', isHold: true }] }
    },
    {
        name: 'THE GLAMOUR ICON',
        bio: "A Hollywood-bound starlet with a lethal kick. She was born to be in the spotlight.",
        hometown: "Hollywood, CA",
        bodyType: 'curvy', faceShape: 'soft', skinColor: '#fde0be', hairColor: '#ffffff', eyeColor: '#3a7acc',
        hairStyle: 'long_straight', clothing: { top: 'jacket', bottom: 'pants', extra: 'none' },
        topColor: '#ff0066', bottomColor: '#ff0066', extraColor: '#ffffff',
        height: 68, muscleMass: 0.5, fatMass: 0.15, feminineCurve: 1.1, breastSize: 0.8, gluteSize: 0.95, hairLength: 10,
        gender: 'female', sigil: '#ff0066', archetype: 'striker', abilities: ['speed_burst'], charisma: 180,
        moveset: { ...standardMoveset, finishers: [{ name: 'STARSTRUCK KICK', dmg: 65, kx: 10, ky: -20, time: 50, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'THE SILICON SISTER',
        bio: "An AI-humanoid hybrid created for the ultimate combat simulation.",
        hometown: "Cyber Valley",
        bodyType: 'amazon', faceShape: 'sharp', skinColor: '#ccffff', hairColor: '#00ffff', eyeColor: '#00ffff',
        hairStyle: 'mohawk', clothing: { top: 'armor', bottom: 'pants', extra: 'none' },
        topColor: '#111', bottomColor: '#111', extraColor: '#00ffff',
        height: 75, muscleMass: 1.0, fatMass: 0, feminineCurve: 0.9, breastSize: 0.9, gluteSize: 0.9, hairLength: 2,
        gender: 'female', sigil: '#00ffff', archetype: 'grappler', abilities: ['armor'], charisma: 120,
        moveset: { ...standardMoveset, finishers: [{ name: 'CYBER CRUSH', dmg: 75, kx: 2, ky: -40, time: 80, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'THE VOODOO QUEEN',
        bio: "She calls upon the spirits to haunt her opponents. A mysterious and dangerous entity.",
        hometown: "New Orleans, LA",
        bodyType: 'athletic', faceShape: 'angular', skinColor: '#3d2b1f', hairColor: '#ffffff', eyeColor: '#ff0000',
        hairStyle: 'dreads', clothing: { top: 'jacket', bottom: 'pants', extra: 'cloak' },
        topColor: '#440044', bottomColor: '#440044', extraColor: '#000000',
        height: 71, muscleMass: 0.6, fatMass: 0.05, feminineCurve: 0.9, breastSize: 0.5, gluteSize: 0.8, hairLength: 8,
        gender: 'female', sigil: '#440044', archetype: 'hybrid', abilities: ['resiliency'], charisma: 155,
        moveset: { ...standardMoveset, finishers: [{ name: 'SPIRIT GRASP', dmg: 70, kx: 0, ky: -2, time: 220, category: 'ground', animation: 'ultra', isHold: true }] }
    },
    {
        name: 'THE IRON MAIDEN',
        bio: "A Russian powerhouse trained in the harshest conditions. Her grip is final.",
        hometown: "Moscow, Russia",
        bodyType: 'heavy', faceShape: 'square', skinColor: '#fde0be', hairColor: '#ffffff', eyeColor: '#111',
        hairStyle: 'short_back', clothing: { top: 'bare', bottom: 'pants', extra: 'none' },
        topColor: '#111', bottomColor: '#cc0000', extraColor: '#ffffff',
        height: 82, muscleMass: 1.3, fatMass: 0.1, feminineCurve: 0.7, breastSize: 0.65, gluteSize: 0.8, hairLength: 1,
        gender: 'female', sigil: '#cc0000', archetype: 'grappler', abilities: ['armor', 'power_strike'], charisma: 135,
        moveset: { ...standardMoveset, finishers: [{ name: 'IRON CLUTCH', dmg: 80, kx: 0, ky: -2, time: 200, category: 'standing', animation: 'ultra', isHold: true }] }
    },
    {
        name: 'THE BLACK WIDOW',
        bio: "Lethal, silent, and beautiful. She strikes when you least expect it.",
        hometown: "Unknown",
        bodyType: 'athletic', faceShape: 'sharp', skinColor: '#fde0be', hairColor: '#cc0000', eyeColor: '#111',
        hairStyle: 'undercut', clothing: { top: 'jacket', bottom: 'pants', extra: 'none' },
        topColor: '#111', bottomColor: '#111', extraColor: '#ff0000',
        height: 69, muscleMass: 0.7, fatMass: 0.05, feminineCurve: 1.0, breastSize: 0.5, gluteSize: 0.9, hairLength: 6,
        gender: 'female', sigil: '#ff0000', archetype: 'striker', abilities: ['speed_burst'], charisma: 160,
        moveset: { ...standardMoveset, finishers: [{ name: 'WIDOWS BITE', dmg: 65, kx: 5, ky: -25, time: 40, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'THE SOLAR FLARE',
        bio: "A high-flying sensation that lights up the arena with her energy.",
        hometown: "Mexico City",
        bodyType: 'athletic', faceShape: 'soft', skinColor: '#e8a87c', hairColor: '#ffcc00', eyeColor: '#ffcc00',
        hairStyle: 'long_straight', clothing: { top: 'jacket', bottom: 'trunks', extra: 'none', facepaint: 'sting' },
        topColor: '#ffaa00', bottomColor: '#ffaa00', extraColor: '#ffff00',
        height: 65, muscleMass: 0.55, fatMass: 0.05, feminineCurve: 0.9, breastSize: 0.4, gluteSize: 0.7, hairLength: 10,
        gender: 'female', sigil: '#ffcc00', archetype: 'striker', abilities: ['speed_burst'], charisma: 175,
        moveset: { ...standardMoveset, finishers: [{ name: 'SOLAR ECLIPSE', dmg: 68, kx: 2, ky: -45, time: 80, category: 'standing', animation: 'ultra' }] }
    },
    // --- FIGHTING GAME RIPOFFS ---
    {
        name: 'THE DRAGON SPIRIT',
        bio: "A master of the flaming fist. He wanders the world seeking the ultimate challenge.",
        hometown: "Hiroshima, Japan",
        bodyType: 'muscular', faceShape: 'square', skinColor: '#fde0be', hairColor: '#2a1a0a', eyeColor: '#111',
        hairStyle: 'wild', clothing: { top: 'bare', bottom: 'pants', extra: 'none', gloveL: 'red', gloveR: 'red' },
        topColor: '#ffffff', bottomColor: '#ffffff', extraColor: '#ff0000',
        height: 85, muscleMass: 1.0, fatMass: 0.05, feminineCurve: 0, breastSize: 0, gluteSize: 0.3, hairLength: 2,
        gender: 'male', sigil: '#ffffff', archetype: 'striker', abilities: ['power_strike'], charisma: 140,
        moveset: { ...standardMoveset, finishers: [{ name: 'HADOU-BURST', dmg: 70, kx: 10, ky: -10, time: 50, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'THE SHADOW NINJA',
        bio: "Get over here! A vengeful wraith returned from the nether-core to claim his soul.",
        hometown: "NetherRealm",
        bodyType: 'muscular', faceShape: 'sharp', skinColor: '#e0c0a0', hairColor: '#111', eyeColor: '#ffffff',
        hairStyle: 'none', clothing: { top: 'armor', bottom: 'pants', extra: 'none', facepaint: 'skull' },
        topColor: '#ffcc00', bottomColor: '#111', extraColor: '#ffcc00',
        height: 88, muscleMass: 0.95, fatMass: 0.05, feminineCurve: 0, breastSize: 0, gluteSize: 0.35, hairLength: 0,
        gender: 'male', sigil: '#ffcc00', archetype: 'striker', abilities: ['teleport'], charisma: 160,
        moveset: { ...standardMoveset, finishers: [{ name: 'CORE SPEAR', dmg: 75, kx: -15, ky: 0, time: 60, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'THE ELECTRIC TYRANT',
        bio: "The god of thunder in the arena. He protects the core from outer-world invasion.",
        hometown: "Elder Heavens",
        bodyType: 'heavy', faceShape: 'angular', skinColor: '#fde0be', hairColor: '#ffffff', eyeColor: '#ccffff',
        hairStyle: 'long_straight', clothing: { top: 'armor', bottom: 'pants', extra: 'cloak' },
        topColor: '#ffffff', bottomColor: '#ffffff', extraColor: '#3a7acc',
        height: 95, muscleMass: 0.9, fatMass: 0.1, feminineCurve: 0, breastSize: 0, gluteSize: 0.3, hairLength: 5,
        gender: 'male', sigil: '#00ffff', archetype: 'hybrid', abilities: ['shock_strike'], charisma: 170,
        moveset: { ...standardMoveset, finishers: [{ name: 'THUNDERBOLT CRUSH', dmg: 80, kx: 2, ky: -50, time: 90, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'THE IRON FIST HEIR',
        bio: "Possessed by the devil gene, he fights for control of his family empire.",
        hometown: "Tokyo, Japan",
        bodyType: 'muscular', faceShape: 'sharp', skinColor: '#fde0be', hairColor: '#111', eyeColor: '#ff0000',
        hairStyle: 'mohawk', clothing: { top: 'bare', bottom: 'pants', extra: 'none', gloveL: 'red', gloveR: 'red' },
        topColor: '#111', bottomColor: '#111', extraColor: '#ff0000',
        height: 86, muscleMass: 1.1, fatMass: 0.05, feminineCurve: 0, breastSize: 0, gluteSize: 0.3, hairLength: 4,
        gender: 'male', sigil: '#ff0000', archetype: 'striker', abilities: ['power_strike'], charisma: 155,
        moveset: { ...standardMoveset, finishers: [{ name: 'DEVIL UPPERCUT', dmg: 72, kx: 2, ky: -45, time: 40, category: 'standing', animation: 'ultra' }] }
    },
    // --- WRESTLING LEGEND RIPOFFS ---
    {
        name: 'THE TEXAS RATTLESNAKE',
        bio: "He doesn't follow rules, he breaks them. Don't trust anyone, especially in the core.",
        hometown: "Victoria, TX",
        bodyType: 'stocky', faceShape: 'square', skinColor: '#fde0be', hairColor: '#111', eyeColor: '#111',
        hairStyle: 'none', clothing: { top: 'bare', bottom: 'trunks', extra: 'none', boots: 'regular' },
        topColor: '#111', bottomColor: '#000', extraColor: '#111',
        height: 84, muscleMass: 1.0, fatMass: 0.15, feminineCurve: 0, breastSize: 0, gluteSize: 0.35, hairLength: 0,
        gender: 'male', sigil: '#111111', archetype: 'brawler', abilities: ['resiliency'], charisma: 190,
        moveset: { ...standardMoveset, finishers: [{ name: 'CORE STUNNER', dmg: 70, kx: 2, ky: -25, time: 30, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'THE BRAHMAN ICON',
        bio: "The most electrifying man in sports entertainment. Do you smell what the Core is cooking?",
        hometown: "Miami, FL",
        bodyType: 'muscular', faceShape: 'square', skinColor: '#8d5524', hairColor: '#111', eyeColor: '#111',
        hairStyle: 'none', clothing: { top: 'bare', bottom: 'trunks', extra: 'none' },
        topColor: '#111', bottomColor: '#111', extraColor: '#ffcc00',
        height: 92, muscleMass: 1.25, fatMass: 0.05, feminineCurve: 0, breastSize: 0, gluteSize: 0.5, hairLength: 0,
        gender: 'male', sigil: '#ffcc00', archetype: 'hybrid', abilities: ['charisma'], charisma: 200,
        moveset: { ...standardMoveset, finishers: [
            { name: 'ROCK BOTTOM', dmg: 68, kx: 5, ky: -30, time: 60, category: 'standing', animation: 'ultra' },
            { name: 'CORES ELBOW', dmg: 75, kx: 0, ky: -10, time: 100, category: 'ground', animation: 'ultra' }
        ] }
    },
    {
        name: 'THE NATURE KING',
        bio: "The stylin', profilin', limousine ridin', jet flyin' icon of the core.",
        hometown: "Charlotte, NC",
        bodyType: 'athletic', faceShape: 'square', skinColor: '#fde0be', hairColor: '#ffffcc', eyeColor: '#3a7acc',
        hairStyle: 'long_straight', clothing: { top: 'bare', bottom: 'trunks', extra: 'cloak' },
        topColor: '#111', bottomColor: '#003366', extraColor: '#ffffff',
        height: 82, muscleMass: 0.7, fatMass: 0.15, feminineCurve: 0, breastSize: 0, gluteSize: 0.3, hairLength: 6,
        gender: 'male', sigil: '#ffffff', archetype: 'grappler', abilities: ['resiliency'], charisma: 185,
        moveset: { ...standardMoveset, finishers: [{ name: 'FIGURE-FOUR CLIP', dmg: 72, kx: 0, ky: -2, time: 240, category: 'ground', animation: 'ultra', isHold: true }] }
    },
    {
        name: 'THE HULK OF THE CORE',
        bio: "Whatcha gonna do when the 24-inch pythons run wild on you?",
        hometown: "Venice Beach, CA",
        bodyType: 'heavy', faceShape: 'square', skinColor: '#e8a87c', hairColor: '#ffffcc', eyeColor: '#111',
        hairStyle: 'wild', clothing: { top: 'bare', bottom: 'trunks', extra: 'none' },
        topColor: '#ffff00', bottomColor: '#ffff00', extraColor: '#ff0000',
        height: 100, muscleMass: 1.4, fatMass: 0.1, feminineCurve: 0, breastSize: 0, gluteSize: 0.3, hairLength: 4,
        gender: 'male', sigil: '#ff0000', archetype: 'grappler', abilities: ['armor'], charisma: 195,
        moveset: { ...standardMoveset, finishers: [{ name: 'ATOMIC LEG DROP', dmg: 70, kx: 0, ky: -5, time: 120, category: 'ground', animation: 'ultra' }] }
    },
    // --- WWE LEGENDS 2.0 ---
    {
        name: 'THE PHENOM',
        bio: "The dark entity of the square circle. His soul belongs to the void, his legacy is immortal.",
        record: { wins: 300, losses: 50 },
        hometown: "Death Valley",
        bodyType: 'heavy', faceShape: 'angular', skinColor: '#f5c49a', hairColor: '#111', eyeColor: '#ffffff',
        hairStyle: 'long_straight', clothing: { top: 'bare', bottom: 'pants', extra: 'cloak', boots: 'regular' },
        topColor: '#000', bottomColor: '#000', extraColor: '#111',
        height: 105, muscleMass: 1.0, fatMass: 0.1, feminineCurve: 0, breastSize: 0, gluteSize: 0.3, hairLength: 8,
        gender: 'male', sigil: '#8844ff', archetype: 'grappler', abilities: ['resiliency', 'armor'], manager: 'none', attireSlot: 0, charisma: 180,
        alternateAttires: [
            { clothing: { top: 'bare', bottom: 'pants', extra: 'cloak', boots: 'regular' }, topColor: '#000', bottomColor: '#000', extraColor: '#666' }, // 1994
            { clothing: { top: 'jacket', bottom: 'pants', extra: 'none', boots: 'regular' }, topColor: '#111', bottomColor: '#111', extraColor: '#333' }, // Biker
            { clothing: { top: 'armor', bottom: 'pants', extra: 'cloak', boots: 'regular' }, topColor: '#000', bottomColor: '#000', extraColor: '#8844ff' } // Ministry
        ],
        moveset: { ...standardMoveset, finishers: [{ name: 'TOMBSTONE', dmg: 85, kx: 0, ky: -40, time: 100, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'THE SHOWSTOPPER',
        bio: "The heart and soul of the performance. He will stop the show, then steal it.",
        hometown: "San Antonio, TX",
        bodyType: 'athletic', faceShape: 'sharp', skinColor: '#fde0be', hairColor: '#cc9922', eyeColor: '#3a7acc',
        hairStyle: 'long_straight', clothing: { top: 'bare', bottom: 'tights', extra: 'none' },
        topColor: '#111', bottomColor: '#ff0000', extraColor: '#ffffff',
        height: 82, muscleMass: 0.8, fatMass: 0.05, feminineCurve: 0, breastSize: 0, gluteSize: 0.4, hairLength: 7,
        gender: 'male', sigil: '#ff0000', archetype: 'hybrid', abilities: ['resiliency', 'speed_burst'], charisma: 190,
        alternateAttires: [
            { clothing: { top: 'bare', bottom: 'tights', extra: 'none' }, topColor: '#111', bottomColor: '#ffffff', extraColor: '#cc0000' }, // White/Red
            { clothing: { top: 'bare', bottom: 'tights', extra: 'none' }, topColor: '#111', bottomColor: '#000000', extraColor: '#ffffff' } // Black/White
        ],
        moveset: { ...standardMoveset, finishers: [{ name: 'SWEET CHIN MUSIC', dmg: 70, kx: 12, ky: -5, time: 40, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'GENETIC FREAK',
        bio: "The big bad booty daddy. Holla if you hear him.",
        hometown: "Detroit, MI",
        bodyType: 'muscular', faceShape: 'square', skinColor: '#fde0be', hairColor: '#ffffcc', eyeColor: '#111',
        hairStyle: 'none', clothing: { top: 'bare', bottom: 'trunks', extra: 'none' },
        topColor: '#111', bottomColor: '#ff00ff', extraColor: '#ffffff',
        height: 88, muscleMass: 1.8, fatMass: 0.05, feminineCurve: 0, breastSize: 0, gluteSize: 0.5, hairLength: 0,
        gender: 'male', sigil: '#ff00ff', archetype: 'powerhouse', abilities: ['power_strike', 'armor'], charisma: 175,
        alternateAttires: [
            { clothing: { top: 'bare', bottom: 'singlet', extra: 'none' }, topColor: '#ff00ff', bottomColor: '#111', extraColor: '#ffffff' }, // Singlet
            { clothing: { top: 'bare', bottom: 'trunks', extra: 'none' }, topColor: '#111', bottomColor: '#111', extraColor: '#ffff00' } // Black/Yellow
        ],
        moveset: { ...standardMoveset, finishers: [{ name: 'STEINER RECLINER', dmg: 80, kx: 0, ky: -2, time: 240, category: 'ground', animation: 'ultra', isHold: true }] }
    },
    {
        name: 'THE MOUNTAIN MASS',
        bio: "A titan of sheer force. He doesn't just crush you, he erases you.",
        hometown: "Harlem, NY",
        bodyType: 'heavy', faceShape: 'round', skinColor: '#3c1f10', hairColor: '#111', eyeColor: '#ffffff',
        hairStyle: 'none', clothing: { top: 'bodysuit', bottom: 'pants', extra: 'none' },
        topColor: '#111', bottomColor: '#111', extraColor: '#111',
        height: 110, muscleMass: 0.8, fatMass: 1.2, feminineCurve: 0, breastSize: 0, gluteSize: 0.6, hairLength: 0,
        gender: 'male', sigil: '#ffffff', archetype: 'grappler', abilities: ['armor', 'shield'], charisma: 140,
        alternateAttires: [
            { clothing: { top: 'bare', bottom: 'pants', extra: 'none' }, topColor: '#111', bottomColor: '#111', extraColor: '#111' }, // Bare Torso
            { clothing: { top: 'bodysuit', bottom: 'pants', extra: 'none' }, topColor: '#440044', bottomColor: '#440044', extraColor: '#ffffff' } // Purple
        ],
        moveset: { ...standardMoveset, finishers: [{ name: 'MOUNTAIN DROP', dmg: 88, kx: 2, ky: -50, time: 100, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'TRIBAL DANCER',
        bio: "He did it for the people. His gravity is his greatest weapon.",
        hometown: "Samoa",
        bodyType: 'stocky', faceShape: 'round', skinColor: '#c8845a', hairColor: '#111', eyeColor: '#111',
        hairStyle: 'none', clothing: { top: 'bare', bottom: 'tights', extra: 'none' },
        topColor: '#111', bottomColor: '#ffffff', extraColor: '#000000',
        height: 85, muscleMass: 0.9, fatMass: 0.8, feminineCurve: 0, breastSize: 0, gluteSize: 1.8, hairLength: 0,
        gender: 'male', sigil: '#ffffff', archetype: 'grappler', abilities: ['power_strike'], charisma: 160,
        moveset: { ...standardMoveset, finishers: [{ name: 'SAMOAN STINKFACE', dmg: 50, kx: 2, ky: -5, time: 120, category: 'corner', animation: 'ultra' }] }
    },
    {
        name: 'FUNKY FORCE',
        bio: "Feel the rhythm, feel the rhyme. She's about to audit your core time.",
        hometown: "Orlando, FL",
        bodyType: 'feminine_curvy', faceShape: 'soft', skinColor: '#8d5524', hairColor: '#00ff00', eyeColor: '#111',
        hairStyle: 'wild', clothing: { top: 'crop_top', bottom: 'leggings', extra: 'none' },
        topColor: '#00ff00', bottomColor: '#111', extraColor: '#ffffff',
        height: 68, muscleMass: 0.6, fatMass: 0.1, feminineCurve: 1.5, breastSize: 0.7, gluteSize: 1.5, hairLength: 8,
        gender: 'female', sigil: '#00ff00', archetype: 'high_flyer', abilities: ['speed_boost', 'speed_burst'], charisma: 175,
        moveset: { ...standardMoveset, finishers: [{ name: 'FUNKY REAR VIEW', dmg: 65, kx: 10, ky: -2, time: 40, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'GIANT SPECTRUM',
        bio: "The eighth wonder of the core. He is the mountain that walks.",
        hometown: "Grenoble, France",
        bodyType: 'heavy', faceShape: 'square', skinColor: '#fde0be', hairColor: '#2a1a0a', eyeColor: '#111',
        hairStyle: 'short_back', clothing: { top: 'bare', bottom: 'singlet', extra: 'none' },
        topColor: '#111', bottomColor: '#000', extraColor: '#ffffff',
        height: 120, muscleMass: 1.2, fatMass: 0.4, feminineCurve: 0, breastSize: 0, gluteSize: 0.4, hairLength: 2,
        gender: 'male', sigil: '#111', archetype: 'powerhouse', abilities: ['armor', 'shield'], charisma: 165,
        moveset: { ...standardMoveset, finishers: [{ name: 'GIANT CHOKESLAM', dmg: 90, kx: 2, ky: -55, time: 80, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'RAINMAKER',
        bio: "He makes it rain money and victories. The ace of the modern era.",
        hometown: "Tokyo, Japan",
        bodyType: 'athletic', faceShape: 'sharp', skinColor: '#fde0be', hairColor: '#cc9922', eyeColor: '#111',
        hairStyle: 'short_back', clothing: { top: 'bare', bottom: 'shorts', extra: 'none' },
        topColor: '#111', bottomColor: '#ffcc00', extraColor: '#ffffff',
        height: 90, muscleMass: 0.85, fatMass: 0.05, feminineCurve: 0, breastSize: 0, gluteSize: 0.35, hairLength: 1,
        gender: 'male', sigil: '#ffcc00', archetype: 'technician', abilities: ['speed_burst'], charisma: 185,
        moveset: { ...standardMoveset, finishers: [{ name: 'RAINMAKER LARIAT', dmg: 85, kx: 18, ky: -5, time: 45, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'TRANQUILO KING',
        bio: "No passes. No stress. Just total destruction of the status quo.",
        hometown: "Mexico City",
        bodyType: 'lean', faceShape: 'sharp', skinColor: '#e8a87c', hairColor: '#111', eyeColor: '#111',
        hairStyle: 'wild', clothing: { top: 'bare', bottom: 'pants', extra: 'none' },
        topColor: '#111', bottomColor: '#ffffff', extraColor: '#ff0000',
        height: 86, muscleMass: 0.7, fatMass: 0.05, feminineCurve: 0, breastSize: 0, gluteSize: 0.3, hairLength: 4,
        gender: 'male', sigil: '#ffffff', archetype: 'striker', abilities: ['resiliency'], charisma: 180,
        moveset: { ...standardMoveset, finishers: [{ name: 'DESTINO', dmg: 78, kx: 2, ky: -48, time: 90, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'THE OLYMPIC HERO',
        bio: "Intensity. Integrity. Intelligence. He won gold with a broken neck.",
        hometown: "Pittsburgh, PA",
        bodyType: 'stocky', faceShape: 'square', skinColor: '#fde0be', hairColor: '#8b4513', eyeColor: '#3a7acc',
        hairStyle: 'none', clothing: { top: 'bare', bottom: 'singlet', extra: 'none' },
        topColor: '#003366', bottomColor: '#ffffff', extraColor: '#cc0000',
        height: 80, muscleMass: 1.1, fatMass: 0.1, feminineCurve: 0, breastSize: 0, gluteSize: 0.45, hairLength: 0,
        gender: 'male', sigil: '#ffffff', archetype: 'technician', abilities: ['resiliency', 'power_strike'], charisma: 175,
        moveset: { ...standardMoveset, finishers: [{ name: 'ANGLE SLAM', dmg: 72, kx: 5, ky: -38, time: 70, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'THE CHARISMATIC ENIGMA',
        bio: "He lives for the high-flying adrenaline. A creature of the night.",
        hometown: "Cameron, NC",
        bodyType: 'lean', faceShape: 'sharp', skinColor: '#fde0be', hairColor: '#cc44ff', eyeColor: '#111',
        hairStyle: 'wild', clothing: { top: 'tshirt', bottom: 'pants', extra: 'none', facepaint: 'ghoul' },
        topColor: '#111', bottomColor: '#111', extraColor: '#cc44ff',
        height: 84, muscleMass: 0.65, fatMass: 0.05, feminineCurve: 0, breastSize: 0, gluteSize: 0.3, hairLength: 6,
        gender: 'male', sigil: '#cc44ff', archetype: 'high_flyer', abilities: ['speed_burst', 'resiliency'], charisma: 185,
        moveset: { ...standardMoveset, finishers: [{ name: 'SWANTON BOMB', dmg: 80, kx: 2, ky: -5, time: 150, category: 'diving', animation: 'ultra' }] }
    },
    {
        name: 'THE HITMAN',
        bio: "The best there is, the best there was, the best there ever will be.",
        hometown: "Calgary, Canada",
        bodyType: 'athletic', faceShape: 'sharp', skinColor: '#fde0be', hairColor: '#111', eyeColor: '#111',
        hairStyle: 'long_straight', clothing: { top: 'bare', bottom: 'tights', extra: 'none' },
        topColor: '#111', bottomColor: '#ff66ff', extraColor: '#ffffff',
        height: 82, muscleMass: 0.75, fatMass: 0.05, feminineCurve: 0, breastSize: 0, gluteSize: 0.35, hairLength: 6,
        gender: 'male', sigil: '#ff66ff', archetype: 'technician', abilities: ['resiliency'], charisma: 180,
        moveset: { ...standardMoveset, finishers: [{ name: 'SHARPSHOOTER', dmg: 75, kx: 0, ky: -2, time: 240, category: 'ground', animation: 'ultra', isHold: true }] }
    },
    {
        name: 'BEAST INCORPORATE',
        bio: "Eat. Sleep. Conquer. Repeat. A legitimate freak of nature.",
        hometown: "Minneapolis, MN",
        bodyType: 'heavy', faceShape: 'square', skinColor: '#fde0be', hairColor: '#ffffcc', eyeColor: '#111',
        hairStyle: 'short_back', clothing: { top: 'bare', bottom: 'shorts', extra: 'none' },
        topColor: '#111', bottomColor: '#000', extraColor: '#ff0000',
        height: 94, muscleMass: 1.5, fatMass: 0.1, feminineCurve: 0, breastSize: 0, gluteSize: 0.3, hairLength: 1,
        gender: 'male', sigil: '#111', archetype: 'grappler', abilities: ['armor', 'power_strike'], charisma: 180,
        moveset: { ...standardMoveset, finishers: [{ name: 'F5 CYCLONE', dmg: 85, kx: 5, ky: -10, time: 80, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'THE BAD OUTSIDER',
        bio: "Hey yo. Survey says: another win for the bad guy.",
        hometown: "Miami, FL",
        bodyType: 'athletic', faceShape: 'sharp', skinColor: '#e0c0a0', hairColor: '#111', eyeColor: '#111',
        hairStyle: 'undercut', clothing: { top: 'bare', bottom: 'trunks', extra: 'none' },
        topColor: '#111', bottomColor: '#111', extraColor: '#ff0000',
        height: 98, muscleMass: 0.9, fatMass: 0.05, feminineCurve: 0, breastSize: 0, gluteSize: 0.3, hairLength: 5,
        gender: 'male', sigil: '#ff0000', archetype: 'hybrid', abilities: ['resiliency'], charisma: 170,
        moveset: { ...standardMoveset, finishers: [{ name: 'OUTSIDERS EDGE', dmg: 78, kx: 5, ky: -40, time: 100, category: 'standing', animation: 'ultra' }] }
    },
    // --- INTERNATIONAL MASTERS ---
    {
        name: 'EMERALD EMPEROR',
        bio: "The spirit of the emerald flow. Precision and power in every elbow strike.",
        hometown: "Tokyo, Japan",
        bodyType: 'stocky', faceShape: 'square', skinColor: '#fde0be', hairColor: '#111', eyeColor: '#111',
        hairStyle: 'short_back', clothing: { top: 'bare', bottom: 'tights', extra: 'none' },
        topColor: '#111', bottomColor: '#228844', extraColor: '#ffffff',
        height: 84, muscleMass: 1.0, fatMass: 0.2, feminineCurve: 0, breastSize: 0, gluteSize: 0.4, hairLength: 2,
        gender: 'male', sigil: '#228844', archetype: 'technician', abilities: ['resiliency'], charisma: 160,
        moveset: { ...standardMoveset, finishers: [{ name: 'EMERALD FLOWSION', dmg: 82, kx: 2, ky: -45, time: 110, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'THE BURNING SPIRIT',
        bio: "He survived the impossible. His lariat can decapitate giants.",
        hometown: "Osaka, Japan",
        bodyType: 'heavy', faceShape: 'square', skinColor: '#fde0be', hairColor: '#111', eyeColor: '#111',
        hairStyle: 'short_back', clothing: { top: 'bare', bottom: 'shorts', extra: 'none' },
        topColor: '#111', bottomColor: '#111', extraColor: '#aa3300',
        height: 88, muscleMass: 1.2, fatMass: 0.25, feminineCurve: 0, breastSize: 0, gluteSize: 0.45, hairLength: 2,
        gender: 'male', sigil: '#aa3300', archetype: 'brawler', abilities: ['power_strike', 'armor'], charisma: 155,
        moveset: { ...standardMoveset, finishers: [{ name: 'BURNING LARIAT', dmg: 88, kx: 15, ky: -5, time: 40, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'TRIBAL DANCER',
        bio: "The Kish. A massive Samoan legend known for the most humiliating move in history.",
        hometown: "Samoa",
        bodyType: 'heavy', faceShape: 'round', skinColor: '#e8a87c', hairColor: '#111', eyeColor: '#111',
        hairStyle: 'wild', clothing: { top: 'bare', bottom: 'trunks', extra: 'none' },
        topColor: '#111', bottomColor: '#111', extraColor: '#ff0000',
        height: 86, muscleMass: 1.0, fatMass: 0.65, feminineCurve: 0, breastSize: 0, gluteSize: 1.2, hairLength: 5,
        gender: 'male', sigil: '#ff0000', archetype: 'powerhouse', abilities: ['armor', 'resiliency'], charisma: 185,
        moveset: { ...standardMoveset, finishers: [{ name: 'STINKFACE', dmg: 45, kx: 2, ky: -2, time: 180, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'FUNKY FORCE',
        bio: "She brings the glow and the funk. High agility and relentless energy.",
        hometown: "Orlando, FL",
        bodyType: 'lean', faceShape: 'sharp', skinColor: '#442211', hairColor: '#00ff33', eyeColor: '#111',
        hairStyle: 'wild', clothing: { top: 'tshirt', bottom: 'tights', extra: 'none' },
        topColor: '#00ff33', bottomColor: '#00ff33', extraColor: '#ff00ff',
        height: 78, muscleMass: 0.6, fatMass: 0.05, feminineCurve: 1.0, breastSize: 0.8, gluteSize: 0.9, hairLength: 8,
        gender: 'female', sigil: '#00ff33', archetype: 'striker', abilities: ['speed_burst', 'regen'], charisma: 180,
        moveset: { ...standardMoveset, finishers: [{ name: 'REAR VIEW', dmg: 65, kx: 18, ky: -5, time: 35, category: 'running', animation: 'ultra' }] }
    },
    {
        name: 'BIG POPPA',
        bio: "Holla if you hear him. The genetic freak with the largest arms in the world.",
        hometown: "Detroit, MI",
        bodyType: 'heavy', faceShape: 'square', skinColor: '#fde0be', hairColor: '#ffffcc', eyeColor: '#111',
        hairStyle: 'short_back', clothing: { top: 'bare', bottom: 'trunks', extra: 'none' },
        topColor: '#111', bottomColor: '#111', extraColor: '#ff00ff',
        height: 88, muscleMass: 1.8, fatMass: 0.05, feminineCurve: 0, breastSize: 0, gluteSize: 0.3, hairLength: 1,
        gender: 'male', sigil: '#ff00ff', archetype: 'powerhouse', abilities: ['power_strike', 'armor'], charisma: 190,
        moveset: { ...standardMoveset, finishers: [{ name: 'STEINER RECLINER', dmg: 75, kx: 0, ky: -2, time: 200, category: 'ground', animation: 'ultra', isHold: true }] }
    },
    {
        name: 'MIST OF MUTA',
        bio: "A dark entity from the Far East. He blinded legends with his poison mist.",
        hometown: "Fukushima, Japan",
        bodyType: 'athletic', faceShape: 'sharp', skinColor: '#fde0be', hairColor: '#111', eyeColor: '#111',
        hairStyle: 'none', clothing: { top: 'bare', bottom: 'pants', extra: 'none', facepaint: 'kabuki' },
        topColor: '#111', bottomColor: '#aa0022', extraColor: '#ffffff',
        height: 82, muscleMass: 0.8, fatMass: 0.05, feminineCurve: 0, breastSize: 0, gluteSize: 0.3, hairLength: 0,
        gender: 'male', sigil: '#aa0022', archetype: 'mage', abilities: ['poison'], charisma: 175,
        moveset: { ...standardMoveset, finishers: [{ name: 'POISON MIST', dmg: 40, kx: 2, ky: -5, time: 30, category: 'standing', animation: 'ultra' }] }
    },
    // --- INDIE ICONS ---
    {
        name: 'THE DRAGON MASTER',
        bio: "Submission specialist. He will kick your head in and make you tap out.",
        hometown: "Aberdeen, WA",
        bodyType: 'lean', faceShape: 'sharp', skinColor: '#fde0be', hairColor: '#8b4513', eyeColor: '#111',
        hairStyle: 'wild', clothing: { top: 'bare', bottom: 'trunks', extra: 'none' },
        topColor: '#111', bottomColor: '#aa3300', extraColor: '#ffffff',
        height: 78, muscleMass: 0.6, fatMass: 0.05, feminineCurve: 0, breastSize: 0, gluteSize: 0.3, hairLength: 4,
        gender: 'male', sigil: '#aa3300', archetype: 'technician', abilities: ['resiliency'], charisma: 165,
        moveset: { ...standardMoveset, finishers: [{ name: 'LEBELL LOCK', dmg: 75, kx: 0, ky: -2, time: 200, category: 'ground', animation: 'ultra', isHold: true }] }
    },
    {
        name: 'PENTAGON ZERO',
        bio: "Cero Miedo. He breaks arms for a living.",
        hometown: "Mexico City",
        bodyType: 'athletic', faceShape: 'sharp', skinColor: '#e8a87c', hairColor: '#111', eyeColor: '#111',
        hairStyle: 'none', clothing: { top: 'jacket', bottom: 'pants', extra: 'none', mask: 'skull' },
        topColor: '#000', bottomColor: '#000', extraColor: '#ffffff',
        height: 80, muscleMass: 0.85, fatMass: 0.05, feminineCurve: 0, breastSize: 0, gluteSize: 0.35, hairLength: 0,
        gender: 'male', sigil: '#000', archetype: 'grappler', abilities: ['power_strike'], charisma: 160,
        moveset: { ...standardMoveset, finishers: [{ name: 'ARM BREAKER', dmg: 70, kx: 2, ky: -15, time: 60, category: 'standing', animation: 'ultra' }] }
    },
    // --- EXPANDED FEMALE ROSTER (Total 45 target) ---
    {
        name: 'BRUTAL NIGHTMARE',
        bio: "This is her brutality. Every match is a audit of your soul.",
        hometown: "Adelaide, Australia",
        bodyType: 'amazon', faceShape: 'sharp', skinColor: '#fde0be', hairColor: '#111', eyeColor: '#111',
        hairStyle: 'undercut', clothing: { top: 'jacket', bottom: 'pants', extra: 'none' },
        topColor: '#111', bottomColor: '#111', extraColor: '#bb00ff',
        height: 75, muscleMass: 0.9, fatMass: 0.05, feminineCurve: 0.85, breastSize: 0.5, gluteSize: 1.0, hairLength: 2,
        gender: 'female', sigil: '#111', archetype: 'powerhouse', abilities: ['rage'], charisma: 175,
        moveset: { ...standardMoveset, finishers: [{ name: 'RIPTIDE', dmg: 78, kx: 2, ky: -40, time: 85, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'THE GLOW ICON',
        bio: "Feel the power. She lights up the arena with her atomic athleticism.",
        hometown: "Orlando, FL",
        bodyType: 'curvy', faceShape: 'soft', skinColor: '#8d5524', hairColor: '#22ff44', eyeColor: '#111',
        hairStyle: 'wild', clothing: { top: 'crop_top', bottom: 'leggings', extra: 'none' },
        topColor: '#22ff44', bottomColor: '#111', extraColor: '#ffffff',
        height: 68, muscleMass: 0.65, fatMass: 0.1, feminineCurve: 1.2, breastSize: 0.6, gluteSize: 1.2, hairLength: 6,
        gender: 'female', sigil: '#22ff44', archetype: 'high_flyer', abilities: ['speed_boost'], charisma: 160,
        moveset: { ...standardMoveset, finishers: [{ name: 'REAR VIEW', dmg: 65, kx: 10, ky: -2, time: 40, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'THE FINAL BOSS',
        bio: "The high chief literal god of the industry. You cannot audit what you cannot beat.",
        hometown: "Miami, FL",
        bodyType: 'muscular', faceShape: 'square', skinColor: '#b58a67', hairColor: '#111', eyeColor: '#111',
        hairStyle: 'bald', clothing: { top: 'vest', bottom: 'trunks', extra: 'none' },
        topColor: '#111', bottomColor: '#111', extraColor: '#ffbb00',
        height: 85, muscleMass: 1.0, fatMass: 0.05, feminineCurve: 0, breastSize: 0, gluteSize: 0.6, hairLength: 0,
        gender: 'male', sigil: '#ff0000', archetype: 'powerhouse', abilities: ['rage'], charisma: 250,
        moveset: { ...standardMoveset, finishers: [{ name: 'PEOPLE ELBOW', dmg: 95, kx: 1, ky: -100, time: 120, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'THE DEADMAN',
        bio: "The phenom of the 8th house. He has come for your debt.",
        hometown: "Death Valley",
        bodyType: 'stocky', faceShape: 'angular', skinColor: '#f2e1d7', hairColor: '#111', eyeColor: '#fff',
        hairStyle: 'long', clothing: { top: 'coat', bottom: 'trousers', extra: 'hat' },
        topColor: '#111', bottomColor: '#111', extraColor: '#6600ff',
        height: 92, muscleMass: 0.85, fatMass: 0.1, feminineCurve: 0, breastSize: 0, gluteSize: 0.4, hairLength: 8,
        gender: 'male', sigil: '#6600ff', archetype: 'powerhouse', abilities: ['resiliency'], charisma: 200,
        moveset: { ...standardMoveset, finishers: [{ name: 'TOMBSTONE', dmg: 100, kx: 0, ky: -150, time: 100, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'VIPER_0',
        bio: "Strike first. Strike hard. No audit needed.",
        hometown: "St. Louis, MO",
        bodyType: 'muscular', faceShape: 'angular', skinColor: '#fde0be', hairColor: '#332211', eyeColor: '#111',
        hairStyle: 'buzz', clothing: { top: 'bare', bottom: 'trunks', extra: 'none' },
        topColor: '#111', bottomColor: '#111', extraColor: '#ffffff',
        height: 84, muscleMass: 0.95, fatMass: 0.02, feminineCurve: 0, breastSize: 0, gluteSize: 0.5, hairLength: 1,
        gender: 'male', sigil: '#111', archetype: 'technician', abilities: ['speed_boost'], charisma: 185,
        moveset: { ...standardMoveset, finishers: [{ name: 'RKO_OUT_OF_NOWHERE', dmg: 85, kx: 5, ky: -60, time: 45, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'THE SOVEREIGN KING',
        bio: "The architect of the game. He owns the contract.",
        hometown: "Greenwich, CT",
        bodyType: 'muscular', faceShape: 'square', skinColor: '#fde0be', hairColor: '#998844', eyeColor: '#111',
        hairStyle: 'long', clothing: { top: 'bare', bottom: 'trunks', extra: 'jacket' },
        topColor: '#111', bottomColor: '#111', extraColor: '#ffbb00',
        height: 84, muscleMass: 0.9, fatMass: 0.05, feminineCurve: 0, breastSize: 0, gluteSize: 0.4, hairLength: 5,
        gender: 'male', sigil: '#ffbb00', archetype: 'powerhouse', abilities: ['rage'], charisma: 190,
        moveset: { ...standardMoveset, finishers: [{ name: 'PEDIGREE', dmg: 90, kx: 0, ky: -120, time: 80, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'EST_QUANTUM',
        bio: "The strongest, fastest, roughest, toughest in the core.",
        hometown: "Knoxville, TN",
        bodyType: 'feminine_athletic', faceShape: 'soft', skinColor: '#4d2d18', hairColor: '#111', eyeColor: '#111',
        hairStyle: 'long_braid', clothing: { top: 'one_piece', bottom: 'leggings', extra: 'none' },
        topColor: '#ff0066', bottomColor: '#ff0066', extraColor: '#ffffff',
        height: 70, muscleMass: 0.85, fatMass: 0.05, feminineCurve: 1.1, breastSize: 0.4, gluteSize: 1.1, hairLength: 12,
        gender: 'female', sigil: '#ff0066', archetype: 'powerhouse', abilities: ['speed_burst'], charisma: 180,
        moveset: { ...standardMoveset, finishers: [{ name: 'K.O.D', dmg: 88, kx: 2, ky: -130, time: 90, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'THE CHOSEN SON',
        bio: "Born into the royalty of the ring. Carrying the legacy.",
        hometown: "Marietta, GA",
        bodyType: 'muscular', faceShape: 'angular', skinColor: '#fde0be', hairColor: '#eebb44', eyeColor: '#111',
        hairStyle: 'buzz', clothing: { top: 'bare', bottom: 'trunks', extra: 'none' },
        topColor: '#111', bottomColor: '#ffffff', extraColor: '#ff0000',
        height: 81, muscleMass: 0.8, fatMass: 0.02, feminineCurve: 0, breastSize: 0, gluteSize: 0.4, hairLength: 1,
        gender: 'male', sigil: '#ff0000', archetype: 'technician', abilities: ['resiliency'], charisma: 195,
        moveset: { ...standardMoveset, finishers: [{ name: 'CROSS_RHODES', dmg: 82, kx: 8, ky: -50, time: 60, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'MAMY_DARKNESS',
        bio: "She has the power. You have the fear.",
        hometown: "Adelaide, Australia",
        bodyType: 'heavy', faceShape: 'sharp', skinColor: '#f2e1d7', hairColor: '#111', eyeColor: '#111',
        hairStyle: 'undercut', clothing: { top: 'vest', bottom: 'pants', extra: 'none' },
        topColor: '#111', bottomColor: '#111', extraColor: '#00ccff',
        height: 74, muscleMass: 0.9, fatMass: 0.05, feminineCurve: 0.8, breastSize: 0.5, gluteSize: 1.2, hairLength: 2,
        gender: 'female', sigil: '#00ccff', archetype: 'powerhouse', abilities: ['rage'], charisma: 190,
        moveset: { ...standardMoveset, finishers: [{ name: 'RIPTIDE', dmg: 92, kx: 3, ky: -140, time: 85, category: 'standing', animation: 'ultra' }] }
    },
    {
        name: 'THE TRIBAL CHIEF_X',
        bio: "Acknowledge the audit. The head of the table.",
        hometown: "Pensacola, FL",
        bodyType: 'muscular', faceShape: 'angular', skinColor: '#8d5524', hairColor: '#111', eyeColor: '#111',
        hairStyle: 'long_wet', clothing: { top: 'bare', bottom: 'pants', extra: 'none' },
        topColor: '#111', bottomColor: '#111', extraColor: '#ff0000',
        height: 86, muscleMass: 0.95, fatMass: 0.05, feminineCurve: 0, breastSize: 0, gluteSize: 0.6, hairLength: 7,
        gender: 'male', sigil: '#ff0000', archetype: 'powerhouse', abilities: ['armor'], charisma: 240,
        moveset: { ...standardMoveset, finishers: [{ name: 'SPEAR', dmg: 88, kx: 25, ky: -10, time: 40, category: 'standing', animation: 'ultra' }] }
    },
    // FFill with better logic
    ...Array.from({ length: 100 }).map((_, i) => {
        const isF = i % 2 === 0;
        const namePrefix = isF ? ['VALKYRIE', 'JADE', 'SIREN', 'NOVA', 'LUNA', 'VIXEN', 'MISTRESS', 'QUEEN'] : ['TITAN', 'COLOSSUS', 'GHOST', 'REAPER', 'WOLF', 'VIPER', 'HAWK', 'KRAKEN'];
        const nameSuffix = isF ? ['STORM', 'BLADE', 'SHADOW', 'HEART', 'ROSE', 'WAVE', 'FIRE', 'ZERO'] : ['STRIKE', 'BANE', 'FANG', 'CRUSH', 'SOUL', 'EDGE', 'BOLT', 'IRON'];
        return {
            name: `${namePrefix[i % namePrefix.length]}_${nameSuffix[Math.floor(i / namePrefix.length) % nameSuffix.length]}_${i}`,
            bio: "A procedural entry into the infinite audit. Destined for the core.",
            hometown: "Synthetic Sector " + (i % 9),
            bodyType: (isF ? 'feminine_athletic' : 'muscular') as BodyType,
            faceShape: (isF ? 'sharp' : 'square') as FaceShape,
            skinColor: SKIN_COLORS[i % SKIN_COLORS.length],
            hairColor: HAIR_COLORS[i % HAIR_COLORS.length],
            eyeColor: EYE_COLORS[i % EYE_COLORS.length],
            hairStyle: HAIR_STYLES[i % HAIR_STYLES.length],
            clothing: { top: (isF ? 'sports_bra' : 'bare') as any, bottom: (i % 3 === 0 ? 'pants' : 'trunks') as any, extra: 'none' as any },
            topColor: HAIR_COLORS[(i + 2) % HAIR_COLORS.length],
            bottomColor: SKIN_COLORS[(i + 4) % SKIN_COLORS.length],
            extraColor: '#ffffff',
            height: isF ? 65 + (i % 15) : 80 + (i % 20),
            muscleMass: 0.4 + (i % 6) / 10,
            fatMass: 0.05 + (i % 5) / 20,
            feminineCurve: isF ? 1.0 : 0,
            breastSize: isF ? 0.4 : 0,
            gluteSize: 0.5 + (i % 5) / 10,
            hairLength: isF ? 6 + (i % 6) : i % 5,
            gender: (isF ? 'female' : 'male') as any,
            sigil: HAIR_COLORS[i % HAIR_COLORS.length],
            archetype: ['brawler', 'high_flyer', 'technician', 'powerhouse'][i % 4] as any,
            abilities: ['resiliency'] as Ability[],
            charisma: 100 + (i % 100),
            moveset: standardMoveset
        };
    })
];

export function getRosterSuperstar(index: number): CharacterData {
    return ROSTER[index % ROSTER.length];
}
