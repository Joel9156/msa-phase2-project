# Design Decisions

## Open decisions (not yet made)

1. **`carbonSavedKg` field** — inherited from the original "climate action" framing.
   Options: (a) drop it from the model/UI now that the app is walking/points-focused,
   (b) keep it as a secondary stat since "steps → CO2 saved vs driving" is a decent
   gamification hook (bonus points for eco-friendly choices). Leaning (b) if time
   allows, else drop for scope control.
2. **Which 3 advanced requirements to commit to.** See
   `01-requirements-checklist.md` for candidates. Needs to be locked in before the
   README is written, since the README list is what gets marked.
3. **Points/streaks model** — how `earnedPoints` is calculated (flat per-record vs.
   scaled by distance/steps, streak bonuses) is not yet defined.

## Decisions made

- **Scalar over Swagger** for API docs — required by the assessment, package
  already wired up in `backend.csproj`.
- **SQLite over a hosted DB** for local dev — simplest path to satisfy "SQL
  persistence"; fine to swap for a hosted Postgres/SQL Server at deploy time if the
  chosen host doesn't support a SQLite file well (many don't, due to ephemeral
  filesystems).
- **Single-page frontend for now** (`WalkingBoard` as the only route) instead of
  keeping the old multi-page demo scaffold (`Leaderboard`/`About` pages) — those
  pages belonged to a generic MSA demo template, not this project, so they were
  removed rather than adapted.
