# Spec Delta

## Purpose

Gives every conversation its own durable canvas and message history, so switching chats switches canvases and nothing is lost across reloads.

## ADDED Requirements

### Requirement: Per-chat combined documents

The system SHALL store one document per chat containing `{id, title, updatedAt, messages[], elements[]}`, where `messages[]` is the chat transcript and `elements[]` is the full canvas snapshot.

#### Scenario: Reload restores everything

- **WHEN** the user reloads the page
- **THEN** the active chat's messages and canvas elements are restored exactly as left

### Requirement: Debounced autosave

The system SHALL persist the active chat's document automatically, debounced so rapid canvas edits and message sends collapse into single writes.

#### Scenario: Edits survive without manual save

- **WHEN** the user draws on the canvas or sends a message and waits past the debounce window
- **THEN** a later reload restores those edits with no explicit save action

### Requirement: Chat switching with save and abort

The system SHALL save the outgoing chat, load the target chat's snapshot (resetting the scene), and abort any in-flight agent run when the user switches chats.

#### Scenario: Clean chat switch

- **WHEN** the user switches from chat A (with unsaved-above-debounce content settled) to chat B
- **THEN** chat A's document is saved, the canvas shows chat B's elements, the transcript shows chat B's messages, and no agent output lands in the wrong chat

### Requirement: Title derivation and recency metadata

The system SHALL derive a chat's title from its first user message (truncated) and track `updatedAt` plus element count for sidebar display.

#### Scenario: Title appears after first message

- **WHEN** the user sends the first message in an untitled chat
- **THEN** the chat gains a title drawn from that message and sorts by recency

### Requirement: Chat deletion

The system SHALL delete a chat's document on delete; deleting the active chat MUST reset to a fresh empty chat.

#### Scenario: Delete active chat

- **WHEN** the user deletes the currently open chat
- **THEN** its document is removed, the canvas clears, the transcript clears, and a new empty chat becomes active
