/**
 * SPDX-License-Identifier: Apache-2.0
 */

export type Gender = 'male' | 'female';
export type BodyType = 'athletic' | 'muscular' | 'heavy' | 'slim' | 'feminine_athletic' | 'feminine_curvy' | 'lean' | 'stocky' | 'amazon' | 'curvy' | 'stocky';
export type FaceShape = 'sharp' | 'round' | 'square' | 'oval' | 'heart' | 'angular' | 'soft';
export type AttackType = 'light' | 'heavy' | 'special' | 'ultra' | 'grapple' | 'taunt' | 'whip';
export type FighterState = 'idle' | 'walk' | 'running' | 'jump' | 'attack' | 'hurt' | 'dead' | 'ragdoll' | 'stunned' | 'grounded' | 'seated' | 'kneeling' | 'corner_seated' | 'on_turnbuckle' | 'on_turnbuckle_middle' | 'tree_of_woe' | 'grappled' | 'being_grappled' | 'carrying' | 'held' | 'submitted' | 'taunting' | 'stagger' | 'victory' | 'climbing_ladder' | 'climbing_cage' | 'reaching' | 'hanging' | 'entrance' | 'cutscene';

export interface ArenaObject {
  id: string;
  type: Weapons;
  x: number;
  y: number;
  z: number;
  rot: number;
  vx: number;
  vy: number;
  rv: number;
  hp: number;
  maxHp: number;
  ownerId?: string;
  isBroken?: boolean;
}

export interface ClothingData {
  top: string;
  bottom: string;
  extra: string;
  mask?: string;
  facepaint?: string;
  makeup?: string;
  elbowPadL?: string;
  elbowPadR?: string;
  kneePadL?: string;
  kneePadR?: string;
  wristbandL?: string;
  wristbandR?: string;
  gloveL?: string;
  gloveR?: string;
  socks?: string;
  boots?: string;
  kickpads?: string;
  fingerTapeL?: string;
  fingerTapeR?: string;
  fingernailColor?: string;
  hairColor2?: string;
  hairBlend?: number;
}

export interface BodyProportions {
  headSize: number;
  neckLength: number;
  shoulderWidth: number;
  armLength: number;
  armThickness: number;
  handSize: number;
  torsoLength: number;
  waistWidth: number;
  chestSize: number;
  hipWidth: number;
  legLength: number;
  legThickness: number;
  footSize: number;
  muscleMass: number;
}

export type Weapons = 'none' | 'katana' | 'mace' | 'staff' | 'brass_knuckles' | 'chair' | 'kendo_stick' | 'sledgehammer' | 'ladder' | 'table' | 'garbage_can' | 'steel_steps' | 'kendo' | 'glass_tube' | 'stop_sign' | 'trash_can';

export interface MoveStage {
  time: number;
  p1Pos: { x: number, y: number, rot: number };
  p2Pos: { x: number, y: number, rot: number };
  p1Anim?: string;
  p2Anim?: string;
  sound?: string;
  allowReverse?: boolean;
}

export interface Move {
  name: string;
  dmg: number;
  kx: number;
  ky: number;
  time: number;
  category: 'standing' | 'ground' | 'corner' | 'running' | 'apron' | 'diving' | 'back' | 'top_rope';
  animation: string;
  isHold?: boolean;
  stages?: MoveStage[];
  limbTarget?: 'head' | 'body' | 'arms' | 'legs';
  isSubmission?: boolean;
}

export interface BodyDamage {
  head: number;
  body: number;
  arms: number;
  legs: number;
}

export interface Moveset {
  // Standing
  light: Move[];          // Neutral, Up, Down, Left, Right (5)
  heavy: Move[];          // Neutral, Up, Down, Left, Right (5)
  grapples: Move[];       // Neutral L/H, Up L/H, Down L/H, Left L/H, Right L/H (10)
  backGrapples: Move[];   // Neutral, Up, Down, Side (4-8)
  
  // Ground
  groundHead: Move[];     // Over head L/H/G (3-6)
  groundSide: Move[];     // Side L/H/G (3-6)
  groundFeet: Move[];     // Over feet L/H/G (3-6)
  groundSeated: Move[];   // Opponent seated
  groundKneeling: Move[]; // Opponent kneeling
  
  // Corner
  cornerFront: Move[];
  cornerBack: Move[];
  cornerSeated: Move[];
  topRopeFrontSeated: Move[];
  topRopeBackSeated: Move[];
  treeOfWoe: Move[];
  
  // Ropes
  ropeLeaning: Move[];
  ropeTied: Move[];
  ropeMiddle: Move[];     // 619 position
  
  // Apron
  apronInsideToOutside: Move[];
  apronOutsideToInside: Move[];
  apronToApron: Move[];
  apronToFloor: Move[];
  apronSpringboardStanding: Move[];
  apronSpringboardGround: Move[];
  
  // Aerial
  divingStanding: Move[];
  divingGround: Move[];
  springboardStanding: Move[];
  springboardGround: Move[];
  springboardOutside: Move[];
  
  // Momentum
  runningStrike: Move[];
  runningHeavy: Move[];
  runningGrapple: Move[];
  runningGroundStrike: Move[];
  irishWhipRebound: Move[];
  reboundStrike: Move[];
  reboundHeavy: Move[];
  reboundGrapple: Move[];
  pullBack: Move[];
  
  // Special
  signatures: Move[];
  finishers: Move[];
  paybacks: string[];     // IDs of abilities
  comebacks: Move[];
  
  // Expression
  taunts: {
    standing: Move[];     // 4 directions * 2 (with/without R)
    corner: Move[];
    apron: Move[];
    ground: Move[];
  };
  
  combos: string[][];     // String sequences of 'L' or 'H'
}

export interface EntranceData {
  music: string;
  lighting: string;
  taunt: string;
}

export interface Team {
  id: string;
  name: string;
  members: string[]; // Character Names
  sigil: string;
  bio: string;
  allies: string[];
  rivals: string[];
}

export interface CharacterData {
  id?: number; 
  name: string;
  bodyType: BodyType;
  faceShape: FaceShape;
  skinColor: string;
  hairColor: string;
  eyeColor: string;
  hairStyle: string;
  clothing: ClothingData;
  topColor: string;
  bottomColor: string;
  extraColor: string;
  height: number;
  muscleMass: number;
  fatMass: number;
  overall?: number;
  stats?: {
    strength: number;
    agility: number;
    technique: number;
  };
  signatures?: string[];
  finishers?: string[];
  paybacks?: string[];
  feminineCurve: number;
  breastSize: number;
  gluteSize: number;
  hairLength: number;
  gender: Gender;
  sigil: string;
  weaponType?: Weapons;
  archetype: Archetype;
  abilities: Ability[];
  manager?: ManagerType;
  attireSlot?: number;
  charisma: number;
  moveset: Moveset;
  entrance?: EntranceData;
  proportions?: BodyProportions;
  spirit?: number; 
  yaw?: number;
  tilt?: number;
  zoom?: number;
  teethStyle?: string;
  teethColor?: string;
  isEntranceMode?: boolean;

  // New Lore & Social Fields
  bio?: string;
  backstory?: string;
  record?: { wins: number; losses: number };
  allies?: string[];
  rivals?: string[];
  teamId?: string;
  nationality?: string;
  hometown?: string;
  sweatLevel?: number;
  hp?: number;
  stamina?: number;

  // Visual Layers
  scars?: string[];
  tattoos?: string[];
  facialHairStyle?: string;
  facialHairColor?: string;
  browStyle?: string;
  
  alternateAttires?: { 
    clothing: ClothingData; 
    topColor: string; 
    bottomColor: string; 
    extraColor: string; 
    faceColor1?: string;
    faceColor2?: string;
  }[];
  faceColor1?: string;
  faceColor2?: string;
}

export type Archetype = 'brawler' | 'grappler' | 'mage' | 'hybrid' | 'high_flyer' | 'powerhouse' | 'technician' | 'striker';

export type Ability = 'regen' | 'power_strike' | 'speed_burst' | 'armor' | 'vampire' | 'resiliency' | 'rage' | 'shield' | 'speed_boost' | 'lifesteal' | 'poison' | 'burn' | 'poison_mist' | 'teleport' | 'shock_strike' | 'charisma';
export type ManagerType = 'none' | 'advisor' | 'enforcer' | 'healer';

export interface WeaponObject {
  id: string;
  type: Weapons;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  rotation: number;
  rv: number;
  onGround: boolean;
  durability: number;
  maxDurability: number;
  w?: number;
  h?: number;
  isBroken?: boolean;
}

export interface GameOptions {
  difficulty: 'easy' | 'normal' | 'hard' | 'legend';
  aiSliders: {
    aggression: number;
    reversalRate: number;
    strikePower: number;
    grapplePower: number;
  };
  bloodEnabled: boolean;
  entrancesEnabled: boolean;
  replaysEnabled: boolean;
  interference: 'off' | 'low' | 'high';
}

export interface ArenaData {
  id: string;
  name: string;
  lighting: string;
  ringColor: string;
  apronColor: string;
  matColor: string;
  floorColor: string;
  barricadeColor: string;
  showBackstage: boolean;
  type: 'stadium' | 'gym' | 'backstage' | 'backyard';
}

export interface MatchSettings {
  category: string;
  type: string;
  arenaId: string;
  championship?: string;
  options: GameOptions;
}

export interface GameState {
  p1: CharacterData;
  p2: CharacterData;
  p1CPU: boolean;
  p2CPU: boolean;
  championship: string | undefined;
  arena?: ArenaData;
  p1Damage: BodyDamage;
  p2Damage: BodyDamage;
  pinProgress: number; 
  subProgress: number;
  matchMode: 'exhibition' | 'story' | 'online';
  matchPhase: 'intro' | 'entrance' | 'fight' | 'victory' | 'report';
  matchType?: string;
  matchCategory?: string;
  timer: number;
  isGameOver: boolean;
  winnerName: null | string;
  currentScreen: 'intro' | 'title' | 'menu' | 'fight' | 'customization' | 'selection' | 'match_selection' | 'arena_selection' | 'creation' | 'tournament' | 'arena' | 'select' | 'career' | 'gm' | 'universe' | 'faction' | 'loading' | 'promo' | 'cutscene';
  stats: {
    p1: { strikes: number; momentum: number; hp: number };
    p2: { strikes: number; momentum: number; hp: number };
  };
}

export const SKIN_COLORS = ['#fde0be', '#f5c49a', '#e8a87c', '#c8845a', '#a06040', '#7a4030', '#3c1f10'];
export const HAIR_COLORS = ['#111111', '#2a1a0a', '#5a3010', '#8b4513', '#c8a050', '#e8d080', '#e8e0d0', '#ff2244', '#4488ff', '#22cc88', '#cc44ff', '#ff8822'];
export const EYE_COLORS = ['#3a7acc', '#2a9a55', '#884422', '#cc9922', '#aa44cc', '#ff2244', '#888899'];
export const CLOTH_COLORS = ['#111111', '#1a1a2a', '#2a0a10', '#0a102a', '#661122', '#aa3300', '#004488', '#228844', '#885500', '#ffffff', '#e8d5a0', '#660066'];

export const HAIR_STYLES = ['short_back', 'mohawk', 'long_straight', 'braid', 'spiky', 'afro', 'bun', 'ponytail', 'undercut', 'wild'];
export const BODY_TYPES: BodyType[] = ['athletic', 'muscular', 'heavy', 'slim', 'feminine_athletic', 'feminine_curvy', 'lean'];
export const FACE_SHAPES: FaceShape[] = ['sharp', 'round', 'square', 'oval', 'heart', 'angular'];

export const CLOTHING_OPTIONS = {
  tops: ['bare', 'tank', 'tshirt', 'gi', 'armor', 'robe', 'bodysuit', 'jacket', 'hoodie', 'crop_top'],
  bottoms: ['shorts', 'pants', 'gi_pants', 'armored', 'skirt', 'robe_bottom', 'leggings', 'trunks', 'tights'],
  extras: ['none', 'belt', 'sash', 'armor_chest', 'cloak', 'cape', 'elbow_pads', 'knee_pads', 'hand_wraps', 'wristbands'],
  facepaints: ['none', 'sting', 'warrior', 'crow', 'venom', 'skull', 'kabuki', 'ghoul', 'samoan']
};

export function getDefaultCharData(id: number): CharacterData {
  const presets: Record<number, CharacterData> = {
    0: {
      name: 'DEATHRAZE',
      bodyType: 'muscular',
      faceShape: 'sharp',
      skinColor: '#2a1a0a',
      hairColor: '#111111',
      eyeColor: '#ff2244',
      hairStyle: 'undercut',
      clothing: { top: 'gi', bottom: 'pants', extra: 'sash' },
      topColor: '#1a0a18',
      bottomColor: '#111111',
      extraColor: '#aa0022',
      height: 88,
      muscleMass: 0.9,
      fatMass: 0.2,
      feminineCurve: 0,
      breastSize: 0,
      gluteSize: 0.3,
      hairLength: 3,
      gender: 'male',
      sigil: '#ff2244',
      weaponType: 'none',
      archetype: 'brawler',
      abilities: ['power_strike'],
      manager: 'none',
      attireSlot: 1,
      charisma: 85,
      bio: "A relentless force of nature. Known for his brutal efficiency and dark presence.",
      backstory: "Rising from the concrete pits of the underground, he seeks total dominance.",
      record: { wins: 42, losses: 7 },
      allies: ['IHADURCA'],
      rivals: ['MERC MERC'],
      hometown: "The Abyss",
      facialHairStyle: 'beard',
      scars: ['eye_slash'],
      tattoos: ['arm_sleeve'],
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
        }
      },
    1: {
      name: 'IHADURCA',
      bodyType: 'feminine_curvy',
      faceShape: 'oval',
      skinColor: '#e8c0a0',
      hairColor: '#c8a050',
      eyeColor: '#4488ff',
      hairStyle: 'long_straight',
      clothing: { top: 'bodysuit', bottom: 'leggings', extra: 'belt' },
      topColor: '#0a0a2a',
      bottomColor: '#110a22',
      extraColor: '#4488ff',
      height: 82,
      muscleMass: 0.5,
      fatMass: 0.35,
      feminineCurve: 1,
      breastSize: 0.75,
      gluteSize: 0.8,
      hairLength: 9,
      gender: 'female',
      sigil: '#4488ff',
      weaponType: 'katana',
      archetype: 'mage',
      abilities: ['vampire'],
      manager: 'healer',
      attireSlot: 1,
        charisma: 95,
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
        }
      }
  };
  return JSON.parse(JSON.stringify(presets[id] || presets[0]));
}
