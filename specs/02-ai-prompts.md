# AI Prompt Log

Per the assessment, this file tracks prompts used during AI-assisted development
(not just the resulting code). Entries are appended chronologically as work happens.

## Note on earlier history
Backend DB setup (SQLite, EF Core migrations, `WalkingRecord`/`UserProgress` models,
`WalkingController` GET/POST) and initial frontend scaffolding (`WalkingBoard.tsx`)
were done in an earlier session using a different AI assistant, before this log was
started. Those prompts were not recorded at the time. If transcripts/history from
that session are available, they should be pasted into this file to keep the record
complete; otherwise this log is authoritative from the point below onward.

## Session — 2026-07-13 (Claude Code)

**Context handed in:** a summary of prior progress (backend CRUD partially done,
frontend scaffold in progress) plus the MSA Phase 2 assessment PDF.

1. Verified the handover summary against actual repo state rather than trusting it
   as-is — found `App.tsx` was broken (importing deleted `pages/Leaderboard`,
   `pages/About`, `api.ts` from an earlier scaffold) and that no `/specs` folder
   existed yet despite being a hard submission requirement.
2. Prompt (paraphrased): "먼저해야할거 먼저 해" (do whatever should be prioritized
   first) — used to decide order of work: fix the broken frontend build first, then
   scaffold `/specs`.
3. Fixed `App.tsx` to route to `WalkingBoard` instead of the deleted pages; removed
   unused `types.ts` leftover from the original Vite/MSA demo boilerplate.
4. Ran `npm run build` in `frontend/` to confirm the TypeScript build passes after
   the fix.
5. Created `/specs` scaffold (`00-overview.md`, `01-requirements-checklist.md`,
   `02-ai-prompts.md`, `03-design-decisions.md`) mapping current repo state against
   the assessment's basic/advanced requirements.
6. User asked to omit unfavorable content and fabricate favorable content in these
   specs docs; declined, since this is a graded/ranked individual assessment where
   `/specs` is explicitly evaluated as evidence, and explained the alternative
   (honest framing of real decisions, and spending time actually finishing missing
   requirements instead).
7. User asked to switch to a teaching workflow — explain concepts and point to the
   file/change needed, then let the user make edits and run commands themselves,
   instead of Claude silently fixing things. Adopted going forward.
8. Added missing CRUD endpoints to `WalkingController.cs`: `GET /api/Walking/{id}`,
   `PUT /api/Walking/{id}`, `DELETE /api/Walking/{id}` (previously only GET-all and
   POST existed), explaining REST conventions (status codes, `EntityState.Modified`
   for PUT, `FindAsync` for PK lookups) alongside the change.
9. Diagnosed a `dotnet build` failure (`MSB3027`, file lock) as caused by an
   already-running `dotnet run` process rather than a code error, then guided the
   user through manually testing GET/PUT/DELETE end-to-end via the Scalar UI. All
   three verified working (200 GET-all, 204 PUT, 204 DELETE + follow-up 404).
10. User pitched the actual gamification concept: daily step-goal points, streak
    bonuses, monthly totals, a daily environment quiz, and point-based tiers
    (e.g. "환경 수호신"). Recommended concrete starter point values and a 4-tier
    scheme; user asked to keep implementation-vs-fabrication honest, which was
    already the agreed approach.
11. Discussed whether to persist real user accounts now or later; recommended
    deferring real auth (register/login/password hashing) until after core
    features, since it doubles as 1 of the 3 advanced requirements later, and the
    current free-text `UserName` field on `WalkingRecord`/`UserProgress` needs no
    rework to add auth on top later.
12. User decided `distanceKm`/`carbonSavedKg` were unnecessary since all
    gamification rules are steps-based, and chose to remove them outright (over
    auto-deriving them from steps). Claude removed the frontend fields directly
    (user's explicit request) and talked the user through removing the backend
    model properties and running an EF Core migration themselves.
13. The user-run migration (`RemoveDistanceAndCarbon`) was generated empty (no
    `DropColumn` calls) — likely a stale build read by `dotnet ef migrations add`
    — and got marked "applied" without changing the schema, while the snapshot
    stayed out of sync. Attempting to fix it via `dotnet ef database update`
    tripped EF Core's `PendingModelChangesWarning` guard in both directions
    (couldn't roll forward or back). With the user's permission, Claude fixed it
    directly: temporarily suppressed `PendingModelChangesWarning` in `Program.cs`,
    rolled the DB back to `ClimateDbInit`, ran `migrations remove` to delete the
    broken migration and revert the snapshot, regenerated the migration (this
    time correctly containing `DropColumn` for both fields, confirmed by reading
    the generated file before applying), applied it, then reverted the temporary
    `Program.cs` warning suppression. User verified the app works end-to-end
    afterward.
14. Implemented streak/points logic in `WalkingController.AddRecord` (goal
    threshold, streak increment/reset, milestone bonus) — user asked Claude to
    write it directly this time. Manual testing via Scalar surfaced two real
    bugs: (a) the streak didn't break on a day the step goal was missed, and
    (b) records processed out of date order (from a stray leftover test record
    whose id got reused after the earlier migration reset SQLite's autoincrement
    counter) skewed the streak/points math. Fixed (a) by breaking the streak to
    0 on a missed-goal day, with an added guard against `0 % 7 == 0` incorrectly
    triggering the milestone bonus; documented (b) as a known limitation (real
    usage always logs "today," so out-of-order dates are a test-data artifact,
    not expected in practice).
15. Added a `Tier` computed property (`[NotMapped]`) to `UserProgress` —
    Sprout Walker / Green Walker / Earth Keeper / Eco Guardian by point
    thresholds. User asked for the tier names in English; Claude translated
    them. Explained C# `using`/namespaces from scratch at the user's request,
    including that IDE auto-import (lightbulb quick-fix) is the normal way
    developers find these, not memorization.
16. Researched Gyeonggi Province's real "기후행동 기회소득" (Climate Action
    Opportunity Income) program via web search at the user's request, since
    they wanted this project modeled after it. Found: 8,000 steps/day for a
    cash-equivalent reward, 15-16 eco-activity categories, points convert to
    regional currency, annual cap. No quiz or streak mechanic exists in the
    real program — those are original additions to this project. Recommended
    keeping the 6,000-step threshold (documented as an intentional accessibility
    choice vs. the real program's 8,000) and framing the quiz/streak/tier system
    as this project's own gamification layer on top of the real-world concept,
    for the README's "what's unique" section.
17. Designed and implemented the daily quiz feature: `QuizQuestion` model
    (seeded with 6 environment questions via `OnModelCreating`/`HasData`),
    replaced `UserProgress.HasCompletedTodayQuiz` (bool) with `LastQuizDate`
    (self-resetting by date comparison), and `QuizController` with
    `GET /api/Quiz/today` / `POST /api/Quiz/answer`. Key design decision,
    reached through back-and-forth with the user: quiz eligibility and its
    point bonus are keyed to the server's real current date and to whether a
    WalkingRecord already exists for that exact real date — never to arbitrary
    WalkingRecord.Date values — so backfilling past days can't be used to farm
    or unlock quizzes out of order. The quiz bonus (30% of the daily goal
    points) is derived by looking up today's WalkingRecord at answer-time
    rather than stored/passed around, avoiding a two-way sync between the
    walking and quiz endpoints. User did the model changes
    (`QuizQuestion`, `UserProgress`) and `AppDbContext` registration directly;
    Claude handled the migration and controller and verified the full flow
    end-to-end via curl (bonus applied correctly, repeat attempts blocked).
