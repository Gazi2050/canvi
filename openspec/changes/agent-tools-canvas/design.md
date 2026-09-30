# Design

## Context

Phrase 04 owns transport and prompt; the editor island owns the Excalidraw API instance. This phrase is the bridge: model-emitted tool calls become scene mutations. The prototype's layout engines (layered DAG, card geometry, elbow routing) are validated algorithms — port, don't reinvent. See proposal.md for motivation; see `specs/agent-tools-canvas/spec.md` for the behavior contract.

## Goals / Non-Goals

**Goals:**

- Eight executors with schemas matching the prototype's contracts.
- Every mutation undoable, camera-followed, and measurably chained.

**Non-Goals:**

- Prompt/transport changes (owned by `agent-backend`).
- Post-draw review (owned by `self-critique-loop`).

## Decisions

- **Single executor module (`src/lib/agent/tools.ts`) with JSON-schema tool definitions.** Rationale: one registry the route passes to the model; schemas version with the code. Alternative (per-tool files): rejected — eight tiny modules obscure the shared commit/measure pipeline.
- **Port prototype layout math verbatim first** (layering, barycenter ordering, card geometry, elbow routing), then tune only against rendered output. Rationale: the algorithms are the validated part; rewrites risk regressions. Alternative (rewrite with a layout lib): rejected — new dependency for solved problems.
- **Shared commit pipeline: `convertToExcalidrawElements` + normalization + `commitToHistory: true` + version bump + `scrollToContent`.** Rationale: guarantees undo, sane defaults (DESIGN.md §Authoritative visual system), and camera-follow for every tool uniformly. Alternative (per-tool commit logic): rejected — inconsistent history behavior.
- **Measured results (bounding boxes + ids) returned from every mutating tool.** Rationale: chaining (draw → connect → align) needs ground truth, not guesses. Alternative (fire-and-forget): rejected — the agent cannot place step N+1 precisely.
- **Image binaries stay transient; R2 is conditional.** Excalidraw `files` payloads are passed through, never persisted. Rationale: no phrase in this rollout requires cross-reload image persistence. R2 enters scope only if that is specced later — then binaries go to R2 with references in D1, never base64 inside rows. Alternative (persist images now): rejected — unneeded infrastructure.

## Risks / Trade-offs

- [Ported layout bugs surfacing only visually] → Mitigate: every executor verified against a rendered canvas in dev, not just unit output.
- [Large scenes slowing `get_scene`] → Mitigate: prototype's 300-element cap and freedraw point decimation carry over.
- [Chat-switched mid-tool-run writes to wrong scene] → Mitigate: run-scoped guard from `chat-store-persistence` aborts before commit.
