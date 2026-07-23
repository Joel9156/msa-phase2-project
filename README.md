# Green Footprint

A gamified step-tracking web app that turns daily walking into points, streaks,
tiers, and an illustrative environmental-impact readout. Built for the
**Microsoft Student Accelerator 2026 Phase 2 (Software Stream)** individual
assessment.

## Deployment

- **Frontend (app):** https://agreeable-hill-0bb9bab00.7.azurestaticapps.net
- **Backend API docs (Scalar):** https://walking-tracker-msa2026.azurewebsites.net/scalar

Note: the backend runs on Azure App Service's free (F1) tier, so the SQLite
database is ephemeral and resets on redeploy — expect a clean slate rather
than persisted history when testing the live site (see
[`specs/03-design-decisions.md`](specs/03-design-decisions.md) for details).

## Introduction

Green Footprint lets a user log how many steps they walked each day. Hitting a
daily step goal earns points and builds a streak; a daily eco-trivia quiz adds
bonus points; accumulated points unlock progressively higher tiers, each with
its own character illustration. A dashboard widget also converts a user's
total logged steps into a rough distance/CO2/tree-equivalent estimate, so the
number of steps feels connected to a real-world outcome.

## How this fits the theme (Gamification)

The assignment theme is gamification — using game-design elements to drive
engagement in a non-game app. Green Footprint layers several of the
theme's suggested mechanics directly onto step tracking:

- **Points** — reaching the daily step goal (6,000 steps) awards points
- **Streaks** — consecutive goal-days build a streak; every 7-day streak
  crosses a bonus-point milestone
- **Progress tracking / tiers** — cumulative points place a user into one of
  four tiers (Sprout Walker → Green Walker → Earth Keeper → Eco Guardian),
  each with a distinct character illustration, similar to a badge/rank system
- **A secondary engagement loop** — a daily environment-trivia quiz (unlocked
  only after that day's walk is logged) awards a smaller bonus for a correct
  answer, encouraging users to return once a day rather than dumping steps in
  all at once

## What makes it worth a second look

- **Environmental-impact framing, not just a step counter** — logged steps
  are converted into an illustrative distance/CO2-saved/tree-equivalent
  readout, both live (based on a user's own total) and as fixed examples on
  the landing page, so the numbers connect to something concrete
- **Tier character illustrations** — each of the four tiers has its own
  AI-generated character (prompted via Gemini, background-removed and
  color-corrected for both light and dark theme), instead of a generic badge
  icon
- **A daily quiz tied to real activity** — the quiz only unlocks once a user
  has logged that day's walk, and only allows one attempt per real calendar
  day, so it can't be gamed by resubmitting old data
- **Cached daily quiz question** — since every user gets the same question on
  a given day, the question is cached server-side per day (`IMemoryCache`)
  instead of being re-queried from the database on every request
- **Real authentication**, not a free-text username — registration/login with
  hashed passwords and JWT-based auth, with a separate display name shown in
  the UI so a login handle and a friendly name aren't the same thing

## Advanced requirements implemented

Per the assessment's rule that **only the top 3 listed here are marked**, the
three below are the ones intended for marking. Two additional features are
listed afterward for completeness but aren't submitted for marking.

### Marked (top 3)

1. **Security measures** (password hashing + data validation)
   - **Password hashing:** `PasswordHasher<User>` (ASP.NET Core Identity) hashes
     and salts passwords on registration (`AuthController.Register`) and
     verifies them on login (`AuthController.Login`) — plaintext passwords are
     never stored, and salting means two users with the same password get
     different hashes. This matters because the SQLite database is the single
     point of failure for every user's credentials; hashing means a leaked
     database file doesn't directly expose passwords.
   - **Data validation:** registration rejects missing/short usernames,
     passwords under 8 characters, and missing display names
     (`AuthController.Register`); every walking-record update/delete checks
     that the record actually belongs to the requesting user before allowing
     the change (`WalkingController.UpdateRecord`/`DeleteRecord`), preventing
     one user from editing another's data by guessing an ID.
2. **State management library — Zustand**
   - `frontend/src/store.ts` centralizes auth token, display name, walking
     records, and progress in a single store shared across `WalkingBoard`,
     `ProgressCard`, `QuizCard`, `RecordForm`, and `RecordList`, instead of
     prop-drilling or duplicating fetch logic in each component.
3. **Caching / API optimization**
   - The daily quiz question is identical for every user on a given day
     (`GET /api/Quiz/today`), so it's cached server-side with `IMemoryCache`
     keyed by date (`QuizController.cs`). The first request each day queries
     the database once; every other request that day is served from memory
     until the date rolls over.

### Additional (not submitted for marking)

- **Theme switching** — light/dark mode via Mantine's `useMantineColorScheme`,
  defaulting to the system preference, toggled from the header.
- **Dockerized backend** — a multi-stage `Dockerfile` (`backend/Dockerfile`)
  builds and runs the API in a container, verified locally with
  `docker build` + `docker run`. Production deployment still uses Azure App
  Service directly rather than a container, so this is offered as an
  additional, self-contained way to build/run the backend rather than a
  replacement for the live deployment.

## Tech stack

- **Backend:** C# / .NET 10, ASP.NET Core Web API, EF Core (SQLite), JWT
  authentication, Scalar for API docs
- **Frontend:** React + TypeScript (Vite), React Router, Mantine, Zustand
- **Testing:** xUnit + EF Core InMemory provider (backend), Vitest + React
  Testing Library (frontend)
- **Deployment:** Azure App Service (backend), Azure Static Web Apps
  (frontend)

## Running locally

**Backend:**
```
cd backend
dotnet run
```
Applies EF Core migrations automatically on startup. API docs at
`http://localhost:5000/scalar`.

**Frontend:**
```
cd frontend
npm install
npm run dev
```

**Tests:**
```
cd backend.Tests && dotnet test
cd frontend && npm test
```

**Docker (backend only):**
```
cd backend
docker build -t green-footprint-backend .
docker run -p 8080:8080 green-footprint-backend
```

## Self-reflection

If starting over, a few things would change:

- **Lock in branding/naming earlier.** The app was built as "Walking
  Tracker" for most of development and renamed to "Green Footprint" fairly
  late, once the environmental-impact framing made the original name feel
  too narrow. Settling on the concept and name before building the UI would
  have avoided re-touching already-finished screens.
- **Write tests alongside features, not after.** Unit tests for the
  gamification rules (streaks, tier boundaries) were added near the end
  rather than as each feature was built. A `% 7 == 0` edge case once let a
  streak bonus fire at a streak of 0 — caught and fixed during manual
  testing, but a test written at the time the feature was built would have
  caught it immediately, for free.
- **Set up secrets management from the very first commit.** The JWT signing
  key spent a short time committed directly in `appsettings.json` before the
  project moved to .NET User Secrets locally and an Azure App Setting in
  production; the key was rotated at that point, so the value that briefly
  sat in git history is no longer valid. Starting with a placeholder from
  commit one would have skipped that step entirely.
- **Plan for the target hosting environment's constraints up front.** Azure
  App Service's free (F1) tier has no persistent disk, so the SQLite file
  resets on every redeploy. Designing the persistence layer with that
  constraint in mind from the start (rather than discovering it after trying
  a persistent path that didn't exist) would have saved a detour.

## AI usage

This project was built with AI assistance (Claude) throughout — planning,
scaffolding, debugging, and iterative feature work. See the
[`/specs`](specs) folder for the full planning log and AI prompt history, and
[`specs/03-design-decisions.md`](specs/03-design-decisions.md) for design
decisions and the reasoning behind them.
