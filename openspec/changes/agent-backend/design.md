# Design

## Context

Phrases 01–03 deliver canvas, store, and chrome with local echo. The prototype's agent logic (GUIDE, tool schemas, critique loop) is proven behavior; only its `claude.use('sample')` transport must go. See proposal.md for motivation; see `specs/agent-backend/spec.md` for the behavior contract.

## Goals / Non-Goals

**Goals:**

- Production transport for the agent with streaming UX.
- Prompt and protocol ports that later tool executors plug into unchanged.

**Non-Goals:**

- Tool executors themselves (`agent-tools-canvas`).
- Screenshot capture pipeline details beyond accepting the image (canvas export lands with tools).

## Decisions

- **AI SDK (`ai` + `@ai-sdk/react` `useChat`) over raw fetch/SSE.** Rationale: message state, streaming, stop/regenerate, and abort come as one tested unit instead of hand-rolled stream parsing. Alternative (raw SSE + custom state): rejected — duplicates `useChat` poorly.
- **Waku `_api` route (`src/pages/_api/agent/chat.ts`, dynamic by default).** Rationale: the documented Waku server seam; standard Request/Response keeps provider code portable. Alternative (server actions): rejected — long-lived binary-capable streams fit routes better.
- **Provider resolved via environment; default `@ai-sdk/openai`-compatible.** Rationale: AI SDK is provider-agnostic, so the spec fixes the interface and env fixes the vendor. Alternative (hardcode vendor): rejected — locks the rollout to one bill.
- **Prompt module (`src/lib/agent/guide.ts`) ported from prototype `GUIDE` with Canvi framing.** Rationale: the design system, palettes, card metrics, and text-sizing math are validated content; only the transport wrapper changes. Alternative (rewrite prompt): rejected — discards proven tuning.

## Risks / Trade-offs

- [Streaming + React Compiler interaction] → Mitigate: keep stream state inside `useChat`, never mirror it into hand-managed state; verify zero tearing in dev.
- [Screenshot size/latency] → Mitigate: cap export dimensions (prototype's 1600px rule) at the capture site; endpoint rejects oversize payloads.
- [Key leakage] → Mitigate: provider client constructed server-side only; verify bundle contains no secret (grep build output).
