# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

GPA Academy is a single-file React SPA (`GPA_Academy_App.html`) for managing surgical assistance training programs in the Dominican Republic. It runs entirely in the browser — no build step, no server, no package manager. React 18, ReactDOM, and Babel are loaded from CDN at runtime; JSX is transpiled on the fly by Babel Standalone.

## Running the app

Open `GPA_Academy_App.html` directly in a browser. No installation or build required. Any HTTP server also works:

```bash
python3 -m http.server 8080
# then open http://localhost:8080/GPA_Academy_App.html
```

## Architecture

Everything lives in one file (~1 400 lines). The structure top-to-bottom is:

1. **CDN imports** — React 18, ReactDOM, Babel Standalone (lines 5–7)
2. **`SAMPLE_DATA`** — hardcoded in-memory dataset (programs, students, doctors, hospitals, assignments, checklists, leads, notifications, alerts). This is the only "database"; nothing is persisted between page reloads.
3. **`ADMIN_USERS`** — flat array of all login credentials (admins, doctors, students). Login compares against this array client-side.
4. **Primitive UI components** — `Icon`, `Badge`, `Card`, `Btn`, `Input`, `Select`, `Table`, `Modal`, `Toast`, `ProgressBar`, `StatCard`. All inline styles, no CSS classes.
5. **`LoginPage`** — unauthenticated entry point; sets `user` state on success.
6. **`NAV_ITEMS` + `Sidebar` + `Header`** — navigation shell; sidebar items are filtered by `user.role`.
7. **Role-specific dashboard pages** — `StudentDashboardPage`, `DoctorDashboardPage`. Admin dashboard views are stubs (placeholder `<p>` tags) not yet implemented.
8. **`App`** — root component; owns `user`, `view`, `toasts`, and `[state, dispatch]` (useReducer).
9. **`reducer` + `initialState`** — minimal reducer with three actions: `COMPLETE_ASSIGNMENT`, `ADD_CHECKLIST`, `UPDATE_CHECKLIST`. All other state mutations are missing; most sections show "Próximamente".
10. **`ReactDOM.createRoot(...).render(<App/>)`** — entry point at the very bottom.

> The file contains duplicate/experimental code blocks (multiple `App` function definitions, multiple `reducer`/`initialState` declarations, multiple `ReactDOM.createRoot` calls). Only the **last** definitions actually execute — earlier ones are dead code from incremental development.

## Roles and access

Three roles control which nav items and dashboards are shown:

| Role | Key views |
|---|---|
| `admin` | Students, Doctors, Hospitals, Assignments, Checklist, Reports, Bot Luz, Alerts, Notifications |
| `doctor` | Dashboard (clinical), Supervisión Clínica, Assignments, Calendar, Alertas Clínicas, Coordinación |
| `student` | Dashboard (personal), Calendar, Cambios de Día |

## State management

`useReducer` with `initialState = { ...SAMPLE_DATA }`. Only three actions are wired up. Adding new mutations requires:
1. Dispatching `{ type: 'YOUR_ACTION', payload: ... }` from a component.
2. Adding a `case 'YOUR_ACTION':` branch in `reducer`.

State is **ephemeral** — reloading the page resets everything to `SAMPLE_DATA`.

## Key data relationships

- `assignments` link `studentId → doctorId → hospitalId → areaId → programId`.
- `checklists` link to `assignments` via `assignmentId`; each checklist holds attendance, cases, `skillLevels` (0–4 scale: No iniciada → Observó → Participó → Realizó → Dominó), and a supervisor signature.
- `dayChanges` reference an `originalAssignmentId` and carry `status: 'pending' | 'approved'`.
- `clinicalAlerts` reference both `doctorId` and `studentId`.

## Skill level constants

```js
const SKILL_LABELS = ['No iniciada','Observó','Participó','Realizó','Dominó'];
const SKILL_COLORS = ['#9CA3AF','#3B82F6','#F59E0B','#F97316','#16A34A'];
```

## Color palette

```js
const COLORS = {
  primary: '#1A3A5C',
  accent:  '#2E75B6',
  light:   '#D6E4F0',
  success: '#1D6B3B',
  warning: '#D97706',
  danger:  '#DC2626',
  bg:      '#F0F5FB',
};
```

## Important constraints

- **No build toolchain.** Do not introduce npm, webpack, Vite, or TypeScript. All code must be valid JSX that Babel Standalone can transpile in the browser.
- **No external state or backend.** All data lives in `SAMPLE_DATA` / `useReducer`. Changes are lost on reload by design (prototype stage).
- **Credentials are hardcoded in plain text.** This is intentional for the prototype. Do not add real secrets to the source.
- **Most views are stubs.** When adding a new view, wire it in `App`'s render block and in `NAV_ITEMS`; the sidebar and header will pick it up automatically.
- **Avoid adding duplicate top-level declarations.** The file already has dead-code duplicates; clean those up rather than adding more.
