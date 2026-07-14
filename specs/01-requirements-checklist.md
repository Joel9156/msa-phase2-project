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
- [x] Visually appealing UI (Mantine component library) — responsiveness not yet
      checked on mobile widths
- [x] Navigation via React Router
- [x] Git with regular commit history
- [ ] Deployed frontend
- [ ] Unit tests covering key frontend components

### README / repo
- [ ] README with deployment link, intro, theme explanation, standout features,
      advanced-features checklist, self-reflection
- [x] `/specs` folder with planning/AI-prompt `.md` files (this folder)

## Advanced requirements (pick >= 3, must be listed in README to be marked)

Target: 4 implemented (3 committed + 1 low-risk backup), since only the top 3
listed in the README get marked — see `03-design-decisions.md`.

- [x] Theme switching (light/dark mode) — Mantine `useMantineColorScheme`,
      toggle in the header
- [x] State management library (Zustand) — `frontend/src/store.ts` shares
      records/progress/token across `ProgressCard`/`QuizCard`/`RecordForm`/`RecordList`
- [x] Security measures (2): password hashing (`PasswordHasher<User>` in
      `AuthController`, JWT-based auth on all data endpoints) + data validation
      (username/password checks on register, per-record ownership checks on
      PUT/DELETE)
- [ ] (backup, not started) Caching / API optimization

## Video (max 6 min)
- [ ] Part 1: how AI was used during development
- [ ] Part 2: design decisions made during the project
