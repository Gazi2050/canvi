# Proposal

## Why

The agent from Phrase 04 can talk but cannot touch the canvas — the entire product premise (an agent that draws) is unimplemented. The prototype's eight tools with their schemas and layout math are proven; this phrase ports them as executors against the real Excalidraw API.

## What Changes

- Add a tool executor module (`src/lib/agent/tools.ts`) implementing all eight tools: `get_scene`, `draw_diagram` (layered auto-layout), `draw_cards`, `draw_elements`, `connect` (elbow routing), `update_elements`, `delete_elements`, `focus_view`.
- Convert skeletons to real elements via `convertToExcalidrawElements` with prototype normalization (fontFamily 2 default, roughness 1, solid fill when set, rounded rects, label defaults).
- Commit every mutation with `commitToHistory: true` plus version bumps; scroll the camera to new content; return measured bounding boxes and ids for chaining.
- Enforce DESIGN.md agent drawing rules (card geometry, palettes, text-sizing math, 1400×1800 bounds) as tool-level acceptance.

## Capabilities

### New Capabilities

- `agent-tools-canvas`: the eight canvas tools as callable executors with schemas, layout engines, history commits, and measured-result chaining.

### Modified Capabilities

(none — plugs into the `agent-backend` route's tool seam without changing its contract)

## Impact

- **Code:** one new module (`src/lib/agent/tools.ts`); route wiring to expose tools to the model.
- **Dependencies:** none (uses the Excalidraw package from Phrase 01).
- **Systems:** none.
- **Out of scope (explicit follow-ups):** self-critique loop (`self-critique-loop`), Clerk (`clerk-auth`).
