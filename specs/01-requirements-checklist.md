# MSA Phase 2 Requirements Checklist

Source: `2026 Phase 2 - Software Assessment.pdf`

## Basic requirements (all required — failing any = instant fail)

### Backend
- [x] C# with .NET 10+
- [x] EF Core
- [x] SQL persistence (SQLite)
- [x] Full CRUD (Create, Read, Update, Delete — manually verified via Scalar UI on 2026-07-13)
- [x] Git with regular commit history
- [ ] Unit tests covering key backend components
- [ ] Deployed backend
- [x] Scalar API docs (instead of Swagger)

### Frontend
- [x] React + TypeScript
- [ ] Visually appealing, responsive UI (currently unstyled placeholder)
- [x] Navigation via React Router
- [x] Git with regular commit history
- [ ] Deployed frontend
- [ ] Unit tests covering key frontend components

### README / repo
- [ ] README with deployment link, intro, theme explanation, standout features,
      advanced-features checklist, self-reflection
- [x] `/specs` folder with planning/AI-prompt `.md` files (this folder)

## Advanced requirements (pick >= 3, must be listed in README to be marked)

Not yet decided/implemented. Candidates given the gamification theme and current
stack:
- Security measures (>=2, e.g. data validation/sanitisation + rate limiting) —
  natural fit since the API currently accepts unvalidated POST bodies
- Theme switching (light/dark mode) — cheap, high visual payoff
- State management library (Zustand) — only worth it once the frontend has more
  than one piece of shared state (points, streaks, etc.)
- Caching / API optimization — possible once leaderboard/aggregate endpoints exist

Final selection should be locked in early and reflected here + README once decided,
since only the first 3 listed in the README get marked.

## Video (max 6 min)
- [ ] Part 1: how AI was used during development
- [ ] Part 2: design decisions made during the project
