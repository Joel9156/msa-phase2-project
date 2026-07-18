# Project Overview

## Project
Green Footprint — a gamified walking/step-tracking web app built for MSA Phase 2
(Software Stream). Originally scaffolded as "Walking Tracker"; renamed once the
app grew past a plain step counter into a points/streak/tier/quiz system with an
environmental-impact framing (see `03-design-decisions.md`).

## Theme fit (Gamification)
Users log daily steps, and the app layers gamification on top: points for hitting
a daily step goal, streaks for consecutive goal days, a daily environment quiz for
bonus points, and point-based tiers (each with its own character illustration,
Sprout Walker through Eco Guardian). A landing page explains the mechanics before
signup, and a dashboard widget translates cumulative steps into an illustrative
environmental-impact stat (distance walked, CO2 vs. driving, tree-equivalent).

## Stack
- Backend: C# / .NET 10, EF Core (SQLite), JWT auth, Scalar for API docs (not Swagger)
- Frontend: React + TypeScript (Vite), React Router, Mantine, Zustand

## Pivot note
The project started as a "climate action" walking app (see commit
`feat: setup SQLite and DB models for climate action walking app`) and was narrowed
to focus on steps/points rather than tracking distance/carbon directly — the
`DistanceKm`/`CarbonSavedKg` fields were later removed from `WalkingRecord` entirely
(every gamification rule is steps-based). The climate framing came back later as a
purely computed, display-only "impact" estimate rather than stored data.

## Status tracking
See `01-requirements-checklist.md` for the current status against the assessment's
basic/advanced requirements, and `02-ai-prompts.md` for the full development log.
