# Design Decisions

## Open decisions (not yet made)

1. **Which 3 advanced requirements to commit to.** See
   `01-requirements-checklist.md` for candidates. Needs to be locked in before the
   README is written, since the README list is what gets marked. Leaning toward
   password hashing + data validation (paired with real login, built after core
   features) as 2 of the 3, since the point/tier system needs real per-user
   identity integrity anyway.
2. **Monthly cumulative-steps bonus** — proposed but not designed or implemented;
   likely to be dropped for scope if time runs short before 2026-08-02, since it's
   an extra rule on top of this project's own gamification layer, not a basic
   requirement.

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
- **Point/streak/tier rules, locked in and implemented**:
  - 6,000+ steps in a day's record → +10 points; streak breaks to 0 on a
    missed-goal day, +30 bonus every 7-day streak milestone
  - Daily environment quiz, correct answer → +3 points (30% of the 10-point
    daily goal, not a flat value, so it scales if the base point value ever
    changes) — but only once the quiz has actually unlocked (see below)
  - Tiers by cumulative `TotalPoints` (computed, not stored):
    0–99 Sprout Walker, 100–299 Green Walker, 300–699 Earth Keeper, 700+ Eco
    Guardian
  - Inspired by Gyeonggi Province's real "기후행동 기회소득" program
    (8,000 steps/day for a cash-equivalent reward across 15-16 eco-activities,
    annual cap, converts to regional currency) — this project intentionally
    narrows scope to walking + quiz, lowers the step threshold to 6,000 for
    accessibility, and replaces cash conversion with a tier/badge system. The
    quiz and streak mechanics don't exist in the real program; they're this
    project's own addition.
- **Quiz eligibility keyed to the server's real current date, never to
  `WalkingRecord.Date`** — `GET /api/Quiz/today` only unlocks a question once a
  `WalkingRecord` exists for the exact real "today," and `LastQuizDate` (not the
  old `HasCompletedTodayQuiz` bool) tracks one attempt per real day. This means
  backfilling past days' walking data (useful for testing/catching up) can never
  be used to unlock or replay quizzes — the two features stay decoupled from
  each other by design.
