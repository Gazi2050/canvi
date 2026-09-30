# Proposal

## Why

The agent from Phrase 05 draws once and stops — but first-pass output has overlapping text, uneven gaps, and off-palette slips the model cannot see in coordinates alone. The prototype closes this gap with a screenshot review loop; without it, agent output stays permanently draft-quality.

## What Changes

- After each drawing run, export the canvas to an image (capped dimensions) and send it to the agent with the picky-reviewer prompt.
- Let the agent fix real problems with the existing tools (`update_elements`, `delete_elements`, `draw_elements`, `connect`); cap the loop at 3 passes.
- Short-circuit on `DONE` (agent judges output professional); surface the pass count in the run status.

## Capabilities

### New Capabilities

- `self-critique-loop`: post-draw screenshot export, reviewer critique, bounded fix passes with early exit.

### Modified Capabilities

(none — reuses the `agent-backend` route and `agent-tools-canvas` executors unchanged)

## Impact

- **Code:** edits to the agent route handler (pass loop) plus the reviewer prompt; no new components, no new tools.
- **Dependencies:** none (uses the Excalidraw export API from the Phrase 01 package).
- **Systems:** extra model calls per drawing run (latency/cost noted in design).
- **Out of scope (explicit follow-ups):** Clerk (`clerk-auth`).
