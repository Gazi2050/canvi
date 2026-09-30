# Spec Delta

## Purpose

Makes agent drawings reliably professional by having the agent review its own rendered output and fix defects, bounded so runs always terminate.

## ADDED Requirements

### Requirement: Post-draw screenshot review

The system SHALL export the canvas to an image after a drawing run and ask the agent to critique it like a picky senior designer (overlaps, clipped text, border contact, gaps, alignment, card consistency, arrow placement, palette).

#### Scenario: Defects get fixed

- **WHEN** the rendered canvas has overlapping text
- **THEN** a review pass moves or resizes the offending elements

### Requirement: Bounded passes with early exit

The system SHALL run at most 3 review passes and stop early when the agent replies `DONE` (already professional) or makes no changes.

#### Scenario: Clean output exits fast

- **WHEN** the first render is already professional
- **THEN** the loop ends after one review with no edits

#### Scenario: Cap enforced

- **WHEN** defects remain after 3 passes
- **THEN** the run ends anyway and the final message summarizes the result

### Requirement: Fixes reuse existing tools only

The system SHALL restrict review-pass mutations to the `agent-tools-canvas` executors (no new drawing paths).

#### Scenario: No shadow pipeline

- **WHEN** a review pass fixes alignment
- **THEN** the fix commits through the same history pipeline (undoable like any agent edit)
