# Proposal

## Why

The canvas from Phrase 01 is amnesiac: every reload wipes it, and there is no concept of separate conversations. Canvi's core promise — one chat = its own canvas + message history — needs the combined-history model before any chat UI or agent work can land.

## What Changes

- Add a chat-store module owning the per-chat document model `{id, title, updatedAt, messages[], elements[]}`.
- Persist documents to localStorage (prototype parity, zero dependencies), debounced (~600ms) on canvas or message changes.
- Implement chat lifecycle: create, switch (save-outgoing/load-incoming, abort in-flight agent runs), delete (removing the document; active-chat delete resets to a fresh chat).
- Derive chat titles from the first user message (48-char truncation); sidebar metadata (`updatedAt`, shape count) falls out of the same documents.

## Capabilities

### New Capabilities

- `chat-store-persistence`: per-chat combined message + canvas history with debounced local persistence and full chat lifecycle (create/switch/delete).

### Modified Capabilities

(none — greenfield; Phrase 01's canvas contract is consumed, not changed)

## Impact

- **Code:** one new module (`src/lib/chat-store.ts`); wiring into the canvas page's `onChange` and (later) the chat bar — no changes to the editor island itself.
- **Dependencies:** none.
- **Systems:** browser localStorage only; no backend.
- **Out of scope (explicit follow-ups):** chat UI surfaces (`chat-ui`), agent backend + tools (`agent-backend`, `agent-tools-canvas`), self-critique (`self-critique-loop`), Clerk (`clerk-auth`), Dexie/DB migration (a future change, not this rollout).
