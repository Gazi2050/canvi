# Tasks

## 1. Dependencies and prompt

- [ ] 1.1 Install `ai`, `@ai-sdk/react`, and the chosen provider package via pnpm and verify they appear in `package.json`
- [ ] 1.2 Create `src/lib/agent/guide.ts` with the ported `GUIDE` system prompt (Canvi framing, design system, workflow, tool rules) and verify it reads as a complete standalone prompt with no prototype transport references

## 2. Route and wiring

- [ ] 2.1 Create `src/pages/_api/agent/chat.ts` (dynamic) accepting `{messages, viewInfo, screenshot?}` and returning the AI SDK data stream, and verify a curl round-trip streams a reply
- [ ] 2.2 Wire the chat bar to `useChat` against the route (streaming bubbles, stop button, abort on chat switch), and verify stop halts streaming with no orphaned output

## 3. Phrase acceptance

- [ ] 3.1 Run `pnpm build` and verify it passes with no provider secret in client output
- [ ] 3.2 Run `pnpm dev`, ask what is on the canvas, request a small drawing plan, and verify a streamed answer plus a visible `todo_write` plan for the complex request
