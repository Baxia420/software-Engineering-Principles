# CLAUDE.md - Virtual Internship Portal (VIP)

This file provides a quick reference for development commands, styling guidelines, and architecture details for **Claude Code** and other AI assistants.

## Project Overview
The Virtual Internship Portal (VIP) is an application developed for UTM to coordinate student internships. It features a three-tier role hierarchy:
1. **Supervisor (UTM Admin)**: Oversees company approvals, internships, and student applications.
2. **Company Partner**: Posts internship listings and reviews student applications.
3. **Student**: Browses internships, applies, setups profiles, and interacts in the peer discussion forum.

---

## Tech Stack & Commands
*   **Frontend**: React (v19), Vite (v8), Tailwind CSS (v4), React Router (v7)
*   **Backend**: Supabase (Auth, PostgreSQL DB, Storage Buckets)

### Commands
Execute all frontend commands inside the `vip-frontend` directory.

| Command | Action |
| :--- | :--- |
| `npm run dev` | Start local Vite development server (`http://localhost:5173`) |
| `npm run build` | Build the production bundle |
| `npm run lint` | Run ESLint check |
| `npm run preview` | Preview production build locally |

---

## Architecture & Code Structure
*   **`/supabase`**: Contains raw SQL migration files for Database tables, Row-Level Security (RLS) policies, and triggers:
    *   `00_initial_schema.sql`: Basic table structures.
    *   `01_schema_and_rls.sql`: Core schema, constraints, RLS policies, storage policies, and user triggers.
    *   `02_forum_policies.sql`: Peer discussion forum schema and RLS.
*   **`/vip-frontend/src`**: React application source code:
    *   `AuthContext.jsx`: Provides session state and updates user roles.
    *   `supabaseClient.js`: Configured Supabase client with a **Web Locks API bypass** to avoid authentication deadlock hangs.
    *   `pages/`: Page components for each role and application state (dashboard, listings, forums, profiles).
    *   `components/`: Navbars and shared layout UI.
*   **`/code`**: Old static mockup HTML pages (useful for UI reference).
*   **`design_system.md`**: Aesthetic settings (JSON representation & markdown guidelines).

---

## Styling & Design Tokens
*   **Theme**: Corporate Academic (prestigious, scholarly look).
*   **Fonts**:
    *   Headlines: **Newsreader** (Serif)
    *   Body/Labels: **Inter** (Sans-serif)
*   **Color Palette**:
    *   Primary: Deep Maroon (`#4d0408`) / Primary Container (`#6b1b1b`)
    *   Secondary (Accent): Warm Amber/Gold (`#805600`) / Accent Container (`#fdb742`)
    *   Background: Off-White/Light Cream (`#fff8f7`)
*   **Borders**: Soft rounded corners (4px - `rounded-md`), flat design, using 1px solid low-contrast outlines (`#E5E1DA`) instead of shadows.

---

## Development Constraints & Rules
1.  **Code Consistency**: Preserve existing comments and docstrings. Keep functions modular and UI responsive.
2.  **Supabase Auth Bypass**: Do not modify the custom Web Locks bypass inside `supabaseClient.js`. It prevents tab-load deadlocks.
3.  **Upload Safety**: Any file upload (avatars or resumes) must implement a 15-second safety timeout promise race (see example in `ProfileSetup.jsx`).
4.  **Login Control**: Currently, user logins are restricted to `alam.j@graduate.utm.my` in `Authentication.jsx`. Keep this rule unless requested to lift it.
