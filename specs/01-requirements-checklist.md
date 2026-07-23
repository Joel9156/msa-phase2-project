# MSA Phase 2 Requirements Checklist

Source: `2026 Phase 2 - Software Assessment.pdf`

## Basic requirements (all required — failing any = instant fail)

### Backend
- [x] C# with .NET 10+
- [x] EF Core
- [x] SQL persistence (SQLite)
- [x] Full CRUD (Create, Read, Update, Delete — manually verified via Scalar UI on 2026-07-13)
- [x] Git with regular commit history
- [x] Unit tests covering key backend components — `backend.Tests` (xUnit):
      tier boundaries, password hashing, gamification rules (EF Core InMemory)
- [x] Deployed backend — Azure App Service (F1 free tier),
      https://walking-tracker-msa2026.azurewebsites.net
- [x] Scalar API docs (instead of Swagger)

### Frontend
- [x] React + TypeScript
- [x] Visually appealing UI (Mantine component library) — mobile header
      overflow bug found and fixed 2026-07-21 (flex-wrap + min-height)
- [x] Navigation via React Router
- [x] Git with regular commit history
- [x] Deployed frontend — Azure Static Web Apps,
      https://agreeable-hill-0bb9bab00.7.azurestaticapps.net
- [x] Unit tests covering key frontend components — Vitest + React Testing
      Library: `decodeDisplayName` JWT parsing, `ImpactCard` rendering

### README / repo
- [x] README with deployment link, intro, theme explanation, standout features,
      advanced-features checklist, self-reflection
- [x] `/specs` folder with planning/AI-prompt `.md` files (this folder)

## Advanced requirements (pick >= 3, must be listed in README to be marked)

5 implemented; only the top 3 listed in the README are submitted for
marking (Security measures, State management, Caching). Theme switching and
Docker are also implemented and mentioned in the README, but not counted
toward marking — see `03-design-decisions.md`.

- [x] Theme switching (light/dark mode) — Mantine `useMantineColorScheme`,
      toggle in the header (not one of the top 3 marked)
- [x] State management library (Zustand) — `frontend/src/store.ts` shares
      records/progress/token across `ProgressCard`/`QuizCard`/`RecordForm`/`RecordList`
- [x] Security measures (2): password hashing (`PasswordHasher<User>` in
      `AuthController`, JWT-based auth on all data endpoints) + data validation
      (username/password checks on register, per-record ownership checks on
      PUT/DELETE)
- [x] Caching / API optimization — daily quiz question cached per-day with
      `IMemoryCache` (`QuizController.cs`), since it's identical for every user
- [x] Dockerized backend — multi-stage `Dockerfile`, verified locally with
      `docker build`/`docker run` (not one of the top 3 marked; production
      deployment stays on Azure App Service directly)

## Video (max 6 min)
- [ ] Part 1: how AI was used during development
- [ ] Part 2: design decisions made during the project
