# NO-DATA-LOSS RULES (owner law — mhvnsnt)

Canonical copy: `mhvnsnt/agent-ops/docs/NO-DATA-LOSS-RULES.md`. Every repo carries a copy at `docs/NO-DATA-LOSS-RULES.md`.
These rules bind every agent (Grok Bot, Muse, Claude, Codex, Rocket, Dependabot owners, humans). They exist because work was lost before: history rewritten, files deleted or replaced, assets re-downloaded.

## 1. History is permanent
- NO `git push --force` / `--force-with-lease` / `+refspec`, on any branch that has ever been pushed.
- NO `git rebase`, `git commit --amend`, `git reset` (soft/mixed/hard) or squash of commits that are already pushed.
- NO `git reset --hard`, `git checkout -- .`, `git clean -fd`, `git stash drop/clear` on shared or someone else's work. Stash or commit to a `-wip` branch first.
- NO `git filter-repo`, `filter-branch`, BFG, or any history rewrite.
- NO branch or tag deletion (local-only scratch excepted) without explicit owner approval in chat. Merged PR branches are kept.
- To undo: `git revert` (a new commit), never rewrite.

## 2. Assets are never lost
- NO deleting or replacing an asset (GLB/FBX/PNG/audio/video/zip/any binary) unless a backup exists first:
  - large binary → SHA-256-verified Release asset in `mhvnsnt/box-storage` (release digest must equal local `sha256sum`), or
  - a pushed `backup/...` / `-wip` branch containing the file, verified with `git ls-tree`.
- Record the backup location + sha256 in WORKLOG before replacing.
- Replacements are additive where possible (new filename/version), old file kept until owner approves removal.

## 3. Feature branches and PRs only
- Never push directly to `main`/default branch. Branch → PR → merge.
- Merge `origin/main` INTO the feature branch to catch up (merge commit). Never rebase.
- MERGE RULE — a PR merges only when ALL hold:
  1. GitHub says MERGEABLE and mergeStateStatus CLEAN;
  2. CI is confirmed green (every latest workflow run = success);
  3. `git diff --diff-filter=D --name-only origin/main...HEAD` is EMPTY (or PR has owner label `approved-deletion`);
  4. `gitleaks detect` is clean;
  5. the build passes; nothing on main is broken.
- Red or conflicting PRs stay OPEN with a comment naming the blocker. Never close someone else's PR.

## 4. Push incremental work as it gets done
- Commit and push small, often. Nothing valuable lives only on the box.
- Before stopping: `git status` clean and `git log @{u}..` empty in every clone (0 dirty / 0 unpushed). Use `-wip` branches for unfinished work.

## 5. WORKLOG
- Every repo keeps `WORKLOG.md`. Log every change: date, agent, branch, what, why, source, backups made (with sha256).

## 6. Backup and verify before any disk cleanup
- Before deleting anything on disk: push it (branch or Release asset), then verify — `git ls-remote` / `git ls-tree` for code, release asset `digest == sha256:<local sha256sum>` for binaries.
- Only verified items may be removed from disk. Anything in doubt is backed up again, never deleted.
- See `agent-ops/docs/END-OF-SESSION-BACKUP.md` and `agent-ops/scripts/bk.sh`.

## 7. Never touch other agents' or Muse's work
- Do not reset, rebase, overwrite, close, or delete another agent's branches, PRs, worktrees, stashes or files. Claim work in `agent-ops/CLAIMS.md`; coordinate, don't clobber.

## 8. Secrets
- Never print or commit secrets (mask to 6 chars). gitleaks must be clean.

## Enforcement
- Branch ruleset on default branch: block force-push, block deletion, require PR (where plan allows).
- CI workflow `.github/workflows/no-deletion-guard.yml`: fails any PR that deletes files unless labelled `approved-deletion` (owner-only label).
