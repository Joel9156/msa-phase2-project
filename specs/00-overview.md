# Project Overview

## Project
Walking Tracker — a gamified walking/step-tracking web app built for MSA Phase 2 (Software Stream).

## Theme fit (Gamification)
Users log daily walking activity (distance, steps) and the app is designed to layer
gamification elements on top of that raw activity data: earned points per record,
progress tracking over time, and (planned) streaks/leaderboards/badges.

## Stack
- Backend: C# / .NET 10, EF Core 9 (SQLite), Scalar for API docs (not Swagger)
- Frontend: React + TypeScript (Vite), React Router

## Pivot note
The project started as a "climate action" walking app (see commit
`feat: setup SQLite and DB models for climate action walking app`) and was narrowed
to focus on the walking/points side rather than carbon-savings framing. The
`carbonSavedKg` field remains on `WalkingRecord` from that earlier design; whether to
keep it user-facing or drop it is an open decision (see `03-design-decisions.md`).

## Status tracking
See `04-todo.md` for the current task list against the assessment requirements.
