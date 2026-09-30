# Proposal

## Why

The chat bar from Phrase 03 only echoes locally — no intelligence behind it. The prototype's agent (system prompt + tools + streaming) ran through an in-artifact transport that cannot exist in production; this phrase replaces it with a real Waku/Hono API route driven by the AI SDK.

## What Changes

- Add a streaming agent API route (`src/pages/_api/agent/chat.ts`) accepting `{messages, viewInfo, screenshot?}` and returning an AI SDK data stream.
- Port the prototype's `GUIDE` system prompt with Canvi framing (design system, workflow, tool usage rules).
- Wire the chat bar to AI SDK `useChat` (streaming bubbles, stop/regenerate, abort on chat switch).
- Establish the `todo_write` planning contract for non-trivial drawing tasks.
- Resolve the LLM provider via environment (concrete default chosen here).

## Capabilities

### New Capabilities

- `agent-backend`: streaming conversational agent endpoint plus `useChat` client wiring, carrying the ported system prompt and planning contract. Tool execution itself is `agent-tools-canvas`.

### Modified Capabilities

(none — consumes `chat-ui` send/stop seam and `chat-store-persistence` transcript without changing them)

## Impact

- **Code:** one new API route; chat-bar transport swap (same send/stop seam); new agent prompt module.
- **Dependencies:** `+ ai`, `+ @ai-sdk/react`, `+` one provider package (e.g. `@ai-sdk/openai` — concrete default fixed in design).
- **Systems:** first server-side secret (provider key via env, never bundled to client).
- **Out of scope (explicit follow-ups):** tool executors (`agent-tools-canvas`), self-critique (`self-critique-loop`), Clerk (`clerk-auth`).
