# HANDOFF — Wrestli6game-3

**Last updated: 2026-11-22 (America/New_York).**
**Repo:** `mhvnsnt/Wrestli6game-3` (PUBLIC), default branch `main`.
**Purpose of this file:** any agent that picks up work here reads this FIRST, then the linked docs. It states what we've done, where we're at, and what we're working toward — so the owner can say "go to this repo, pick up the work" and you just know. Update this file in the same PR whenever the state changes (add, don't delete).

## 1. What this repo is

"Sovereign Striker" — a web game/app built from a Google AI Studio starter (Vite + TypeScript, `package.json`, `src/`, `index.html`). The repo description is "Sovereign Striker" and the README is still the AI Studio boilerplate ("Run and deploy your AI Studio app", app link `https://ai.studio/apps/7cf3a75a-5c9c-46e2-9d33-eb197fbbfddf`).

It is a small (380 KB) early-stage web build: app scaffold, `AGENTS.md`, `WORKING-METHOD.md`, a `docs/` folder. What "Sovereign Striker" is as a game — beyond the name — is NOT written down in the repo state read 2026-11-22; the README still describes the starter template, not the game. Any agent picking this up should treat the game design as unclear until the owner or the `docs/` folder says otherwise.

## 2. Where we're at

### DONE
- **Scaffold landed:** Vite + TypeScript app structure (`src/`, `index.html`, `vite.config.ts`, `tsconfig.json`, `package.json`, `metadata.json`), plus `AGENTS.md` and `WORKING-METHOD.md`.
- **Docs rules merged (2026-11-19–21):** PR #7 — sourcing rule (merged 2026-11-19); PR #8 — pre-made parts first rule (merged 2026-11-21). Unlike the teardown repos, where the same two rule PRs are still open, here they are MERGED.
- **Last push 2026-11-21 11:29 UTC** (the PR #8 merge).

### IN PROGRESS
- **No open PRs and no recorded in-progress work as of 2026-11-22.** The repo state shows no open pull requests and no releases. What the next build step is — gameplay, art, or design — is not recorded in the repo.
- **README still boilerplate.** It describes the AI Studio starter, not Sovereign Striker. Rewriting it to say what the game is would be a real pickup step, but only once the game is defined.

### BLOCKED
- **Game definition unclear — stated plainly, not guessed.** The repo does not say what Sovereign Striker plays like, what its goal is, or what the next feature is. That is the open question (see §6), not a technical block. Nothing in the repo state names a technical blocker.

## 3. What we're working toward

**The goal (as far as the repo states it):** ship "Sovereign Striker" as a playable web game from this scaffold.

**The bar (owner, general):** REAL-SOURCE-ONLY — real parts, wired in, no hand-tooled lookalikes; the work proves itself in a live playable build the owner can open on his phone, never a text-only "done". Until the game is defined, there is no specific bar for this repo beyond that.

**In order:** (1) get the owner to define what Sovereign Striker is and what the first playable slice is; (2) build that slice in player-progression order; (3) replace the boilerplate README with the real game description once it exists.

## 4. Standing rules that apply here

- **Branch → PR → merge, always.** Never push to main directly. Add-only, zero-conflict PRs, no force pushes.
- **Checkpoint-and-save law:** CHECKPOINT.md first, update after every step; the repo is the save; resume, never restart.
- **No-temp-storage law:** nothing in /tmp or any wipeable location, ever. Everything goes straight into the repo or a durable folder the second it exists.
- **Real-source-only:** every part comes from the actual source code and files, wired up fully. No hand-tooled lookalikes, no fake panels.
- **No-gaps / solve-it law:** a gap or block is never the end of the work — route-switch until it's done or every reasonable route is exhausted with exact errors recorded.
- **Never kill in-progress work.** Never delete another lane's work without the standing verification rules.
- **Phone-only:** the owner works from his phone — anything built here must be openable and playable from a phone link, no manual setup steps for him.

## 5. Key files and paths

| What | Where |
|---|---|
| App entry | `index.html`, `src/` |
| Build config | `vite.config.ts`, `tsconfig.json`, `package.json` |
| App metadata | `metadata.json` |
| Agent notes / working method | `AGENTS.md`, `WORKING-METHOD.md` |
| Docs (incl. merged rules) | `docs/` |
| AI Studio app link | https://ai.studio/apps/7cf3a75a-5c9c-46e2-9d33-eb197fbbfddf |
| Env example | `.env.example` |
| Merged PRs | #7 (sourcing rule), #8 (pre-made parts first rule) |

There are no releases and no open PRs in this repo. The README is AI Studio boilerplate, not a game description.

## 6. Open decisions needing the owner

- **What IS Sovereign Striker?** The name is the only game fact in the repo. What it plays like, what the first playable slice is, and what comes first — all his call. A lane cannot invent the game design.
- **README rewrite:** once the game is defined, the boilerplate README should say what the game is. That follows the design decision, it doesn't come before it.
- **No other owner decision is recorded as open in this repo's state.**

## 7. How to pick up

1. Read this HANDOFF.md first, then `AGENTS.md`, `WORKING-METHOD.md`, and `docs/` — then the README, knowing it is still boilerplate.
2. Do NOT invent a game design for Sovereign Striker. If the design is still undefined, the next step is asking the owner (through the parent agent), not building a guessed game.
3. If a design lands, build the first playable slice in player-progression order, branch → PR → merge, and stage it so it opens on his phone.
4. Resume from the stated next step — never restart, never re-derive finished work.
5. Land work branch → PR → merge, add-only. Update this HANDOFF.md in the same PR when the state changes. Verify with your own eyes (live playable build) before claiming anything done.
