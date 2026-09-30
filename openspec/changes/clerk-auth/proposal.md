# Proposal

## Why

Phrases 01–06 build the full product with zero access control — anyone opening the app reaches every chat and canvas. v1's earlier iterations proved Clerk as the auth provider; this phrase gates the app last, keeping every earlier phrase verifiable without auth ceremony.

## What Changes

- Add Clerk as the authentication provider (provider package, publishable/secret keys via env).
- Gate all app surfaces: signed-out visitors reach sign-in only, never canvas or chat.
- Scope chats per user so one account cannot read another's documents.

## Capabilities

### New Capabilities

- `clerk-auth`: sign-in gate over the app plus per-user chat scoping.

### Modified Capabilities

(none — earlier phrases' contracts assume a current user; this phrase supplies it)

## Impact

- **Code:** provider placement in the root layout, middleware or route guard, chat-store user scoping.
- **Dependencies:** `+ @clerk/*` packages per the Clerk/Waku integration prevailing at implementation time.
- **Systems:** first external service dependency (Clerk); local dev must stay runnable (document the dev path).
- **Out of scope:** everything else — this is the final phrase of the rollout.
