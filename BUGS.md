# VIP Portal — Bug & Risk Report

Status: **report only**. These were found during a code+SQL sweep on 2026-06-22. They are documented here for a separate fix pass; the visual-polish work does **not** address them (except where the new `StatusBadge`/`Card` primitives incidentally remove hardcoded colors — see #5).

Findings were verified by reading the actual source, not just the exploration summary. Three commonly-flagged "bugs" turned out to be false positives and are listed last so they aren't re-investigated.

---

## Confirmed false positives (NOT bugs — do not "fix")

- **`supervisor_id` vs `company_id` "mismatch".** Intentional. The schema and RLS use `internships.supervisor_id = auth.uid()` as the creating profile's id — companies are the creators, the column name is just generic. See `supabase/01_schema_and_rls.sql:98`.
- **`status` enum "breaks DB writes".** `applications.status` is `TEXT DEFAULT 'pending'` with **no CHECK constraint** (`supabase/00_initial_schema.sql:49`). The code consistently writes and reads `approved`/`rejected`, so writes succeed.
- **AuthContext "missing unmount guard".** It already uses an `active` flag, `clearTimeout`, and `subscription.unsubscribe()` in cleanup (`vip-frontend/src/AuthContext.jsx:34-91`).

---

## Real findings

### Medium

**1. Silent Supabase error swallowing (pattern across many pages)**
Queries destructure `{ data, error }` and then act only on `data` (`if (data) { ... }`), ignoring `error`. A failed query produces a silent empty UI with no feedback or log.
- Verified: `vip-frontend/src/pages/BrowseListings.jsx:16-23`
- Same pattern: `vip-frontend/src/pages/Dashboard.jsx:26-74`, `vip-frontend/src/AuthContext.jsx:24-27`, and others.
- Fix direction: inspect `error`, surface it (toast/inline), and `console.error` it.

**2. `localStorage('role')` used as the routing source of truth**
`vip-frontend/src/App.jsx` (`ProtectedRoute`, `AuthRoute`, `FallbackRedirect`) and several pages read the role from `localStorage` instead of the `profile` already in `AuthContext`. This can desync across tabs or after a logout in another tab, briefly granting/denying the wrong routes.
- Fix direction: derive role from `profile?.role` via context; keep `localStorage` only as a cold-start hint.

**3. Uncontrolled inputs read via `document.getElementById`**
`vip-frontend/src/pages/Authentication.jsx:28-29` (login) and `:84-90` (register) read form values straight from the DOM rather than React state — fragile and bypasses React-idiomatic validation.
- Fix direction: convert to controlled `useState` inputs.

### Low

**4. Unreachable dead code**
`handleRegister` returns early because signups are disabled, leaving ~30 lines of unreachable signup logic. `vip-frontend/src/pages/Authentication.jsx:82-114`.
- Fix direction: delete it, or guard it behind a feature flag.

**5. Hardcoded hex colors bypass the design-token system**
e.g. `#6B1B1B`, `#C4860A`, `#6B7280` in `vip-frontend/src/components/InternshipCard.jsx:10-15,34,53` and `vip-frontend/src/pages/Dashboard.jsx:123,192`. Defeats theming and duplicates status-color logic across files.
- Fix direction: use tokens; centralize status colors in the `StatusBadge` primitive. (Partly handled by the visual-polish pass.)

**6. Array-index `key` props in mapped lists**
e.g. forum replies keyed by array index — breaks reconciliation on reorder/filter.
- Fix direction: key by stable `item.id`.

**7. Status vocabulary mismatch (docs vs code)**
Code uses `approved`/`rejected`; `HANDOFF.md` and the design docs say `accepted`/`reviewed`. The `reviewed` state is never actually produced in the UI. Harmless today, but confusing for the next developer.
- Fix direction: pick one vocabulary and align code + docs.

**8. Missing loading / empty / error states**
Several pages show a bare spinner or nothing on empty/error. UX gap, not a crash. (The visual-polish pass adds `Skeleton`/`EmptyState` primitives that can be adopted here later.)
