/**
 * SPDX-License-Identifier: Apache-2.0
 *
 * customizerPersistence.ts — save/load the player's custom builds.
 *
 * Ported from the AshLane customizer's persistence module (the suite's
 * persistence pattern): a versioned envelope { schemaVersion, updatedAt, data }
 * with forward-only migrations, a backup of the previous store, and
 * localStorage as the backend. Builds are keyed by fighter name (the game's
 * stable character id). One slot per fighter; saving is per-build and never
 * touches match or roster state.
 */

import type { CharacterData } from '../types';

const SCHEMA_VERSION = 1;
const STORE_KEY = 'wrestli6:customizer:builds';
const BACKUP_KEY = 'wrestli6:customizer:builds:backup';

interface Envelope {
  schemaVersion: number;
  updatedAt: number;
  data: Record<string, CharacterData>;
}

type Migration = (data: Record<string, CharacterData>) => Record<string, CharacterData>;

/** Forward-only. Add a new entry (never edit old ones) when the schema changes. */
const MIGRATIONS: Record<number, Migration> = {
  // v1 is the first schema — no migrations yet.
};

function migrate(envelope: Envelope): Envelope {
  if (envelope.schemaVersion > SCHEMA_VERSION) {
    throw new Error(
      `Customizer builds are from a newer game version (v${envelope.schemaVersion} > v${SCHEMA_VERSION})`,
    );
  }
  let { schemaVersion, data } = envelope;
  let d = data;
  while (schemaVersion < SCHEMA_VERSION) {
    const step = MIGRATIONS[schemaVersion];
    if (!step) throw new Error(`No migration path from customizer builds v${schemaVersion}`);
    d = step(d);
    schemaVersion++;
  }
  return { ...envelope, schemaVersion, data: d };
}

function sanitize(raw: unknown): Record<string, CharacterData> {
  if (!raw || typeof raw !== 'object') return {};
  const out: Record<string, CharacterData> = {};
  for (const [name, b] of Object.entries(raw as Record<string, unknown>)) {
    if (!b || typeof b !== 'object') continue;
    const bb = b as Partial<CharacterData>;
    if (!bb.name || typeof bb.name !== 'string') continue;
    // Older/partial saves merge over the stored copy as-is; the Customizer
    // re-validates fields when it loads. structuredClone-free deep copy:
    out[name] = JSON.parse(JSON.stringify(b)) as CharacterData;
  }
  return out;
}

function readEnvelope(): Envelope | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Envelope;
    if (typeof parsed.schemaVersion !== 'number' || !parsed.data) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Load every saved build, keyed by fighter name. Never throws. */
export function loadAllBuilds(): Record<string, CharacterData> {
  try {
    const env = readEnvelope();
    if (!env) return {};
    const migrated = migrate(structuredClone(env));
    if (migrated.schemaVersion !== env.schemaVersion) {
      localStorage.setItem(STORE_KEY, JSON.stringify(migrated));
    }
    return sanitize(migrated.data);
  } catch (e) {
    console.error('Customizer builds unreadable:', e);
    return {};
  }
}

/** Load the saved build for one fighter, or null when never saved. */
export function loadBuild(fighterName: string): CharacterData | null {
  const all = loadAllBuilds();
  return all[fighterName] ?? null;
}

/** Save (or overwrite) the build for one fighter. Keeps the previous store as backup. */
export function saveBuild(build: CharacterData): void {
  const all = loadAllBuilds();
  all[build.name] = JSON.parse(JSON.stringify(build)) as CharacterData;
  const envelope: Envelope = {
    schemaVersion: SCHEMA_VERSION,
    updatedAt: Date.now(),
    data: all,
  };
  const prev = localStorage.getItem(STORE_KEY);
  if (prev) {
    try {
      localStorage.setItem(BACKUP_KEY, prev);
    } catch {
      /* quota — keep going without a backup */
    }
  }
  localStorage.setItem(STORE_KEY, JSON.stringify(envelope));
}

/** Delete the saved build for one fighter (revert to authored). */
export function deleteBuild(fighterName: string): void {
  const all = loadAllBuilds();
  if (!(fighterName in all)) return;
  delete all[fighterName];
  const envelope: Envelope = {
    schemaVersion: SCHEMA_VERSION,
    updatedAt: Date.now(),
    data: all,
  };
  const prev = localStorage.getItem(STORE_KEY);
  if (prev) {
    try {
      localStorage.setItem(BACKUP_KEY, prev);
    } catch {
      /* quota — keep going without a backup */
    }
  }
  localStorage.setItem(STORE_KEY, JSON.stringify(envelope));
}

/** Export all builds as a downloadable JSON file (offline backup / transfer). */
export function exportBuildsFile(builds: Record<string, CharacterData>): void {
  const blob = new Blob([JSON.stringify({ exportedAt: Date.now(), builds }, null, 2)], {
    type: 'application/json',
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `wrestli6-customizer-builds-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}
