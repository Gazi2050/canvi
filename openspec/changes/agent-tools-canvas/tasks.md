# Tasks

## 1. Executor module

- [ ] 1.1 Create `src/lib/agent/tools.ts` with the eight tool schemas and the shared commit pipeline (convert, normalize, history commit, version bump, camera scroll, measured results), and verify each tool validates its inputs against its schema
- [ ] 1.2 Port the `draw_diagram` layout engine (layering, cycle-safe ordering, groups, bound arrows) and verify a flowchart renders with no overlaps
- [ ] 1.3 Port `draw_cards`/`cardSk` geometry and `connect` elbow routing, and verify a chained draw-then-connect run anchors edge-to-edge

## 2. Route wiring and remaining tools

- [ ] 2.1 Expose the tools to the model through the `agent-backend` route and verify an end-to-end "draw a login flowchart" run uses at least three tools
- [ ] 2.2 Implement `get_scene`, `draw_elements`, `update_elements`, `delete_elements`, `focus_view` and verify read-edit-delete-focus round-trips by id

## 3. Phrase acceptance

- [ ] 3.1 Run `pnpm build` and verify it passes
- [ ] 3.2 Run `pnpm dev`, have the agent build a multi-card design, press undo, and verify the last agent commit reverts; check output against DESIGN.md drawing rules (no clipped text, no overlaps, on-palette)
