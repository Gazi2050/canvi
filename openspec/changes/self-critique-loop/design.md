# Design

## Context

Phrases 04–05 deliver transport, prompt, and tools. The prototype's review loop (screenshot → critique prompt → fix, ≤3 passes) is the last proven behavior to port. See proposal.md for motivation; see `specs/self-critique-loop/spec.md` for the behavior contract.

## Goals / Non-Goals

**Goals:**

- Render-grounded quality gate on every drawing run.
- Guaranteed termination with observable pass state.

**Non-Goals:**

- New tools or prompt rewrites (reuse both).
- Human-in-the-loop approval between passes.

## Decisions

- **Pass loop inside the `agent-backend` route handler, not the client.** Rationale: the loop needs the screenshot pipeline and tool executors server-side; the client only sees status text and the final message. Alternative (client-orchestrated): rejected — ships intermediate images back and forth.
- **Screenshot via Excalidraw export API capped at 1600px longest edge** (prototype's rule), honoring the current theme. Rationale: bounds latency and model-input cost while keeping defects legible. Alternative (full-res): rejected — cost without readability gain.
- **Reviewer prompt ported from the prototype** (defect checklist + `DONE` convention). Rationale: validated wording; the checklist mirrors DESIGN.md's inspect-and-revise order. Alternative (freeform "improve this"): rejected — unbounded, unjudgeable.
- **Hard cap of 3 passes, `DONE`/no-change short-circuit.** Rationale: termination guarantee; most runs exit at 0–1. Alternative (higher cap): rejected — diminishing returns per prototype experience.

## Risks / Trade-offs

- [Extra latency and model cost per drawing] → Mitigate: cap + early exit; record as accepted cost of the quality bar.
- [Reviewer scope creep per pass (redesign instead of fix)] → Mitigate: prompt restricts to fixing listed defect classes, no new content.
