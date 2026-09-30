# Design

## Context

Phrases 01–06 assume a single local user implicitly. This phrase introduces identity at the outermost layer (layout/middleware) plus a user key in the store, without touching editor, agent, or UI internals. See proposal.md for motivation; see `specs/clerk-auth/spec.md` for the behavior contract.

## Goals / Non-Goals

**Goals:**

- Hard gate: no canvas, chat, or document access without a session.
- Per-user document namespaces.

**Non-Goals:**

- Organizations, sharing, or collaboration invites (future work, not this rollout).
- Changing any phrase 01–06 behavior for signed-in users.

## Decisions

- **Clerk (proven in v1's earlier iterations) over hand-rolled auth.** Rationale: prior art in this repo's history; managed sessions beat custom JWT plumbing. Alternative (custom auth): rejected — security-critical code with no product benefit.
- **Gate at layout/middleware boundary, user key in store.** Rationale: one enforcement point plus document namespacing covers every surface uniformly. Alternative (per-component guards): rejected — scattered, missable.
- **Keys via environment; dev path documented in tasks.** Rationale: secrets never bundled; the rollout's `pnpm dev` verification standard must survive this phrase. Alternative (keys in repo): rejected absolutely.
- **Integrate per the Clerk React quickstart** (https://clerk.com/docs/react/getting-started/quickstart; JS-frontend quickstart as fallback reference), provider adapted to the Waku root layout, re-verified against the live docs at implementation time. Rationale: first-party integration path beats improvisation on security-critical code. Alternative (custom session handling): rejected — see provider decision above.

## Risks / Trade-offs

- [Clerk/Waku integration drift (both move fast)] → Mitigate: follow the prevailing Clerk + Waku docs at implementation time; keep the integration surface to provider + gate + user key.
- [First external runtime dependency] → Mitigate: failure mode is sign-in unavailable, never data loss — local documents stay intact.
