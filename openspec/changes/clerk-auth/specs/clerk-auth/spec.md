# Spec Delta

## Purpose

Restricts the whiteboard and all chats to signed-in users, with each account isolated to its own documents.

## ADDED Requirements

### Requirement: Sign-in gate

The system SHALL require sign-in before showing the canvas, sidebar, or chat; signed-out visitors MUST reach sign-in only.

#### Scenario: Signed-out visit

- **WHEN** a signed-out visitor opens `/`
- **THEN** they see sign-in, never the canvas or any chat content

### Requirement: Per-user chat isolation

The system SHALL scope every chat document to its owning user so accounts cannot read or mutate each other's chats.

#### Scenario: Account separation

- **WHEN** a second user signs in on the same browser
- **THEN** they see only their own chats, never the first user's

### Requirement: Frictionless local development

The system SHALL document a local-dev path that exercises the full app without production Clerk credentials blocking verification.

#### Scenario: Dev without prod keys

- **WHEN** a developer runs `pnpm dev` without production keys
- **THEN** the documented dev path still reaches a working canvas and chat
