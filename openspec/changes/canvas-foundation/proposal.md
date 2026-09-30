# Proposal

## Why

Every Canvi phrase (chat store, chat UI, agent tools, self-critique) hangs off a working canvas, yet `src/` is still the untouched Waku starter with no canvas at all. A themed, client-only Excalidraw surface must exist first so later phrases have something to read, draw on, and persist.

## What Changes

- Add `@excalidraw/excalidraw` as a runtime dependency (pinned `^0.18.0`).
- Add a client-only whiteboard canvas component (`src/components/custom/whiteboard-canvas.tsx`) that dynamically imports Excalidraw so it never renders server-side.
- Render the canvas full-viewport on the home page (`/`), replacing the starter content there.
- Theme the editor through Excalidraw's documented CSS variables (`.canvi .excalidraw` / `.canvi .excalidraw.theme--dark`) per DESIGN.md — the single sanctioned exception to the Tailwind-only rule.
- Show the empty-canvas hero (title, one guidance line, suggestion chips) when no elements exist, per the prototype.

## Capabilities

### New Capabilities

- `canvas-foundation`: full-screen client-only Excalidraw surface on `/`, themed per DESIGN.md, with empty-state hero. This is the drawing surface and Excalidraw API attachment point every later phrase builds on.

### Modified Capabilities

(none — greenfield; no existing specs to modify)

## Impact

- **Code:** one new component (`src/components/custom/whiteboard-canvas.tsx`); `src/pages/index.tsx` rewired from starter content to the canvas page; starter demo components (`counter.tsx`, about page) left untouched by this change.
- **Dependencies:** `+ @excalidraw/excalidraw@^0.18.0` (client bundle only; must stay out of the RSC/server bundle).
- **Systems:** none (no backend, no persistence, no auth in this phrase).
- **Out of scope (explicit follow-ups):** per-chat store + persistence (`chat-store-persistence`), sidebar/chat-bar/hero interactivity beyond static empty state (`chat-ui`), agent backend + tools (`agent-backend`, `agent-tools-canvas`), self-critique (`self-critique-loop`), Clerk (`clerk-auth`).
