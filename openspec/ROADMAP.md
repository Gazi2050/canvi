# Canvi Phrases — Master List

One folder per phrase under `changes/` (folder name = phrase). Artifact filenames inside each change (`proposal.md`, `design.md`, `tasks.md`, `specs/`) are an OpenSpec CLI contract — never rename them. Flip a checkbox when its phrase is applied and archived.

- [x] Phrase 01 — [canvas-foundation](changes/canvas-foundation/) — full-screen client-only Excalidraw on `/`, themed per DESIGN.md, empty-state hero. (planning complete, validated)
- [x] Phrase 02 — [chat-store-persistence](changes/chat-store-persistence/) — per-chat `{messages, elements}` model, debounced autosave, Waku-native I/O. (proposed, validated — implement after 01)
- [x] Phrase 03 — [chat-ui](changes/chat-ui/) — sidebar, floating chat bar, interactive hero. (proposed, validated — implement after 02)
- [x] Phrase 04 — [agent-backend](changes/agent-backend/) — AI SDK + `_api` route, `GUIDE` port, planning contract. (proposed, validated — implement after 03)
- [x] Phrase 05 — [agent-tools-canvas](changes/agent-tools-canvas/) — eight canvas tool executors. (proposed, validated — implement after 04)
- [x] Phrase 06 — [self-critique-loop](changes/self-critique-loop/) — screenshot review, ≤3 passes. (proposed, validated — implement after 05)
- [x] Phrase 07 — [clerk-auth](changes/clerk-auth/) — sign-in gate, per-user isolation. (proposed, validated — implement after 06)
- [x] Phrase 08 — [cloudflare-deploy](changes/cloudflare-deploy/) — worker adapter, wrangler project, D1 database + schema, deploy workflow. (proposed, validated — implement after 07)

Rule: implement in order; archive a phrase before starting the next. Here `[x]` = planning done; implementation status lives in each change's `tasks.md`.
