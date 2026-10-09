# DESIGN DIRECTION — Wrestli6game-3

**Standing directive (owner, 2026-10-09). Recorded, not redesigned.**

## Where this game is headed

Wrestli6game-3 is developed toward the design DNA of four north stars,
blended in this order:

1. **Ultraviolence Pro Wrestling** (dev Adam / @Gackdaw) — deathmatch
   logistics, visceral hardcore wrestling. This is the top design target:
   the game's grit, weapon physics, and ultraviolence tone aim here.
2. **Steve Masson's Neckbreaker: Visceral Pro Wrestling** (Steam) —
   active ragdoll, overexertion/lift mechanics, physical selling. The
   game's body-feel targets come from here (its ragdoll and hit-reaction
   systems are the reference, not a copy).
3. **WWE 2K** — presentation and creation depth: the Creation Suite
   (wrestler/arena/title/show editors), attire slots, entrances, match
   flow, and superstar-profile chrome follow the WWE 2K playbook.
4. **MDickie-style games** — systemic wrestling simulation: deep
   movesets, career/universe-style modes, procedural roster depth,
   physics-first grappling. The MDickie formula is the simulation layer.

## Tech lineage

- **Bannon tech** is the engineering reference for this repo: the
  character customization suite (masks, gloves, wrist pads, shoes,
  hoods, chain pendant, face paint, hairstyles, eye colors) is aligned
  with the suite patterns built in AshLanev2/Bannon's lane, and future
  tooling ports pull from Bannon's tooling first.
- "Other-games tech" (AshLane, Brutal Fist, Concrete Dragon lanes) is
  shared where it fits: procedural accessory attach patterns,
  persistence conventions, live-zoomable preview patterns.

## Canon lock (binding)

- The game's fiction is the **original SOVEREIGN CORE multiverse**
  (THE CROWN SOVEREIGN, THE SPECTRAL REAPER, THE CROWN COUNCIL, APEX
  SYNDICATE, etc.). It is its own canon — **never** import characters,
  names, or factions from AshLane, Bannon, Brutal Fist, or any other
  game, and never invent new characters/names/factions on its behalf.
- Gender correctness is binding; skin-tone likeness is locked (the
  customizer never recolors skin).

## Out of scope for this wave

This doc is a record of direction, not a redesign ticket. Current wave
scope is the character-customizer suite alignment only.
