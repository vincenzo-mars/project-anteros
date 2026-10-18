# Spec Delta

## Purpose

Owns the viewer-side ephemeral viewing experience: deliver-once encrypted transfer, per-session biometric unlock, secure-layer rendering with anti-capture, session lifecycle rules, and the audio background exception.

## ADDED Requirements

### Requirement: Deliver-once encrypted transfer
Upon first approval of a permission, the file SHALL be transferred once, end-to-end encrypted, to the viewer device where it is stored only as ciphertext. Subsequent viewing sessions SHALL require only the per-session unlock from the owner (a session key), not a new file transfer.

#### Scenario: First approval transfers file
- **WHEN** the owner approves a request
- **THEN** the file transfers encrypted over the P2P channel and the owner's device is free to be closed afterwards

### Requirement: Per-session unlock
Opening a viewing session SHALL require an unlock exchanged from the owner (per-TTL rules) plus viewer-side biometric authentication. The owner MAY be offline during viewing.

#### Scenario: Owner offline during viewing
- **WHEN** the viewer unlocks a session while the owner's device is offline
- **THEN** viewing proceeds normally within the permission rules

### Requirement: Secure-layer rendering
Media SHALL be rendered exclusively inside a secure rendering layer that the OS excludes from screenshots, screen recordings, and app-switcher snapshots, app-wide. The app SHALL be exempt from capture on every screen.

#### Scenario: Screenshot blocked
- **WHEN** a viewer attempts a system screenshot or screen recording during any app screen
- **THEN** the captured output contains no app content

### Requirement: Session lifecycle
Leaving the app (backgrounding, app switch, screen off) SHALL terminate the session immediately, with content obscured before suspension. Incoming phone calls SHALL terminate the session definitively (no pause/resume). Screen capture detection SHALL kill the session immediately, not only notify.

#### Scenario: Exit kills session
- **WHEN** the viewer backgrounds the app or turns the screen off during viewing
- **THEN** the session terminates and content is not visible on return without a new unlock

#### Scenario: Capture detection kills session
- **WHEN** screen recording or mirroring is detected during a session
- **THEN** the session is killed immediately and the event is logged and notified to the owner

### Requirement: Audio background exception
Audio files SHALL be exempt from the screen-off rule: an audio session MAY continue with the screen off, remaining bound to TTL and logging rules. Video and photo sessions SHALL NOT have this exception.

#### Scenario: Audio with screen off
- **WHEN** a viewer listens to an audio file and locks the screen
- **THEN** playback continues until TTL expiry or manual stop, logged as session activity

### Requirement: Batch navigation
Within one session, the viewer MAY navigate among files covered by active permissions; each file opening SHALL be logged individually and "1 view" permissions SHALL be consumed per file at opening.

#### Scenario: Batch within session
- **WHEN** a viewer in an open session moves from photo A (already opened) to photo B under active permissions
- **THEN** photo B opens in the same session and its opening is logged as a separate access

### Requirement: Viewer-side ephemeral handling
Viewed content SHALL exist only in memory during the session: no disk cache, no save, no share targets, cleared on session end. The visible countdown (or perpetual indicator) MAY be hidden from the viewer by owner choice, but the partial session identifier watermark always remains visible.

#### Scenario: Session end clears content
- **WHEN** a viewing session ends for any reason
- **THEN** no rendered content remains in memory, cache, or any persisted form
