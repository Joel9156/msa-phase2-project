# Design Decisions

## Open decisions (not yet made)

1. **Which 3 advanced requirements to commit to.** See
   `01-requirements-checklist.md` for candidates. Needs to be locked in before the
   README is written, since the README list is what gets marked. Leaning toward
   password hashing + data validation (paired with real login, built after core
   features) as 2 of the 3, since the point/tier system needs real per-user
   identity integrity anyway.
2. **Exact point/streak/tier numbers** — starter values proposed (6,000+ steps/day
   = 10pt, streak and monthly bonuses, quiz = 15pt, 4-tier scheme ending in
   "환경 수호신"), not yet locked in as final.

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
- **Dropped `distanceKm`/`carbonSavedKg` from `WalkingRecord` entirely** (rather
  than auto-deriving them from steps) — every gamification rule in this project is
  steps-based, so tracking distance/carbon was redundant, unverified user input
  with no functional use. Removed via an EF Core migration
  (`RemoveDistanceAndCarbon`).
- **Real user accounts deferred until after core gamification features** — the
  current free-text `UserName` field on `WalkingRecord`/`UserProgress` (a "mock
  login" from the original scaffold) is treated as the identity key now, and real
  auth (register/login, hashed passwords) will be layered on top later without
  needing to rework the data model.
- **One `WalkingRecord` = one day's total steps** (not multiple records per day)
  — chosen for simplicity so daily-goal/streak logic only has to look at a single
  record's date rather than aggregating same-day records.
