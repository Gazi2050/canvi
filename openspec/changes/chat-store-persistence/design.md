# Design

## Context

Phrase 01 delivers the editor island with no memory. The prototype proves the combined-document model (`index` + `c:<id>` keys, debounced writes, switch-with-abort) in vanilla JS; this phrase ports that behavior into a typed module the React tree consumes. See proposal.md for motivation; see `specs/chat-store-persistence/spec.md` for the behavior contract.

## Goals / Non-Goals

**Goals:**

- One typed store module owning documents, persistence, and lifecycle.
- Waku-native I/O with no added data-fetching library.

**Non-Goals:**

- Any chat UI (sidebar, chat bar, hero interactivity) — `chat-ui` consumes this store.
- Server-side persistence or sync — local-first only.
- Message sending/agent invocation — `agent-backend` consumes the transcript.

## Decisions

- **localStorage backend with prototype-compatible key layout** (`index` + per-chat documents). Rationale: zero dependencies, prototype parity, sufficient for single-device local-first. Alternative (D1 now): rejected for this phrase — D1 is the recorded future backend (schema + migration owned by `cloudflare-deploy`); the store API hides the backend either way, and localStorage stands until multi-device matters.
- **Plain client store module (`src/lib/chat-store.ts`), no SWR/React Query.** Rationale: reads are local and synchronous; Waku server actions/`useOptimistic` cover the rare async edges later. Alternative (SWR): rejected per rollout decision — candidate only if server-side persistence creates freshness needs.
- **Debounce (~600ms) at the store boundary, not in components.** Rationale: one choke point guarantees canvas bursts and message sends collapse into single writes regardless of caller. Alternative (per-component debounce): rejected — duplicates timing logic and risks lost writes.
- **Switch = save-outgoing + load-incoming + abort in-flight run.** Rationale: prototype semantics; the abort guard prevents agent output landing in the wrong chat. Alternative (rely on run-scoped ids only): rejected — abort is cheaper and deterministic.

## Risks / Trade-offs

- [localStorage quota on huge canvases] → Mitigate: catch write failures and surface a non-blocking warning; quota strategy belongs to the future persistence-migration change.
- [Shape of `elements[]` couples store to Excalidraw types] → Mitigate: store treats elements opaquely (serializable snapshot in, snapshot out); conversion lives in agent/canvas layers.
