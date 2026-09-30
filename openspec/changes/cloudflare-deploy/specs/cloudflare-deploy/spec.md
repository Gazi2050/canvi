# Spec Delta

## Purpose

Ships Canvi to Cloudflare Workers with a bound D1 database, so the app runs publicly with durable per-chat storage.

## ADDED Requirements

### Requirement: Worker build output

The system SHALL build via the Cloudflare adapter into worker assets plus a `dist/public` static directory, with all pages that need per-request behavior kept dynamic.

#### Scenario: Production build

- **WHEN** `waku build` runs with the Cloudflare setup
- **THEN** it emits the worker bundle and static assets with no errors (static-export mode MUST NOT be used)

### Requirement: Local worker with D1 binding

The system SHALL run under `wrangler dev` with the D1 binding available to server components and API routes against a local database.

#### Scenario: Local round-trip

- **WHEN** the app runs via `wrangler dev`
- **THEN** pages render and a chat document written through the app reads back from the local D1

### Requirement: Chats schema

The system SHALL provide a `chats` table storing `ChatDocument`s keyed by `(user_id, id)` with title, timestamp, messages, and elements columns.

#### Scenario: Document round-trip

- **WHEN** a chat document is written with `prepare(...).bind(...)` and read back
- **THEN** all fields return exactly as stored

### Requirement: Secrets via environment only

The system SHALL resolve provider keys (LLM, Clerk) exclusively from environment/bindings, never from bundled code.

#### Scenario: No secret in output

- **WHEN** the production bundle is inspected
- **THEN** it contains no provider or Clerk secret values

### Requirement: Typed bindings

The system SHALL generate worker types (`cf-typegen`) so the `Env` interface (including the D1 binding) typechecks the codebase.

#### Scenario: Type-safe env access

- **WHEN** server code accesses the D1 binding through `Env`
- **THEN** TypeScript accepts it with no casts
