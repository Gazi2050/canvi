# Tasks

## 1. Review loop

- [ ] 1.1 Implement canvas screenshot export (capped 1600px, current theme) at the end of drawing runs and verify the image legibly shows the canvas
- [ ] 1.2 Add the reviewer prompt plus the pass loop (max 3, `DONE`/no-change short-circuit, pass count in run status) to the agent route handler, reusing existing tool executors only, and verify a deliberately imperfect draw gets a fixing second pass

## 2. Phrase acceptance

- [ ] 2.1 Run `pnpm build` and verify it passes
- [ ] 2.2 Run `pnpm dev`, request a multi-element drawing, and verify the loop terminates (≤3 passes), clean output exits early, and every fix is undoable
