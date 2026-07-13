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
