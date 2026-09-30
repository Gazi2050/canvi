# Design

## Context

Phrase 02 owns documents; Phrase 01 owns a static hero placeholder. This phrase builds the three islands from the prototype (`#side`, `#chat`, `#hero`) as React components styled by the shadcn/Tailwind system. See proposal.md for motivation; see `specs/chat-ui/spec.md` for the behavior contract.

## Goals / Non-Goals

**Goals:**

- Prototype chrome parity, expressed as DESIGN.md islands (one radius + one shadow per family, compact, floating).
- Strict shadcn composition: custom wrappers in `src/components/custom/`, zero hand-edits under `src/components/ui/`.

**Non-Goals:**

- Message transport/streaming (local echo only; `agent-backend` wires `useChat` later).
- Sidebar virtualization or server-driven history.

## Decisions

- **Three components: `chat-sidebar.tsx`, `chat-bar.tsx`, `hero-prompt.tsx`**, all reading the `chat-store-persistence` documents. Rationale: one island per component maps 1:1 to prototype regions and DESIGN.md's surface map. Alternative (single chat shell): rejected — mixes three independent responsive behaviors.
- **shadcn parts via CLI only** (`button`, `input`, `scroll-area`, or equivalents), composed — never edited — inside custom wrappers. Rationale: AGENTS.md rule 6; keeps registry output regenerable. Alternative (hand-rolled controls): rejected — duplicates tested accessible primitives.
- **Hero takeover, not parallel hero.** `hero-prompt.tsx` replaces the Phrase 01 static placeholder in place. Rationale: single owner per surface; the Phrase 01 risk log already names this handoff. Alternative (keep both, hide one): rejected — dead component ships.
- **Resize via pointer-drag on the chat bar with remembered size** (localStorage UI prefs, mirroring the prototype's `ui` key). Rationale: prototype parity; purely presentational state. Alternative (fixed sizes): rejected — prototype behavior is the spec.

## Risks / Trade-offs

- [Island styling drift from DESIGN.md] → Mitigate: radius/shadow/spacing tokens from `src/styles.css` only; verify against the DESIGN.md reject-list (no full-width bars, no card-grid hero).
- [Chat-bar wiring churn when `agent-backend` lands] → Mitigate: bar exposes send/stop callbacks now; `useChat` plugs into the same seam later.
